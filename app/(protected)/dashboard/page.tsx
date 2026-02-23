import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getUserProfile } from "@/utils/supabase/profiles";
import { GettingStartedChecklist } from "@/components/protected/dashboard/GettingStartedChecklist";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/signin");

  const profile = await getUserProfile(user);
  const firstName = profile?.full_name?.split(' ')[0] || 'there';
  const balance = profile?.peer_points_balance || 0;

  // Real counts
  const { count: prCount } = await supabase
    .from("pull_requests")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  const { count: reviewCount } = await supabase
    .from("reviews")
    .select("*", { count: "exact", head: true })
    .eq("reviewer_id", user.id);

  // Received reviews count (reviews on user's own PRs)
  const { count: receivedReviewCount } = await supabase
    .from("reviews")
    .select("*, pull_requests!inner(user_id)", { count: "exact", head: true })
    .eq("pull_requests.user_id", user.id)
    .in("status", ["submitted", "approved"]);

  // Available PRs to review
  const { count: availableCount } = await supabase
    .from("pull_requests")
    .select("*", { count: "exact", head: true })
    .eq("status", "open")
    .neq("user_id", user.id);

  // My recent PRs
  const { data: recentPRs } = await supabase
    .from("pull_requests")
    .select("id, title, status, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(3);

  const hasSubmittedProject = (prCount || 0) > 0;
  const hasReviewedProject = (reviewCount || 0) > 0;
  const hasReceivedReview = (receivedReviewCount || 0) > 0;
  const isNewUser = !hasSubmittedProject || !hasReviewedProject || !hasReceivedReview;

  const statusDot = (status: string) => {
    const color = status === "open" ? "bg-yellow-500" : status === "completed" ? "bg-green-500" : "bg-primary";
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-dark-text-muted">
        <span className={`inline-block h-1.5 w-1.5 rounded-full ${color}`} />
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner or Getting Started Checklist */}
      {isNewUser ? (
        <GettingStartedChecklist
          hasSubmittedProject={hasSubmittedProject}
          hasReviewedProject={hasReviewedProject}
          hasReceivedReview={hasReceivedReview}
        />
      ) : (
        <div className="rounded-md border border-dark-border bg-dark-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-dark-text">Welcome back, {firstName}!</h1>
              <p className="mt-1 text-sm text-dark-text-muted">
                You have <strong className="text-dark-text">{balance} PeerPoints</strong> available
                {availableCount ? ` and ${availableCount} projects waiting for review.` : "."}
              </p>
            </div>
            <div className="hidden md:block">
              <Link href="/dashboard/request-feedback" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-muted transition">
                Submit New PullRequest
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Link href="/dashboard/request-feedback" className="rounded-md border border-dark-border bg-dark-card p-4 text-center hover:border-dark-text-muted/30 transition">
          <span className="block text-sm font-semibold text-dark-text">Submit PullRequest</span>
          <span className="text-xs text-dark-text-muted">Get feedback on your project</span>
        </Link>
        <Link href="/dashboard/submit-feedback" className="rounded-md border border-dark-border bg-dark-card p-4 text-center hover:border-dark-text-muted/30 transition">
          <span className="block text-sm font-semibold text-dark-text">Start Reviewing</span>
          <span className="text-xs text-dark-text-muted">Earn PeerPoints</span>
        </Link>
        <Link href="/dashboard/request-feedback" className="rounded-md border border-dark-border bg-dark-card p-4 text-center hover:border-dark-text-muted/30 transition">
          <span className="block text-sm font-semibold text-dark-text">View Feedback</span>
          <span className="text-xs text-dark-text-muted">See your latest reviews</span>
        </Link>
        <Link href="/dashboard/peerpoints" className="rounded-md border border-dark-border bg-dark-card p-4 text-center hover:border-dark-text-muted/30 transition">
          <span className="block text-sm font-semibold text-dark-text">PeerPoints</span>
          <span className="text-xs text-dark-text-muted">View balance & history</span>
        </Link>
      </div>

      {/* Stats + Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-md border border-dark-border bg-dark-card p-4 text-center">
              <div className="text-2xl font-semibold tabular-nums text-dark-text">{balance}</div>
              <div className="text-xs text-dark-text-muted">PeerPoints</div>
            </div>
            <div className="rounded-md border border-dark-border bg-dark-card p-4 text-center">
              <div className="text-2xl font-semibold tabular-nums text-dark-text">{prCount || 0}</div>
              <div className="text-xs text-dark-text-muted">PullRequests</div>
            </div>
            <div className="rounded-md border border-dark-border bg-dark-card p-4 text-center">
              <div className="text-2xl font-semibold tabular-nums text-dark-text">{reviewCount || 0}</div>
              <div className="text-xs text-dark-text-muted">Reviews Given</div>
            </div>
          </div>

          {/* My PullRequests */}
          <div className="rounded-md border border-dark-border bg-dark-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-dark-text-muted uppercase tracking-wider">Feedback Requests</h2>
              <Link href="/dashboard/request-feedback" className="text-sm font-medium text-primary hover:text-primary/80">
                View all →
              </Link>
            </div>
            {recentPRs && recentPRs.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-dark-border">
                      <th className="pb-3 text-left text-[11px] uppercase tracking-wider font-medium text-dark-text-muted">Project</th>
                      <th className="pb-3 text-left text-[11px] uppercase tracking-wider font-medium text-dark-text-muted">Status</th>
                      <th className="pb-3 text-left text-[11px] uppercase tracking-wider font-medium text-dark-text-muted">Submitted</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentPRs.map((pr: any) => (
                      <tr key={pr.id} className="border-b border-dark-border/50">
                        <td className="py-3">
                          <Link href={`/dashboard/request-feedback/${pr.id}`} className="text-sm font-medium text-primary hover:text-primary/80">
                            {pr.title}
                          </Link>
                        </td>
                        <td className="py-3">
                          {statusDot(pr.status)}
                        </td>
                        <td className="py-3 text-sm text-dark-text-muted">
                          {new Date(pr.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-dark-text-muted text-sm">
                No PullRequests yet. Submit one to get video feedback!
              </p>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* PeerPoints Balance Widget */}
          <div className="rounded-md border border-dark-border bg-dark-card p-6">
            <h2 className="text-sm font-medium text-dark-text-muted uppercase tracking-wider mb-4">PeerPoints Balance</h2>
            <div className="flex items-center justify-center py-4">
              <div className="text-center">
                <div className="text-4xl font-semibold tabular-nums text-dark-text">{balance}</div>
                <div className="text-xs text-dark-text-muted mt-1">points</div>
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-dark-text-muted">
                {balance >= 2 ? "Ready to submit a PullRequest!" : `Need ${2 - balance} more to submit`}
              </p>
              <Link href="/dashboard/submit-feedback" className="mt-3 inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-muted transition">
                {balance >= 2 ? "Submit PullRequest" : "Earn Points by Reviewing"}
              </Link>
            </div>
          </div>

          {/* Available Reviews */}
          <div className="rounded-md border border-dark-border bg-dark-card p-6">
            <h2 className="text-sm font-medium text-dark-text-muted uppercase tracking-wider mb-4">Available Reviews</h2>
            <p className="text-dark-text-muted text-sm">
              {availableCount
                ? `${availableCount} project${availableCount === 1 ? "" : "s"} waiting for your feedback`
                : "No projects available for review right now"}
            </p>
            <Link href="/dashboard/submit-feedback" className="mt-4 block w-full rounded-md border border-dark-border py-2 text-center text-sm font-medium text-dark-text hover:bg-dark-surface transition">
              Browse Review Queue
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
