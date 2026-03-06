-- ============================================================
-- Defer signup + referral bonuses until account activation
-- (email verified + onboarding completed)
--
-- Previously, signup bonus was awarded immediately in the
-- handle_new_user() trigger and referral bonus was awarded
-- immediately in redeem_referral(). This allowed abuse by
-- creating fake accounts with unverified emails to farm points.
--
-- New flow:
--   1. handle_new_user()  -> profile created with 0 balance
--   2. redeem_referral()  -> records relationship only (no payout)
--   3. award_activation_bonuses() -> called when user completes
--      onboarding, awards both signup and referral bonuses
-- ============================================================

-- ============================================================
-- 1. Migrate existing referrals that already received payouts
--    to 'activated' status so the UI reflects reality
-- ============================================================
UPDATE public.referrals
SET status = 'activated', updated_at = now()
WHERE bonus_awarded > 0 AND status = 'signed_up';

-- ============================================================
-- 2. Update handle_new_user() to NOT award signup bonus
--    Profile is created with 0 balance. Bonus is deferred
--    to award_activation_bonuses() on onboarding completion.
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _first_name TEXT;
  _last_name TEXT;
  _full_name TEXT;
  _avatar TEXT;
  v_referral_code text;
  v_attempts integer := 0;
BEGIN
  -- ==============================
  -- Name extraction (OAuth-aware)
  -- ==============================

  -- 1. Try explicit first/last name (email/password signup)
  _first_name := COALESCE(NULLIF(NEW.raw_user_meta_data->>'firstname', ''), '');
  _last_name := COALESCE(NULLIF(NEW.raw_user_meta_data->>'lastname', ''), '');

  -- 2. Try OIDC standard claims (LinkedIn OIDC)
  IF _first_name = '' THEN
    _first_name := COALESCE(NULLIF(NEW.raw_user_meta_data->>'given_name', ''), '');
  END IF;
  IF _last_name = '' THEN
    _last_name := COALESCE(NULLIF(NEW.raw_user_meta_data->>'family_name', ''), '');
  END IF;

  -- 3. Fall back to splitting full_name / name (Google, GitHub, Twitch)
  IF _first_name = '' AND _last_name = '' THEN
    _full_name := COALESCE(
      NULLIF(NEW.raw_user_meta_data->>'full_name', ''),
      NULLIF(NEW.raw_user_meta_data->>'name', ''),
      ''
    );
    IF _full_name != '' THEN
      _first_name := split_part(_full_name, ' ', 1);
      IF position(' ' in _full_name) > 0 THEN
        _last_name := substring(_full_name from position(' ' in _full_name) + 1);
      END IF;
    END IF;
  END IF;

  -- 4. Avatar: try avatar_url first, then picture
  _avatar := COALESCE(
    NULLIF(NEW.raw_user_meta_data->>'avatar_url', ''),
    NULLIF(NEW.raw_user_meta_data->>'picture', ''),
    ''
  );

  -- ==============================
  -- Referral code generation
  -- ==============================

  -- Generate a unique referral code (6 chars alphanumeric, fallback to 8 on collision)
  LOOP
    v_referral_code := lower(substr(md5(random()::text || clock_timestamp()::text), 1, 6));
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.profiles WHERE referral_code = v_referral_code);
    v_attempts := v_attempts + 1;
    IF v_attempts > 10 THEN
      v_referral_code := lower(substr(md5(random()::text || clock_timestamp()::text), 1, 8));
      EXIT;
    END IF;
  END LOOP;

  -- Insert profile with ZERO balance. Signup bonus is deferred
  -- until the user completes onboarding (award_activation_bonuses).
  INSERT INTO public.profiles (id, first_name, last_name, avatar_url, peer_points_balance, referral_code, status)
  VALUES (NEW.id, _first_name, _last_name, _avatar, 0, v_referral_code, 'onboarding');

  RETURN NEW;
END;
$$;

-- ============================================================
-- 3. Update redeem_referral() to record relationship only
--    No points awarded. Bonus deferred to activation.
-- ============================================================
CREATE OR REPLACE FUNCTION public.redeem_referral(p_code text, p_new_user_id uuid)
RETURNS void AS $$
DECLARE
  v_inviter_id uuid;
BEGIN
  -- Look up inviter by referral code
  SELECT id INTO v_inviter_id
  FROM public.profiles
  WHERE referral_code = lower(trim(p_code));

  -- Fallback: check historical codes
  IF v_inviter_id IS NULL THEN
    SELECT user_id INTO v_inviter_id
    FROM public.referral_code_history
    WHERE old_code = lower(trim(p_code));
  END IF;

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

  -- Set invited_by on new user profile
  UPDATE public.profiles SET invited_by = v_inviter_id WHERE id = p_new_user_id;

  -- Record referral relationship with no bonus (deferred to activation)
  INSERT INTO public.referrals (inviter_id, invitee_id, status, bonus_awarded)
  VALUES (v_inviter_id, p_new_user_id, 'signed_up', 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ============================================================
-- 4. Create award_activation_bonuses() RPC
--    Called when a user completes onboarding. Awards:
--      a) Signup bonus to the new user
--      b) Referral bonus to the inviter (if referred)
--    Idempotent: checks for existing signup_bonus transaction.
-- ============================================================
CREATE OR REPLACE FUNCTION public.award_activation_bonuses(p_user_id uuid)
RETURNS void AS $$
DECLARE
  v_signup_bonus integer;
  v_referral_bonus integer;
  v_inviter_id uuid;
  v_already_awarded boolean;
BEGIN
  -- Idempotency: skip if signup bonus was already awarded
  SELECT EXISTS (
    SELECT 1 FROM public.peer_point_transactions
    WHERE user_id = p_user_id AND type = 'signup_bonus'
  ) INTO v_already_awarded;

  IF v_already_awarded THEN
    RETURN;
  END IF;

  -- Award signup bonus to the new user
  v_signup_bonus := COALESCE(public.get_setting('signup_bonus_amount')::integer, 3);

  IF v_signup_bonus > 0 THEN
    UPDATE public.profiles
    SET peer_points_balance = peer_points_balance + v_signup_bonus
    WHERE id = p_user_id;

    INSERT INTO public.peer_point_transactions (user_id, amount, type, reference_id)
    VALUES (p_user_id, v_signup_bonus, 'signup_bonus', NULL);
  END IF;

  -- Check if this user was referred (pending activation)
  SELECT inviter_id INTO v_inviter_id
  FROM public.referrals
  WHERE invitee_id = p_user_id AND status = 'signed_up';

  IF v_inviter_id IS NOT NULL THEN
    v_referral_bonus := COALESCE(public.get_setting('referral_bonus_amount')::integer, 5);

    -- Award referral bonus to inviter
    IF v_referral_bonus > 0 THEN
      UPDATE public.profiles
      SET peer_points_balance = peer_points_balance + v_referral_bonus
      WHERE id = v_inviter_id;

      INSERT INTO public.peer_point_transactions (user_id, amount, type, reference_id)
      VALUES (v_inviter_id, v_referral_bonus, 'referral_bonus', p_user_id);
    END IF;

    -- Update referral status to activated
    UPDATE public.referrals
    SET status = 'activated', bonus_awarded = v_referral_bonus, updated_at = now()
    WHERE invitee_id = p_user_id AND status = 'signed_up';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
