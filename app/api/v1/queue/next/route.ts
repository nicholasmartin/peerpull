import { createApiClient, requireActiveApiUser, apiSuccess, apiError, optionsResponse } from "@/utils/supabase/api-client";

export async function OPTIONS() {
  return optionsResponse();
}

export async function GET(request: Request) {
  const { supabase, user, errorResponse } = await createApiClient(request);
  if (errorResponse) return errorResponse;

  const activeCheck = await requireActiveApiUser(supabase, user.id);
  if (activeCheck.error) {
    return apiError("INACTIVE_USER", activeCheck.error, 403);
  }

  // Check for existing in-progress review first
  const { data: existingReview } = await supabase
    .from("reviews")
    .select("id, feedback_request_id")
    .eq("reviewer_id", user.id)
    .eq("status", "in_progress")
    .limit(1)
    .single();

  let reviewId: string;
  let feedbackRequestId: string;

  if (existingReview) {
    reviewId = existingReview.id;
    feedbackRequestId = existingReview.feedback_request_id;
  } else {
    const { data, error } = await supabase.rpc("get_next_review", {
      p_reviewer_id: user.id,
    });

    if (error) {
      console.error("API getNextReview error:", error);
      return apiError("QUEUE_ERROR", "Failed to get next project", 500);
    }

    if (!data || data.length === 0) {
      return apiSuccess(null);
    }

    reviewId = data[0].review_id;
    feedbackRequestId = data[0].pr_id;
  }

  // Fetch feedback request details
  const { data: feedbackRequest } = await supabase
    .from("feedback_requests")
    .select("id, title, url, description, questions, focus_areas")
    .eq("id", feedbackRequestId)
    .single();

  return apiSuccess({
    review_id: reviewId,
    feedback_request: feedbackRequest,
  });
}
