-- Fix foreign key constraints to allow deleting users from auth.users

-- 1. profiles.id -> CASCADE (profile should be deleted with user)
ALTER TABLE public.profiles
  DROP CONSTRAINT profiles_id_fkey,
  ADD CONSTRAINT profiles_id_fkey
    FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 2. profiles.invited_by -> SET NULL (keep profile, clear reference)
ALTER TABLE public.profiles
  DROP CONSTRAINT profiles_invited_by_fkey,
  ADD CONSTRAINT profiles_invited_by_fkey
    FOREIGN KEY (invited_by) REFERENCES auth.users(id) ON DELETE SET NULL;

-- 3. system_settings.updated_by -> SET NULL (keep settings, clear actor)
ALTER TABLE public.system_settings
  DROP CONSTRAINT system_settings_updated_by_fkey,
  ADD CONSTRAINT system_settings_updated_by_fkey
    FOREIGN KEY (updated_by) REFERENCES auth.users(id) ON DELETE SET NULL;
