import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Lock } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { getSettings } from "@/utils/supabase/settings";
import { getUserProfile } from "@/utils/supabase/profiles";
import { GetNextReviewButton } from "./get-next-review-button";

export default async function FeedbackSubmitPage() {
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

  // Check for in-progress reviews
  const { data: myReviews } = await supabase
    .from("reviews")
    .select("*, feedback_requests(*)")
    .eq("reviewer_id", user.id)
    .in("status", ["in_progress"])
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Submit Feedback</h1>

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
              { title: "Allow microphone", desc: "Narrate your thoughts as you explore for richer feedback" },
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
            href={`/dashboard/feedback/${myReviews[0].feedback_request_id}/review`}
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-muted"
          >
            Continue Review
          </Link>
        </div>
      ) : (
        <GetNextReviewButton />
      )}
    </div>
  );
}
