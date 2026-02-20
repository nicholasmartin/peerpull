import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getUserProfile } from "@/utils/supabase/profiles";

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

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-lg bg-gradient-to-r from-[#3366FF] to-[#2EC4B6] p-6 text-white shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {firstName}!</h1>
            <p className="mt-1">
              You have <strong>{balance} PeerPoints</strong> available
              {availableCount ? ` and ${availableCount} projects waiting for review.` : "."}
            </p>
          </div>
          <div className="hidden md:block">
            <Link href="/dashboard/request-feedback" className="rounded-lg bg-white px-4 py-2 font-medium text-[#3366FF] hover:bg-opacity-90 transition">
              Submit New PullRequest
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Link href="/dashboard/request-feedback" className="rounded-lg bg-white p-4 text-center shadow-sm hover:shadow-md transition dark:bg-gray-800">
          <span className="block text-lg font-semibold text-[#3366FF]">Submit PullRequest</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">Get feedback on your project</span>
        </Link>
        <Link href="/dashboard/submit-feedback" className="rounded-lg bg-white p-4 text-center shadow-sm hover:shadow-md transition dark:bg-gray-800">
          <span className="block text-lg font-semibold text-[#FF6633]">Start Reviewing</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">Earn PeerPoints</span>
        </Link>
        <Link href="/dashboard/request-feedback" className="rounded-lg bg-white p-4 text-center shadow-sm hover:shadow-md transition dark:bg-gray-800">
          <span className="block text-lg font-semibold text-[#2EC4B6]">View Feedback</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">See your latest reviews</span>
        </Link>
        <Link href="/dashboard/peerpoints" className="rounded-lg bg-white p-4 text-center shadow-sm hover:shadow-md transition dark:bg-gray-800">
          <span className="block text-lg font-semibold text-gray-700 dark:text-gray-300">PeerPoints</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">View balance & history</span>
        </Link>
      </div>

      {/* Stats + Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800 text-center">
              <div className="text-3xl font-bold text-[#3366FF]">{balance}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">PeerPoints</div>
            </div>
            <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800 text-center">
              <div className="text-3xl font-bold text-[#2EC4B6]">{prCount || 0}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">PullRequests</div>
            </div>
            <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800 text-center">
              <div className="text-3xl font-bold text-[#FF6633]">{reviewCount || 0}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Reviews Given</div>
            </div>
          </div>

          {/* My PullRequests */}
          <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Feedback Requests</h2>
              <Link href="/dashboard/request-feedback" className="text-sm font-medium text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                View all →
              </Link>
            </div>
            {recentPRs && recentPRs.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="pb-3 text-left font-medium text-gray-500 dark:text-gray-400">Project</th>
                      <th className="pb-3 text-left font-medium text-gray-500 dark:text-gray-400">Status</th>
                      <th className="pb-3 text-left font-medium text-gray-500 dark:text-gray-400">Submitted</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentPRs.map((pr: any) => (
                      <tr key={pr.id} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-3">
                          <Link href={`/dashboard/request-feedback/${pr.id}`} className="font-medium text-blue-600 dark:text-blue-400 hover:underline">
                            {pr.title}
                          </Link>
                        </td>
                        <td className="py-3">
                          <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                            pr.status === "open" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" :
                            pr.status === "completed" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" :
                            "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                          }`}>
                            {pr.status}
                          </span>
                        </td>
                        <td className="py-3 text-gray-500 dark:text-gray-400">
                          {new Date(pr.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                No PullRequests yet. Submit one to get video feedback!
              </p>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* PeerPoints Balance Widget */}
          <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
            <h2 className="mb-4 text-xl font-bold">PeerPoints Balance</h2>
            <div className="flex items-center justify-center">
              <div className="relative h-32 w-32">
                <svg className="h-full w-full" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="18" cy="18" r="16" fill="none" className="stroke-gray-200 dark:stroke-gray-700" strokeWidth="2" />
                  <circle cx="18" cy="18" r="16" fill="none" className="stroke-[#3366FF]" strokeWidth="2" strokeDasharray="100" strokeDashoffset={Math.max(0, 100 - balance * 10)} transform="rotate(-90 18 18)" />
                  <text x="18" y="18" textAnchor="middle" dominantBaseline="middle" className="fill-[#3366FF] text-3xl font-bold">
                    {balance}
                  </text>
                </svg>
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                {balance >= 2 ? "Ready to submit a PullRequest!" : `Need ${2 - balance} more to submit`}
              </p>
              <Link href="/dashboard/submit-feedback" className="mt-3 inline-block rounded-lg bg-[#3366FF] px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 transition">
                {balance >= 2 ? "Submit PullRequest" : "Earn Points by Reviewing"}
              </Link>
            </div>
          </div>

          {/* Available Reviews */}
          <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
            <h2 className="mb-4 text-xl font-bold">Available Reviews</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {availableCount
                ? `${availableCount} project${availableCount === 1 ? "" : "s"} waiting for your feedback`
                : "No projects available for review right now"}
            </p>
            <Link href="/dashboard/submit-feedback" className="mt-4 block w-full rounded-lg border border-gray-200 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 transition">
              Browse Review Queue
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
