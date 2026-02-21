import { createClient } from "@/utils/supabase/server";
import SettingsEditor from "../SettingsEditor";
import React from "react";

export default async function QueueSettingsPage() {
  const supabase = await createClient();

  const { data: settings } = await supabase
    .from("system_settings")
    .select("key, value, label, description, updated_at")
    .eq("category", "queue")
    .order("key");

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Queue Settings</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Configure project queue limits, requeue behavior, and claim timeouts.
      </p>
      <SettingsEditor settings={settings || []} />
    </div>
  );
}
