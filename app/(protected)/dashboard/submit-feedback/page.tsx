import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle, Lock } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { getSettings } from "@/utils/supabase/settings";
import { getUserProfile } from "@/utils/supabase/profiles";
import { GetNextReviewButton } from "./get-next-review-button";

export default async function ReviewQueuePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/signin");

  const profile = await getUserProfile(user);
  const settings = await getSettings();
  const isActive = profile?.status === 'active' || settings.platform_launched;

  if (!isActive) {
    return (
      <div className="mx-auto max-w-md mt-16 text-center">
        <div className="rounded-xl border border-dark-border bg-dark-card p-8">
          <Lock className="h-12 w-12 text-dark-text-muted mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-dark-text mb-3">Coming Soon</h2>
          <p className="text-dark-text-muted mb-6">
            The feedback queue will be available when the platform launches. While you wait, complete your profile and invite other founders!
          </p>
          <Link href="/dashboard">
            <Button className="bg-primary hover:bg-primary-muted">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  // My in-progress reviews
  const { data: myReviews } = await supabase
    .from("reviews")
    .select("*, feedback_requests(*)")
    .eq("reviewer_id", user.id)
    .in("status", ["in_progress"])
    .order("created_at", { ascending: false });

  // My completed reviews
  const { data: completedReviews } = await supabase
    .from("reviews")
    .select("*, feedback_requests(*)")
    .eq("reviewer_id", user.id)
    .in("status", ["submitted", "approved", "rejected"])
    .order("submitted_at", { ascending: false });

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Give Feedback</h1>

      <Tabs defaultValue="get-review" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="get-review">Get Next Project</TabsTrigger>
          <TabsTrigger value="assigned">My In-Progress ({myReviews?.length || 0})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedReviews?.length || 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="get-review" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">How Giving Feedback Works</CardTitle>
              <CardDescription>Follow these steps to give feedback and earn PeerPoints</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ol className="space-y-3">
                {[
                  { title: "Click \"Get Next Project\"", desc: "You'll be assigned the next project in the queue" },
                  { title: "Read the briefing", desc: "Read the project details, focus areas, and questions to address" },
                  { title: "Open the project", desc: "Click \"Open Site in New Tab\" to load their project" },
                  { title: "Allow screen recording", desc: "When prompted, select the browser tab with the project (not your whole screen)" },
                  { title: "Allow microphone (optional)", desc: "Narrate your thoughts as you explore for richer feedback" },
                  { title: "Record your feedback", desc: "Navigate the project while sharing your honest feedback aloud (1\u20135 minutes)" },
                  { title: "Stop recording & submit", desc: "Rate the project, add written notes, and submit" },
                ].map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary-subtle text-xs font-bold text-primary">
                      {i + 1}
                    </span>
                    <div>
                      <span className="text-sm font-medium text-dark-text">{step.title}</span>
                      <span className="text-sm text-dark-text-muted"> &mdash; {step.desc}</span>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-dark-border">
                <div className="flex-1 rounded-md bg-dark-surface px-3 py-2 text-sm text-dark-text-muted">
                  <strong>Earn:</strong> 1 PeerPoint per feedback given (+2 bonus on your first!)
                </div>
                <div className="flex-1 rounded-md bg-dark-surface px-3 py-2 text-sm text-dark-text-muted">
                  <strong>Tip:</strong> Think out loud &mdash; founders get the most value from hearing your raw reactions
                </div>
              </div>
            </CardContent>
          </Card>

          {myReviews && myReviews.length > 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center space-y-4 rounded-lg border border-yellow-500/30 bg-yellow-500/10">
              <AlertCircle className="h-8 w-8 text-yellow-400" />
              <p className="text-sm text-yellow-200">
                You already have a review in progress. Complete or abandon it before starting a new one.
              </p>
              <Link
                href={`/dashboard/submit-feedback/${myReviews[0].feedback_request_id}/review`}
                className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-muted"
              >
                Continue Review
              </Link>
            </div>
          ) : (
            <GetNextReviewButton />
          )}
        </TabsContent>

        <TabsContent value="assigned" className="space-y-6">
          {myReviews && myReviews.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {myReviews.map((review: any) => (
                <Card key={review.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">
                      <Link href={`/dashboard/submit-feedback/${review.feedback_request_id}/review`} className="hover:text-primary hover:underline">
                        {review.feedback_requests?.title}
                      </Link>
                    </CardTitle>
                    <CardDescription>
                      Claimed {new Date(review.created_at).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link
                      href={`/dashboard/submit-feedback/${review.feedback_request_id}/review`}
                      className="inline-flex items-center justify-center w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-muted"
                    >
                      Continue
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CheckCircle2 className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-dark-text">No assigned projects</h3>
              <p className="mt-2 text-sm text-dark-text-muted">
                Click &quot;Get Next Project&quot; to get assigned the next project in the queue.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-6">
          {completedReviews && completedReviews.length > 0 ? (
            <div className="rounded-md border border-dark-border bg-dark-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-dark-border">
                      <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider font-medium text-dark-text-muted">Project</th>
                      <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider font-medium text-dark-text-muted">Status</th>
                      <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider font-medium text-dark-text-muted">Submitted</th>
                      <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider font-medium text-dark-text-muted">Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {completedReviews.map((review: any) => (
                      <tr key={review.id} className="border-b border-dark-border/50">
                        <td className="px-4 py-4 font-medium">{review.feedback_requests?.title}</td>
                        <td className="px-4 py-4">
                          <Badge variant="outline" className={
                            review.status === "approved"
                              ? "bg-dark-surface text-green-400"
                              : review.status === "rejected"
                              ? "bg-dark-surface text-red-400"
                              : "bg-dark-surface text-yellow-400"
                          }>
                            {review.status === "approved" ? "Approved" : review.status === "rejected" ? "Rejected" : "Submitted"}
                          </Badge>
                        </td>
                        <td className="px-4 py-4 text-dark-text-muted">
                          {review.submitted_at ? new Date(review.submitted_at).toLocaleDateString() : "-"}
                        </td>
                        <td className="px-4 py-4">
                          <span className={review.status === "approved" ? "font-medium text-green-400" : "text-gray-400"}>
                            {review.status === "approved" ? "+1" : "0"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-dark-text">No completed feedback</h3>
              <p className="mt-2 text-sm text-dark-text-muted">
                Give your first feedback to see it here.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
