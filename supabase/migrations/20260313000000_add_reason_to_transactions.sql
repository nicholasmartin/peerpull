-- Add a reason column to peer_point_transactions
-- Used by admin_inject_points to store a human-readable reason
-- that is displayed to users in their PeerPoints history.

ALTER TABLE public.peer_point_transactions
ADD COLUMN reason text;

-- Update admin_inject_points to accept and store the reason
CREATE OR REPLACE FUNCTION public.admin_inject_points(
  p_admin_id uuid,
  p_target_user_id uuid,
  p_amount integer,
  p_reason text DEFAULT 'Admin adjustment'
)
RETURNS void AS $$
BEGIN
  -- Verify admin
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = p_admin_id AND is_admin = true) THEN
    RAISE EXCEPTION 'Not authorized: admin only';
  END IF;

  -- Update balance
  UPDATE public.profiles SET peer_points_balance = peer_points_balance + p_amount WHERE id = p_target_user_id;

  -- Record transaction with reason
  INSERT INTO public.peer_point_transactions (user_id, amount, type, reference_id, reason)
  VALUES (p_target_user_id, p_amount, 'admin_injection', NULL, p_reason);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
