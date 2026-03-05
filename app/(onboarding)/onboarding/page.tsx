import { createClient } from "@/utils/supabase/server";
import { getUserProfile } from "@/utils/supabase/profiles";
import { getSettings } from "@/utils/supabase/settings";
import { redirect } from "next/navigation";
import OnboardingFlow from "@/components/protected/dashboard/OnboardingFlow";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/signin");

  const profile = await getUserProfile(user);

  if (!profile || profile.status !== "onboarding") {
    return redirect("/dashboard");
  }

  const settings = await getSettings();

  return (
    <div className="w-full max-w-2xl px-4">
      <OnboardingFlow
        profile={profile}
        signupBonus={settings.signup_bonus_amount}
        referralBonus={settings.referral_bonus_amount}
      />
    </div>
  );
}
