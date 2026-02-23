-- ============================================================
-- Allow users to change their referral code
-- Old codes kept in history table so shared links keep working
-- ============================================================

-- 1. Create referral_code_history table
CREATE TABLE public.referral_code_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  old_code text NOT NULL,
  replaced_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_referral_code_history_old_code ON public.referral_code_history (old_code);

ALTER TABLE public.referral_code_history ENABLE ROW LEVEL SECURITY;

-- Users can only read their own history
CREATE POLICY "referral_code_history_select" ON public.referral_code_history
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- 2. change_referral_code function
CREATE OR REPLACE FUNCTION public.change_referral_code(p_user_id uuid, p_new_code text)
RETURNS void AS $$
DECLARE
  v_normalized text;
  v_current_code text;
BEGIN
  -- Normalize input
  v_normalized := lower(trim(p_new_code));

  -- Validate format: 3-20 lowercase alphanumeric chars
  IF v_normalized !~ '^[a-z0-9]{3,20}$' THEN
    RAISE EXCEPTION 'Code must be 3-20 lowercase letters or numbers' USING ERRCODE = 'check_violation';
  END IF;

  -- Get current code
  SELECT referral_code INTO v_current_code
  FROM public.profiles
  WHERE id = p_user_id;

  -- No-op if same code
  IF v_current_code = v_normalized THEN
    RETURN;
  END IF;

  -- Check uniqueness against active codes (exclude self)
  IF EXISTS (
    SELECT 1 FROM public.profiles
    WHERE referral_code = v_normalized AND id != p_user_id
  ) THEN
    RAISE EXCEPTION 'That code is already taken' USING ERRCODE = 'unique_violation';
  END IF;

  -- Check uniqueness against historical codes (exclude own old codes so user can reclaim)
  IF EXISTS (
    SELECT 1 FROM public.referral_code_history
    WHERE old_code = v_normalized AND user_id != p_user_id
  ) THEN
    RAISE EXCEPTION 'That code is already taken' USING ERRCODE = 'unique_violation';
  END IF;

  -- Archive current code (ON CONFLICT DO NOTHING for idempotency)
  INSERT INTO public.referral_code_history (user_id, old_code)
  VALUES (p_user_id, v_current_code)
  ON CONFLICT (old_code) DO NOTHING;

  -- Update profile
  UPDATE public.profiles SET referral_code = v_normalized WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 3. Update redeem_referral — add fallback to history table
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
