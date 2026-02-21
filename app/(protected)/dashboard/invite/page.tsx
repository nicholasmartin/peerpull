"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Gift,
  Users,
  CheckCircle2,
  Copy,
  Check
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function InviteFoundersPage() {
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [referralBonus, setReferralBonus] = useState(5);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [copied, setCopied] = useState<"link" | "code" | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch profile for referral code
      const { data: profile } = await supabase
        .from("profiles")
        .select("referral_code")
        .eq("id", user.id)
        .single();

      if (profile?.referral_code) {
        setReferralCode(profile.referral_code);
      }

      // Fetch referral bonus setting
      const { data: setting } = await supabase
        .from("system_settings")
        .select("value")
        .eq("key", "referral_bonus_amount")
        .single();

      if (setting) {
        setReferralBonus(Number(setting.value));
      }

      // Fetch referrals
      const { data: refs } = await supabase
        .from("referrals")
        .select("*, invitee:profiles!referrals_invitee_id_profiles_fkey(first_name, last_name)")
        .eq("inviter_id", user.id)
        .order("created_at", { ascending: false });

      if (refs) {
        setReferrals(refs);
      }

      setLoading(false);
    }
    load();
  }, []);

  const referralLink = referralCode
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/signup?ref=${referralCode}`
    : "";

  const handleCopy = async (text: string, type: "link" | "code") => {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const totalBonus = referrals.reduce((sum, r) => sum + (r.bonus_awarded || 0), 0);

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Invite Founders</h1>
        <div className="text-gray-500 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Invite Founders</h1>

      <Card>
        <CardHeader>
          <CardTitle>Invite & Earn PeerPoints</CardTitle>
          <CardDescription>
            Invite other founders to join PeerPull and earn {referralBonus} PeerPoints for each successful referral
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
            <div className="flex-1 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
              <h3 className="font-medium mb-2">Your Referral Link</h3>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-sm bg-white dark:bg-gray-900 px-3 py-2 rounded border border-gray-200 dark:border-gray-600 truncate">
                  {referralLink || "Loading..."}
                </code>
                <button
                  onClick={() => referralLink && handleCopy(referralLink, "link")}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium bg-blue-500 text-white rounded hover:bg-blue-600 transition shrink-0"
                >
                  {copied === "link" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied === "link" ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>

            <div className="flex-1 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
              <h3 className="font-medium mb-2">Your Referral Code</h3>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-lg font-mono font-bold bg-white dark:bg-gray-900 px-3 py-2 rounded border border-gray-200 dark:border-gray-600 text-center tracking-widest">
                  {referralCode || "Loading..."}
                </code>
                <button
                  onClick={() => referralCode && handleCopy(referralCode, "code")}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium bg-blue-500 text-white rounded hover:bg-blue-600 transition shrink-0"
                >
                  {copied === "code" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied === "code" ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card className="bg-white dark:bg-gray-800">
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-medium">Invite Founders</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  Share your referral link with other founders
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800">
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-medium">They Join</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  They sign up using your referral link or code
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800">
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-400">
                  <Gift className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-medium">Earn Rewards</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  Get {referralBonus} PeerPoints for each successful referral
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Referral Stats</CardTitle>
          <CardDescription>
            Track your referral performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-gray-200 p-4 text-center dark:border-gray-700">
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{referrals.length}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Total Referrals</div>
            </div>
            <div className="rounded-lg border border-gray-200 p-4 text-center dark:border-gray-700">
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {referrals.filter(r => r.status === "signed_up").length}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Signed Up</div>
            </div>
            <div className="rounded-lg border border-gray-200 p-4 text-center dark:border-gray-700">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalBonus}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">PeerPoints Earned</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {referrals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Referral History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                    <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Invitee</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Status</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Bonus</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {referrals.map((r) => (
                    <tr key={r.id} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                        {r.invitee?.first_name} {r.invitee?.last_name}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
                          {r.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-blue-600 dark:text-blue-400 font-medium">
                        +{r.bonus_awarded}
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                        {new Date(r.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
