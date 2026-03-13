import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export function corsHeaders(): Record<string, string> {
  return CORS_HEADERS;
}

export function apiSuccess(data: unknown, status = 200) {
  return NextResponse.json(
    { data, meta: { timestamp: new Date().toISOString() } },
    { status, headers: corsHeaders() }
  );
}

export function apiError(code: string, message: string, status = 400) {
  return NextResponse.json(
    { error: { code, message } },
    { status, headers: corsHeaders() }
  );
}

export function optionsResponse() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

interface ApiClientResult {
  supabase: ReturnType<typeof createClient>;
  user: { id: string };
  errorResponse: NextResponse | null;
}

export async function createApiClient(
  request: Request
): Promise<ApiClientResult> {
  const authHeader = request.headers.get("Authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return {
      supabase: null as any,
      user: null as any,
      errorResponse: apiError("UNAUTHORIZED", "Missing or invalid Authorization header", 401),
    };
  }

  const token = authHeader.slice(7);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  );

  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return {
      supabase: null as any,
      user: null as any,
      errorResponse: apiError("UNAUTHORIZED", "Invalid or expired token", 401),
    };
  }

  return {
    supabase,
    user: { id: data.user.id },
    errorResponse: null,
  };
}

/**
 * Check if user is active (mirrors requireActiveUser from app/actions.ts).
 */
export async function requireActiveApiUser(
  supabase: ReturnType<typeof createClient>,
  userId: string
): Promise<{ error?: string }> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("status")
    .eq("id", userId)
    .single();

  if (!profile) return { error: "Profile not found" };

  const { data: launchSetting } = await supabase
    .from("system_settings")
    .select("value")
    .eq("key", "platform_launched")
    .single();

  const platformLaunched = launchSetting?.value === "true";

  if (profile.status !== "active" && !platformLaunched) {
    return { error: "Your account is not yet active. Please wait for platform launch." };
  }

  return {};
}
