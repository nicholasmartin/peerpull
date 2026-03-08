-- Fix: Prevent reviewers from claiming multiple projects simultaneously.
-- The get_next_review RPC had no guard against a reviewer already having
-- an in-progress review. This adds an early-exit check.
-- Also improves timeout cleanup to handle the reviewer's own timed-out claims first.

CREATE OR REPLACE FUNCTION public.get_next_review(p_reviewer_id uuid)
RETURNS TABLE(review_id uuid, pr_id uuid) AS $$
DECLARE
  v_pr_id uuid;
  v_review_id uuid;
  v_pr_owner uuid;
  v_timeout_minutes integer;
  v_existing_review_id uuid;
  v_existing_pr_id uuid;
BEGIN
  -- Read claim timeout from settings
  v_timeout_minutes := COALESCE(public.get_setting('review_claim_timeout_minutes')::integer, 10);

  -- Handle ALL timed-out claims (not just this reviewer's)
  -- This is the only place timeout recovery runs, so clean up globally.
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

  -- GUARD: Check if reviewer already has an active (in-progress) review.
  -- If so, return that existing review instead of claiming a new one.
  SELECT rv.id, rv.feedback_request_id
  INTO v_existing_review_id, v_existing_pr_id
  FROM public.reviews rv
  WHERE rv.reviewer_id = p_reviewer_id
    AND rv.status = 'in_progress'
  LIMIT 1;

  IF v_existing_review_id IS NOT NULL THEN
    review_id := v_existing_review_id;
    pr_id := v_existing_pr_id;
    RETURN NEXT;
    RETURN;
  END IF;

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
