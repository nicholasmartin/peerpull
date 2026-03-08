-- ============================================================
-- Make handle_new_user() idempotent with ON CONFLICT guard
--
-- Prevents PRIMARY KEY violation if the trigger fires for a
-- user who already has a profile (edge case defense for
-- identity linking scenarios or race conditions).
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
  -- ON CONFLICT guard: if a profile already exists (e.g. from identity
  -- linking edge cases), silently skip to preserve existing data.
  INSERT INTO public.profiles (id, first_name, last_name, avatar_url, peer_points_balance, referral_code, status)
  VALUES (NEW.id, _first_name, _last_name, _avatar, 0, v_referral_code, 'onboarding')
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;
