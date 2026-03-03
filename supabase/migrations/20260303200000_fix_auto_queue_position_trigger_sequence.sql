-- Fix auto_assign_queue_position trigger function to use renamed sequence
-- The trigger was missed during the pull_requests → feedback_requests rename migration
CREATE OR REPLACE FUNCTION auto_assign_queue_position()
RETURNS trigger AS $$
BEGIN
  IF NEW.status = 'open' AND NEW.queue_position IS NULL THEN
    NEW.queue_position := nextval('public.feedback_requests_queue_seq');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
