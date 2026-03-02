-- Allow anonymous (public) users to read system_settings
-- so the homepage can display dynamic values without auth
DROP POLICY IF EXISTS "system_settings_select" ON public.system_settings;
CREATE POLICY "system_settings_select" ON public.system_settings
  FOR SELECT
  TO anon, authenticated
  USING (true);
