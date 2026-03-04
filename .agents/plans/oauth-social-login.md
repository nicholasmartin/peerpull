# Feature: OAuth Social Login (Google, GitHub, LinkedIn, Twitch)

The following plan should be complete, but its important that you validate documentation and codebase patterns and task sanity before you start implementing.

Pay special attention to naming of existing utils types and models. Import from the right files etc.

## Feature Description

Add OAuth social login via Google, GitHub, LinkedIn (OIDC), and Twitch using Supabase Auth Providers. Replace the current placeholder OAuth buttons on auth pages with functional social login buttons. Update the `handle_new_user()` database trigger to correctly extract profile metadata from all OAuth providers. Add provider-specific SVG icons and style buttons to match the dark gold theme.

## User Story

As a new or returning user,
I want to sign in with my Google, GitHub, LinkedIn, or Twitch account,
So that I can access PeerPull without creating a separate email/password credential.

## Problem Statement

The auth pages currently have non-functional placeholder OAuth buttons (Google and X/Twitter from the template). Users can only sign up/in with email and password. OAuth would reduce signup friction and increase conversion, especially for the technical audience (GitHub) and professional audience (LinkedIn) PeerPull targets.

## Solution Statement

Leverage Supabase's built-in OAuth provider support. Each provider requires:
1. Credentials configured in the provider's developer console
2. Provider enabled in Supabase Dashboard (or config.toml for local dev)
3. A client-side `signInWithOAuth()` call that redirects to the provider
4. The existing `/auth/callback` route already handles the PKCE code exchange — no changes needed

The `handle_new_user()` trigger must be updated to parse different metadata field names from each provider.

## Feature Metadata

**Feature Type**: New Capability
**Estimated Complexity**: Medium
**Primary Systems Affected**: Auth pages (signin/signup), database trigger, Supabase config
**Dependencies**: Supabase Auth Providers (external), provider developer console credentials (manual setup)

---

## PROVIDER SETUP INSTRUCTIONS

These are step-by-step instructions for the user to configure each provider. The implementation agent should NOT attempt these — they require manual browser interaction with external services.

### Provider 1: Google OAuth

1. Go to **https://console.cloud.google.com/** and select/create a project
2. Navigate to **APIs & Services > OAuth consent screen**
3. Choose **External** user type
4. Add app name ("PeerPull"), support email, logo
5. Under **Scopes**, ensure these are present:
   - `openid`
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`
6. Go to **Credentials > Create Credentials > OAuth 2.0 Client ID**
7. Select **Web application**
8. **Authorized JavaScript origins:**
   - `http://localhost:3000` (dev)
   - `https://yourdomain.com` (prod)
9. **Authorized redirect URIs:**
   - `https://fquqlbbcfibvnllwhbjv.supabase.co/auth/v1/callback`
   - `http://localhost:54321/auth/v1/callback` (local Supabase CLI)
10. Click **Create** → copy **Client ID** and **Client Secret**

**Supabase Dashboard:**
- Go to **Authentication > Providers > Google** → toggle ON
- Paste Client ID and Client Secret → Save
- Go to **Authentication > URL Configuration** → ensure Site URL is set (e.g., `http://localhost:3000`)
- Add `http://localhost:3000/**` to Redirect URLs

### Provider 2: GitHub OAuth

1. Go to **https://github.com/settings/applications/new**
2. Fill in:
   - **Application name:** `PeerPull`
   - **Homepage URL:** `https://yourdomain.com` (or `http://localhost:3000`)
   - **Authorization callback URL:** `https://fquqlbbcfibvnllwhbjv.supabase.co/auth/v1/callback`
3. Click **Register application**
4. Copy the **Client ID**
5. Click **Generate a new client secret** → copy immediately (shown once)

**Supabase Dashboard:**
- Go to **Authentication > Providers > GitHub** → toggle ON
- Paste Client ID and Client Secret → Save

### Provider 3: LinkedIn (OIDC)

> **IMPORTANT:** Use `linkedin_oidc` provider, NOT the deprecated `linkedin` provider.

1. Go to **https://www.linkedin.com/developers/apps** → **Create App**
2. Fill in:
   - **App name:** `PeerPull`
   - **LinkedIn Page:** Associate a LinkedIn Company Page (create one if needed)
   - **App logo:** Upload logo
