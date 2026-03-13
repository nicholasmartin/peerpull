import { API_BASE_URL } from "./constants";
import { getAuthTokens } from "./storage";

interface ApiSuccessResponse<T> {
  data: T;
  meta: { timestamp: string };
}

interface ApiErrorResponse {
  error: { code: string; message: string };
}

type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

function isErrorResponse<T>(response: ApiResponse<T>): response is ApiErrorResponse {
  return "error" in response;
}

export class ApiError extends Error {
  constructor(public code: string, message: string, public status: number) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const tokens = await getAuthTokens();
  if (!tokens) {
    throw new ApiError("UNAUTHORIZED", "Not logged in", 401);
  }

  const url = `${API_BASE_URL}/api/v1${path}`;
  const headers: Record<string, string> = {
    Authorization: `Bearer ${tokens.accessToken}`,
    ...((options.headers as Record<string, string>) || {}),
  };

  if (options.body && typeof options.body === "string") {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(url, { ...options, headers });
  const json: ApiResponse<T> = await response.json();

  if (isErrorResponse(json)) {
    throw new ApiError(json.error.code, json.error.message, response.status);
  }

  return json.data;
}

// API methods
export const api = {
  verifyAuth: () =>
    request<{
      id: string;
      full_name: string;
      avatar_url: string | null;
      referral_code: string;
      peer_points_balance: number;
      quality_score: number | null;
      status: string;
      unread_notification_count: number;
    }>("/auth/verify"),

  getSettings: () =>
    request<{
      min_video_duration: number;
      max_video_duration: number;
      review_reward: number;
      platform_launched: boolean;
    }>("/settings"),

  getSignedUploadUrl: (filename: string, contentType: string) =>
    request<{ signed_url: string; path: string }>("/upload/signed-url", {
      method: "POST",
      body: JSON.stringify({ filename, content_type: contentType }),
    }),

  getNextReview: () =>
    request<{
      review_id: string;
      feedback_request: {
        id: string;
        title: string;
        url: string;
        description: string;
        questions: string[] | null;
        focus_areas: string[] | null;
      };
    } | null>("/queue/next"),

  submitReview: (payload: {
    review_id: string;
    video_url: string;
    duration: number;
    rating: number;
    strengths?: string | null;
    improvements?: string | null;
    signal_follow?: boolean;
    signal_engage?: boolean;
    signal_invest?: boolean;
  }) =>
    request<{ points_earned: number; new_balance: number }>("/queue/submit", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  createExternalReview: (payload: {
    video_url: string;
    video_duration: number;
    target_url: string;
    target_title?: string | null;
    target_favicon_url?: string | null;
    target_og_image_url?: string | null;
    target_og_description?: string | null;
  }) =>
    request<{
      id: string;
      slug: string;
      shareable_url: string;
      created_at: string;
    }>("/external-reviews", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};
