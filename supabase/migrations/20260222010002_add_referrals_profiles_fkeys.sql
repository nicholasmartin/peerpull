-- Add FK constraints from referrals to profiles so Supabase PostgREST
-- can resolve embedded joins like profiles!referrals_invitee_id_profiles_fkey
ALTER TABLE public.referrals
  ADD CONSTRAINT referrals_invitee_id_profiles_fkey
  FOREIGN KEY (invitee_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.referrals
  ADD CONSTRAINT referrals_inviter_id_profiles_fkey
  FOREIGN KEY (inviter_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
