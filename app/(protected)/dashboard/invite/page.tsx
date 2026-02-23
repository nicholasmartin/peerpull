"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Gift,
  Users,
  CheckCircle2,
  Copy,
  Check,
  Pencil
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { changeReferralCode } from "@/app/actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function InviteFoundersPage() {
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [referralBonus, setReferralBonus] = useState(5);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [copied, setCopied] = useState<"link" | "code" | null>(null);
  const [loading, setLoading] = useState(true);

  // Edit referral code state
  const [isEditing, setIsEditing] = useState(false);
  const [newCode, setNewCode] = useState("");
  const [codeError, setCodeError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saving, setSaving] = useState(false);

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

  const isValidCode = (code: string) => /^[a-z0-9]{3,20}$/.test(code);

  const handleStartEdit = () => {
    setNewCode(referralCode || "");
    setCodeError(null);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setNewCode("");
    setCodeError(null);
  };

  const handleNewCodeChange = (value: string) => {
    const normalized = value.toLowerCase().replace(/[^a-z0-9]/g, "");
    setNewCode(normalized);
    if (normalized.length > 0 && !isValidCode(normalized)) {
      setCodeError("Code must be 3–20 lowercase letters or numbers");
    } else {
      setCodeError(null);
    }
  };

  const handleSaveClick = () => {
    if (!isValidCode(newCode)) {
      setCodeError("Code must be 3–20 lowercase letters or numbers");
      return;
    }
    if (newCode === referralCode) {
      handleCancelEdit();
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirmChange = async () => {
    setSaving(true);
    setShowConfirm(false);
    const result = await changeReferralCode(newCode);
    if ("error" in result) {
      setCodeError(result.error!);
      setSaving(false);
      return;
    }
    setReferralCode(newCode);
    setIsEditing(false);
    setNewCode("");
    setCodeError(null);
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-xl font-semibold">Invite Founders</h1>
        <div className="text-dark-text-muted">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Invite Founders</h1>

      <Card>
        <CardHeader>
          <CardTitle>Invite & Earn PeerPoints</CardTitle>
          <CardDescription>
            Invite other founders to join PeerPull and earn {referralBonus} PeerPoints for each successful referral
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
            <div className="flex-1 rounded-md border border-dark-border bg-dark-surface p-4">
              <h3 className="font-medium mb-2">Your Referral Link</h3>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-sm bg-dark-card px-3 py-2 rounded border border-dark-border truncate">
                  {referralLink || "Loading..."}
                </code>
                <button
                  onClick={() => referralLink && handleCopy(referralLink, "link")}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium bg-primary text-white rounded hover:bg-primary-muted transition shrink-0"
                >
                  {copied === "link" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied === "link" ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>

            <div className="flex-1 rounded-md border border-dark-border bg-dark-surface p-4">
              <h3 className="font-medium mb-2">Your Referral Code</h3>
              {isEditing ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newCode}
                      onChange={(e) => handleNewCodeChange(e.target.value)}
                      maxLength={20}
                      placeholder="Enter new code"
                      className="flex-1 text-lg font-mono font-bold bg-dark-card px-3 py-2 rounded border border-dark-border text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-primary"
                      autoFocus
                    />
                    <button
                      onClick={handleSaveClick}
                      disabled={!isValidCode(newCode) || saving}
                      className="px-3 py-2 text-sm font-medium bg-primary text-white rounded hover:bg-primary-muted transition shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      disabled={saving}
                      className="px-3 py-2 text-sm font-medium bg-dark-card text-dark-text-muted rounded border border-dark-border hover:bg-dark-surface transition shrink-0 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                  {codeError && (
                    <p className="text-sm text-red-400">{codeError}</p>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-lg font-mono font-bold bg-dark-card px-3 py-2 rounded border border-dark-border text-center tracking-widest">
                    {referralCode || "Loading..."}
                  </code>
                  <button
                    onClick={() => referralCode && handleCopy(referralCode, "code")}
                    className="flex items-center gap-1 px-3 py-2 text-sm font-medium bg-primary text-white rounded hover:bg-primary-muted transition shrink-0"
                  >
                    {copied === "code" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied === "code" ? "Copied!" : "Copy"}
                  </button>
                  <button
                    onClick={handleStartEdit}
                    className="p-2 text-dark-text-muted hover:text-dark-text rounded hover:bg-dark-card transition shrink-0"
                    title="Edit referral code"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card className="bg-dark-card">
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-subtle text-primary">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-medium">Invite Founders</h3>
                <p className="mt-2 text-sm text-dark-text-muted">
                  Share your referral link with other founders
                </p>
              </CardContent>
            </Card>

            <Card className="bg-dark-card">
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10 text-green-400">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-medium">They Join</h3>
                <p className="mt-2 text-sm text-dark-text-muted">
                  They sign up using your referral link or code
                </p>
              </CardContent>
            </Card>

            <Card className="bg-dark-card">
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500/10 text-yellow-400">
                  <Gift className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-medium">Earn Rewards</h3>
                <p className="mt-2 text-sm text-dark-text-muted">
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
            <div className="rounded-md border border-dark-border p-4 text-center">
              <div className="text-2xl font-semibold tabular-nums text-dark-text">{referrals.length}</div>
              <div className="text-sm text-dark-text-muted">Total Referrals</div>
            </div>
            <div className="rounded-md border border-dark-border p-4 text-center">
              <div className="text-2xl font-semibold tabular-nums text-dark-text">
                {referrals.filter(r => r.status === "signed_up").length}
              </div>
              <div className="text-sm text-dark-text-muted">Signed Up</div>
            </div>
            <div className="rounded-md border border-dark-border p-4 text-center">
              <div className="text-2xl font-semibold tabular-nums text-primary">{totalBonus}</div>
              <div className="text-sm text-dark-text-muted">PeerPoints Earned</div>
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
            <div className="rounded-md bg-dark-card overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dark-border">
                    <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider font-medium text-dark-text-muted">Invitee</th>
                    <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider font-medium text-dark-text-muted">Status</th>
                    <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider font-medium text-dark-text-muted">Bonus</th>
                    <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider font-medium text-dark-text-muted">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {referrals.map((r) => (
                    <tr key={r.id} className="border-b border-dark-border/50">
                      <td className="px-4 py-3 text-dark-text">
                        {r.invitee?.first_name} {r.invitee?.last_name}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                          {r.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-primary font-medium">
                        +{r.bonus_awarded}
                      </td>
                      <td className="px-4 py-3 text-dark-text-muted">
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

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change your referral code?</AlertDialogTitle>
            <AlertDialogDescription>
              Your code will change from &ldquo;<strong>{referralCode}</strong>&rdquo; to &ldquo;<strong>{newCode}</strong>&rdquo;. Any links or promotions you&apos;ve previously shared will continue to work — old codes remain valid.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmChange}>
              Change Code
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
