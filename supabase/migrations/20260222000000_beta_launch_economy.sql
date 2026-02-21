-- ============================================================
-- Beta Launch Economy Migration
-- Creates system_settings, referrals table, updates functions
-- ============================================================

-- 0. Add columns to profiles (must come before policies that reference is_admin)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS referral_code text UNIQUE,
  ADD COLUMN IF NOT EXISTS invited_by uuid REFERENCES auth.users(id);

-- 1. Create system_settings table
CREATE TABLE public.system_settings (
  key text PRIMARY KEY,
  value text NOT NULL,
  category text NOT NULL CHECK (category IN ('point_economy', 'queue', 'review')),
  label text NOT NULL,
  description text,
  updated_at timestamptz DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id)
);

ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- All authenticated users can read settings (app code needs this)
CREATE POLICY "system_settings_select" ON public.system_settings
  FOR SELECT TO authenticated USING (true);

-- Only admins can update (enforced via is_admin check in the update function)
CREATE POLICY "system_settings_update" ON public.system_settings
  FOR UPDATE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- 2. Seed all 11 settings
INSERT INTO public.system_settings (key, value, category, label, description) VALUES
  ('signup_bonus_amount',          '3',   'point_economy', 'Signup Bonus',            'Points granted to new users on signup'),
  ('review_reward_amount',         '1',   'point_economy', 'Review Reward',           'Points earned by reviewer per completed review'),
  ('review_cost_amount',           '1',   'point_economy', 'Review Cost',             'Points charged to project owner per review received'),
  ('first_review_bonus_amount',    '2',   'point_economy', 'First Review Bonus',      'Bonus points for a user''s first completed review'),
  ('referral_bonus_amount',        '5',   'point_economy', 'Referral Bonus',          'Points awarded to inviter when invitee signs up'),
  ('active_project_limit',         '1',   'queue',         'Active Project Limit',    'Max projects a user can have in queue simultaneously'),
  ('auto_requeue_limit',           '3',   'queue',         'Auto-Requeue Limit',      'Max times a project auto-requeues after review'),
  ('auto_requeue_min_balance',     '1',   'queue',         'Requeue Min Balance',     'Min point balance required for auto-requeue'),
  ('review_claim_timeout_minutes', '10',  'queue',         'Review Claim Timeout',    'Minutes before an uncompleted review claim expires'),
  ('min_video_duration_seconds',   '60',  'review',        'Min Video Duration',      'Minimum video length (seconds) for a valid review'),
  ('max_video_duration_seconds',   '300', 'review',        'Max Video Duration',      'Maximum video length (seconds) allowed');

-- 3. Create referrals table
CREATE TABLE public.referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inviter_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  invitee_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'signed_up'
    CHECK (status IN ('signed_up', 'activated', 'milestone')),
  bonus_awarded integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(inviter_id, invitee_id)
);

ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- Users can see referrals they're part of
CREATE POLICY "referrals_select" ON public.referrals
  FOR SELECT TO authenticated
  USING (inviter_id = auth.uid() OR invitee_id = auth.uid());

-- 4. Add requeue_count to pull_requests
ALTER TABLE public.pull_requests
  ADD COLUMN IF NOT EXISTS requeue_count integer DEFAULT 0;

-- 6. Expand transaction type CHECK constraint
ALTER TABLE public.peer_point_transactions DROP CONSTRAINT IF EXISTS peer_point_transactions_type_check;
ALTER TABLE public.peer_point_transactions ADD CONSTRAINT peer_point_transactions_type_check
  CHECK (type IN ('earned_review', 'spent_submission', 'signup_bonus', 'first_review_bonus', 'referral_bonus', 'admin_injection'));

-- 7. Widen video duration constraint for settings-based control
ALTER TABLE public.reviews DROP CONSTRAINT IF EXISTS reviews_video_duration_check;
ALTER TABLE public.reviews ADD CONSTRAINT reviews_video_duration_check
  CHECK (video_duration IS NULL OR (video_duration BETWEEN 5 AND 600));

-- ============================================================
-- Helper function: get_setting(key)
-- ============================================================
CREATE OR REPLACE FUNCTION public.get_setting(p_key text)
RETURNS text AS $$
DECLARE
  v_value text;
BEGIN
  SELECT value INTO v_value FROM public.system_settings WHERE key = p_key;
  RETURN v_value;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ============================================================
-- Replace handle_new_user() — grants signup bonus + generates referral code
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_bonus integer;
  v_referral_code text;
  v_attempts integer := 0;
