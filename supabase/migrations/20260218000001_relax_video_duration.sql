-- TODO: revert to BETWEEN 60 AND 300 for production
ALTER TABLE public.reviews DROP CONSTRAINT IF EXISTS reviews_video_duration_check;
ALTER TABLE public.reviews ADD CONSTRAINT reviews_video_duration_check CHECK (video_duration IS NULL OR (video_duration BETWEEN 5 AND 300));
