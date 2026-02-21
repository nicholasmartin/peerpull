import { createClient } from "@/utils/supabase/server";
import SettingsEditor from "../SettingsEditor";
import React from "react";

export default async function EconomySettingsPage() {
  const supabase = await createClient();

  const { data: settings } = await supabase
    .from("system_settings")
    .select("key, value, label, description, updated_at")
    .eq("category", "point_economy")
    .order("key");

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Point Economy Settings</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Configure how PeerPoints are earned, spent, and awarded across the platform.
      </p>
      <SettingsEditor settings={settings || []} />
    </div>
  );
}
