import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { CelebrationConfetti } from "./celebration-confetti";

export default async function FeedbackSubmittedPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/signin");

  // Fetch the user's latest submitted review for context
  const { data: latestReview } = await supabase
    .from("reviews")
    .select("id, rating, feedback_requests(title)")
    .eq("reviewer_id", user.id)
    .eq("status", "submitted")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  const projectTitle = latestReview?.feedback_requests
    ? (latestReview.feedback_requests as { title: string }).title
    : null;

  // Fetch user's point balance
  const { data: profile } = await supabase
    .from("profiles")
    .select("peer_points_balance")
    .eq("id", user.id)
    .single();

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4">
      <CelebrationConfetti />

      <div className="relative z-10 mx-auto max-w-md text-center space-y-6">
        {/* Big checkmark */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-teal-accent/20 border-2 border-primary/30 animate-in zoom-in-50 duration-500">
          <svg
            className="h-10 w-10 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Heading */}
        <div className="space-y-2 animate-in fade-in slide-in-from-bottom-3 duration-500 delay-200">
          <h1 className="text-3xl font-bold text-dark-text">Feedback Submitted!</h1>
          {projectTitle && (
            <p className="text-dark-text-muted">
              Your review of <span className="font-medium text-dark-text">{projectTitle}</span> has been sent to the builder.
            </p>
          )}
        </div>

        {/* Points earned */}
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-1 animate-in fade-in slide-in-from-bottom-3 duration-500 delay-300">
          <p className="text-sm text-dark-text-muted">You earned</p>
          <p className="text-2xl font-bold text-primary">+1 PeerPoint</p>
          <p className="text-xs text-dark-text-muted">
            Balance: {profile?.peer_points_balance ?? 0} PeerPoints
          </p>
        </div>

        {/* Motivation */}
        <p className="text-sm text-dark-text-muted animate-in fade-in duration-500 delay-500">
          Every review you give helps a fellow builder improve their product. Your feedback makes a real difference.
        </p>

        {/* CTAs */}
        <div className="space-y-3 pt-2 animate-in fade-in slide-in-from-bottom-3 duration-500 delay-500">
          <Link
            href="/dashboard/feedback/submit"
            className="block w-full rounded-xl bg-gradient-to-r from-primary to-teal-accent px-6 py-3 text-center font-semibold text-dark-bg hover:brightness-110 transition-all shadow-md shadow-primary/20 active:scale-[0.98]"
          >
            Review Another Project
          </Link>
          <Link
            href="/dashboard"
            className="block w-full rounded-xl border border-dark-border bg-dark-card px-6 py-3 text-center text-sm font-medium text-dark-text-muted hover:bg-dark-surface transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