3. Click **Create app**
4. Go to **Products** tab → request access to **"Sign In with LinkedIn using OpenID Connect"**
   - This may require approval (usually instant for OIDC)
5. Go to **Auth** tab:
   - Verify scopes include: `openid`, `profile`, `email`
   - Under **Authorized redirect URLs**, add: `https://fquqlbbcfibvnllwhbjv.supabase.co/auth/v1/callback`
6. Copy **Client ID** and **Client Secret** from the Auth tab

**Supabase Dashboard:**
- Go to **Authentication > Providers > LinkedIn (OIDC)** → toggle ON (NOT the old "LinkedIn")
- Paste Client ID and Client Secret → Save

### Provider 4: Twitch OAuth

> **PREREQUISITE:** Enable 2-Factor Authentication on your Twitch account at **https://www.twitch.tv/settings/security**

1. Go to **https://dev.twitch.tv/console** → click **Register Your Application**
2. Fill in:
   - **Name:** `PeerPull`
   - **OAuth Redirect URLs:** `https://fquqlbbcfibvnllwhbjv.supabase.co/auth/v1/callback`
   - **Category:** Website Integration
   - **Client Type:** Confidential
3. Complete CAPTCHA → click **Create**
4. Find the app in the list → click **Manage**
5. Copy the **Client ID**
6. Click **New Secret** → copy immediately

**Supabase Dashboard:**
- Go to **Authentication > Providers > Twitch** → toggle ON
- Paste Client ID and Client Secret → Save

---

## CONTEXT REFERENCES

### Relevant Codebase Files — MUST READ BEFORE IMPLEMENTING

- `app/(auth-pages)/signin/page.tsx` (lines 1-99) — Current signin page, server component. No OAuth buttons currently — need to add OAuth button section above the form
- `app/(auth-pages)/signup/page.tsx` (lines 1-148) — Current signup page, server component. No OAuth buttons currently — need to add OAuth button section above the form
- `app/(auth-pages)/layout.tsx` (lines 1-37) — Auth layout with dark theme, gold accent. Buttons must match this theme
- `app/auth/callback/route.ts` (lines 1-40) — **Already handles PKCE exchange.** Reads `code` param, calls `exchangeCodeForSession()`, checks onboarding status. NO CHANGES NEEDED.
- `app/actions.ts` (lines 10-60) — `signUpAction` passes `{ firstname, lastname }` in `options.data` to Supabase signup
- `supabase/migrations/20250419120600_create_profiles_table.sql` (lines 30-49) — Current `handle_new_user()` trigger. Reads `firstname`, `lastname`, `avatar_url` from `raw_user_meta_data`. **MUST BE UPDATED** for OAuth metadata keys
- `utils/supabase/client.ts` — Browser-side Supabase client (used for `signInWithOAuth`)
- `utils/supabase/middleware.ts` (lines 1-65) — Session refresh middleware. No changes needed
- `supabase/config.toml` (lines 211-225) — Local dev OAuth config. Currently only has `[auth.external.apple]` with `enabled = false`
- `components/auth/SignInForm.tsx` (lines 1-154) — **UNUSED** template sign-in form with placeholder Google/X buttons. For reference only — NOT the active auth page
- `components/auth/SignUpForm.tsx` (lines 1-191) — **UNUSED** template sign-up form with placeholder Google/X buttons. For reference only — NOT the active auth page
- `.env.example` (lines 1-9) — Needs OAuth env var placeholders added

### New Files to Create

- `components/auth/OAuthButtons.tsx` — Client component with all 4 OAuth provider buttons
- `supabase/migrations/YYYYMMDD000000_update_handle_new_user_for_oauth.sql` — Migration to update `handle_new_user()` trigger

### Relevant Documentation — READ BEFORE IMPLEMENTING

