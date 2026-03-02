-- ============================================================
-- Terminology Migration: pull_requests → feedback_requests
-- Renames table, columns, indexes, sequences, policies, and
-- recreates all RPC functions that reference the old names.
-- ============================================================

-- 1. Rename the table
ALTER TABLE public.pull_requests RENAME TO feedback_requests;

-- 2. Rename FK column on reviews
ALTER TABLE public.reviews RENAME COLUMN pull_request_id TO feedback_request_id;

-- 3. Rename the queue sequence
ALTER SEQUENCE public.pull_requests_queue_seq RENAME TO feedback_requests_queue_seq;

-- 4. Rename indexes
ALTER INDEX IF EXISTS idx_pull_requests_queue_position RENAME TO idx_feedback_requests_queue_position;

-- 5. Rename RLS policies on feedback_requests (auto-transferred on table rename)
ALTER POLICY "pull_requests_select" ON public.feedback_requests RENAME TO "feedback_requests_select";
ALTER POLICY "pull_requests_insert" ON public.feedback_requests RENAME TO "feedback_requests_insert";
ALTER POLICY "pull_requests_update" ON public.feedback_requests RENAME TO "feedback_requests_update";

-- 6. Recreate reviews_select policy to reference feedback_request_id
DROP POLICY IF EXISTS "reviews_select" ON public.reviews;
CREATE POLICY "reviews_select" ON public.reviews
  FOR SELECT TO authenticated USING (
    reviewer_id = auth.uid()
    OR feedback_request_id IN (
      SELECT id FROM public.feedback_requests WHERE user_id = auth.uid()
    )
  );

-- 7. Recreate reviews_update policy to reference feedback_request_id
DROP POLICY IF EXISTS "reviews_update" ON public.reviews;
CREATE POLICY "reviews_update" ON public.reviews
  FOR UPDATE TO authenticated USING (
    auth.uid() = reviewer_id
    OR feedback_request_id IN (
      SELECT id FROM public.feedback_requests WHERE user_id = auth.uid()
    )
  );

