import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { getSettings } from "@/utils/supabase/settings";
import { getUserProfile } from "@/utils/supabase/profiles";
import { FeedbackFlow } from "./feedback-flow";

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
    .select("id, feedback_request_id")
    .eq("reviewer_id", user.id)
    .in("status", ["in_progress"])
    .order("created_at", { ascending: false })
    .limit(1);

  const initialReview = myReviews && myReviews.length > 0
    ? { reviewId: myReviews[0].id, feedbackRequestId: myReviews[0].feedback_request_id }
    : undefined;

  return (
    <FeedbackFlow
      initialReview={initialReview}
      minDuration={settings.min_video_duration_seconds}
      maxDuration={settings.max_video_duration_seconds}
    />
  );
}