BEGIN
  -- Read signup bonus from settings
  v_bonus := COALESCE(public.get_setting('signup_bonus_amount')::integer, 3);

  -- Generate a unique referral code (6 chars alphanumeric)
  LOOP
    v_referral_code := upper(substr(md5(random()::text || clock_timestamp()::text), 1, 6));
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.profiles WHERE referral_code = v_referral_code);
    v_attempts := v_attempts + 1;
    IF v_attempts > 10 THEN
      -- Fallback to 8 chars if collisions
      v_referral_code := upper(substr(md5(random()::text || clock_timestamp()::text), 1, 8));
      EXIT;
    END IF;
  END LOOP;

  -- Insert profile with bonus and referral code
  INSERT INTO public.profiles (id, first_name, last_name, avatar_url, peer_points_balance, referral_code)
  VALUES (
    NEW.id,
    COALESCE((NEW.raw_user_meta_data->>'firstname')::TEXT, ''),
    COALESCE((NEW.raw_user_meta_data->>'lastname')::TEXT, ''),
    COALESCE((NEW.raw_user_meta_data->>'avatar_url')::TEXT, ''),
    v_bonus,
    v_referral_code
  );

  -- Record signup bonus transaction
  IF v_bonus > 0 THEN
    INSERT INTO public.peer_point_transactions (user_id, amount, type, reference_id)
    VALUES (NEW.id, v_bonus, 'signup_bonus', NULL);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ============================================================
-- Replace get_next_review() — reads timeout from settings
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
  UPDATE public.pull_requests
  SET queue_position = COALESCE(timeout_queue_position, 0),
      claimed_at = NULL,
      timeout_queue_position = NULL
  WHERE claimed_at IS NOT NULL
    AND claimed_at < now() - (v_timeout_minutes || ' minutes')::interval
    AND queue_position IS NULL;

  -- Mark timed-out reviews as abandoned
  UPDATE public.reviews r
  SET status = 'abandoned'
  FROM public.pull_requests pr
  WHERE r.pull_request_id = pr.id
    AND r.status = 'in_progress'
    AND r.created_at < now() - (v_timeout_minutes || ' minutes')::interval
    AND pr.queue_position IS NOT NULL;

  -- Find oldest eligible project
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

  -- Claim: remove from queue
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

-- ============================================================
-- Replace complete_review_and_charge() — dynamic economy values
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
  UPDATE public.pull_requests SET claimed_at = NULL, timeout_queue_position = NULL WHERE id = v_pr_id;

  -- Get current requeue count
  SELECT COALESCE(requeue_count, 0) INTO v_current_requeue
  FROM public.pull_requests WHERE id = v_pr_id;

  -- Auto-re-queue if under limit and owner has enough balance
  SELECT peer_points_balance INTO v_owner_balance
  FROM public.profiles WHERE id = v_owner_id;

  IF v_current_requeue < v_requeue_limit AND v_owner_balance >= v_requeue_min_balance THEN
    UPDATE public.pull_requests
    SET queue_position = nextval('public.pull_requests_queue_seq'),
        requeue_count = COALESCE(requeue_count, 0) + 1
    WHERE id = v_pr_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ============================================================
-- redeem_referral() — called after signup with a referral code
-- ============================================================
CREATE OR REPLACE FUNCTION public.redeem_referral(p_code text, p_new_user_id uuid)
RETURNS void AS $$
DECLARE
  v_inviter_id uuid;
  v_bonus integer;
BEGIN
  -- Look up inviter by referral code
  SELECT id INTO v_inviter_id
  FROM public.profiles
  WHERE referral_code = upper(trim(p_code));

  IF v_inviter_id IS NULL THEN
    RAISE EXCEPTION 'Invalid referral code';
  END IF;

  -- Don't allow self-referral
  IF v_inviter_id = p_new_user_id THEN
    RAISE EXCEPTION 'Cannot use your own referral code';
  END IF;

  -- Check not already referred
  IF EXISTS (SELECT 1 FROM public.referrals WHERE invitee_id = p_new_user_id) THEN
    RAISE EXCEPTION 'User already has a referral';
  END IF;

  -- Read bonus amount
  v_bonus := COALESCE(public.get_setting('referral_bonus_amount')::integer, 5);

  -- Set invited_by on new user profile
  UPDATE public.profiles SET invited_by = v_inviter_id WHERE id = p_new_user_id;

  -- Create referral record
  INSERT INTO public.referrals (inviter_id, invitee_id, status, bonus_awarded)
  VALUES (v_inviter_id, p_new_user_id, 'signed_up', v_bonus);

  -- Award bonus to inviter
  UPDATE public.profiles SET peer_points_balance = peer_points_balance + v_bonus WHERE id = v_inviter_id;
  INSERT INTO public.peer_point_transactions (user_id, amount, type, reference_id)
  VALUES (v_inviter_id, v_bonus, 'referral_bonus', p_new_user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ============================================================
-- admin_inject_points() — admin grants/removes points
-- ============================================================
CREATE OR REPLACE FUNCTION public.admin_inject_points(
  p_admin_id uuid,
  p_target_user_id uuid,
  p_amount integer,
  p_reason text DEFAULT 'Admin adjustment'
)
RETURNS void AS $$
BEGIN
  -- Verify admin
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = p_admin_id AND is_admin = true) THEN
    RAISE EXCEPTION 'Not authorized: admin only';
  END IF;

  -- Update balance
  UPDATE public.profiles SET peer_points_balance = peer_points_balance + p_amount WHERE id = p_target_user_id;

  -- Record transaction
  INSERT INTO public.peer_point_transactions (user_id, amount, type, reference_id)
  VALUES (p_target_user_id, p_amount, 'admin_injection', NULL);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
