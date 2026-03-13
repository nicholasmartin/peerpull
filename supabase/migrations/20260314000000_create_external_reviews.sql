-- ============================================================
-- Phase 6.1: External Reviews Table & Storage Constraints
-- ============================================================

-- 1. External reviews table
CREATE TABLE public.external_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  video_url text NOT NULL,
  video_duration integer NOT NULL CHECK (video_duration > 0),
  target_url text NOT NULL,
  target_title text,
  target_favicon_url text,
  target_og_image_url text,
  target_og_description text,
  slug text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'deleted')),
  view_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Indexes
CREATE INDEX idx_external_reviews_reviewer ON public.external_reviews (reviewer_id);
CREATE INDEX idx_external_reviews_slug ON public.external_reviews (slug);
CREATE INDEX idx_external_reviews_public_lookup ON public.external_reviews (slug, status) WHERE status = 'published';

-- 3. Updated_at trigger (reuses existing function from profiles table)
CREATE TRIGGER update_external_reviews_updated_at
  BEFORE UPDATE ON public.external_reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4. Enable RLS
ALTER TABLE public.external_reviews ENABLE ROW LEVEL SECURITY;

-- 5. RLS policies

-- Authenticated users can read their own external reviews (all statuses)
CREATE POLICY "external_reviews_select_own" ON public.external_reviews
  FOR SELECT TO authenticated
  USING (auth.uid() = reviewer_id);

-- Anonymous/public can read published external reviews (for shareable pages)
CREATE POLICY "external_reviews_select_published" ON public.external_reviews
  FOR SELECT TO anon
  USING (status = 'published');

-- Authenticated users can insert their own external reviews
CREATE POLICY "external_reviews_insert" ON public.external_reviews
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = reviewer_id);

-- Authenticated users can update their own external reviews
CREATE POLICY "external_reviews_update" ON public.external_reviews
  FOR UPDATE TO authenticated
  USING (auth.uid() = reviewer_id);

-- Authenticated users can delete their own external reviews
CREATE POLICY "external_reviews_delete" ON public.external_reviews
  FOR DELETE TO authenticated
  USING (auth.uid() = reviewer_id);

-- 6. Tighten review-videos storage bucket: restrict to video MIME types and 500MB limit
UPDATE storage.buckets
SET file_size_limit = 524288000,
    allowed_mime_types = ARRAY['video/webm', 'video/mp4', 'video/quicktime']
WHERE id = 'review-videos';
