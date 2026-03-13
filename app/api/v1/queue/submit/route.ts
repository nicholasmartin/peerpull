import { createApiClient, requireActiveApiUser, apiSuccess, apiError, optionsResponse } from "@/utils/supabase/api-client";
import { SubmitReviewSchema } from "@/types/api";

export async function OPTIONS() {
  return optionsResponse();
}

export async function POST(request: Request) {
  const { supabase, user, errorResponse } = await createApiClient(request);
  if (errorResponse) return errorResponse;

  const activeCheck = await requireActiveApiUser(supabase, user.id);
  if (activeCheck.error) {
    return apiError("INACTIVE_USER", activeCheck.error, 403);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiError("INVALID_JSON", "Request body must be valid JSON", 400);
  }

  const parsed = SubmitReviewSchema.safeParse(body);
  if (!parsed.success) {
    return apiError("VALIDATION_ERROR", parsed.error.issues[0].message, 400);
  }

  const { review_id, video_url, duration, rating, strengths, improvements, signal_follow, signal_engage, signal_invest } = parsed.data;

  // Validate minimum video duration
  const { data: minDurationSetting } = await supabase
    .from("system_settings")
    .select("value")
    .eq("key", "min_video_duration_seconds")
    .single();

  const minDuration = minDurationSetting ? Number(minDurationSetting.value) : 60;
  if (duration < minDuration) {
    return apiError("VIDEO_TOO_SHORT", `Video must be at least ${minDuration} seconds`, 400);
  }

  // Call the atomic RPC
  const { error: rpcError } = await supabase.rpc("submit_review_atomic", {
    p_review_id: review_id,
    p_reviewer_id: user.id,
    p_video_url: video_url,
    p_video_duration: duration,
    p_rating: rating,
    p_strengths: strengths || null,
    p_improvements: improvements || null,
    p_signal_follow: signal_follow,
    p_signal_engage: signal_engage,
    p_signal_invest: signal_invest,
  });

  if (rpcError) {
    console.error("API submitReview RPC error:", rpcError);
    return apiError("SUBMIT_FAILED", rpcError.message || "Failed to submit review", 500);
  }

  // Create in-app notification for the feedback request owner (skip email for API routes)
  const { data: notifData } = await supabase
    .from("reviews")
    .select("feedback_request_id, feedback_requests(user_id, title)")
    .eq("id", review_id)
    .single();

  if (notifData?.feedback_requests) {
    const fr = notifData.feedback_requests as { user_id: string; title: string };
    await supabase.rpc("create_notification", {
      p_user_id: fr.user_id,
      p_type: "review_received",
      p_title: "New feedback received",
      p_message: `Someone submitted video feedback for "${fr.title}"`,
      p_reference_id: review_id,
      p_link_url: `/dashboard/projects/list/${notifData.feedback_request_id}`,
    });
  }

  // Fetch updated balance
  const { data: profile } = await supabase
    .from("profiles")
    .select("peer_points_balance")
    .eq("id", user.id)
    .single();

  const { data: rewardSetting } = await supabase
    .from("system_settings")
    .select("value")
    .eq("key", "review_reward_amount")
    .single();

  return apiSuccess({
    points_earned: rewardSetting ? Number(rewardSetting.value) : 1,
    new_balance: profile?.peer_points_balance ?? 0,
  });
}
