import React from "react";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Coins, ArrowUpRight, ArrowDownRight, Award } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

export default async function PeerPointsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/signin");

  const { data: profile } = await supabase
    .from("profiles")
    .select("peer_points_balance")
    .eq("id", user.id)
    .single();

  const { data: transactions } = await supabase
    .from("peer_point_transactions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const balance = profile?.peer_points_balance || 0;
  const totalEarned = (transactions || [])
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">PeerPoints</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Available Balance</CardTitle>
            <CardDescription>Your current PeerPoints</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Coins className="h-8 w-8 text-dark-text-muted mr-3" />
              <div className="text-2xl font-semibold tabular-nums text-dark-text">{balance}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Lifetime Earned</CardTitle>
            <CardDescription>Total PeerPoints earned</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Award className="h-8 w-8 text-dark-text-muted mr-3" />
              <div className="text-2xl font-semibold tabular-nums text-dark-text">{totalEarned}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Transactions</CardTitle>
            <CardDescription>All-time activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <ArrowUpRight className="h-8 w-8 text-dark-text-muted mr-3" />
              <div className="text-2xl font-semibold tabular-nums text-dark-text">{transactions?.length || 0}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-sm font-medium text-dark-text-muted uppercase tracking-wider">Transaction History</h2>

        {transactions && transactions.length > 0 ? (
          <div className="rounded-md border border-dark-border bg-dark-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dark-border">
                    <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider font-medium text-dark-text-muted">Transaction</th>
                    <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider font-medium text-dark-text-muted">Date</th>
                    <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider font-medium text-dark-text-muted">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t: any) => (
                    <tr key={t.id} className="border-b border-dark-border/50">
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          <div className={`flex h-8 w-8 items-center justify-center rounded-md mr-3 ${
                            t.amount > 0
                              ? "bg-green-500/10 text-green-400"
                              : "bg-red-500/10 text-red-400"
                          }`}>
                            {t.amount > 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                          </div>
                          <div className="font-medium text-dark-text">
                            {{
                              earned_review: "Review approved",
                              spent_submission: "PullRequest submitted",
                              signup_bonus: "Welcome bonus",
                              first_review_bonus: "First review bonus",
                              referral_bonus: "Referral bonus",
                              admin_injection: "Bonus points",
                            }[t.type as string] || t.type}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-dark-text-muted">
                        {new Date(t.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`font-medium ${t.amount > 0 ? "text-green-400" : "text-red-400"}`}>
                          {t.amount > 0 ? "+" : ""}{t.amount} PeerPoints
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-dark-text-muted">
            <p>No transactions yet. Review projects to earn PeerPoints!</p>
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>How PeerPoints Work</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-dark-text-muted">
          <p><strong className="text-dark-text">Earn points:</strong> Review other founders' projects to earn PeerPoints. You also get a bonus for your first review!</p>
          <p><strong className="text-dark-text">Spend points:</strong> Submit a PullRequest to get video feedback on your project.</p>
          <p><strong className="text-dark-text">Get started:</strong> New users start with bonus PeerPoints. Invite friends to earn even more!</p>
        </CardContent>
      </Card>
    </div>
  );
}
