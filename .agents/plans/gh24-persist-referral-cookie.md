# Feature: Persist Referral Code Across All Public Pages (GH #24)

The following plan should be complete, but validate documentation and codebase patterns before implementing.

Pay special attention to naming of existing utils, types, and models. Import from the right files.

## Feature Description

When a visitor lands on any public page with `?ref=CODE` (homepage, terms, privacy, etc.), the referral code should be stored in a cookie so it persists through navigation. When the visitor eventually signs up (email or OAuth), the referral code is automatically applied from the cookie if not provided via URL params. The cookie is cleared after successful redemption.

## User Story

As a referrer
I want to share any PeerPull page URL with my referral code (e.g. `peerpull.com/?ref=nickmartin`)
So that the referral is credited even if my invitee browses around before signing up

## Problem Statement

Referral links currently only work when pointing directly to `/signup?ref=CODE`. If a referrer shares a homepage link like `peerpull.com/?ref=nickmartin`, the code is lost when the visitor clicks "Sign Up" because no mechanism persists the `ref` param across page navigations.

## Solution Statement

Use middleware to detect `?ref=` on any incoming request and store it in a cookie (90-day TTL). The signup page, `signUpAction`, `OAuthButtons`, and `auth/callback` route read the cookie as a fallback when no URL `ref` param is present. The cookie is cleared after successful referral redemption.

## Feature Metadata

**Feature Type**: Enhancement
**Estimated Complexity**: Low
**Primary Systems Affected**: Middleware, Signup page, OAuth flow, Auth callback
**Dependencies**: None (all infrastructure already exists)

---

## CONTEXT REFERENCES

### Relevant Codebase Files — YOU MUST READ THESE BEFORE IMPLEMENTING

- `utils/supabase/middleware.ts` (lines 1-70) — Current middleware logic. The cookie must be set on the `response` object returned by this function.
- `middleware.ts` (lines 1-20) — Entry point that calls `updateSession()`.
- `app/(auth-pages)/signup/page.tsx` (lines 11-15) — Currently reads `ref` from `searchParams` only. Must add cookie fallback.
- `components/auth/OAuthButtons.tsx` (lines 57-67) — Currently reads `ref` from `window.location.href` URL params only. Must add cookie fallback.
- `app/auth/callback/route.ts` (lines 20-30) — Currently reads `ref` from callback URL params only. Must add cookie fallback.
- `app/actions.ts` (lines 11-96) — `signUpAction` reads referral_code from form data. No changes needed here since the signup page will pre-fill the hidden input from the cookie.
- `app/(protected)/dashboard/invite/page.tsx` (line 87-89) — Generates referral links pointing to `/signup?ref=`. Consider updating to point to homepage instead (optional, nice-to-have).

### New Files to Create

None. All changes are modifications to existing files.

### Patterns to Follow

**Cookie setting in middleware** — The middleware already creates a `response` object via `NextResponse.next()` and sets cookies on it (lines 30-31 in `utils/supabase/middleware.ts`). Follow the same pattern:
```typescript
response.cookies.set("name", "value", { options });
```

**Reading cookies in Server Components** — Use `cookies()` from `next/headers`:
```typescript
import { cookies } from "next/headers";
const cookieStore = await cookies();
const value = cookieStore.get("name")?.value;
```

**Reading cookies in Route Handlers** — Use `request.cookies` or `cookies()` from `next/headers`.

**Reading cookies client-side** — Use `document.cookie` parsing or a simple helper since `httpOnly: false`.

---

## IMPLEMENTATION PLAN

### Phase 1: Middleware Cookie Capture

Set the `referral_code` cookie whenever a `?ref=` param is detected on any request.

### Phase 2: Consumer Updates

Update the four consumer points (signup page, OAuthButtons, auth callback, signUpAction) to read the cookie as a fallback.

### Phase 3: Cookie Cleanup

Clear the cookie after successful referral redemption in both email signup and OAuth flows.

---

## STEP-BY-STEP TASKS

### Task 1: UPDATE `utils/supabase/middleware.ts` — Capture `ref` param into cookie

