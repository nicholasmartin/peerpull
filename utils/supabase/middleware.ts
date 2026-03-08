import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
  // This `try/catch` block is only here for the interactive tutorial.
  // Feel free to remove once you have Supabase connected.
  try {
    // Capture referral code from any page's ?ref= param
    const refParam = request.nextUrl.searchParams.get("ref")?.trim().toLowerCase();
    const attachReferralCookie = (res: NextResponse) => {
      if (refParam) {
        res.cookies.set("referral_code", refParam, {
          path: "/",
          maxAge: 60 * 60 * 24 * 90, // 90 days
          httpOnly: false,
          sameSite: "lax",
        });
      }
      return res;
    };

    // Create an unmodified response
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value),
            );
            response = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options),
            );
          },
        },
      },
    );

    // This will refresh session if expired - required for Server Components
    // https://supabase.com/docs/guides/auth/server-side/nextjs
    const user = await supabase.auth.getUser();

    // protected routes
    if ((request.nextUrl.pathname.startsWith("/dashboard") ||
         request.nextUrl.pathname.startsWith("/reset-password") ||
         request.nextUrl.pathname.startsWith("/onboarding")) &&
        user.error) {
      return attachReferralCookie(NextResponse.redirect(new URL("/signin", request.url)));
    }

    if (!user.error && (
      request.nextUrl.pathname === "/" ||
      request.nextUrl.pathname.startsWith("/signin") ||
      request.nextUrl.pathname.startsWith("/signup") ||
      request.nextUrl.pathname.startsWith("/forgot-password")
    )) {
      return attachReferralCookie(NextResponse.redirect(new URL("/dashboard", request.url)));
    }

    return attachReferralCookie(response);
  } catch (e) {
    // If you are here, a Supabase client could not be created!
    // This is likely because you have not set up environment variables.
    // Check out http://localhost:3000 for Next Steps.
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};
