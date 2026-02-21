import { createClient } from "@/utils/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

export default async function AdminOverviewPage() {
  const supabase = await createClient();

  // Total users
  const { count: totalUsers } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true });

  // New signups (7d)
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const { count: newSignups } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .gte("created_at", sevenDaysAgo);

  // Total points in circulation
  const { data: balances } = await supabase
    .from("profiles")
    .select("peer_points_balance");
  const totalPoints = (balances || []).reduce((sum, p) => sum + (p.peer_points_balance || 0), 0);

  // Queue depth
  const { count: queueDepth } = await supabase
    .from("pull_requests")
    .select("id", { count: "exact", head: true })
    .not("queue_position", "is", null)
    .eq("status", "open");

  // Total reviews
  const { count: totalReviews } = await supabase
    .from("reviews")
    .select("id", { count: "exact", head: true });

  // Completed reviews
  const { count: completedReviews } = await supabase
    .from("reviews")
    .select("id", { count: "exact", head: true })
    .in("status", ["submitted", "approved"]);

  // Average rating
  const { data: ratings } = await supabase
    .from("reviews")
    .select("rating")
    .not("rating", "is", null);
  const avgRating = ratings && ratings.length > 0
    ? (ratings.reduce((sum, r) => sum + (r.rating || 0), 0) / ratings.length).toFixed(1)
    : "N/A";

  // Transactions last 24h
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { data: recentTx } = await supabase
    .from("peer_point_transactions")
    .select("amount")
    .gte("created_at", oneDayAgo);
  const netFlow24h = (recentTx || []).reduce((sum, t) => sum + t.amount, 0);

  // Transactions last 7d
  const { data: weekTx } = await supabase
    .from("peer_point_transactions")
    .select("amount")
    .gte("created_at", sevenDaysAgo);
  const netFlow7d = (weekTx || []).reduce((sum, t) => sum + t.amount, 0);

  // Total referrals
  const { count: totalReferrals } = await supabase
    .from("referrals")
    .select("id", { count: "exact", head: true });

  // Health indicator
  const completionRate = totalReviews && totalReviews > 0
    ? ((completedReviews || 0) / totalReviews * 100)
    : 0;
  const healthStatus = completionRate >= 70 ? "Green" : completionRate >= 40 ? "Yellow" : "Red";
  const healthColor = healthStatus === "Green"
    ? "text-green-600 dark:text-green-400"
    : healthStatus === "Yellow"
    ? "text-yellow-600 dark:text-yellow-400"
    : "text-red-600 dark:text-red-400";

  const metrics = [
    { label: "Total Users", value: totalUsers ?? 0 },
    { label: "New Signups (7d)", value: newSignups ?? 0 },
    { label: "Points in Circulation", value: totalPoints },
    { label: "Net Flow (24h)", value: netFlow24h >= 0 ? `+${netFlow24h}` : netFlow24h },
    { label: "Net Flow (7d)", value: netFlow7d >= 0 ? `+${netFlow7d}` : netFlow7d },
    { label: "Queue Depth", value: queueDepth ?? 0 },
    { label: "Total Reviews", value: totalReviews ?? 0 },
    { label: "Completed Reviews", value: completedReviews ?? 0 },
    { label: "Avg Rating", value: avgRating },
    { label: "Total Referrals", value: totalReferrals ?? 0 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-semibold">Platform Health</h2>
        <span className={`font-bold text-sm px-3 py-1 rounded-full ${
          healthStatus === "Green" ? "bg-green-100 dark:bg-green-900" :
          healthStatus === "Yellow" ? "bg-yellow-100 dark:bg-yellow-900" :
          "bg-red-100 dark:bg-red-900"
        } ${healthColor}`}>
          {healthStatus} — {completionRate.toFixed(0)}% completion rate
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {metrics.map((m) => (
          <Card key={m.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                {m.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{m.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
