-- ============================================================
-- Phase 4: Notifications & Polish — Schema
-- ============================================================

-- 1. Notifications table
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('review_received', 'review_approved', 'review_rejected', 'review_rated')),
  title text NOT NULL,
  message text,
  reference_id uuid,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes for unread count query and dropdown fetch
CREATE INDEX idx_notifications_user_unread ON public.notifications (user_id, read, created_at DESC);
CREATE INDEX idx_notifications_user_created ON public.notifications (user_id, created_at DESC);

-- 2. Notification preferences table
CREATE TABLE public.notification_preferences (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type text NOT NULL CHECK (event_type IN ('review_received', 'review_approved', 'review_rejected', 'review_rated')),
  email_enabled boolean NOT NULL DEFAULT true,
  push_enabled boolean NOT NULL DEFAULT false,
  PRIMARY KEY (user_id, event_type)
);

-- 3. RLS on notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notifications_select" ON public.notifications
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "notifications_update" ON public.notifications
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- 4. RLS on notification_preferences
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notification_preferences_select" ON public.notification_preferences
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "notification_preferences_upsert" ON public.notification_preferences
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "notification_preferences_update" ON public.notification_preferences
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- 5. Enable Realtime on notifications table
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- 6. SECURITY DEFINER: create notification for any user (bypasses RLS)
--    Needed because server actions run as the ACTOR but must insert
--    a notification for a DIFFERENT user (the recipient).
CREATE OR REPLACE FUNCTION public.create_notification(
  p_user_id uuid,
  p_type text,
  p_title text,
  p_message text DEFAULT NULL,
  p_reference_id uuid DEFAULT NULL
)
RETURNS uuid AS $$
DECLARE
  v_notification_id uuid;
BEGIN
  INSERT INTO public.notifications (user_id, type, title, message, reference_id)
  VALUES (p_user_id, p_type, p_title, p_message, p_reference_id)
  RETURNING id INTO v_notification_id;

  RETURN v_notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 7. SECURITY DEFINER: get user email from auth.users for email notifications
CREATE OR REPLACE FUNCTION public.get_user_email(p_user_id uuid)
RETURNS text AS $$
  SELECT email FROM auth.users WHERE id = p_user_id;
$$ LANGUAGE sql SECURITY DEFINER SET search_path = public;
