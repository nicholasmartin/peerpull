import { createApiClient, apiSuccess, apiError, optionsResponse } from "@/utils/supabase/api-client";

export async function OPTIONS() {
  return optionsResponse();
}

export async function GET(request: Request) {
  const { supabase, user, errorResponse } = await createApiClient(request);
  if (errorResponse) return errorResponse;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("full_name, avatar_url, referral_code, peer_points_balance, quality_score, status")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return apiError("PROFILE_NOT_FOUND", "User profile not found", 404);
  }

  const { count } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("read", false);

  return apiSuccess({
    id: user.id,
    full_name: profile.full_name,
    avatar_url: profile.avatar_url,
    referral_code: profile.referral_code,
    peer_points_balance: profile.peer_points_balance,
    quality_score: profile.quality_score,
    status: profile.status,
    unread_notification_count: count ?? 0,
  });
}
