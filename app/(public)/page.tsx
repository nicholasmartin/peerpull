export const dynamic = "force-dynamic";

import { createClient } from "@/utils/supabase/server";
import { Hero } from "@/components/public/home/Hero";
import { Problem } from "@/components/public/home/Problem";
import { HowItWorks } from "@/components/public/home/HowItWorks";
import { FAQ } from "@/components/public/home/FAQ";
import { CTASection } from "@/components/public/home/CTASection";

export type SiteSettings = {
  signupBonus: number;
  referralBonus: number;
  reviewReward: number;
  reviewCost: number;
  firstReviewBonus: number;
};

async function getSettings(): Promise<SiteSettings> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("system_settings")
    .select("key, value")
    .in("key", [
      "signup_bonus_amount",
      "referral_bonus_amount",
      "review_reward_amount",
      "review_cost_amount",
      "first_review_bonus_amount",
    ]);

  const map = Object.fromEntries((data || []).map((r) => [r.key, r.value]));

  return {
    signupBonus: Number(map.signup_bonus_amount) || 3,
    referralBonus: Number(map.referral_bonus_amount) || 5,
    reviewReward: Number(map.review_reward_amount) || 1,
    reviewCost: Number(map.review_cost_amount) || 1,
    firstReviewBonus: Number(map.first_review_bonus_amount) || 2,
  };
}

export default async function HomePage() {
  const settings = await getSettings();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1">
        <Hero settings={settings} />
        <Problem />
        <HowItWorks />
        <FAQ settings={settings} />
        <CTASection settings={settings} />
      </main>
    </div>
  );
}
