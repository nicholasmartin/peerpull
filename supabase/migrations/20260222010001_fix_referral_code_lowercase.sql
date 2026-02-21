-- Fix referral code case handling: standardize on lowercase
-- Root cause: redeem_referral() uppercased the input but stored codes were lowercase

-- 1. Normalize all existing referral codes to lowercase
UPDATE public.profiles SET referral_code = lower(referral_code) WHERE referral_code IS NOT NULL;

-- 2. Replace handle_new_user() — generate lowercase referral codes
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
    v_referral_code := lower(substr(md5(random()::text || clock_timestamp()::text), 1, 6));
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.profiles WHERE referral_code = v_referral_code);
    v_attempts := v_attempts + 1;
    IF v_attempts > 10 THEN
      -- Fallback to 8 chars if collisions
      v_referral_code := lower(substr(md5(random()::text || clock_timestamp()::text), 1, 8));
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

-- 3. Replace redeem_referral() — lookup with lowercase normalization
CREATE OR REPLACE FUNCTION public.redeem_referral(p_code text, p_new_user_id uuid)
RETURNS void AS $$
DECLARE
  v_inviter_id uuid;
  v_bonus integer;
BEGIN
  -- Look up inviter by referral code
  SELECT id INTO v_inviter_id
  FROM public.profiles
  WHERE referral_code = lower(trim(p_code));

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

-- 4. Retroactively fix Tommy Fleetwood's referral for Nick
--    Tommy's username: nickmartin (the invitee who used the code)
--    Tommy's user ID: d1a68176-98e4-4243-95cc-df1f55f17e83
SELECT public.redeem_referral('nickmartin', 'd1a68176-98e4-4243-95cc-df1f55f17e83');
