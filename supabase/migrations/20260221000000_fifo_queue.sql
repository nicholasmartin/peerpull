-- ============================================================
-- FIFO Review Queue Migration
-- ============================================================

-- 1. Add queue columns to pull_requests
ALTER TABLE public.pull_requests
  ADD COLUMN IF NOT EXISTS queue_position bigint,
  ADD COLUMN IF NOT EXISTS claimed_at timestamptz,
  ADD COLUMN IF NOT EXISTS timeout_queue_position bigint;

-- 2. Create sequence for monotonic queue ordering
CREATE SEQUENCE IF NOT EXISTS public.pull_requests_queue_seq;

-- 3. Index for fast queue lookups
CREATE INDEX IF NOT EXISTS idx_pull_requests_queue_position
  ON public.pull_requests (queue_position ASC NULLS LAST)
  WHERE queue_position IS NOT NULL;

-- 4. Add 'abandoned' to reviews status check constraint
ALTER TABLE public.reviews DROP CONSTRAINT IF EXISTS reviews_status_check;
ALTER TABLE public.reviews ADD CONSTRAINT reviews_status_check
  CHECK (status IN ('in_progress', 'submitted', 'approved', 'rejected', 'abandoned'));

-- Drop the unique constraint so a reviewer can get the same project again after abandonment
ALTER TABLE public.reviews DROP CONSTRAINT IF EXISTS reviews_pull_request_id_reviewer_id_key;

-- 5. RPC: assign_queue_position
CREATE OR REPLACE FUNCTION assign_queue_position(p_pr_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE public.pull_requests
  SET queue_position = nextval('public.pull_requests_queue_seq'),
      claimed_at = NULL,
      timeout_queue_position = NULL
  WHERE id = p_pr_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 6. RPC: get_next_review
CREATE OR REPLACE FUNCTION get_next_review(p_reviewer_id uuid)
RETURNS TABLE(review_id uuid, pr_id uuid) AS $$
DECLARE
  v_pr_id uuid;
  v_review_id uuid;
  v_pr_owner uuid;
BEGIN
  -- First, handle timed-out claims: reset projects claimed > 10 min ago
  UPDATE public.pull_requests
  SET queue_position = COALESCE(timeout_queue_position, 0),
      claimed_at = NULL,
      timeout_queue_position = NULL
  WHERE claimed_at IS NOT NULL
    AND claimed_at < now() - interval '10 minutes'
    AND queue_position IS NULL;

  -- Mark those timed-out reviews as abandoned
  UPDATE public.reviews r
  SET status = 'abandoned'
  FROM public.pull_requests pr
  WHERE r.pull_request_id = pr.id
    AND r.status = 'in_progress'
    AND r.created_at < now() - interval '10 minutes'
    AND pr.queue_position IS NOT NULL;

  -- Find the oldest eligible project (not own, not already reviewed by this user)
  SELECT pr.id, pr.user_id INTO v_pr_id, v_pr_owner
  FROM public.pull_requests pr
  WHERE pr.queue_position IS NOT NULL
    AND pr.status = 'open'
    AND pr.user_id != p_reviewer_id
    AND NOT EXISTS (
      SELECT 1 FROM public.reviews rv
      WHERE rv.pull_request_id = pr.id
        AND rv.reviewer_id = p_reviewer_id
        AND rv.status != 'abandoned'
    )
  ORDER BY pr.queue_position ASC
  LIMIT 1
  FOR UPDATE OF pr SKIP LOCKED;

  IF v_pr_id IS NULL THEN
    RETURN;
  END IF;

  -- Claim: remove from queue, record claimed_at and save position for timeout restoration
  UPDATE public.pull_requests
  SET timeout_queue_position = queue_position,
      queue_position = NULL,
      claimed_at = now()
  WHERE id = v_pr_id;

  -- Create review record
  INSERT INTO public.reviews (pull_request_id, reviewer_id, status)
  VALUES (v_pr_id, p_reviewer_id, 'in_progress')
  RETURNING id INTO v_review_id;

  pr_id := v_pr_id;
  review_id := v_review_id;
  RETURN NEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 7. RPC: complete_review_and_charge
CREATE OR REPLACE FUNCTION complete_review_and_charge(p_reviewer_id uuid, p_review_id uuid)
RETURNS void AS $$
DECLARE
  v_pr_id uuid;
  v_owner_id uuid;
  v_owner_balance integer;
BEGIN
  -- Get the PR from the review
  SELECT r.pull_request_id INTO v_pr_id
  FROM public.reviews r
  WHERE r.id = p_review_id AND r.reviewer_id = p_reviewer_id;

  IF v_pr_id IS NULL THEN
    RAISE EXCEPTION 'Review not found';
  END IF;

  -- Get owner
  SELECT pr.user_id INTO v_owner_id
  FROM public.pull_requests pr
  WHERE pr.id = v_pr_id;

  -- Award reviewer +1
  UPDATE public.profiles SET peer_points_balance = peer_points_balance + 1 WHERE id = p_reviewer_id;
  INSERT INTO public.peer_point_transactions (user_id, amount, type, reference_id)
  VALUES (p_reviewer_id, 1, 'earned_review', p_review_id);

  -- Charge owner -2
  UPDATE public.profiles SET peer_points_balance = peer_points_balance - 2 WHERE id = v_owner_id;
  INSERT INTO public.peer_point_transactions (user_id, amount, type, reference_id)
  VALUES (v_owner_id, -2, 'spent_submission', v_pr_id);

  -- Clear claimed_at
  UPDATE public.pull_requests SET claimed_at = NULL, timeout_queue_position = NULL WHERE id = v_pr_id;

  -- Auto-re-queue if owner can afford it
  SELECT peer_points_balance INTO v_owner_balance
  FROM public.profiles WHERE id = v_owner_id;

  IF v_owner_balance >= 2 THEN
    UPDATE public.pull_requests
    SET queue_position = nextval('public.pull_requests_queue_seq')
    WHERE id = v_pr_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 8. Seed: assign queue positions to existing open PRs
UPDATE public.pull_requests
SET queue_position = nextval('public.pull_requests_queue_seq')
WHERE status = 'open' AND queue_position IS NULL;
