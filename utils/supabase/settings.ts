import { createClient } from "./server";

export type SystemSettings = {
  signup_bonus_amount: number;
  review_reward_amount: number;
  review_cost_amount: number;
  first_review_bonus_amount: number;
  referral_bonus_amount: number;
  active_project_limit: number;
  auto_requeue_limit: number;
  auto_requeue_min_balance: number;
  review_claim_timeout_minutes: number;
  min_video_duration_seconds: number;
  max_video_duration_seconds: number;
};

const DEFAULTS: SystemSettings = {
  signup_bonus_amount: 3,
  review_reward_amount: 1,
  review_cost_amount: 1,
  first_review_bonus_amount: 2,
  referral_bonus_amount: 5,
  active_project_limit: 1,
  auto_requeue_limit: 3,
  auto_requeue_min_balance: 1,
  review_claim_timeout_minutes: 10,
  min_video_duration_seconds: 60,
  max_video_duration_seconds: 300,
};

export async function getSettings(): Promise<SystemSettings> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("system_settings")
    .select("key, value");

  if (error || !data) {
    console.error("Failed to fetch settings, using defaults:", error);
    return DEFAULTS;
  }

  const settings = { ...DEFAULTS };
  for (const row of data) {
    if (row.key in settings) {
      (settings as any)[row.key] = Number(row.value);
    }
  }
  return settings;
}

export async function getSetting(key: keyof SystemSettings): Promise<number> {
  const settings = await getSettings();
  return settings[key];
}
