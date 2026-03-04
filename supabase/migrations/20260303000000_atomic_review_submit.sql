-- ============================================================
-- Atomic Review Submit Migration
-- (a) Fix review_cost_amount to 2
-- (b) Create submit_review_atomic RPC that combines review
--     update + complete_review_and_charge in a single transaction
-- ============================================================

-- 1. Update review_cost_amount from 1 to 2
UPDATE public.system_settings
SET value = '2', updated_at = now()
WHERE key = 'review_cost_amount';

-- ============================================================
-- 2. Create submit_review_atomic function
-- Atomically updates review row AND performs all economy logic
-- in a single transaction (no split between app and RPC).
-- ============================================================
CREATE OR REPLACE FUNCTION public.submit_review_atomic(
  p_review_id uuid,
  p_reviewer_id uuid,
  p_video_url text,
  p_video_duration integer,
  p_rating integer,
  p_strengths text DEFAULT NULL,
  p_improvements text DEFAULT NULL
)
RETURNS void AS $$
DECLARE
  v_pr_id uuid;
  v_review_status text;
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
  -- Validate review belongs to reviewer and get current status
  SELECT r.feedback_request_id, r.status INTO v_pr_id, v_review_status
  FROM public.reviews r
  WHERE r.id = p_review_id AND r.reviewer_id = p_reviewer_id;

  IF v_pr_id IS NULL THEN
    RAISE EXCEPTION 'Review not found or does not belong to reviewer';
  END IF;

  IF v_review_status != 'in_progress' THEN
    RAISE EXCEPTION 'Review is not in in_progress status (current: %)', v_review_status;
  END IF;

  -- Update the review row
  UPDATE public.reviews
  SET video_url = p_video_url,
      video_duration = p_video_duration,
      rating = p_rating,
      strengths = p_strengths,
      improvements = p_improvements,
      status = 'submitted',
      submitted_at = now()
  WHERE id = p_review_id;

  -- ── Economy logic (from complete_review_and_charge) ──

  -- Read settings
  v_review_reward := COALESCE(public.get_setting('review_reward_amount')::integer, 1);
  v_review_cost := COALESCE(public.get_setting('review_cost_amount')::integer, 2);
  v_first_bonus := COALESCE(public.get_setting('first_review_bonus_amount')::integer, 2);
  v_requeue_limit := COALESCE(public.get_setting('auto_requeue_limit')::integer, 3);
  v_requeue_min_balance := COALESCE(public.get_setting('auto_requeue_min_balance')::integer, 1);

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
