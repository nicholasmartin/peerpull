import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import React from "react";
import { AdminNav } from "./admin-nav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/signin");

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) {
    return redirect("/dashboard");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Admin Dashboard</h1>
        <p className="text-sm text-dark-text-muted mt-1">
          Manage system settings, users, and monitor platform health
        </p>
      </div>

      <AdminNav />

      {children}
    </div>
  );
}
