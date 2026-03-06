import { createClient } from "@/utils/supabase/server";
import { getUserProfile } from "@/utils/supabase/profiles";
import { getSettings } from "@/utils/supabase/settings";
import { getFlashMessage } from "@/utils/utils";
import { redirect } from "next/navigation";
import React from "react";
import DashboardShell from "@/components/protected/dashboard/layout/DashboardShell";
import { FlashToast } from "@/components/toast-from-params";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check authentication
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/signin");
  }

  // Fetch user profile, settings, and any flash message
  const profile = await getUserProfile(user);
  const settings = await getSettings();
  const flash = await getFlashMessage();
  const isActive = profile?.status === 'active' || settings.platform_launched;

  return (
    <>
      <FlashToast flash={flash} />
      <DashboardShell
        user={user}
        profile={profile}
        isActive={!!isActive}
      >
        {children}
      </DashboardShell>
    </>
  );
}
