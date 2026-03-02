import { createClient } from "@/utils/supabase/server";
import { getUserProfile } from "@/utils/supabase/profiles";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";
import DashboardShell from "@/components/protected/dashboard/layout/DashboardShell";
import { ToastFromParams } from "@/components/toast-from-params";

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

  // Fetch user profile
  const profile = await getUserProfile(user);

  return (
    <>
      <Suspense fallback={null}>
        <ToastFromParams />
      </Suspense>
      <DashboardShell user={user} profile={profile}>{children}</DashboardShell>
    </>
  );
}
