import { createApiClient, apiSuccess, apiError, optionsResponse } from "@/utils/supabase/api-client";
import { CreateExternalReviewSchema } from "@/types/api";

function generateSlug(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let slug = "";
  for (let i = 0; i < 6; i++) {
    slug += chars[Math.floor(Math.random() * chars.length)];
  }
  return slug;
}

export async function OPTIONS() {
  return optionsResponse();
}

export async function POST(request: Request) {
  const { supabase, user, errorResponse } = await createApiClient(request);
  if (errorResponse) return errorResponse;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiError("INVALID_JSON", "Request body must be valid JSON", 400);
  }

  const parsed = CreateExternalReviewSchema.safeParse(body);
  if (!parsed.success) {
    return apiError("VALIDATION_ERROR", parsed.error.errors[0].message, 400);
  }

  // Get reviewer's referral code for the shareable URL
  const { data: profile } = await supabase
    .from("profiles")
    .select("referral_code")
    .eq("id", user.id)
    .single();

  if (!profile?.referral_code) {
    return apiError("PROFILE_ERROR", "Could not find your referral code", 500);
  }

  // Generate a unique slug, retry once on collision
  let slug = generateSlug();
  let insertResult = await supabase
    .from("external_reviews")
    .insert({
      reviewer_id: user.id,
      video_url: parsed.data.video_url,
      video_duration: parsed.data.video_duration,
      target_url: parsed.data.target_url,
      target_title: parsed.data.target_title || null,
      target_favicon_url: parsed.data.target_favicon_url || null,
      target_og_image_url: parsed.data.target_og_image_url || null,
      target_og_description: parsed.data.target_og_description || null,
      slug,
    })
    .select("id, slug, created_at")
    .single();

  // Retry once on slug collision
  if (insertResult.error?.code === "23505") {
    slug = generateSlug();
    insertResult = await supabase
      .from("external_reviews")
      .insert({
        reviewer_id: user.id,
        video_url: parsed.data.video_url,
        video_duration: parsed.data.video_duration,
        target_url: parsed.data.target_url,
        target_title: parsed.data.target_title || null,
        target_favicon_url: parsed.data.target_favicon_url || null,
        target_og_image_url: parsed.data.target_og_image_url || null,
        target_og_description: parsed.data.target_og_description || null,
        slug,
      })
      .select("id, slug, created_at")
      .single();
  }

  if (insertResult.error) {
    console.error("API createExternalReview error:", insertResult.error);
    return apiError("INSERT_FAILED", "Failed to create external review", 500);
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://peerpull.com";
  const shareableUrl = `${appUrl}/r/${profile.referral_code}/${slug}`;

  return apiSuccess(
    {
      id: insertResult.data.id,
      slug: insertResult.data.slug,
      shareable_url: shareableUrl,
      created_at: insertResult.data.created_at,
    },
    201
  );
}
