import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getUserProfile } from "@/utils/supabase/profiles";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/signin");
  }

  // Fetch user profile
  const profile = await getUserProfile(user);
  const firstName = profile?.full_name?.split(' ')[0] || 'there';

  // Mock data for UI mockup
  const mockData = {
    peerPoints: 5,
    activePullRequests: 2,
    pendingReviews: 3,
    recentFeedback: [
      { id: 1, project: "Landing Page Feedback", date: "2 days ago", rating: 4.5 },
      { id: 2, project: "App Concept Review", date: "1 week ago", rating: 4.0 }
    ],
    communityHighlights: [
      { id: 1, name: "Sarah Chen", action: "gave an exceptional review", project: "TechMate" },
      { id: 2, name: "Alex Johnson", action: "joined the platform", date: "yesterday" }
    ],
    activitySummary: [
      { type: "review_received", project: "SaaS Dashboard", date: "2 days ago" },
      { type: "points_earned", amount: 2, date: "3 days ago" },
      { type: "review_given", project: "CryptoTracker", date: "5 days ago" }
    ],
    progressMetrics: {
      feedbackQuality: 4.2,
      responseTime: "1.5 days"
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-lg bg-gradient-to-r from-[#3366FF] to-[#2EC4B6] p-6 text-white shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {firstName}!</h1>
            <p className="mt-1">You have {mockData.peerPoints} PeerPoints available and {mockData.pendingReviews} pending reviews.</p>
          </div>
          <div className="hidden md:block">
            <button className="rounded-lg bg-white px-4 py-2 font-medium text-[#3366FF] hover:bg-opacity-90 transition">Submit New PullRequest</button>
          </div>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <button className="rounded-lg bg-white p-4 text-center shadow-sm hover:shadow-md transition dark:bg-gray-800">
          <span className="block text-lg font-semibold text-[#3366FF] dark:text-[#3366FF]">Submit PullRequest</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">Get feedback on your project</span>
        </button>
        <button className="rounded-lg bg-white p-4 text-center shadow-sm hover:shadow-md transition dark:bg-gray-800">
          <span className="block text-lg font-semibold text-[#FF6633] dark:text-[#FF6633]">Start Reviewing</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">Earn PeerPoints</span>
        </button>
        <button className="rounded-lg bg-white p-4 text-center shadow-sm hover:shadow-md transition dark:bg-gray-800">
          <span className="block text-lg font-semibold text-[#2EC4B6] dark:text-[#2EC4B6]">View Feedback</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">See your latest reviews</span>
        </button>
        <button className="rounded-lg bg-white p-4 text-center shadow-sm hover:shadow-md transition dark:bg-gray-800">
          <span className="block text-lg font-semibold text-gray-700 dark:text-gray-300">Invite Founders</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">Grow the community</span>
        </button>
      </div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Activity Summary Card */}
          <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
            <h2 className="mb-4 text-xl font-bold">Recent Activity</h2>
            <div className="space-y-4">
              {mockData.activitySummary.map((activity, index) => (
                <div key={index} className="flex items-center border-b border-gray-100 pb-3 dark:border-gray-700">
                  <div className="mr-4 rounded-full bg-blue-100 p-2 text-blue-500 dark:bg-blue-900 dark:text-blue-300">
                    {activity.type === "review_received" ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    ) : activity.type === "points_earned" ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">
                      {activity.type === "review_received" ? (
                        <>You received feedback on <span className="text-blue-500">{activity.project}</span></>
                      ) : activity.type === "points_earned" ? (
                        <>You earned <span className="text-green-500">{activity.amount} PeerPoints</span></>
                      ) : (
                        <>You reviewed <span className="text-blue-500">{activity.project}</span></>
                      )}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{activity.date}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-4 text-sm font-medium text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
              View all activity →
            </button>
          </div>

          {/* My Active PullRequests */}
          <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">My Active PullRequests</h2>
              <a href="/dashboard/pull-requests" className="text-sm font-medium text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                View all →
              </a>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="pb-3 text-left font-medium text-gray-500 dark:text-gray-400">Project</th>
                    <th className="pb-3 text-left font-medium text-gray-500 dark:text-gray-400">Status</th>
                    <th className="pb-3 text-left font-medium text-gray-500 dark:text-gray-400">Feedback</th>
                    <th className="pb-3 text-left font-medium text-gray-500 dark:text-gray-400">Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-3">
                      <span className="font-medium">SaaS Dashboard</span>
                    </td>
                    <td className="py-3">
                      <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Awaiting Reviews</span>
                    </td>
                    <td className="py-3">0/3</td>
                    <td className="py-3 text-gray-500 dark:text-gray-400">2 days ago</td>
                  </tr>
                  <tr>
                    <td className="py-3">
                      <span className="font-medium">Mobile App Concept</span>
                    </td>
                    <td className="py-3">
                      <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">Reviews In</span>
                    </td>
                    <td className="py-3">2/3</td>
                    <td className="py-3 text-gray-500 dark:text-gray-400">1 week ago</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Feedback */}
          <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Recent Feedback</h2>
              <a href="/dashboard/pull-requests" className="text-sm font-medium text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                View all →
              </a>
            </div>
            <div className="space-y-4">
              {mockData.recentFeedback.map((feedback) => (
                <div key={feedback.id} className="rounded-lg border border-gray-100 p-4 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{feedback.project}</h3>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          xmlns="http://www.w3.org/2000/svg"
                          className={`h-4 w-4 ${i < Math.floor(feedback.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">{feedback.rating}</span>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Received {feedback.date}</p>
                  <button className="mt-3 text-sm font-medium text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                    View full feedback →
                  </button>
                </div>
              ))}
            </div>
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
                  <circle cx="18" cy="18" r="16" fill="none" className="stroke-[#3366FF]" strokeWidth="2" strokeDasharray="100" strokeDashoffset="20" transform="rotate(-90 18 18)" />
                  <text x="18" y="18" textAnchor="middle" dominantBaseline="middle" className="fill-[#3366FF] text-3xl font-bold">
                    {mockData.peerPoints}
                  </text>
                </svg>
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-gray-500 dark:text-gray-400">Available for new PullRequests</p>
              <button className="mt-3 rounded-lg bg-[#3366FF] px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 transition">
                Earn More Points
              </button>
            </div>
          </div>

          {/* Pending Reviews */}
          <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
            <h2 className="mb-4 text-xl font-bold">Pending Reviews</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border border-gray-100 p-3 dark:border-gray-700">
                <div>
                  <h3 className="font-medium">E-commerce Landing Page</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">15 min review time</p>
                </div>
                <button className="rounded bg-[#FF6633] px-3 py-1 text-xs font-medium text-white hover:bg-orange-600 transition">
                  Review
                </button>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-gray-100 p-3 dark:border-gray-700">
                <div>
                  <h3 className="font-medium">SaaS Pricing Page</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">10 min review time</p>
                </div>
                <button className="rounded bg-[#FF6633] px-3 py-1 text-xs font-medium text-white hover:bg-orange-600 transition">
                  Review
                </button>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-gray-100 p-3 dark:border-gray-700">
                <div>
                  <h3 className="font-medium">AI Tool Concept</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">20 min review time</p>
                </div>
                <button className="rounded bg-[#FF6633] px-3 py-1 text-xs font-medium text-white hover:bg-orange-600 transition">
                  Review
                </button>
              </div>
            </div>
            <button className="mt-4 w-full rounded-lg border border-gray-200 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 transition">
              View All Reviews
            </button>
          </div>

          {/* Community Highlights */}
          <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
            <h2 className="mb-4 text-xl font-bold">Community Highlights</h2>
            <div className="space-y-4">
              {mockData.communityHighlights.map((highlight) => (
                <div key={highlight.id} className="border-b border-gray-100 pb-3 dark:border-gray-700">
                  <div className="flex items-center">
                    <div className="mr-3 h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                    <div>
                      <p>
                        <span className="font-medium">{highlight.name}</span> {highlight.action}{' '}
                        {highlight.project && <span className="text-blue-500">{highlight.project}</span>}
                      </p>
                      {highlight.date && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">{highlight.date}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-3 text-sm font-medium text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
              View community →
            </button>
          </div>

          {/* Progress Metrics */}
          <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
            <h2 className="mb-4 text-xl font-bold">Your Metrics</h2>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <p className="font-medium">Feedback Quality Score</p>
                  <p className="font-bold text-[#3366FF]">{mockData.progressMetrics.feedbackQuality}/5.0</p>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className="h-2 rounded-full bg-[#3366FF]"
                    style={{ width: `${(mockData.progressMetrics.feedbackQuality / 5) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <p className="font-medium">Average Response Time</p>
                  <p className="font-bold text-[#2EC4B6]">{mockData.progressMetrics.responseTime}</p>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                  <div className="h-2 w-3/4 rounded-full bg-[#2EC4B6]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
