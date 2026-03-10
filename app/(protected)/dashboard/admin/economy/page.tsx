import { createClient } from "@/utils/supabase/server";
import SettingsEditor from "../SettingsEditor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

export default async function EconomySettingsPage() {
  const supabase = await createClient();

  const { data: settings } = await supabase
    .from("system_settings")
    .select("key, value, label, description, updated_at")
    .eq("category", "point_economy")
    .order("key");

  const { data: adjustments } = await supabase
    .from("peer_point_transactions")
    .select("id, user_id, amount, reason, created_at, profiles!inner(first_name, last_name)")
    .eq("type", "admin_injection")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Point Economy Settings</h2>
        <p className="text-sm text-dark-text-muted">
          Configure how PeerPoints are earned, spent, and awarded across the platform.
        </p>
        <SettingsEditor settings={settings || []} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manual Adjustments History</CardTitle>
        </CardHeader>
        <CardContent>
          {adjustments && adjustments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dark-border">
                    <th className="px-4 py-3 text-left text-xs font-medium text-dark-text-muted uppercase">User</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-dark-text-muted uppercase">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-dark-text-muted uppercase">Reason</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-dark-text-muted uppercase">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {adjustments.map((a: any) => (
                    <tr key={a.id} className="border-b border-dark-border/50">
                      <td className="px-4 py-3 font-medium text-dark-text">
                        {a.profiles?.first_name} {a.profiles?.last_name}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`font-medium ${a.amount > 0 ? "text-green-400" : "text-red-400"}`}>
                          {a.amount > 0 ? "+" : ""}{a.amount}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-dark-text-muted">
                        {a.reason || "No reason provided"}
                      </td>
                      <td className="px-4 py-3 text-sm text-dark-text-muted">
                        {new Date(a.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-dark-text-muted py-4">No manual adjustments yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
