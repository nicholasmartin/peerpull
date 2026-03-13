import { z } from "zod";

// POST /api/v1/queue/submit
export const SubmitReviewSchema = z.object({
  review_id: z.string().uuid(),
  video_url: z.string().url(),
  duration: z.number().int().positive(),
  rating: z.number().int().min(1).max(5),
  strengths: z.string().optional().nullable(),
  improvements: z.string().optional().nullable(),
  signal_follow: z.boolean().default(false),
  signal_engage: z.boolean().default(false),
  signal_invest: z.boolean().default(false),
});
export type SubmitReviewPayload = z.infer<typeof SubmitReviewSchema>;

// POST /api/v1/external-reviews
export const CreateExternalReviewSchema = z.object({
  video_url: z.string().url(),
  video_duration: z.number().int().positive(),
  target_url: z.string().url(),
  target_title: z.string().optional().nullable(),
  target_favicon_url: z.string().url().optional().nullable(),
  target_og_image_url: z.string().url().optional().nullable(),
  target_og_description: z.string().optional().nullable(),
});
export type CreateExternalReviewPayload = z.infer<typeof CreateExternalReviewSchema>;

// PATCH /api/v1/external-reviews/:id
export const UpdateExternalReviewSchema = z.object({
  target_title: z.string().optional(),
  target_og_description: z.string().optional(),
});
export type UpdateExternalReviewPayload = z.infer<typeof UpdateExternalReviewSchema>;

// POST /api/v1/upload/signed-url
export const SignedUrlSchema = z.object({
  filename: z.string().min(1),
  content_type: z.string().refine(
    (val) => val.startsWith("video/"),
    { message: "Only video content types are allowed" }
  ),
});
export type SignedUrlPayload = z.infer<typeof SignedUrlSchema>;
