-- Add link_url column to notifications for deep linking from dropdown
ALTER TABLE public.notifications ADD COLUMN link_url text;

-- Update create_notification RPC to accept link_url parameter
CREATE OR REPLACE FUNCTION public.create_notification(
  p_user_id uuid,
  p_type text,
  p_title text,
  p_message text DEFAULT NULL,
  p_reference_id uuid DEFAULT NULL,
  p_link_url text DEFAULT NULL
)
RETURNS uuid AS $$
DECLARE
  v_notification_id uuid;
BEGIN
  INSERT INTO public.notifications (user_id, type, title, message, reference_id, link_url)
  VALUES (p_user_id, p_type, p_title, p_message, p_reference_id, p_link_url)
  RETURNING id INTO v_notification_id;

  RETURN v_notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
