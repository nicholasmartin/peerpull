-- Add 'draft' to the feedback_requests status CHECK constraint
-- Drafts are projects saved during onboarding that skip the review queue.

ALTER TABLE public.feedback_requests
  DROP CONSTRAINT IF EXISTS pull_requests_status_check,
  DROP CONSTRAINT IF EXISTS feedback_requests_status_check;

ALTER TABLE public.feedback_requests
  ADD CONSTRAINT feedback_requests_status_check
    CHECK (status IN ('draft', 'open', 'in_review', 'completed', 'closed'));
