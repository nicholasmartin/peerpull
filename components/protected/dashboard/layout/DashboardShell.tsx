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
  isActive,
}: {
  children: React.ReactNode;
  user: User;
  profile: Profile | null;
  isActive: boolean;
}) {
  return (
    <ThemeProvider isProtected={true}>
      <div className="min-h-screen xl:flex">
        {/* Sidebar and Backdrop */}
        <AppSidebar isAdmin={profile?.is_admin} isUserActive={isActive} />
        <Backdrop />
        
        {/* Main Content Area */}
        <DashboardContent user={user} profile={profile}>{children}</DashboardContent>
      </div>
    </ThemeProvider>
  );
}
