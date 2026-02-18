-- Allow PR owner to update reviews on their PRs (for approve/reject)
DROP POLICY IF EXISTS "reviews_update" ON public.reviews;
CREATE POLICY "reviews_update" ON public.reviews
  FOR UPDATE TO authenticated USING (
    auth.uid() = reviewer_id
    OR pull_request_id IN (
      SELECT id FROM public.pull_requests WHERE user_id = auth.uid()
    )
  );
