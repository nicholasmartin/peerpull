-- ============================================================
-- admin_activate_user() — admin activates a single user
-- ============================================================
CREATE OR REPLACE FUNCTION public.admin_activate_user(
  p_admin_id uuid,
  p_user_id uuid
)
RETURNS void AS $$
BEGIN
  -- Verify admin
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = p_admin_id AND is_admin = true) THEN
    RAISE EXCEPTION 'Not authorized: admin only';
  END IF;

  UPDATE public.profiles SET status = 'active' WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ============================================================
-- admin_activate_all_waitlisted() — admin activates all waiting users
-- ============================================================
CREATE OR REPLACE FUNCTION public.admin_activate_all_waitlisted(
  p_admin_id uuid
)
RETURNS integer AS $$
DECLARE
  v_count integer;
BEGIN
  -- Verify admin
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = p_admin_id AND is_admin = true) THEN
    RAISE EXCEPTION 'Not authorized: admin only';
  END IF;

  UPDATE public.profiles SET status = 'active' WHERE status IN ('waitlisted', 'onboarding');
  GET DIAGNOSTICS v_count = ROW_COUNT;

  RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
