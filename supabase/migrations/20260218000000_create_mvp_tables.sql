-- ============================================================
-- PeerPull MVP Migration
-- ============================================================

-- 1. Alter profiles table
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS expertise text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS peer_points_balance integer DEFAULT 0;

-- 2. Create pull_requests table
CREATE TABLE public.pull_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  url text,
  description text,
  stage text,
  categories text[] DEFAULT '{}',
  focus_areas text[] DEFAULT '{}',
  questions text[] DEFAULT '{}',
  status text NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'in_review', 'completed', 'closed')),
  created_at timestamptz DEFAULT now()
);

-- 3. Create reviews table
CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pull_request_id uuid NOT NULL REFERENCES public.pull_requests(id) ON DELETE CASCADE,
  reviewer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  video_url text,
  video_duration integer CHECK (video_duration IS NULL OR (video_duration BETWEEN 60 AND 300)),
  rating smallint CHECK (rating IS NULL OR (rating BETWEEN 1 AND 5)),
  strengths text,
  improvements text,
  status text NOT NULL DEFAULT 'in_progress'
    CHECK (status IN ('in_progress', 'submitted', 'approved', 'rejected')),
  created_at timestamptz DEFAULT now(),
  submitted_at timestamptz,
  UNIQUE(pull_request_id, reviewer_id)
);

-- 4. Create peer_point_transactions table
CREATE TABLE public.peer_point_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount integer NOT NULL,
  type text NOT NULL CHECK (type IN ('earned_review', 'spent_submission')),
  reference_id uuid,
  created_at timestamptz DEFAULT now()
);

-- ============================================================
-- RLS Policies
-- ============================================================

ALTER TABLE public.pull_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.peer_point_transactions ENABLE ROW LEVEL SECURITY;

-- pull_requests: all authenticated can read, owners can insert/update
CREATE POLICY "pull_requests_select" ON public.pull_requests
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "pull_requests_insert" ON public.pull_requests
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "pull_requests_update" ON public.pull_requests
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- reviews: reviewer and PR owner can read, reviewer can insert/update own
CREATE POLICY "reviews_select" ON public.reviews
  FOR SELECT TO authenticated USING (
    reviewer_id = auth.uid()
    OR pull_request_id IN (
      SELECT id FROM public.pull_requests WHERE user_id = auth.uid()
    )
  );
CREATE POLICY "reviews_insert" ON public.reviews
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = reviewer_id);
CREATE POLICY "reviews_update" ON public.reviews
  FOR UPDATE TO authenticated USING (auth.uid() = reviewer_id);

-- peer_point_transactions: own only
CREATE POLICY "transactions_select" ON public.peer_point_transactions
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "transactions_insert" ON public.peer_point_transactions
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- profiles: add update policy for new columns (existing policies cover select/insert)
-- The existing update policy already allows updating own row

-- ============================================================
-- Storage bucket for review videos
-- ============================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('review-videos', 'review-videos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: authenticated users can upload, public can read
CREATE POLICY "review_videos_upload" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'review-videos');

CREATE POLICY "review_videos_read" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'review-videos');

CREATE POLICY "review_videos_update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'review-videos' AND (storage.foldername(name))[1] = auth.uid()::text);

-- ============================================================
-- Seed data: 5 pull requests for cold-start
-- ============================================================

INSERT INTO public.pull_requests (user_id, title, url, description, stage, categories, focus_areas, questions, status) VALUES
(
  '815e70f3-7a74-467e-a731-e90ad11890ef',
  'PeerPull',
  'https://peerpull.com',
  'A peer-to-peer feedback platform where founders review each other''s projects via video. Get honest, actionable feedback from people who understand the startup journey.',
  'mvp',
  ARRAY['SaaS', 'Marketplace'],
  ARRAY['Value Proposition', 'UI/UX', 'Messaging'],
  ARRAY['Is the value proposition clear on the landing page?', 'Does the review flow make sense?', 'What would make you sign up?'],
  'open'
),
(
  '815e70f3-7a74-467e-a731-e90ad11890ef',
  'Nick Martin Portfolio',
  'https://nickmartin.com',
  'Personal portfolio and blog for a product-focused engineer. Showcases projects, writing, and professional background.',
  'launched',
  ARRAY['Other'],
  ARRAY['UI/UX', 'Messaging'],
  ARRAY['Does the portfolio effectively communicate my skills?', 'Is the navigation intuitive?'],
  'open'
),
(
  '815e70f3-7a74-467e-a731-e90ad11890ef',
  'SubCashFlow',
  'https://subcashflow.nickmartin.com',
  'A subscription analytics tool that helps SaaS founders track MRR, churn, and revenue metrics in one dashboard.',
  'prototype',
  ARRAY['SaaS', 'AI/ML'],
  ARRAY['Value Proposition', 'Technical Architecture', 'Pricing'],
  ARRAY['Is the pricing model clear?', 'Which feature would you use first?', 'Does the dashboard feel overwhelming?'],
  'open'
),
(
  '326b3802-62a2-4457-a5d0-c2a28624d6e8',
  'MagLoft',
  'https://magloft.com',
  'Digital publishing platform for magazines and catalogs. Publish once, distribute everywhere — web, iOS, Android, and print.',
  'launched',
  ARRAY['SaaS', 'E-commerce'],
  ARRAY['Value Proposition', 'UI/UX', 'Market Fit'],
  ARRAY['Is the pricing page convincing?', 'Does the demo showcase the product well?', 'What competitor would you compare us to?'],
  'open'
),
(
  '326b3802-62a2-4457-a5d0-c2a28624d6e8',
  'SaaStrialFlow',
  'https://saastrialflow.com',
  'SaaS trial optimization platform. Increase trial-to-paid conversion with behavioral triggers, onboarding flows, and analytics.',
  'mvp',
  ARRAY['SaaS', 'AI/ML'],
  ARRAY['Value Proposition', 'Technical Architecture', 'Messaging'],
  ARRAY['Is the landing page compelling enough to sign up?', 'Does the product positioning make sense?'],
  'open'
);