- **IMPLEMENT**: After `let response = NextResponse.next(...)` (line 9-13), before the Supabase client creation, add:
  ```typescript
  // Persist referral code in cookie when ?ref= is present on any page
  const ref = request.nextUrl.searchParams.get("ref");
  if (ref) {
    response.cookies.set("referral_code", ref.trim().toLowerCase(), {
      path: "/",
      maxAge: 60 * 60 * 24 * 90, // 90 days
      httpOnly: false,
      sameSite: "lax",
    });
  }
  ```
- **GOTCHA**: This must be done on the initial `response` object AND also after any `response = NextResponse.next(...)` reassignment inside `setAll`. However, since `setAll` replaces the response, the cookie would be lost. The fix: set the referral cookie AFTER the Supabase client does its work, right before returning the response. Place the cookie-setting logic just before `return response;` (line 59).
- **GOTCHA**: The redirect responses (lines 47, 56) create new `NextResponse.redirect()` objects. The referral cookie must also be set on those redirect responses. Add the cookie to any redirect response when `ref` is present.
- **PATTERN**: Follow existing cookie patterns in the same file.
- **VALIDATE**: `npm run build` passes without errors.

**Refined implementation approach:**

Extract `ref` at the top of the function. Then, before each `return` statement, set the cookie on the response if `ref` is present. Create a small helper at the top of the function:

```typescript
const ref = request.nextUrl.searchParams.get("ref")?.trim().toLowerCase();

// Helper to attach referral cookie to any response
const attachReferralCookie = (res: NextResponse) => {
  if (ref) {
    res.cookies.set("referral_code", ref, {
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      httpOnly: false,
      sameSite: "lax",
    });
  }
  return res;
};
```

Then wrap each return: `return attachReferralCookie(response);` and `return attachReferralCookie(NextResponse.redirect(...));`

### Task 2: UPDATE `app/(auth-pages)/signup/page.tsx` — Read cookie as fallback for ref

- **IMPLEMENT**: Import `cookies` from `next/headers`. After reading `searchParams.ref`, fall back to the cookie:
  ```typescript
  import { cookies } from "next/headers";

  // Inside the component:
  const cookieStore = await cookies();
  const referralCode = searchParams.ref || cookieStore.get("referral_code")?.value || "";
  ```
- **PATTERN**: This is a Server Component, so `cookies()` works directly.
- **VALIDATE**: `npm run build` passes.

### Task 3: UPDATE `components/auth/OAuthButtons.tsx` — Read cookie as fallback for ref

- **IMPLEMENT**: In `handleOAuth`, after reading `ref` from URL params (line 63), fall back to the cookie:
  ```typescript
  const ref = currentUrl.searchParams.get("ref") || getCookie("referral_code");
  ```
  Add a simple cookie reader helper (inline or at top of file):
  ```typescript
  function getCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return match ? decodeURIComponent(match[2]) : null;
  }
  ```
- **GOTCHA**: This is a client component, so use `document.cookie`, not `next/headers`.
- **VALIDATE**: `npm run build` passes.

### Task 4: UPDATE `app/auth/callback/route.ts` — Read cookie as fallback for ref

- **IMPLEMENT**: After reading `ref` from URL params (line 21), fall back to cookie:
  ```typescript
  import { cookies } from "next/headers";

  // Inside the handler, after getting user:
  const cookieStore = await cookies();
  const ref = requestUrl.searchParams.get("ref")?.trim().toLowerCase()
    || cookieStore.get("referral_code")?.value?.trim().toLowerCase();
  ```
- **IMPLEMENT**: After successful referral redemption (after the `supabase.rpc("redeem_referral", ...)` call), clear the cookie:
  ```typescript
  // Clear the referral cookie after redemption
  cookieStore.delete("referral_code");
  ```
- **GOTCHA**: Only delete the cookie if the RPC succeeded (no error), not if it failed.
- **VALIDATE**: `npm run build` passes.

### Task 5: UPDATE `app/actions.ts` `signUpAction` — Clear cookie after email signup referral redemption

- **IMPLEMENT**: Import `cookies` from `next/headers`. After the successful `redeem_referral` RPC call (line 64-70), clear the cookie:
  ```typescript
  import { cookies } from "next/headers";

  // After successful referral redemption (inside the if block at line 63):
  if (!refError) {
    const cookieStore = await cookies();
    cookieStore.delete("referral_code");
  }
  ```
