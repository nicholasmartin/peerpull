-- ============================================================
-- Phase 2: Quality & Trust Engine — Rate Review Function
-- ============================================================

CREATE OR REPLACE FUNCTION rate_review(
  p_review_id uuid,
  p_rater_id uuid,
  p_builder_rating smallint,
  p_builder_flags text[] DEFAULT '{}',
  p_builder_feedback text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_review reviews%ROWTYPE;
  v_fr feedback_requests%ROWTYPE;
BEGIN
  SELECT * INTO v_review FROM reviews WHERE id = p_review_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Review not found'; END IF;
  IF v_review.status NOT IN ('submitted', 'approved', 'rejected') THEN
    RAISE EXCEPTION 'Review not in ratable state';
  END IF;

  SELECT * INTO v_fr FROM feedback_requests WHERE id = v_review.feedback_request_id;
  IF v_fr.user_id <> p_rater_id THEN
    RAISE EXCEPTION 'Only the project owner can rate reviews';
  END IF;

  UPDATE reviews SET
    builder_rating = p_builder_rating,
    builder_flags = p_builder_flags,
    builder_feedback = p_builder_feedback
  WHERE id = p_review_id;

  PERFORM recalculate_quality_score(v_review.reviewer_id);
END;
$$;