- [Supabase: Login with Google](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Supabase: Login with GitHub](https://supabase.com/docs/guides/auth/social-login/auth-github)
- [Supabase: Login with LinkedIn (OIDC)](https://supabase.com/docs/guides/auth/social-login/auth-linkedin)
- [Supabase: Login with Twitch](https://supabase.com/docs/guides/auth/social-login/auth-twitch)
- [Supabase: signInWithOAuth API Reference](https://supabase.com/docs/reference/javascript/auth-signinwithoauth)
- [Supabase: Server-Side Auth for Next.js](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Supabase: Identity Linking](https://supabase.com/docs/guides/auth/auth-identity-linking)

### Patterns to Follow

**OAuth Call Pattern (client-side):**
```typescript
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();
await supabase.auth.signInWithOAuth({
  provider: 'google', // or 'github', 'linkedin_oidc', 'twitch'
  options: {
    redirectTo: `${window.location.origin}/auth/callback`,
  },
});
```

**Dark Theme Button Styling (from signin/signup pages):**
```
bg-dark-surface border border-dark-border text-dark-text hover:border-blue-primary/50 hover:bg-dark-surface/80 transition
```

**Provider Strings:**
| Provider | Supabase `provider` string |
|----------|---------------------------|
| Google | `'google'` |
| GitHub | `'github'` |
| LinkedIn | `'linkedin_oidc'` (NOT `'linkedin'`) |
| Twitch | `'twitch'` |

**OAuth Metadata Fields by Provider:**

| Field | Email/Password | Google | GitHub | LinkedIn OIDC | Twitch |
|-------|---------------|--------|--------|---------------|--------|
| First name | `firstname` | `full_name` (split) | `full_name` (split) | `given_name` | `full_name` (split) |
| Last name | `lastname` | `full_name` (split) | `full_name` (split) | `family_name` | `full_name` (split) |
| Avatar | `avatar_url` | `avatar_url` or `picture` | `avatar_url` | `avatar_url` or `picture` | `avatar_url` or `picture` |
| Username | — | — | `user_name` | — | `preferred_username` |

---

## IMPLEMENTATION PLAN

### Phase 1: Database — Update handle_new_user() trigger

Update the `handle_new_user()` function to handle metadata from all OAuth providers. The function needs to:
1. Try `firstname`/`lastname` (email/password signup)
2. Try `given_name`/`family_name` (LinkedIn OIDC)
3. Fall back to splitting `full_name` or `name` (Google, GitHub, Twitch)
4. Handle `avatar_url` OR `picture` for avatar

### Phase 2: UI — Create OAuthButtons component

Create a single reusable `"use client"` component with all 4 OAuth provider buttons. This component calls `signInWithOAuth()` on click and handles loading state.

### Phase 3: Integration — Add OAuthButtons to auth pages

Add the `<OAuthButtons />` component to both signin and signup pages, above the email/password form, with a divider ("Or continue with email").

### Phase 4: Configuration — Update config files

Update `supabase/config.toml` for local development and `.env.example` with placeholder OAuth credentials.

---

## STEP-BY-STEP TASKS

### Task 1: CREATE migration to update handle_new_user()

**File:** `supabase/migrations/YYYYMMDD000000_update_handle_new_user_for_oauth.sql`

Use the next timestamp in sequence (after `20260305000000`). Suggested: `20260306000000`.

**IMPLEMENT:** Replace the `handle_new_user()` function to handle OAuth provider metadata:

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  _first_name TEXT;
  _last_name TEXT;
  _full_name TEXT;
  _avatar TEXT;
BEGIN
  -- 1. Try explicit first/last name (email/password signup)
  _first_name := COALESCE(NULLIF(NEW.raw_user_meta_data->>'firstname', ''), '');
  _last_name := COALESCE(NULLIF(NEW.raw_user_meta_data->>'lastname', ''), '');

  -- 2. Try OIDC standard claims (LinkedIn OIDC)
  IF _first_name = '' THEN
    _first_name := COALESCE(NULLIF(NEW.raw_user_meta_data->>'given_name', ''), '');
  END IF;
  IF _last_name = '' THEN
    _last_name := COALESCE(NULLIF(NEW.raw_user_meta_data->>'family_name', ''), '');
  END IF;

  -- 3. Fall back to splitting full_name / name (Google, GitHub, Twitch)
  IF _first_name = '' AND _last_name = '' THEN
    _full_name := COALESCE(
      NULLIF(NEW.raw_user_meta_data->>'full_name', ''),
      NULLIF(NEW.raw_user_meta_data->>'name', ''),
      ''
    );
    IF _full_name != '' THEN
      _first_name := split_part(_full_name, ' ', 1);
      -- Everything after the first space is the last name
      IF position(' ' in _full_name) > 0 THEN
        _last_name := substring(_full_name from position(' ' in _full_name) + 1);
      END IF;
    END IF;
  END IF;

  -- 4. Avatar: try avatar_url first, then picture
  _avatar := COALESCE(
    NULLIF(NEW.raw_user_meta_data->>'avatar_url', ''),
    NULLIF(NEW.raw_user_meta_data->>'picture', ''),
    ''
  );

  INSERT INTO public.profiles (id, first_name, last_name, avatar_url)
  VALUES (NEW.id, _first_name, _last_name, _avatar);

  RETURN NEW;
END;
$$;
```

**PATTERN:** Follows existing migration convention from `20260305000000_phase4_notifications.sql`.
**GOTCHA:** The `SET search_path = ''` follows the pattern from `20260213084850_fix_function_search_path.sql` to avoid search_path security issues.
**VALIDATE:** `supabase db push` (or check migration applies without error)

---

### Task 2: CREATE OAuthButtons client component

**File:** `components/auth/OAuthButtons.tsx`

**IMPLEMENT:** A `"use client"` component that renders 4 OAuth buttons (Google, GitHub, LinkedIn, Twitch) in a responsive grid. Each button:
- Calls `supabase.auth.signInWithOAuth({ provider, options: { redirectTo } })` on click
- Shows a loading spinner while redirecting
- Is styled to match the dark gold theme from the auth pages
- Includes inline SVG icons for each provider

**IMPORTS:**
```typescript
"use client";
import { createClient } from "@/utils/supabase/client";
import { useState } from "react";
```

**Button layout:** 2x2 grid on desktop, stacked on mobile.

**Provider-specific options:**
- Google: add `queryParams: { access_type: 'offline', prompt: 'consent' }` for refresh token
- GitHub, LinkedIn OIDC, Twitch: no extra options needed

**SVG Icons to include inline:**
- Google: Standard 4-color G logo (copy from `components/auth/SignInForm.tsx` lines 37-59)
- GitHub: GitHub Octocat mark (simple path SVG, use `fill="currentColor"`)
- LinkedIn: LinkedIn "in" logo (use `fill="#0A66C2"`)
- Twitch: Twitch glitch logo (use `fill="#9146FF"`)

**Button styling pattern (matches auth page dark theme):**
```
className="inline-flex items-center justify-center gap-3 w-full py-3 text-sm font-medium
  rounded-lg border border-dark-border bg-dark-surface text-dark-text
  hover:border-blue-primary/50 hover:bg-dark-card transition-colors
  disabled:opacity-50 disabled:cursor-not-allowed"
```

**Error handling:** If `signInWithOAuth` returns an error, show a toast via Sonner:
```typescript
import { toast } from "sonner";
// ...
if (error) toast.error(error.message);
```

**GOTCHA:** `signInWithOAuth` must be called from a client component using the browser Supabase client (`@/utils/supabase/client`), NOT the server client. The method triggers a full-page redirect — it does not return data on success.

**VALIDATE:** Component renders without errors, buttons are visible and styled correctly.

---

### Task 3: UPDATE signin page to include OAuthButtons

**File:** `app/(auth-pages)/signin/page.tsx`

**IMPLEMENT:** Add `<OAuthButtons />` above the form, with an "Or" divider between OAuth buttons and the email/password form.

Insert after the subtitle paragraph (line 20), before the `<form>`:

```tsx
import OAuthButtons from "@/components/auth/OAuthButtons";

// ... inside the component, after the subtitle <p> tag:
<OAuthButtons />

{/* Divider */}
<div className="relative my-5">
  <div className="absolute inset-0 flex items-center">
    <div className="w-full border-t border-dark-border"></div>
  </div>
  <div className="relative flex justify-center text-sm">
    <span className="px-4 text-dark-text-muted bg-dark-card">
      Or continue with email
    </span>
  </div>
</div>

{/* Existing form below */}
```

**PATTERN:** Follows the divider pattern from `components/auth/SignInForm.tsx` (lines 77-86) but styled for dark theme.
**GOTCHA:** The `bg-dark-card` on the divider span must match the card background from the auth layout (`app/(auth-pages)/layout.tsx` line 30).
**VALIDATE:** Sign-in page renders with OAuth buttons above the form, divider looks clean.

---

### Task 4: UPDATE signup page to include OAuthButtons

**File:** `app/(auth-pages)/signup/page.tsx`

**IMPLEMENT:** Same pattern as signin — add `<OAuthButtons />` and divider above the form.

Insert after the subtitle paragraph (line 33), before the `<form>`:

```tsx
import OAuthButtons from "@/components/auth/OAuthButtons";

// Same OAuth buttons + divider pattern as signin
```

**GOTCHA:** When users sign up via OAuth, they bypass the referral code and name fields. This is acceptable — OAuth users get names from their provider profile (via the updated `handle_new_user()` trigger), and referral codes can be applied later.
**VALIDATE:** Sign-up page renders with OAuth buttons above the form.

---

### Task 5: UPDATE supabase/config.toml for local development

**File:** `supabase/config.toml`

**IMPLEMENT:** Add OAuth provider configurations after the existing `[auth.external.apple]` block (line 225). Add sections for Google, GitHub, LinkedIn OIDC, and Twitch:

```toml
[auth.external.google]
enabled = true
client_id = "env(GOOGLE_CLIENT_ID)"
secret = "env(GOOGLE_CLIENT_SECRET)"
# skip_nonce_check is required for local Google OAuth
skip_nonce_check = true

[auth.external.github]
enabled = true
client_id = "env(GITHUB_CLIENT_ID)"
secret = "env(GITHUB_CLIENT_SECRET)"

[auth.external.linkedin_oidc]
enabled = true
client_id = "env(LINKEDIN_CLIENT_ID)"
secret = "env(LINKEDIN_CLIENT_SECRET)"

[auth.external.twitch]
enabled = true
client_id = "env(TWITCH_CLIENT_ID)"
secret = "env(TWITCH_CLIENT_SECRET)"
```

**GOTCHA:** `skip_nonce_check = true` is required for Google OAuth in local development. Without it, Google sign-in will fail with a nonce validation error when running against the local Supabase CLI.
**GOTCHA:** The `linkedin_oidc` key is the correct one — not `linkedin`.
**VALIDATE:** `supabase start` does not error on config parsing.

---

### Task 6: UPDATE .env.example with OAuth placeholders

**File:** `.env.example`

**IMPLEMENT:** Add OAuth credential placeholders:

```
# OAuth Providers (configure in each provider's developer console)
# Google: https://console.cloud.google.com/apis/credentials
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub: https://github.com/settings/applications/new
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# LinkedIn (OIDC): https://www.linkedin.com/developers/apps
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret

# Twitch: https://dev.twitch.tv/console
TWITCH_CLIENT_ID=your-twitch-client-id
TWITCH_CLIENT_SECRET=your-twitch-client-secret
```

**GOTCHA:** These environment variables are ONLY used by the Supabase CLI for local development (referenced in `config.toml` via `env()`). In production, the credentials are configured directly in the Supabase Dashboard — NOT via Next.js env vars.
**VALIDATE:** File contains all 8 OAuth env var placeholders.

---

## TESTING STRATEGY

### No Automated Tests

PeerPull has no test framework configured (hackathon project). All validation is manual.

### Edge Cases to Test

1. **New user signs in with Google** → profile created with correct first_name, last_name, avatar_url
2. **Existing email user signs in with Google (same email)** → identities linked, single account, can log in with either method
3. **OAuth user signs in with Google, then later tries GitHub (same email)** → identities linked correctly
4. **OAuth user goes through onboarding flow** → redirected to `/dashboard/onboarding` after first sign-in
5. **OAuth user with no name from provider** → profile created with empty names (graceful fallback)
6. **User clicks OAuth button, cancels at provider consent screen** → returns to app without error
7. **User clicks OAuth button while already signed in** → session updated, no duplicate profile

---

## VALIDATION COMMANDS

### Level 1: Build Check

```bash
npm run build
```

Verify no TypeScript errors in new/modified files (note: `ignoreBuildErrors: true` is set, so TS errors won't fail the build, but check console output anyway).

### Level 2: Dev Server

```bash
npm run dev
```

Visit `http://localhost:3000/signin` and `http://localhost:3000/signup` — verify OAuth buttons render correctly.

### Level 3: Database Migration

```bash
supabase db push
```

Or if using local Supabase:

```bash
supabase db reset
```

Verify `handle_new_user()` function is updated.

### Level 4: Manual OAuth Flow Testing

For each provider (Google, GitHub, LinkedIn, Twitch):

1. Click the provider button on the signin page
2. Verify redirect to provider's consent screen
3. Authorize the app
4. Verify redirect back to PeerPull
5. Verify profile is created with correct name and avatar
6. Verify user lands on `/dashboard/onboarding` (new user) or `/dashboard` (existing user)
7. Check Supabase Dashboard > Auth > Users to see the user record and identities

---

## ACCEPTANCE CRITERIA

- [ ] All 4 OAuth buttons (Google, GitHub, LinkedIn, Twitch) render on both signin and signup pages
- [ ] Buttons are styled to match the dark gold theme (dark-surface bg, dark-border, hover effects)
- [ ] Each button has the correct provider icon (Google 4-color, GitHub octocat, LinkedIn blue, Twitch purple)
- [ ] Clicking a button initiates OAuth flow with correct provider
- [ ] OAuth flow completes successfully — user is authenticated and redirected to dashboard
- [ ] New OAuth users get correct first_name, last_name, and avatar_url in their profile
- [ ] Existing email users can link their OAuth identity (same email = auto-linked)
- [ ] OAuth users land on `/dashboard/onboarding` on first sign-in (onboarding status)
- [ ] `supabase/config.toml` has all 4 providers configured for local dev
- [ ] `.env.example` documents all OAuth credential placeholders
- [ ] No regressions to existing email/password auth flow
- [ ] Divider between OAuth buttons and email form is visually clean

---

## COMPLETION CHECKLIST

- [ ] Task 1: Migration created for `handle_new_user()` update
- [ ] Task 2: `OAuthButtons.tsx` component created and renders
- [ ] Task 3: Signin page updated with OAuth buttons + divider
- [ ] Task 4: Signup page updated with OAuth buttons + divider
- [ ] Task 5: `config.toml` updated with 4 providers
- [ ] Task 6: `.env.example` updated with OAuth placeholders
- [ ] Manual testing: at least 1 provider flow tested end-to-end
- [ ] Build passes (`npm run build`)

---

## NOTES

### Account Linking Behavior

Supabase has **automatic identity linking** enabled by default. When an OAuth sign-in has the same verified email as an existing user, the OAuth identity is linked to that existing user. The `handle_new_user()` trigger does NOT fire again (no new `auth.users` row is created). This means:

- If a user signs up with email, then signs in with Google (same email) → one account, two identities
- The user's `user_metadata` will be **overwritten** with the most recent OAuth provider's data (known Supabase behavior). Profile data in `public.profiles` is NOT affected since the trigger only fires once on first user creation.

### OAuth Users Skip Signup Fields

When signing in via OAuth, users bypass the referral code field and name entry. This is acceptable because:
- Names come from the OAuth provider via `handle_new_user()`
- Referral codes can be applied later or via URL params (existing `?ref=code` pattern on signup page)

### signInWithOAuth Must Be Client-Side

`supabase.auth.signInWithOAuth()` triggers a browser redirect. It must be called from a client component using the browser Supabase client (`createClient` from `@/utils/supabase/client`). The existing `/auth/callback` route handler already handles the server-side code exchange.

### LinkedIn Uses OIDC Provider String

The provider string for LinkedIn is `'linkedin_oidc'`, NOT `'linkedin'`. The old `linkedin` provider is deprecated. This applies to both the `signInWithOAuth()` call and the `config.toml` section name.

### Google Needs Extra Query Params

For Google OAuth, include `queryParams: { access_type: 'offline', prompt: 'consent' }` to ensure Supabase receives a refresh token from Google. Without these, the Google access token will expire and cannot be refreshed.

### Local Dev Requires skip_nonce_check for Google

When running against the local Supabase CLI, Google OAuth requires `skip_nonce_check = true` in `config.toml` to avoid nonce validation errors.
