import { createApiClient, apiSuccess, apiError, optionsResponse } from "@/utils/supabase/api-client";
import { SignedUrlSchema } from "@/types/api";

export async function OPTIONS() {
  return optionsResponse();
}

export async function POST(request: Request) {
  const { supabase, user, errorResponse } = await createApiClient(request);
  if (errorResponse) return errorResponse;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiError("INVALID_JSON", "Request body must be valid JSON", 400);
  }

  const parsed = SignedUrlSchema.safeParse(body);
  if (!parsed.success) {
    return apiError("VALIDATION_ERROR", parsed.error.errors[0].message, 400);
  }

  const { filename, content_type } = parsed.data;
  const path = `reviews/${user.id}/${Date.now()}-${filename}`;

  const { data, error } = await supabase.storage
    .from("review-videos")
    .createSignedUploadUrl(path);

  if (error) {
    console.error("API signedUrl error:", error);
    return apiError("UPLOAD_URL_FAILED", "Failed to generate upload URL", 500);
  }

  return apiSuccess({
    signed_url: data.signedUrl,
    token: data.token,
    path: data.path,
    content_type,
  });
}
