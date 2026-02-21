"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) throw new Error("Not authorized");
  return { supabase, user };
}

export async function updateSetting(key: string, value: string) {
  const { supabase, user } = await requireAdmin();

  const { error } = await supabase
    .from("system_settings")
    .update({
      value,
      updated_at: new Date().toISOString(),
      updated_by: user.id,
    })
    .eq("key", key);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/admin");
  return { success: true };
}

export async function injectPoints(targetUserId: string, amount: number, reason: string) {
  const { supabase, user } = await requireAdmin();

  const { error } = await supabase.rpc("admin_inject_points", {
    p_admin_id: user.id,
    p_target_user_id: targetUserId,
    p_amount: amount,
    p_reason: reason,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/admin/users");
  return { success: true };
}

export async function injectPointsToAll(amount: number, reason: string) {
  const { supabase, user } = await requireAdmin();

  // Get all users
  const { data: users, error: fetchError } = await supabase
    .from("profiles")
    .select("id");

  if (fetchError || !users) {
    return { error: fetchError?.message || "Failed to fetch users" };
  }

  for (const u of users) {
    await supabase.rpc("admin_inject_points", {
      p_admin_id: user.id,
      p_target_user_id: u.id,
      p_amount: amount,
      p_reason: reason,
    });
  }

  revalidatePath("/dashboard/admin/users");
  return { success: true, count: users.length };
}
