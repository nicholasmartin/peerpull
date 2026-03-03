-- ============================================================
-- Phase 2: Quality & Trust Engine — Schema Changes
-- ============================================================

-- 1. Reviewer Action Signals on reviews
ALTER TABLE reviews ADD COLUMN signal_follow boolean NOT NULL DEFAULT false;
ALTER TABLE reviews ADD COLUMN signal_engage boolean NOT NULL DEFAULT false;
ALTER TABLE reviews ADD COLUMN signal_invest boolean NOT NULL DEFAULT false;

-- 2. Builder Feedback Quality on reviews
ALTER TABLE reviews ADD COLUMN builder_rating smallint CHECK (builder_rating IS NULL OR builder_rating BETWEEN 1 AND 5);
ALTER TABLE reviews ADD COLUMN builder_flags text[] NOT NULL DEFAULT '{}';
ALTER TABLE reviews ADD COLUMN builder_feedback text;

-- 3. Quality score on profiles
ALTER TABLE profiles ADD COLUMN quality_score numeric(3,2);
