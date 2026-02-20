-- Create server-side function to award points (bypasses RLS)
CREATE OR REPLACE FUNCTION award_review_point(p_reviewer_id uuid, p_review_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE profiles SET peer_points_balance = peer_points_balance + 1 WHERE id = p_reviewer_id;
  INSERT INTO peer_point_transactions (user_id, amount, type, reference_id)
  VALUES (p_reviewer_id, 1, 'earned_review', p_review_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Backfill: insert missing transactions for already-approved reviews
INSERT INTO peer_point_transactions (user_id, amount, type, reference_id)
SELECT r.reviewer_id, 1, 'earned_review', r.id
FROM reviews r
WHERE r.status = 'approved'
  AND NOT EXISTS (
    SELECT 1 FROM peer_point_transactions t
    WHERE t.reference_id = r.id AND t.type = 'earned_review'
  );

-- Recalculate balances from transactions
UPDATE profiles p SET peer_points_balance = COALESCE(sub.total, 0)
FROM (
  SELECT user_id, SUM(amount) as total
  FROM peer_point_transactions GROUP BY user_id
) sub
WHERE p.id = sub.user_id;
