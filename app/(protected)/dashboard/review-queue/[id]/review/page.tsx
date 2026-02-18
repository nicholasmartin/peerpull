import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { ReviewSession } from "./review-session";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ReviewPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/signin");

  // Load PR data
  const { data: pr } = await supabase
    .from("pull_requests")
    .select("*")
    .eq("id", id)
    .single();

  if (!pr) return redirect("/dashboard/review-queue");

  // Get founder name
  const { data: founderProfile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", pr.user_id)
    .single();

  // Load reviewer's review for this PR
  const { data: review } = await supabase
    .from("reviews")
    .select("*")
    .eq("pull_request_id", id)
    .eq("reviewer_id", user.id)
    .single();

  if (!review || review.status !== "in_progress") {
    return redirect("/dashboard/review-queue");
  }

  return (
    <ReviewSession
      pullRequest={{
        id: pr.id,
        title: pr.title,
        url: pr.url || "",
        description: pr.description || "",
        stage: pr.stage || "",
        categories: pr.categories || [],
        focusAreas: pr.focus_areas || [],
        questions: pr.questions || [],
        founderName: founderProfile?.full_name || "Anonymous",
      }}
      reviewId={review.id}
    />
  );
}
