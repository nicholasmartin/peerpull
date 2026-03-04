import { createClient } from "@/utils/supabase/server";
import { getUserProfile } from "@/utils/supabase/profiles";
import { redirect } from "next/navigation";
import OnboardingFlow from "@/components/protected/dashboard/OnboardingFlow";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/signin");

  const profile = await getUserProfile(user);

  // If user is not in onboarding, send them to the dashboard
  if (!profile || profile.status !== "onboarding") {
    return redirect("/dashboard");
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center py-8">
      <OnboardingFlow profile={profile} />
    </div>
  );
}
