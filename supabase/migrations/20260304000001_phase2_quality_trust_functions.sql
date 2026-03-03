-- ============================================================
-- Phase 2: Quality & Trust Engine — Functions
-- ============================================================

-- 1. Update submit_review_atomic to accept signal params
CREATE OR REPLACE FUNCTION public.submit_review_atomic(
  p_review_id uuid,
  p_reviewer_id uuid,
  p_video_url text,
  p_video_duration integer,
  p_rating integer,
  p_strengths text DEFAULT NULL,
  p_improvements text DEFAULT NULL,
  p_signal_follow boolean DEFAULT false,
  p_signal_engage boolean DEFAULT false,
  p_signal_invest boolean DEFAULT false
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
  SELECT r.feedback_request_id, r.status INTO v_pr_id, v_review_status
  FROM public.reviews r
  WHERE r.id = p_review_id AND r.reviewer_id = p_reviewer_id;

  IF v_pr_id IS NULL THEN
    RAISE EXCEPTION 'Review not found or does not belong to reviewer';
  END IF;

  IF v_review_status != 'in_progress' THEN
    RAISE EXCEPTION 'Review is not in in_progress status (current: %)', v_review_status;
  END IF;

  UPDATE public.reviews
  SET video_url = p_video_url,
      video_duration = p_video_duration,
      rating = p_rating,
      strengths = p_strengths,
      improvements = p_improvements,
      signal_follow = p_signal_follow,
      signal_engage = p_signal_engage,
      signal_invest = p_signal_invest,
      status = 'submitted',
      submitted_at = now()
  WHERE id = p_review_id;

  v_review_reward := COALESCE(public.get_setting('review_reward_amount')::integer, 1);
  v_review_cost := COALESCE(public.get_setting('review_cost_amount')::integer, 2);
  v_first_bonus := COALESCE(public.get_setting('first_review_bonus_amount')::integer, 2);
  v_requeue_limit := COALESCE(public.get_setting('auto_requeue_limit')::integer, 3);
  v_requeue_min_balance := COALESCE(public.get_setting('auto_requeue_min_balance')::integer, 1);

  SELECT fr.user_id INTO v_owner_id
  FROM public.feedback_requests fr
  WHERE fr.id = v_pr_id;

  SELECT NOT EXISTS (
    SELECT 1 FROM public.peer_point_transactions
    WHERE user_id = p_reviewer_id AND type = 'earned_review'
  ) INTO v_is_first_review;

  UPDATE public.profiles SET peer_points_balance = peer_points_balance + v_review_reward WHERE id = p_reviewer_id;
  INSERT INTO public.peer_point_transactions (user_id, amount, type, reference_id)
  VALUES (p_reviewer_id, v_review_reward, 'earned_review', p_review_id);

  IF v_is_first_review AND v_first_bonus > 0 THEN
    UPDATE public.profiles SET peer_points_balance = peer_points_balance + v_first_bonus WHERE id = p_reviewer_id;
    INSERT INTO public.peer_point_transactions (user_id, amount, type, reference_id)
    VALUES (p_reviewer_id, v_first_bonus, 'first_review_bonus', p_review_id);
  END IF;

  UPDATE public.profiles SET peer_points_balance = peer_points_balance - v_review_cost WHERE id = v_owner_id;
  INSERT INTO public.peer_point_transactions (user_id, amount, type, reference_id)
  VALUES (v_owner_id, -v_review_cost, 'spent_submission', v_pr_id);

  UPDATE public.feedback_requests SET claimed_at = NULL, timeout_queue_position = NULL WHERE id = v_pr_id;

  SELECT COALESCE(requeue_count, 0) INTO v_current_requeue
  FROM public.feedback_requests WHERE id = v_pr_id;

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
