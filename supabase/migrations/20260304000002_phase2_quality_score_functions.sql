-- ============================================================
-- Phase 2: Quality & Trust Engine — Quality Score + Rate Review
-- ============================================================

-- 1. Recalculate quality score RPC
CREATE OR REPLACE FUNCTION recalculate_quality_score(p_reviewer_id uuid)
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_avg numeric;
  v_flag_count int;
  v_rated_count int;
  v_score numeric;
BEGIN
  SELECT count(*), COALESCE(avg(builder_rating), 0)
  INTO v_rated_count, v_avg
  FROM reviews
  WHERE reviewer_id = p_reviewer_id
    AND builder_rating IS NOT NULL;

  SELECT COALESCE(sum(array_length(builder_flags, 1)), 0)
  INTO v_flag_count
  FROM reviews
  WHERE reviewer_id = p_reviewer_id
    AND builder_flags <> '{}';

  IF v_rated_count < 3 THEN
    UPDATE profiles SET quality_score = NULL WHERE id = p_reviewer_id;
    RETURN NULL;
  END IF;

  v_score := GREATEST(0, LEAST(5, v_avg - (v_flag_count * 0.5)));
  v_score := ROUND(v_score, 2);

  UPDATE profiles SET quality_score = v_score WHERE id = p_reviewer_id;
  RETURN v_score;
END;
$$;
