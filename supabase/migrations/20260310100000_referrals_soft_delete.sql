-- Preserve referral records when users are deleted.
-- Changes CASCADE to SET NULL so referral history (and awarded points) survives user deletion.

-- 1. Make inviter_id and invitee_id nullable
ALTER TABLE public.referrals
  ALTER COLUMN inviter_id DROP NOT NULL,
  ALTER COLUMN invitee_id DROP NOT NULL;

-- 2. Drop the UNIQUE constraint (it doesn't work well with NULLs)
ALTER TABLE public.referrals
  DROP CONSTRAINT IF EXISTS referrals_inviter_id_invitee_id_key;

-- Re-add as a unique index that ignores nulls
CREATE UNIQUE INDEX IF NOT EXISTS referrals_inviter_invitee_unique
  ON public.referrals (inviter_id, invitee_id)
  WHERE inviter_id IS NOT NULL AND invitee_id IS NOT NULL;

-- 3. Update FK constraints on auth.users to SET NULL
ALTER TABLE public.referrals
  DROP CONSTRAINT IF EXISTS referrals_inviter_id_fkey,
  ADD CONSTRAINT referrals_inviter_id_fkey
    FOREIGN KEY (inviter_id) REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE public.referrals
  DROP CONSTRAINT IF EXISTS referrals_invitee_id_fkey,
  ADD CONSTRAINT referrals_invitee_id_fkey
    FOREIGN KEY (invitee_id) REFERENCES auth.users(id) ON DELETE SET NULL;

-- 4. Update FK constraints on profiles to SET NULL
ALTER TABLE public.referrals
  DROP CONSTRAINT IF EXISTS referrals_inviter_id_profiles_fkey,
  ADD CONSTRAINT referrals_inviter_id_profiles_fkey
    FOREIGN KEY (inviter_id) REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE public.referrals
  DROP CONSTRAINT IF EXISTS referrals_invitee_id_profiles_fkey,
  ADD CONSTRAINT referrals_invitee_id_profiles_fkey
    FOREIGN KEY (invitee_id) REFERENCES public.profiles(id) ON DELETE SET NULL;

-- 5. Update RLS policy to handle nulls
DROP POLICY IF EXISTS "referrals_select" ON public.referrals;
CREATE POLICY "referrals_select" ON public.referrals
  FOR SELECT TO authenticated
  USING (inviter_id = auth.uid() OR invitee_id = auth.uid());
