import React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, ArrowDownRight, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { QualityScoreBadge } from "@/components/protected/dashboard/QualityScoreBadge";
import { createClient } from "@/utils/supabase/server";

const typeLabels: Record<string, string> = {
  earned_review: "Feedback submitted",
  spent_submission: "Feedback Request submitted",
  signup_bonus: "Welcome bonus",
  first_review_bonus: "First feedback bonus",
  referral_bonus: "Referral bonus",
  admin_injection: "Bonus points",
};

function statusColor(status: string) {
  switch (status) {
    case "active":
      return "text-green-400 bg-green-500/10";
    case "waitlisted":
      return "text-yellow-400 bg-yellow-500/10";
    default:
      return "text-blue-400 bg-blue-500/10";
  }
}

function feedbackStatusColor(status: string) {
  switch (status) {
    case "open":
    case "live":
      return "text-green-400";
    case "claimed":
      return "text-yellow-400";
    case "closed":
      return "text-gray-400";
    case "draft":
      return "text-blue-400";
    default:
      return "text-dark-text-muted";
  }
}

function reviewStatusColor(status: string) {
  switch (status) {
    case "approved":
      return "text-green-400";
    case "submitted":
      return "text-yellow-400";
    case "rejected":
      return "text-red-400";
    default:
      return "text-dark-text-muted";
  }
}

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: userId } = await params;
  const supabase = await createClient();

  // Fetch all data in parallel
  const [
    { data: profile },
    { data: feedbackRequests },
    { data: reviewsGiven },
    { data: transactions },
    { data: referralsGiven },
  ] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", userId).single(),
    supabase
      .from("feedback_requests")
      .select("id, title, status, queue_position, created_at, url")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20),
    supabase
      .from("reviews")
      .select(
        "id, rating, video_duration, status, created_at, submitted_at, feedback_request_id, feedback_requests(title)"
      )
      .eq("reviewer_id", userId)
      .order("created_at", { ascending: false })
      .limit(20),
    supabase
      .from("peer_point_transactions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false }),
    supabase
      .from("referrals")
      .select(
        "id, invitee_id, bonus_awarded, status, created_at, profiles!referrals_invitee_id_profiles_fkey(first_name, last_name)"
      )
      .eq("inviter_id", userId)
      .order("created_at", { ascending: false }),
  ]);

  if (!profile) {
    return (
      <div className="space-y-4">
        <Link
          href="/dashboard/admin/users"
          className="inline-flex items-center gap-1.5 text-sm text-dark-text-muted hover:text-dark-text transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Users
        </Link>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-dark-text-muted">User not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Reviews received: get reviews on this user's feedback requests
  const requestIds = feedbackRequests?.map((r: any) => r.id) ?? [];
  const { data: reviewsReceived } =
    requestIds.length > 0
      ? await supabase
          .from("reviews")
          .select(
            "id, builder_rating, builder_flags, builder_feedback, status, created_at, reviewer_id, feedback_request_id, feedback_requests(title)"
          )
          .in("feedback_request_id", requestIds)
          .order("created_at", { ascending: false })
          .limit(20)
      : { data: [] as any[] };

  // Fetch reviewer names for received reviews
  const reviewerIds = [
    ...new Set(
      (reviewsReceived ?? []).map((r: any) => r.reviewer_id).filter(Boolean)
    ),
  ];
  const reviewerMap: Record<string, string> = {};
  if (reviewerIds.length > 0) {
    const { data: reviewerProfiles } = await supabase
      .from("profiles")
      .select("id, first_name, last_name")
      .in("id", reviewerIds);
    for (const rp of reviewerProfiles ?? []) {
      reviewerMap[rp.id] = `${rp.first_name ?? ""} ${rp.last_name ?? ""}`.trim() || "Unknown";
    }
  }

  // Invited by
  let invitedByName: string | null = null;
  let invitedById: string | null = null;
  if (profile.invited_by) {
    const { data: inviter } = await supabase
      .from("profiles")
      .select("id, first_name, last_name")
      .eq("id", profile.invited_by)
      .single();
    if (inviter) {
      invitedByName =
        `${inviter.first_name ?? ""} ${inviter.last_name ?? ""}`.trim() || "Unknown";
      invitedById = inviter.id;
    }
  }

  const displayName =
    `${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim() || "User";
  const initials = displayName.charAt(0).toUpperCase();
  const expertise = profile.expertise ?? [];
  const projectCount = feedbackRequests?.length ?? 0;
  const givenCount = reviewsGiven?.length ?? 0;
  const receivedCount = reviewsReceived?.length ?? 0;

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/dashboard/admin/users"
        className="inline-flex items-center gap-1.5 text-sm text-dark-text-muted hover:text-dark-text transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Users
      </Link>

      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-6">
            <Avatar className="h-20 w-20 shrink-0">
              <AvatarImage src={profile.avatar_url || ""} alt={displayName} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0 space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-lg font-semibold">{displayName}</h2>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusColor(profile.status)}`}
                >
                  {profile.status}
                </span>
                {profile.is_admin && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                    Admin
                  </span>
                )}
                <QualityScoreBadge score={profile.quality_score ?? null} />
              </div>

              {profile.website && (
                <a
                  href={
                    profile.website.startsWith("http")
                      ? profile.website
                      : `https://${profile.website}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  {profile.website}
                </a>
              )}

              <div className="flex flex-wrap gap-4 text-sm text-dark-text-muted">
                <span>
                  Joined {new Date(profile.created_at).toLocaleDateString()}
                </span>
                {profile.referral_code && (
                  <span>
                    Referral code:{" "}
                    <code className="text-xs bg-dark-surface px-1.5 py-0.5 rounded">
                      {profile.referral_code}
                    </code>
                  </span>
                )}
              </div>

              {/* Summary stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="flex flex-col items-center p-3 rounded-md border border-dark-border">
                  <span className="text-lg font-semibold">
                    {profile.peer_points_balance ?? 0}
                  </span>
                  <span className="text-xs text-dark-text-muted">Balance</span>
                </div>
                <div className="flex flex-col items-center p-3 rounded-md border border-dark-border">
                  <span className="text-lg font-semibold">{projectCount}</span>
                  <span className="text-xs text-dark-text-muted">Projects</span>
                </div>
                <div className="flex flex-col items-center p-3 rounded-md border border-dark-border">
                  <span className="text-lg font-semibold">{givenCount}</span>
                  <span className="text-xs text-dark-text-muted">
                    Reviews Given
                  </span>
                </div>
                <div className="flex flex-col items-center p-3 rounded-md border border-dark-border">
                  <span className="text-lg font-semibold">
                    {receivedCount}
                  </span>
                  <span className="text-xs text-dark-text-muted">
                    Reviews Received
                  </span>
                </div>
              </div>

              {expertise.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {expertise.map((skill: string, i: number) => (
                    <Badge
                      key={i}
                      className="bg-primary/20 text-primary border-primary/30"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Two-column detail sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Projects + Feedback Given */}
        <div className="space-y-6">
          {/* Projects */}
          <Card>
            <CardHeader>
              <CardTitle>Projects ({projectCount})</CardTitle>
            </CardHeader>
            <CardContent>
              {feedbackRequests && feedbackRequests.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-dark-border">
                        <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider font-medium text-dark-text-muted">
                          Title
                        </th>
                        <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider font-medium text-dark-text-muted">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider font-medium text-dark-text-muted">
                          Queue
                        </th>
                        <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider font-medium text-dark-text-muted">
                          Created
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {feedbackRequests.map((fr: any) => (
                        <tr
                          key={fr.id}
                          className="border-b border-dark-border/50"
                        >
                          <td className="px-4 py-3 font-medium text-dark-text text-sm max-w-[200px] truncate">
                            {fr.title}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`text-xs font-medium ${feedbackStatusColor(fr.status)}`}
                            >
                              {fr.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-dark-text-muted">
                            {fr.queue_position ?? "—"}
                          </td>
                          <td className="px-4 py-3 text-sm text-dark-text-muted">
                            {new Date(fr.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-dark-text-muted text-center py-6">
                  No projects yet
                </p>
              )}
            </CardContent>
          </Card>

          {/* Feedback Given */}
          <Card>
            <CardHeader>
              <CardTitle>Feedback Given ({givenCount})</CardTitle>
            </CardHeader>
            <CardContent>
              {reviewsGiven && reviewsGiven.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-dark-border">
                        <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider font-medium text-dark-text-muted">
                          Project
                        </th>
                        <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider font-medium text-dark-text-muted">
                          Rating
                        </th>
                        <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider font-medium text-dark-text-muted">
                          Duration
                        </th>
                        <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider font-medium text-dark-text-muted">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider font-medium text-dark-text-muted">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {reviewsGiven.map((r: any) => (
                        <tr
                          key={r.id}
                          className="border-b border-dark-border/50"
                        >
                          <td className="px-4 py-3 font-medium text-dark-text text-sm max-w-[160px] truncate">
                            {r.feedback_requests?.title ?? "—"}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {r.rating != null ? (
                              <span className="text-yellow-400">
                                {"★".repeat(r.rating)}
                                {"☆".repeat(5 - r.rating)}
                              </span>
                            ) : (
                              <span className="text-dark-text-muted">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm text-dark-text-muted">
                            {r.video_duration != null
                              ? `${Math.floor(r.video_duration / 60)}:${String(r.video_duration % 60).padStart(2, "0")}`
                              : "—"}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`text-xs font-medium ${reviewStatusColor(r.status)}`}
                            >
                              {r.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-dark-text-muted">
                            {r.submitted_at
                              ? new Date(r.submitted_at).toLocaleDateString()
                              : new Date(r.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-dark-text-muted text-center py-6">
                  No feedback given yet
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: Feedback Received + PeerPoints History */}
        <div className="space-y-6">
          {/* Feedback Received */}
          <Card>
            <CardHeader>
              <CardTitle>Feedback Received ({receivedCount})</CardTitle>
            </CardHeader>
            <CardContent>
              {reviewsReceived && reviewsReceived.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-dark-border">
                        <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider font-medium text-dark-text-muted">
                          Project
                        </th>
                        <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider font-medium text-dark-text-muted">
                          Reviewer
                        </th>
                        <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider font-medium text-dark-text-muted">
                          Rating
                        </th>
                        <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider font-medium text-dark-text-muted">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {reviewsReceived.map((r: any) => (
                        <tr
                          key={r.id}
                          className="border-b border-dark-border/50"
                        >
                          <td className="px-4 py-3 font-medium text-dark-text text-sm max-w-[140px] truncate">
                            {r.feedback_requests?.title ?? "—"}
                          </td>
                          <td className="px-4 py-3 text-sm text-dark-text-muted">
                            {reviewerMap[r.reviewer_id] ?? "Unknown"}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {r.builder_rating != null ? (
                              <span className="text-yellow-400">
                                {"★".repeat(r.builder_rating)}
                                {"☆".repeat(5 - r.builder_rating)}
                              </span>
                            ) : (
                              <span className="text-dark-text-muted">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm text-dark-text-muted">
                            {new Date(r.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-dark-text-muted text-center py-6">
                  No feedback received yet
                </p>
              )}
            </CardContent>
          </Card>

          {/* PeerPoints History */}
          <Card>
            <CardHeader>
              <CardTitle>
                PeerPoints History ({transactions?.length ?? 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {transactions && transactions.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-dark-border">
                        <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider font-medium text-dark-text-muted">
                          Transaction
                        </th>
                        <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider font-medium text-dark-text-muted">
                          Date
                        </th>
                        <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider font-medium text-dark-text-muted">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((t: any) => (
                        <tr
                          key={t.id}
                          className="border-b border-dark-border/50"
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <div
                                className={`flex h-7 w-7 items-center justify-center rounded-md mr-3 ${
                                  t.amount > 0
                                    ? "bg-green-500/10 text-green-400"
                                    : "bg-red-500/10 text-red-400"
                                }`}
                              >
                                {t.amount > 0 ? (
                                  <ArrowUpRight className="h-3.5 w-3.5" />
                                ) : (
                                  <ArrowDownRight className="h-3.5 w-3.5" />
                                )}
                              </div>
                              <span className="font-medium text-dark-text text-sm">
                                {t.type === "admin_injection" && t.reason
                                  ? t.reason
                                  : typeLabels[t.type as string] || t.type}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-dark-text-muted">
                            {new Date(t.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`font-medium text-sm ${t.amount > 0 ? "text-green-400" : "text-red-400"}`}
                            >
                              {t.amount > 0 ? "+" : ""}
                              {t.amount}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-dark-text-muted text-center py-6">
                  No transactions yet
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Referrals (full width) */}
      <Card>
        <CardHeader>
          <CardTitle>Referrals</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Invited by */}
          {invitedByName ? (
            <div className="text-sm">
              <span className="text-dark-text-muted">Invited by: </span>
              <Link
                href={`/dashboard/admin/users/${invitedById}`}
                className="text-primary hover:underline"
              >
                {invitedByName}
              </Link>
            </div>
          ) : (
            <p className="text-sm text-dark-text-muted">
              Not invited by anyone (direct signup)
            </p>
          )}

          {/* Users referred */}
          {referralsGiven && referralsGiven.length > 0 ? (
            <>
              <h3 className="text-sm font-medium text-dark-text-muted uppercase tracking-wider mt-4">
                Users Referred ({referralsGiven.length})
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-dark-border">
                      <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider font-medium text-dark-text-muted">
                        Name
                      </th>
                      <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider font-medium text-dark-text-muted">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider font-medium text-dark-text-muted">
                        Bonus
                      </th>
                      <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider font-medium text-dark-text-muted">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {referralsGiven.map((ref: any) => {
                      const inviteeName =
                        `${ref.profiles?.first_name ?? ""} ${ref.profiles?.last_name ?? ""}`.trim() ||
                        "Unknown";
                      return (
                        <tr
                          key={ref.id}
                          className="border-b border-dark-border/50"
                        >
                          <td className="px-4 py-3 font-medium text-sm">
                            <Link
                              href={`/dashboard/admin/users/${ref.invitee_id}`}
                              className="text-primary hover:underline"
                            >
                              {inviteeName}
                            </Link>
                          </td>
                          <td className="px-4 py-3 text-xs font-medium text-dark-text-muted">
                            {ref.status}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {ref.bonus_awarded != null ? (
                              <span className="text-green-400">
                                +{ref.bonus_awarded}
                              </span>
                            ) : (
                              <span className="text-dark-text-muted">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm text-dark-text-muted">
                            {new Date(ref.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <p className="text-sm text-dark-text-muted mt-2">
              No referrals yet
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
