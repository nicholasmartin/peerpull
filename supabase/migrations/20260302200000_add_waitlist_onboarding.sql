-- Add waitlist/onboarding support to profiles and system_settings
-- New users start in 'onboarding', complete setup → 'waitlisted', admin launch → 'active'

-- 1. Add status column to profiles (default 'active' so existing users are unaffected)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active';

-- Add CHECK constraint separately (IF NOT EXISTS not supported for constraints)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'profiles_status_check'
  ) THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_status_check
      CHECK (status IN ('onboarding', 'waitlisted', 'active'));
  END IF;
END $$;

-- 2. Add platform_launched system setting
INSERT INTO public.system_settings (key, value, category, label, description)
VALUES (
  'platform_launched',
  'false',
  'queue',
  'Platform Launched',
  'Whether the platform is open for feedback exchange. When false, new users enter a waitlist.'
)
ON CONFLICT (key) DO NOTHING;

-- 3. Replace handle_new_user() to set status = 'onboarding' for new signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_bonus integer;
  v_referral_code text;
  v_attempts integer := 0;
BEGIN
  -- Read signup bonus from settings
  v_bonus := COALESCE(public.get_setting('signup_bonus_amount')::integer, 3);

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

  -- Insert profile with bonus, referral code, and onboarding status
  INSERT INTO public.profiles (id, first_name, last_name, avatar_url, peer_points_balance, referral_code, status)
  VALUES (
    NEW.id,
    COALESCE((NEW.raw_user_meta_data->>'firstname')::TEXT, ''),
    COALESCE((NEW.raw_user_meta_data->>'lastname')::TEXT, ''),
    COALESCE((NEW.raw_user_meta_data->>'avatar_url')::TEXT, ''),
    v_bonus,
    v_referral_code,
    'onboarding'
  );

  -- Record signup bonus transaction
  IF v_bonus > 0 THEN
    INSERT INTO public.peer_point_transactions (user_id, amount, type, reference_id)
    VALUES (NEW.id, v_bonus, 'signup_bonus', NULL);
  END IF;

  RETURN NEW;
END;
$$;
