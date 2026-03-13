import { createApiClient, apiSuccess, apiError, optionsResponse } from "@/utils/supabase/api-client";

export async function OPTIONS() {
  return optionsResponse();
}

export async function GET(request: Request) {
  const { supabase, errorResponse } = await createApiClient(request);
  if (errorResponse) return errorResponse;

  const { data, error } = await supabase
    .from("system_settings")
    .select("key, value");

  if (error) {
    console.error("API settings error:", error);
    return apiError("SETTINGS_ERROR", "Failed to fetch settings", 500);
  }

  const settingsMap: Record<string, string> = {};
  for (const row of data ?? []) {
    settingsMap[row.key] = row.value;
  }

  return apiSuccess({
    min_video_duration: Number(settingsMap["min_video_duration_seconds"] ?? 60),
    max_video_duration: Number(settingsMap["max_video_duration_seconds"] ?? 300),
    review_reward: Number(settingsMap["review_reward_amount"] ?? 1),
    platform_launched: settingsMap["platform_launched"] === "true",
  });
}