- **GOTCHA**: `cookies()` is already available in server actions. Only clear on success.
- **VALIDATE**: `npm run build` passes.

### Task 6 (OPTIONAL): UPDATE `app/(protected)/dashboard/invite/page.tsx` — Update referral link to use homepage

- **IMPLEMENT**: Change line 88 from `/signup?ref=` to `/?ref=`:
  ```typescript
  const referralLink = referralCode
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/?ref=${referralCode}`
    : "";
  ```
- **WHY**: With cookie persistence, sharing the homepage URL feels more natural and less pushy than sharing a signup URL directly. The referral code will persist through to signup via the cookie.
- **VALIDATE**: Manual check that the invite page shows the new URL format.

---

## TESTING STRATEGY

### Unit Tests

No test framework configured. Skip.

### Manual Testing

This is the primary validation method for this hackathon project.

### Edge Cases

1. **Cookie overwrite**: Visit `/?ref=alice`, then `/?ref=bob`. Cookie should contain `bob`.
2. **URL param takes precedence**: Visit `/?ref=alice` (cookie set), then go directly to `/signup?ref=bob`. The form should show `bob`, not `alice`.
3. **Cookie cleared after signup**: After email signup with a referral code, the cookie should be gone.
4. **Cookie cleared after OAuth signup**: After OAuth signup with a referral code from cookie, the cookie should be gone.
5. **No cookie when no ref**: Visiting pages without `?ref=` should not create or modify the cookie.
6. **Cookie survives navigation**: Visit `/?ref=alice`, click around to `/terms`, `/privacy`, then click "Sign Up". The referral field should show `alice`.
7. **Case normalization**: `?ref=NickMartin` should store as `nickmartin`.

---

## VALIDATION COMMANDS

### Level 1: Build

```bash
npm run build
```

### Level 4: Manual Validation

1. Open browser in incognito mode
2. Visit `http://localhost:3000/?ref=testcode`
3. Check browser cookies for `referral_code=testcode`
4. Click "Sign Up" from the navbar
5. Verify the referral code field is pre-filled with `testcode`
6. Visit `http://localhost:3000/terms?ref=anothercode`
7. Navigate to signup, verify field shows `anothercode` (cookie updated)
8. Test OAuth flow: visit `/?ref=oauthtest`, click OAuth button, verify referral is redeemed
9. After signup, verify cookie is cleared

---

## ACCEPTANCE CRITERIA

- [ ] Visiting any page with `?ref=CODE` stores the code in a `referral_code` cookie (90-day TTL)
- [ ] Cookie value is lowercase-normalized
- [ ] Signup page reads referral code from cookie when no `?ref=` URL param is present
- [ ] OAuthButtons reads referral code from cookie when no `?ref=` URL param is present
- [ ] Auth callback reads referral code from cookie when no `?ref=` URL param is present
- [ ] URL `?ref=` param always takes precedence over cookie value
- [ ] Cookie is cleared after successful referral redemption (both email and OAuth flows)
- [ ] Visiting with a new `?ref=` param overwrites the previous cookie value
- [ ] `npm run build` passes without errors
- [ ] No regressions in existing referral flow (direct `/signup?ref=CODE` still works)

---

## COMPLETION CHECKLIST

- [ ] All tasks completed in order
- [ ] `npm run build` passes
- [ ] Manual testing confirms cookie persistence across pages
- [ ] Manual testing confirms email signup with cookie referral
- [ ] Manual testing confirms OAuth signup with cookie referral
- [ ] Manual testing confirms cookie cleanup after redemption
- [ ] Acceptance criteria all met

---

## NOTES

- **Why not localStorage?** Cookies are accessible in middleware and server components. localStorage would require client-side JavaScript on every page to read and pass the value, adding complexity.
- **Why `httpOnly: false`?** The `OAuthButtons` component is a client component that needs to read the cookie via `document.cookie`. The referral code is not sensitive data.
- **Why `sameSite: lax`?** Standard for cookies that should be sent on top-level navigations. `strict` would prevent the cookie from being sent when clicking a link from an external site.
- **Confidence Score**: 9/10. This is a straightforward middleware cookie with four consumer touchpoints, all well-understood patterns in the codebase.
