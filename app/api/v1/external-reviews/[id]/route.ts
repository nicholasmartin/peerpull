import { createApiClient, apiSuccess, apiError, optionsResponse } from "@/utils/supabase/api-client";
import { UpdateExternalReviewSchema } from "@/types/api";

export async function OPTIONS() {
  return optionsResponse();
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { supabase, user, errorResponse } = await createApiClient(request);
  if (errorResponse) return errorResponse;

  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiError("INVALID_JSON", "Request body must be valid JSON", 400);
  }

  const parsed = UpdateExternalReviewSchema.safeParse(body);
  if (!parsed.success) {
    return apiError("VALIDATION_ERROR", parsed.error.issues[0].message, 400);
  }

  // RLS ensures only the owner can update
  const { data, error } = await supabase
    .from("external_reviews")
    .update(parsed.data)
    .eq("id", id)
    .eq("reviewer_id", user.id)
    .select("id, updated_at")
    .single();

  if (error || !data) {
    return apiError("NOT_FOUND", "External review not found or not owned by you", 404);
  }

  return apiSuccess({ id: data.id, updated_at: data.updated_at });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { supabase, user, errorResponse } = await createApiClient(request);
  if (errorResponse) return errorResponse;

  const { id } = await params;

  // Soft delete: set status to 'deleted'
  const { data, error } = await supabase
    .from("external_reviews")
    .update({ status: "deleted" })
    .eq("id", id)
    .eq("reviewer_id", user.id)
    .select("id")
    .single();

  if (error || !data) {
    return apiError("NOT_FOUND", "External review not found or not owned by you", 404);
  }

  return apiSuccess({ id: data.id, deleted: true });
}
