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
      <h1 className="text-2xl font-bold">PeerPoints</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Available Balance</CardTitle>
            <CardDescription>Your current PeerPoints</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Coins className="h-8 w-8 text-yellow-500 mr-3" />
              <div className="text-3xl font-bold">{balance}</div>
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
              <Award className="h-8 w-8 text-purple-500 mr-3" />
              <div className="text-3xl font-bold">{totalEarned}</div>
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
              <ArrowUpRight className="h-8 w-8 text-blue-500 mr-3" />
              <div className="text-3xl font-bold">{transactions?.length || 0}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Transaction History</h2>

        {transactions && transactions.length > 0 ? (
          <div className="rounded-lg bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                    <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Transaction</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Date</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t: any) => (
                    <tr key={t.id} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          <div className={`flex h-8 w-8 items-center justify-center rounded-full mr-3 ${
                            t.amount > 0
                              ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400"
                              : "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400"
                          }`}>
                            {t.amount > 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                          </div>
                          <div className="font-medium text-gray-900 dark:text-gray-100">
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
                      <td className="px-4 py-4 text-gray-600 dark:text-gray-300">
                        {new Date(t.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`font-medium ${t.amount > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
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
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <p>No transactions yet. Review projects to earn PeerPoints!</p>
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>How PeerPoints Work</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
          <p><strong className="text-gray-900 dark:text-gray-100">Earn points:</strong> Review other founders' projects to earn PeerPoints. You also get a bonus for your first review!</p>
          <p><strong className="text-gray-900 dark:text-gray-100">Spend points:</strong> Submit a PullRequest to get video feedback on your project.</p>
          <p><strong className="text-gray-900 dark:text-gray-100">Get started:</strong> New users start with bonus PeerPoints. Invite friends to earn even more!</p>
        </CardContent>
      </Card>
    </div>
  );
}
