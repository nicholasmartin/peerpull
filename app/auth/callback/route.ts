import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the SSR package. It exchanges an auth code for the user's session.
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;
  const redirectTo = requestUrl.searchParams.get("redirect_to")?.toString();
  const cookieStore = await cookies();

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);

    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // Redeem referral code (URL param > cookie fallback)
      const ref = requestUrl.searchParams.get("ref")?.trim().toLowerCase()
        || cookieStore.get("referral_code")?.value?.trim().toLowerCase();
      if (ref) {
        const { error: refError } = await supabase.rpc("redeem_referral", {
          p_code: ref,
          p_new_user_id: user.id,
        });
        if (refError) {
          console.error("OAuth referral redemption failed:", refError.message);
        } else {
          cookieStore.delete("referral_code");
        }
      }

      // Check if this is a new user in onboarding status
      if (!redirectTo) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("status")
          .eq("id", user.id)
          .single();

        if (profile?.status === 'onboarding') {
          return NextResponse.redirect(`${origin}/onboarding`);
        }
      }
    }
  }

  if (redirectTo) {
    return NextResponse.redirect(`${origin}${redirectTo}`);
  }

  // URL to redirect to after sign up process completes
  return NextResponse.redirect(`${origin}/dashboard`);
}
