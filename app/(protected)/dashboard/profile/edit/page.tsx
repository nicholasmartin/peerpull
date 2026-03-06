import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getUserProfile } from "@/utils/supabase/profiles";
import EditProfileForm from "@/components/protected/dashboard/EditProfileForm";

export default async function EditProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/signin");

  const profile = await getUserProfile(user);
  if (!profile) return redirect("/signin");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/profile"
          className="rounded-md p-1.5 hover:bg-dark-surface transition"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-xl font-semibold">Edit Profile</h1>
      </div>

      <EditProfileForm profile={profile} userEmail={user.email || ""} />
    </div>
  );
}
