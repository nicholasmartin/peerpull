"use client";

import React from "react";
import AppSidebar from "@/components/protected/dashboard/layout/AppSidebar";
import Backdrop from "@/components/protected/dashboard/layout/Backdrop";
import DashboardContent from "@/components/protected/dashboard/layout/DashboardContent";
import { ThemeProvider } from "@/context/ThemeContext";
import { User } from "@supabase/supabase-js";
import { Profile } from "@/utils/supabase/profiles";

export default function DashboardShell({
  children,
  user,
  profile,
  userStatus,
  platformLaunched,
}: {
  children: React.ReactNode;
  user: User;
  profile: Profile | null;
  userStatus?: string;
  platformLaunched?: boolean;
}) {
  return (
    <ThemeProvider isProtected={true}>
      <div className="min-h-screen xl:flex">
        {/* Sidebar and Backdrop */}
        <AppSidebar isAdmin={profile?.is_admin} userStatus={userStatus} platformLaunched={platformLaunched} />
        <Backdrop />
        
        {/* Main Content Area */}
        <DashboardContent user={user} profile={profile}>{children}</DashboardContent>
      </div>
    </ThemeProvider>
  );
}