-- ============================================================
-- 8. Recreate RPC: assign_queue_position
-- ============================================================
CREATE OR REPLACE FUNCTION assign_queue_position(p_pr_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE public.feedback_requests
  SET queue_position = nextval('public.feedback_requests_queue_seq'),
      claimed_at = NULL,
      timeout_queue_position = NULL
  WHERE id = p_pr_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ============================================================
-- 9. Recreate RPC: get_next_review
-- ============================================================
CREATE OR REPLACE FUNCTION public.get_next_review(p_reviewer_id uuid)
RETURNS TABLE(review_id uuid, pr_id uuid) AS $$
DECLARE
  v_pr_id uuid;
  v_review_id uuid;
  v_pr_owner uuid;
  v_timeout_minutes integer;
BEGIN
  -- Read claim timeout from settings
  v_timeout_minutes := COALESCE(public.get_setting('review_claim_timeout_minutes')::integer, 10);

  -- Handle timed-out claims
  UPDATE public.feedback_requests
  SET queue_position = COALESCE(timeout_queue_position, 0),
      claimed_at = NULL,
      timeout_queue_position = NULL
  WHERE claimed_at IS NOT NULL
    AND claimed_at < now() - (v_timeout_minutes || ' minutes')::interval
    AND queue_position IS NULL;

  -- Mark timed-out reviews as abandoned
  UPDATE public.reviews r
  SET status = 'abandoned'
  FROM public.feedback_requests fr
  WHERE r.feedback_request_id = fr.id
    AND r.status = 'in_progress'
    AND r.created_at < now() - (v_timeout_minutes || ' minutes')::interval
    AND fr.queue_position IS NOT NULL;

  -- Find oldest eligible project
  SELECT fr.id, fr.user_id INTO v_pr_id, v_pr_owner
  FROM public.feedback_requests fr
  WHERE fr.queue_position IS NOT NULL
    AND fr.status = 'open'
    AND fr.user_id != p_reviewer_id
    AND NOT EXISTS (
      SELECT 1 FROM public.reviews rv
      WHERE rv.feedback_request_id = fr.id
        AND rv.reviewer_id = p_reviewer_id
        AND rv.status != 'abandoned'
    )
  ORDER BY fr.queue_position ASC
  LIMIT 1
  FOR UPDATE OF fr SKIP LOCKED;

  IF v_pr_id IS NULL THEN
    RETURN;
  END IF;

  -- Claim: remove from queue
  UPDATE public.feedback_requests
  SET timeout_queue_position = queue_position,
      queue_position = NULL,
      claimed_at = now()
  WHERE id = v_pr_id;

  -- Create review record
  INSERT INTO public.reviews (feedback_request_id, reviewer_id, status)
  VALUES (v_pr_id, p_reviewer_id, 'in_progress')
  RETURNING id INTO v_review_id;

  pr_id := v_pr_id;
  review_id := v_review_id;
  RETURN NEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ============================================================
-- 10. Recreate RPC: complete_review_and_charge
-- ============================================================
CREATE OR REPLACE FUNCTION public.complete_review_and_charge(p_reviewer_id uuid, p_review_id uuid)
RETURNS void AS $$
DECLARE
  v_pr_id uuid;
  v_owner_id uuid;
  v_owner_balance integer;
  v_review_reward integer;
  v_review_cost integer;
  v_first_bonus integer;
  v_requeue_limit integer;
  v_requeue_min_balance integer;
  v_current_requeue integer;
  v_is_first_review boolean;
BEGIN
  -- Read settings
  v_review_reward := COALESCE(public.get_setting('review_reward_amount')::integer, 1);
  v_review_cost := COALESCE(public.get_setting('review_cost_amount')::integer, 1);
  v_first_bonus := COALESCE(public.get_setting('first_review_bonus_amount')::integer, 2);
  v_requeue_limit := COALESCE(public.get_setting('auto_requeue_limit')::integer, 3);
  v_requeue_min_balance := COALESCE(public.get_setting('auto_requeue_min_balance')::integer, 1);

  -- Get the feedback request from the review
  SELECT r.feedback_request_id INTO v_pr_id
  FROM public.reviews r
  WHERE r.id = p_review_id AND r.reviewer_id = p_reviewer_id;

  IF v_pr_id IS NULL THEN
    RAISE EXCEPTION 'Review not found';
  END IF;

  -- Get owner
  SELECT fr.user_id INTO v_owner_id
  FROM public.feedback_requests fr
  WHERE fr.id = v_pr_id;

  -- Check if this is the reviewer's first completed review
  SELECT NOT EXISTS (
    SELECT 1 FROM public.peer_point_transactions
    WHERE user_id = p_reviewer_id AND type = 'earned_review'
  ) INTO v_is_first_review;

  -- Award reviewer
  UPDATE public.profiles SET peer_points_balance = peer_points_balance + v_review_reward WHERE id = p_reviewer_id;
  INSERT INTO public.peer_point_transactions (user_id, amount, type, reference_id)
  VALUES (p_reviewer_id, v_review_reward, 'earned_review', p_review_id);

  -- Award first review bonus if applicable
  IF v_is_first_review AND v_first_bonus > 0 THEN
    UPDATE public.profiles SET peer_points_balance = peer_points_balance + v_first_bonus WHERE id = p_reviewer_id;
    INSERT INTO public.peer_point_transactions (user_id, amount, type, reference_id)
    VALUES (p_reviewer_id, v_first_bonus, 'first_review_bonus', p_review_id);
  END IF;

  -- Charge owner
  UPDATE public.profiles SET peer_points_balance = peer_points_balance - v_review_cost WHERE id = v_owner_id;
  INSERT INTO public.peer_point_transactions (user_id, amount, type, reference_id)
  VALUES (v_owner_id, -v_review_cost, 'spent_submission', v_pr_id);

  -- Clear claimed_at
  UPDATE public.feedback_requests SET claimed_at = NULL, timeout_queue_position = NULL WHERE id = v_pr_id;

  -- Get current requeue count
  SELECT COALESCE(requeue_count, 0) INTO v_current_requeue
  FROM public.feedback_requests WHERE id = v_pr_id;

  -- Auto-re-queue if under limit and owner has enough balance
  SELECT peer_points_balance INTO v_owner_balance
  FROM public.profiles WHERE id = v_owner_id;

  IF v_current_requeue < v_requeue_limit AND v_owner_balance >= v_requeue_min_balance THEN
    UPDATE public.feedback_requests
    SET queue_position = nextval('public.feedback_requests_queue_seq'),
        requeue_count = COALESCE(requeue_count, 0) + 1
    WHERE id = v_pr_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
