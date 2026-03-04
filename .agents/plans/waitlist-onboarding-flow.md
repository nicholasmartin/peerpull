# Feature: Pre-Launch Waitlist & Onboarding Flow

The following plan should be complete, but its important that you validate documentation and codebase patterns and task sanity before you start implementing.

Pay special attention to naming of existing utils types and models. Import from the right files etc.

## Feature Description

Build a pre-launch waitlist and onboarding flow that lets new users sign up, complete their profile, and wait for launch before they can participate in the feedback exchange. This creates a controlled rollout where users prepare accounts (profile, project URL, preferences, referrals) while the platform is "unlaunched." When an admin flips the `platform_launched` setting, all waitlisted users become active and can use the full feedback loop.

## User Story

As a new user signing up before launch,
I want to complete my profile and set up my account during a waitlist period,
So that I'm ready to give and receive feedback the moment the platform goes live.

As an admin,
I want to control when the platform launches and optionally activate individual users,
So that I can manage the rollout and ensure a critical mass of users are ready.

## Problem Statement

Currently, any authenticated user has immediate access to all dashboard features (submitting feedback requests, reviewing, spending points). There's no concept of account status — a user signs up and is fully active. For a controlled launch, we need:
1. A way to distinguish user readiness (onboarding vs waitlisted vs active)
2. An onboarding flow that guides new users through profile setup
3. Feature gating that prevents waitlisted users from submitting/reviewing
4. An admin control to flip the launch switch

## Solution Statement

Add a `status` column to `profiles` (`onboarding` → `waitlisted` → `active`) and a `platform_launched` system setting. New users start in `onboarding`, complete a multi-step setup flow, then transition to `waitlisted`. When `platform_launched` is set to `true` (or an admin manually activates a user), status becomes `active`. The dashboard layout reads the profile status and either shows the onboarding flow, a waitlist holding state, or the full dashboard.

## Feature Metadata

**Feature Type**: New Capability
**Estimated Complexity**: High
**Primary Systems Affected**: profiles table, dashboard layout, signup flow, server actions, middleware, admin dashboard, system_settings
**Dependencies**: No new external libraries needed — uses existing Supabase, Next.js App Router, Sonner toast patterns

---

## CONTEXT REFERENCES

### Relevant Codebase Files — IMPORTANT: YOU MUST READ THESE FILES BEFORE IMPLEMENTING!

**Database & Backend:**
- `supabase/migrations/20260222000000_beta_launch_economy.sql` (lines 100-141) — `handle_new_user()` trigger function. MUST be updated to set initial status
- `supabase/migrations/20260218000000_create_mvp_tables.sql` — Base table definitions for feedback_requests, reviews
- `supabase/migrations/20260302000000_allow_anon_read_system_settings.sql` — RLS pattern for system_settings
- `utils/supabase/settings.ts` — `SystemSettings` type and `getSettings()`/`getSetting()` helpers. MUST add `platform_launched` field
- `utils/supabase/profiles.ts` — `Profile` type definition. MUST add `status` field
- `app/actions.ts` — All server actions. Several need waitlist gating checks

**Layout & Navigation:**
- `app/(protected)/dashboard/layout.tsx` — Dashboard layout (auth gate + profile fetch). Key integration point for status-based routing
- `components/protected/dashboard/layout/DashboardShell.tsx` — Renders AppSidebar + DashboardContent. May need to pass status for conditional rendering
- `components/protected/dashboard/layout/AppSidebar.tsx` — Sidebar nav items. Need to disable/hide items for non-active users
- `components/protected/dashboard/layout/DashboardContent.tsx` — Main content wrapper
- `components/protected/dashboard/layout/AppHeader.tsx` — Header bar

**Pages that need gating:**
- `app/(protected)/dashboard/page.tsx` — Main dashboard. Shows GettingStartedChecklist for new users
- `app/(protected)/dashboard/request-feedback/page.tsx` — Feedback request listing. Must block if not active
- `app/(protected)/dashboard/request-feedback/new/page.tsx` — New feedback request form. Must block if not active
- `app/(protected)/dashboard/submit-feedback/page.tsx` — Review queue. Must block if not active
- `app/(protected)/dashboard/submit-feedback/get-next-review-button.tsx` — Get next review button. Must block if not active

**Pages accessible during waitlist (no gating needed):**
- `app/(protected)/dashboard/profile/page.tsx` — Profile view/edit
- `app/(protected)/dashboard/settings/page.tsx` — Settings/preferences
- `app/(protected)/dashboard/invite/page.tsx` — Referral system
- `app/(protected)/dashboard/peerpoints/page.tsx` — PeerPoints balance view

**Auth:**
- `components/auth/SignUpForm.tsx` — Signup form (currently collects: firstname, lastname, email, password, referral_code)
- `app/(auth-pages)/signup/page.tsx` — Signup page

**Existing Components to Reference:**
- `components/protected/dashboard/GettingStartedChecklist.tsx` — Pattern for step-based UI with progress tracking and localStorage dismissal
- `components/toast-from-params.tsx` — ToastFromParams bridge pattern

**Admin:**
- `app/(protected)/dashboard/admin/page.tsx` — Admin dashboard
- `app/(protected)/dashboard/admin/SettingsEditor.tsx` — Settings editor component
- `app/(protected)/dashboard/admin/actions.ts` — Admin server actions

### New Files to Create

- `supabase/migrations/YYYYMMDDHHMMSS_add_waitlist_onboarding.sql` — Migration: add `status` to profiles, add `platform_launched` setting, update `handle_new_user()`
- `app/(protected)/dashboard/onboarding/page.tsx` — Multi-step onboarding page
- `components/protected/dashboard/WaitlistBanner.tsx` — "Ready for Launch" banner shown on waitlisted dashboard
- `components/protected/dashboard/OnboardingFlow.tsx` — Client component for multi-step onboarding UI

### Relevant Documentation — YOU SHOULD READ THESE BEFORE IMPLEMENTING!

- `.claude/PRD.md` (Section 7.7, lines 312-344) — Full spec for waitlist & onboarding feature
- `.claude/PRD.md` (Section 10, lines 566-570) — New columns on `profiles` table
- `.claude/PRD.md` (Section 10, lines 609-611) — New `platform_launched` system setting
- `CLAUDE.md` — Project conventions, naming, styling tokens

### Patterns to Follow

**Server Action Pattern (from `app/actions.ts`):**
```typescript
export async function someAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/signin");
  // ... validation ...
  // ... supabase operation ...
  return encodedRedirect("success", "/dashboard/path", "Success message");
}
```

**Server Component Data Fetching (from `app/(protected)/dashboard/page.tsx`):**
```typescript
export default async function Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/signin");
  const profile = await getUserProfile(user);
  // ... fetch more data ...
  return <JSX />;
}
```

**Styling Tokens (dark theme):**
- Card: `rounded-md border border-dark-border bg-dark-card p-6`
- Muted text: `text-dark-text-muted text-sm`
- Primary text: `text-dark-text`
- Primary button: `rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-muted transition`
- Section heading: `text-sm font-medium text-dark-text-muted uppercase tracking-wider`

**Toast Pattern (from `get-next-review-button.tsx`):**
```typescript
import { toast } from "sonner";
toast.success("Action completed!");
toast.error("Something went wrong");
toast.info("Informational message");
```

**Migration Naming:** `YYYYMMDDHHMMSS_descriptive_name.sql`

**Profile Type (from `utils/supabase/profiles.ts`):**
Must add `status` to the `Profile` type.

---

## IMPLEMENTATION PLAN

### Phase 1: Database Foundation

Add the `status` column to `profiles`, create the `platform_launched` system setting, and update the `handle_new_user()` trigger to set initial status to `'onboarding'`.

**Tasks:**
- Create migration file with `status` column, CHECK constraint, and default
- Add `platform_launched` setting to `system_settings`
- Replace `handle_new_user()` function to include status initialization
- Update existing users to `'active'` status (so current users aren't broken)

### Phase 2: Type & Helper Updates

Update TypeScript types and helper functions to include the new `status` field and `platform_launched` setting.

**Tasks:**
- Add `status` to `Profile` type
- Add `platform_launched` to `SystemSettings` type and defaults
- Create helper function to check if user can access features

### Phase 3: Onboarding Flow

Build the multi-step onboarding page that guides new users through: welcome → profile completion → project URL → completion.

**Tasks:**
- Create onboarding page with step-based UI
- Create server actions for saving onboarding progress
- Add transition from `onboarding` → `waitlisted` on completion

### Phase 4: Dashboard Gating

Update the dashboard layout and pages to check profile status and route appropriately:
- `onboarding` → redirect to onboarding flow
- `waitlisted` (platform not launched) → show limited dashboard with waitlist banner
- `active` (or platform launched) → full dashboard

**Tasks:**
- Update dashboard layout to check status and redirect
- Create waitlist banner component
- Gate feedback/review pages
- Update sidebar to disable locked items

### Phase 5: Admin Controls

Add admin ability to flip `platform_launched` and manually activate individual users.

**Tasks:**
- Ensure `platform_launched` shows in admin settings editor
- Add admin action to activate individual users

### Phase 6: Server Action Gating

Add status checks to server actions that should be blocked for non-active users.

**Tasks:**
- Gate `submitFeedbackRequest` action
- Gate `getNextReview` action
- Gate `submitReview` action

---

## STEP-BY-STEP TASKS

IMPORTANT: Execute every task in order, top to bottom. Each task is atomic and independently testable.

---

### Task 1: CREATE `supabase/migrations/20260302200000_add_waitlist_onboarding.sql`

Create the database migration for the waitlist/onboarding feature.

- **IMPLEMENT**: SQL migration with the following operations:

```sql
-- 1. Add status column to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active'
  CHECK (status IN ('onboarding', 'waitlisted', 'active'));

-- 2. Add platform_launched system setting
INSERT INTO public.system_settings (key, value, category, label, description)
VALUES ('platform_launched', 'false', 'queue', 'Platform Launched', 'Whether the platform is open for feedback exchange. When false, new users enter a waitlist.')
ON CONFLICT (key) DO NOTHING;

-- 3. Update handle_new_user() to set status = 'onboarding'
-- IMPORTANT: This replaces the existing function. Copy the FULL current body
-- from migration 20260222000000_beta_launch_economy.sql lines 100-141
-- and 20260222010001_fix_referral_code_lowercase.sql (which may have updated it).
-- Add: status initialization to 'onboarding' in the INSERT INTO profiles statement.
-- The INSERT should include `status` in column list and 'onboarding' as value.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_bonus integer;
  v_referral_code text;
  v_attempts integer := 0;
BEGIN
  -- Read signup bonus from settings
  v_bonus := COALESCE(public.get_setting('signup_bonus_amount')::integer, 3);

  -- Generate unique referral code (6 chars, falls back to 8 on collision)
  LOOP
    v_referral_code := lower(substr(md5(random()::text || clock_timestamp()::text), 1, 6));
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.profiles WHERE referral_code = v_referral_code);
    v_attempts := v_attempts + 1;
    IF v_attempts > 10 THEN
      v_referral_code := lower(substr(md5(random()::text || clock_timestamp()::text), 1, 8));
      EXIT;
    END IF;
  END LOOP;

  -- Insert profile with status = 'onboarding'
  INSERT INTO public.profiles (id, first_name, last_name, avatar_url, peer_points_balance, referral_code, status)
  VALUES (
    NEW.id,
    COALESCE((NEW.raw_user_meta_data->>'firstname')::TEXT, ''),
    COALESCE((NEW.raw_user_meta_data->>'lastname')::TEXT, ''),
    COALESCE((NEW.raw_user_meta_data->>'avatar_url')::TEXT, ''),
    v_bonus,
    v_referral_code,
    'onboarding'
  );

  -- Record signup bonus transaction
  IF v_bonus > 0 THEN
    INSERT INTO public.peer_point_transactions (user_id, amount, type, reference_id)
    VALUES (NEW.id, v_bonus, 'signup_bonus', NULL);
  END IF;

  RETURN NEW;
END;
$$;
```

- **GOTCHA**: The `handle_new_user()` function may have been modified by later migrations. Read the latest version by checking migrations in order: `20260222000000`, `20260222010001`. The one above is based on the latest known version. Verify before applying.
- **GOTCHA**: Existing users need `status = 'active'` (the DEFAULT handles this since we set DEFAULT 'active'). New users from the trigger get `'onboarding'`.
- **VALIDATE**: `supabase db push` or `supabase migration up` (depending on workflow). Verify with: `SELECT column_name, column_default FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'status';`

---

### Task 2: UPDATE `utils/supabase/profiles.ts` — Add `status` to Profile type

- **IMPLEMENT**: Add `status` field to the `Profile` type definition
- **PATTERN**: Follow existing type structure at `utils/supabase/profiles.ts:4-18`
- **CHANGE**:
  ```typescript
  // Add after line 16 (invited_by field):
  status: 'onboarding' | 'waitlisted' | 'active';
  ```
- **VALIDATE**: `npx tsc --noEmit` (note: project has `ignoreBuildErrors: true` so this is advisory)

---

### Task 3: UPDATE `utils/supabase/settings.ts` — Add `platform_launched` to SystemSettings

- **IMPLEMENT**: Add `platform_launched` to the `SystemSettings` type and `DEFAULTS` object
- **PATTERN**: Follow existing pattern at `utils/supabase/settings.ts:3-15`
- **CHANGES**:
  1. Add to `SystemSettings` type: `platform_launched: boolean;`
  2. Add to `DEFAULTS`: `platform_launched: false,`
  3. Update `getSettings()` to handle boolean parsing — currently all values are cast via `Number()` (line 46). The `platform_launched` value is `'true'`/`'false'` string. Add special handling:
  ```typescript
  for (const row of data) {
    if (row.key === 'platform_launched') {
      (settings as any)[row.key] = row.value === 'true';
    } else if (row.key in settings) {
      (settings as any)[row.key] = Number(row.value);
    }
  }
  ```
- **GOTCHA**: All existing settings are numbers. `platform_launched` is a boolean stored as string. The parsing logic must handle this special case.
- **VALIDATE**: `npm run build` passes

---

### Task 4: CREATE `app/(protected)/dashboard/onboarding/page.tsx` — Onboarding page

- **IMPLEMENT**: Server component that checks if user is in `onboarding` status and renders the onboarding flow. If user is NOT in `onboarding`, redirect to `/dashboard`.
- **PATTERN**: Server component pattern from `app/(protected)/dashboard/page.tsx` (auth check + profile fetch)
- **IMPORTS**:
  ```typescript
  import { createClient } from "@/utils/supabase/server";
  import { getUserProfile } from "@/utils/supabase/profiles";
  import { redirect } from "next/navigation";
  import OnboardingFlow from "@/components/protected/dashboard/OnboardingFlow";
  ```
- **IMPLEMENT**:
  - Auth check → redirect to `/signin` if no user
  - Profile fetch → redirect to `/dashboard` if status !== `'onboarding'`
  - Render `<OnboardingFlow profile={profile} />` passing current profile data
- **VALIDATE**: Page renders at `/dashboard/onboarding` when logged in

---

### Task 5: CREATE `components/protected/dashboard/OnboardingFlow.tsx` — Multi-step onboarding client component

- **IMPLEMENT**: Client component with 3 steps:
  1. **Welcome** — "Welcome to PeerPull!" message with explanation of the platform and how it works. CTA: "Let's Get Started"
  2. **Complete Profile** — Form to fill in: website URL, expertise tags (multi-select from predefined list). Pre-populated with existing profile data. Show first name/last name (already set from signup). CTA: "Continue"
  3. **All Set** — "You're on the waitlist!" confirmation. Shows what they can do while waiting (edit profile, invite friends, check PeerPoints). CTA: "Go to Dashboard"

- **PATTERN**: Reference `GettingStartedChecklist.tsx` for step-based UI with progress indicators
- **IMPORTS**:
  ```typescript
  "use client";
  import { useState } from "react";
  import { useRouter } from "next/navigation";
  import { toast } from "sonner";
  import { Profile } from "@/utils/supabase/profiles";
  import { completeOnboarding, updateProfileOnboarding } from "@/app/actions";
  ```
- **STYLING**: Use dark theme tokens consistently:
  - Outer wrapper: `max-w-2xl mx-auto`
  - Card: `rounded-md border border-dark-border bg-dark-card p-8`
  - Step indicator: numbered circles with connecting lines, active step highlighted with `bg-primary`
  - Buttons: primary button style for CTA, outline for secondary
- **STATE**: `currentStep` (0, 1, 2), form state for profile fields
- **STEP 2 FORM FIELDS**:
  - Website URL (text input, optional)
  - Expertise tags — checkboxes from predefined list: `["SaaS", "Mobile App", "Web App", "API/Backend", "UI/UX Design", "Marketing", "DevTools", "E-commerce", "AI/ML", "Fintech", "Other"]`
- **STEP 2 SAVE**: Calls `updateProfileOnboarding` server action to save website + expertise
- **STEP 3 COMPLETE**: Calls `completeOnboarding` server action to transition status to `waitlisted`, then redirects to `/dashboard`
- **VALIDATE**: Component renders 3 steps with forward navigation

---

### Task 6: UPDATE `app/actions.ts` — Add onboarding server actions

- **IMPLEMENT**: Add two new server actions:

```typescript
export async function updateProfileOnboarding(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/signin");

  const website = formData.get("website")?.toString()?.trim() || null;
  const expertise = formData.getAll("expertise").map(String).filter(Boolean);

  const { error } = await supabase
    .from("profiles")
    .update({ website, expertise })
    .eq("id", user.id);

  if (error) {
    return { error: "Failed to update profile" };
  }

  return { success: true };
}

export async function completeOnboarding() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/signin");

  // Verify user is in onboarding status
  const { data: profile } = await supabase
    .from("profiles")
    .select("status")
    .eq("id", user.id)
    .single();

  if (!profile || profile.status !== 'onboarding') {
    return { error: "Not in onboarding state" };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ status: 'waitlisted' })
    .eq("id", user.id);

  if (error) {
    return { error: "Failed to complete onboarding" };
  }

  return { success: true };
}
```

- **PATTERN**: Follow existing action patterns in `app/actions.ts` (auth check, supabase operation, return object)
- **GOTCHA**: The `completeOnboarding` action does NOT use `encodedRedirect` — it returns an object so the client component can handle the redirect with `router.push()` and show a toast
- **VALIDATE**: Actions are callable from client components

---

### Task 7: UPDATE `app/(protected)/dashboard/layout.tsx` — Status-based routing

- **IMPLEMENT**: After fetching the profile, check status and redirect accordingly:
  - If `profile.status === 'onboarding'` → redirect to `/dashboard/onboarding` (UNLESS already on that page — check via a prop or let the onboarding page handle its own redirect)
  - If `profile.status === 'waitlisted'` → allow rendering but pass status info (the individual pages and the sidebar will handle gating)
  - If `profile.status === 'active'` → normal flow

- **APPROACH**: The cleanest approach is to handle the `onboarding` redirect in the layout itself. For the `/dashboard/onboarding` route, it's nested under the dashboard layout, so we need to avoid infinite redirect. Use a simple check:

```typescript
import { headers } from "next/headers";

// After fetching profile:
const headersList = await headers();
const pathname = headersList.get("x-pathname") || "";

// If user is in onboarding and NOT already on the onboarding page, redirect
if (profile?.status === 'onboarding') {
  // We can't reliably get pathname from headers in all cases.
  // Better approach: let the onboarding page itself guard against non-onboarding users.
  // Only gate in the OTHER direction: block non-onboarding users from /dashboard/onboarding
}
```

**REVISED APPROACH** — simpler and more robust:
- Do NOT redirect from the layout. Instead, each page that needs gating checks the profile status.
- The **dashboard main page** (`/dashboard/page.tsx`) checks: if `onboarding`, redirect to `/dashboard/onboarding`.
- The **onboarding page** checks: if NOT `onboarding`, redirect to `/dashboard`.
- Pass `profile` (which includes `status`) through to DashboardShell which already receives it.

This avoids the circular redirect problem entirely.

- **CHANGE TO LAYOUT**: Minimal — just ensure profile is always passed through (it already is). Add settings fetch for `platform_launched`:

```typescript
import { getSettings } from "@/utils/supabase/settings";

// After profile fetch:
const settings = await getSettings();
const isActive = profile?.status === 'active' || settings.platform_launched;
```

Pass `isActive` and `profile.status` to DashboardShell as additional props, which passes them down to AppSidebar.

- **VALIDATE**: Dashboard layout still renders. No redirect loops.

---

### Task 8: UPDATE `app/(protected)/dashboard/page.tsx` — Redirect onboarding users

- **IMPLEMENT**: At the top of the dashboard page (after profile fetch), add:
  ```typescript
  if (profile?.status === 'onboarding') {
    return redirect("/dashboard/onboarding");
  }
  ```
- **ALSO**: If user is `waitlisted` and platform is NOT launched, show a different dashboard view with the WaitlistBanner instead of the full dashboard content. Fetch settings:
  ```typescript
  const settings = await getSettings();
  const isActive = profile?.status === 'active' || settings.platform_launched;
  ```
  If `!isActive`, render `<WaitlistBanner profile={profile} />` instead of the normal quick actions and stats (but keep the GettingStartedChecklist or a simplified version).

- **PATTERN**: Same server component pattern, just conditional rendering
- **VALIDATE**: Onboarding user gets redirected. Waitlisted user sees banner.

---

### Task 9: CREATE `components/protected/dashboard/WaitlistBanner.tsx` — Waitlist holding state

- **IMPLEMENT**: Server-renderable component showing:
  - Heading: "You're on the waitlist!" or "Ready for Launch"
  - Subtext: "We're preparing PeerPull for launch. While you wait, you can:"
  - Action cards (accessible during waitlist):
    1. "Complete your profile" → link to `/dashboard/profile`
    2. "Invite other founders" → link to `/dashboard/invite`
    3. "Check your PeerPoints" → link to `/dashboard/peerpoints`
  - Bottom note: "You'll receive a notification when the platform launches."

- **STYLING**:
  - Use a gradient or accent border to make it feel special (e.g., `border-l-4 border-primary`)
  - Cards use standard `rounded-md border border-dark-border bg-dark-card p-4` pattern
  - Use Lucide icons: `User`, `Send`, `Coins` (or similar)

- **PROPS**: `profile: Profile` (to show personalized greeting)
- **VALIDATE**: Component renders with correct links

---

### Task 10: UPDATE `components/protected/dashboard/layout/AppSidebar.tsx` — Disable nav items for non-active users

- **IMPLEMENT**: Accept new props `userStatus` and `platformLaunched`. When user is not active (status !== 'active' AND platformLaunched !== true):
  - Disable/gray out "Feedback" menu item (both Request Feedback and Submit Feedback sub-items)
  - Show a lock icon or tooltip on disabled items
  - Keep accessible: Dashboard, PeerPoints, Community, Profile, Settings, Help, Invite

- **APPROACH**: Add `disabled?: boolean` to the `NavItem` type. When rendering a disabled item, use a `<span>` instead of `<Link>` with `opacity-50 cursor-not-allowed` styling. Optionally show a small lock icon.

- **PROPS CHANGE**:
  ```typescript
  const AppSidebar: React.FC<{
    isAdmin?: boolean;
    userStatus?: string;
    platformLaunched?: boolean;
  }> = ({ isAdmin, userStatus, platformLaunched }) => {
  ```

- **PASS-THROUGH**: Update `DashboardShell.tsx` to accept and pass these props from the layout.

- **VALIDATE**: Non-active users see disabled Feedback nav items

---

### Task 11: UPDATE `components/protected/dashboard/layout/DashboardShell.tsx` — Pass new props

- **IMPLEMENT**: Update props interface to accept `userStatus` and `platformLaunched`, pass them to `AppSidebar`:
  ```typescript
  export default function DashboardShell({
    children, user, profile, userStatus, platformLaunched
  }: {
    children: React.ReactNode;
    user: User;
    profile: Profile | null;
    userStatus?: string;
    platformLaunched?: boolean;
  }) {
    return (
      <ThemeProvider isProtected={true}>
        <div className="min-h-screen xl:flex">
          <AppSidebar isAdmin={profile?.is_admin} userStatus={userStatus} platformLaunched={platformLaunched} />
          ...
  ```
- **VALIDATE**: Build passes, props flow correctly

---

### Task 12: UPDATE `app/(protected)/dashboard/layout.tsx` — Pass status props to DashboardShell

- **IMPLEMENT**: Fetch settings and pass status info to DashboardShell:
  ```typescript
  import { getSettings } from "@/utils/supabase/settings";

  // After profile fetch:
  const settings = await getSettings();

  return (
    <>
      <Suspense fallback={null}>
        <ToastFromParams />
      </Suspense>
      <DashboardShell
        user={user}
        profile={profile}
        userStatus={profile?.status}
        platformLaunched={settings.platform_launched}
      >
        {children}
      </DashboardShell>
    </>
  );
  ```
- **VALIDATE**: Props reach AppSidebar correctly

---

### Task 13: UPDATE `app/(protected)/dashboard/request-feedback/page.tsx` — Gate for non-active users

- **IMPLEMENT**: After profile fetch, check if user is active:
  ```typescript
  const settings = await getSettings();
  const isActive = profile?.status === 'active' || settings.platform_launched;

  if (!isActive) {
    return (
      <div className="rounded-md border border-dark-border bg-dark-card p-8 text-center">
        <h2 className="text-lg font-semibold text-dark-text">Coming Soon</h2>
        <p className="mt-2 text-dark-text-muted">
          Feedback requests will be available when the platform launches. While you wait, complete your profile and invite other founders!
        </p>
        <Link href="/dashboard" className="mt-4 inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-muted transition">
          Back to Dashboard
        </Link>
      </div>
    );
  }
  ```
- **PATTERN**: Similar to the existing active project limit gate in `request-feedback/new/page.tsx` (lines 54-71)
- **VALIDATE**: Waitlisted user sees "Coming Soon" instead of feedback requests

---

### Task 14: UPDATE `app/(protected)/dashboard/request-feedback/new/page.tsx` — Gate for non-active users

- **IMPLEMENT**: Same pattern as Task 13 — check `isActive` before rendering form
- **VALIDATE**: Waitlisted user sees gated message

---

### Task 15: UPDATE `app/(protected)/dashboard/submit-feedback/page.tsx` — Gate for non-active users

- **IMPLEMENT**: Same pattern as Task 13 — check `isActive` before rendering review queue
- **VALIDATE**: Waitlisted user sees gated message

---

### Task 16: UPDATE `app/actions.ts` — Add server-side gating to sensitive actions

- **IMPLEMENT**: Add status check to `submitFeedbackRequest`, `getNextReview`, and `submitReview`:

  ```typescript
  // Helper at top of actions.ts:
  async function requireActiveUser(supabase: any, userId: string): Promise<{ error?: string }> {
    const { data: profile } = await supabase
      .from("profiles")
      .select("status")
      .eq("id", userId)
      .single();

    if (!profile) return { error: "Profile not found" };

    // Check platform_launched setting
    const { data: launchSetting } = await supabase
      .from("system_settings")
      .select("value")
      .eq("key", "platform_launched")
      .single();

    const platformLaunched = launchSetting?.value === 'true';

    if (profile.status !== 'active' && !platformLaunched) {
      return { error: "Your account is not yet active. Please wait for platform launch." };
    }

    return {};
  }
  ```

  Add call to this helper at the start of `submitFeedbackRequest`, `getNextReview`, and `submitReview`:
  ```typescript
  const activeCheck = await requireActiveUser(supabase, user.id);
  if (activeCheck.error) {
    return encodedRedirect("error", "/dashboard", activeCheck.error);
    // or return { error: activeCheck.error } for actions that return objects
  }
  ```

- **GOTCHA**: `getNextReview` returns an object, not a redirect. Use `return { error: activeCheck.error }` for it. `submitFeedbackRequest` uses `encodedRedirect`. `submitReview` uses `return { error }` for validation and `redirect()` for success.
- **VALIDATE**: Calling these actions as a waitlisted user returns an error

---

### Task 17: UPDATE `app/(protected)/dashboard/admin/page.tsx` or admin actions — Add user activation action

- **IMPLEMENT**: Add a server action for admins to manually activate a user:

  ```typescript
  // In app/(protected)/dashboard/admin/actions.ts:
  export async function activateUser(userId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated" };

    // Verify admin
    const { data: adminProfile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single();

    if (!adminProfile?.is_admin) return { error: "Not authorized" };

    const { error } = await supabase
      .from("profiles")
      .update({ status: 'active' })
      .eq("id", userId);

    if (error) return { error: "Failed to activate user" };

    return { success: true };
  }

  export async function activateAllWaitlisted() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated" };

    const { data: adminProfile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single();

    if (!adminProfile?.is_admin) return { error: "Not authorized" };

    const { error } = await supabase
      .from("profiles")
      .update({ status: 'active' })
      .eq("status", "waitlisted");

    if (error) return { error: "Failed to activate users" };

    return { success: true };
  }
  ```

- **UI**: Add an "Activate All Waitlisted Users" button to the admin users page (`app/(protected)/dashboard/admin/users/page.tsx`). If the admin users page shows a list of users, add an "Activate" button per row for individual activation.

- **GOTCHA**: The `platform_launched` setting already shows in the SettingsEditor since it's in `system_settings` table. When an admin sets `platform_launched = 'true'`, the system naturally treats all waitlisted users as active via the `isActive` check. But their profile status remains `'waitlisted'` — this is fine for the MVP. The `activateAllWaitlisted` action is for permanently updating statuses.

- **VALIDATE**: Admin can activate users. Setting `platform_launched` to `'true'` allows all waitlisted users to access features.

---

### Task 18: UPDATE `app/auth/callback/route.ts` — Redirect new users to onboarding

- **IMPLEMENT**: After session exchange, check user's profile status. If `onboarding`, redirect to `/dashboard/onboarding` instead of `/dashboard`:

  ```typescript
  // After successful code exchange:
  const { data: profile } = await supabase
    .from("profiles")
    .select("status")
    .eq("id", user.id) // need to get user from session
    .single();

  if (profile?.status === 'onboarding') {
    return NextResponse.redirect(new URL("/dashboard/onboarding", request.url));
  }
  ```

- **GOTCHA**: The callback route uses `exchangeCodeForSession`. After exchange, call `getUser()` to get the user ID, then fetch profile. If profile doesn't exist yet (race condition with trigger), default to `/dashboard` which will handle the redirect.
- **VALIDATE**: New user email verification leads to onboarding page

---

## TESTING STRATEGY

### No Automated Tests (per project conventions — no test framework configured)

### Manual Testing

**Test Case 1: New User Onboarding Flow**
1. Sign up with new email
2. Verify email via link
3. Should land on `/dashboard/onboarding`
4. Complete 3-step flow (welcome → profile → done)
5. Should transition to waitlisted state
6. Should see waitlist dashboard

**Test Case 2: Waitlisted User Restrictions**
1. As waitlisted user, try to navigate to `/dashboard/request-feedback`
2. Should see "Coming Soon" message
3. Try to navigate to `/dashboard/submit-feedback`
4. Should see "Coming Soon" message
5. Verify can access: Profile, Settings, Invite, PeerPoints, Dashboard

**Test Case 3: Platform Launch**
1. As admin, set `platform_launched` to `true` in admin settings
2. As waitlisted user, refresh dashboard
3. Should now see full dashboard with all features accessible
4. Feedback nav items in sidebar should be enabled

**Test Case 4: Admin Individual Activation**
1. As admin, go to Users page
2. Activate a specific waitlisted user
3. As that user, verify full access even without `platform_launched`

**Test Case 5: Existing Users Unaffected**
1. Existing users should have status = `active` (from migration default)
2. Verify all existing functionality works unchanged

### Edge Cases

- User navigates directly to `/dashboard/onboarding` when already waitlisted → should redirect to `/dashboard`
- User navigates directly to `/dashboard/onboarding` when already active → should redirect to `/dashboard`
- Browser back button during onboarding flow
- Multiple tab handling (complete onboarding in one tab, other tab still on step 1)
- Admin activates user who is still in `onboarding` (should work — skip to active)

---

## VALIDATION COMMANDS

### Level 1: Build Check

```bash
npm run build
```

### Level 2: Migration Check

```bash
supabase db push --dry-run
```

### Level 3: Dev Server

```bash
npm run dev
# Navigate to /dashboard/onboarding and verify rendering
```

### Level 4: Manual Validation

- Sign up new user → verify onboarding flow
- Complete onboarding → verify waitlist state
- Toggle `platform_launched` → verify feature access
- Verify existing users are unaffected

---

## ACCEPTANCE CRITERIA

- [ ] New users start in `onboarding` status (verified in database)
- [ ] Onboarding flow renders 3 steps with correct content
- [ ] Completing onboarding transitions user to `waitlisted`
- [ ] Waitlisted users see a "Ready for Launch" dashboard with limited access
- [ ] Waitlisted users cannot access Request Feedback or Submit Feedback pages
- [ ] Waitlisted users CAN access: Profile, Settings, Invite, PeerPoints
- [ ] Sidebar shows disabled/locked Feedback items for waitlisted users
- [ ] Server actions (`submitFeedbackRequest`, `getNextReview`, `submitReview`) reject non-active users
- [ ] Setting `platform_launched = true` grants access to all waitlisted users
- [ ] Admin can manually activate individual users
- [ ] Admin can bulk-activate all waitlisted users
- [ ] Existing users have status `active` and are unaffected
- [ ] Auth callback redirects new users to onboarding
- [ ] Toast notifications show for all action outcomes
- [ ] `npm run build` passes without new errors
- [ ] All UI uses dark theme tokens consistently

---

## COMPLETION CHECKLIST

- [ ] All tasks completed in order (1-18)
- [ ] Migration applied successfully
- [ ] Profile type updated with status field
- [ ] Settings type updated with platform_launched
- [ ] Onboarding page and flow component created
- [ ] Server actions for onboarding added
- [ ] Dashboard page redirects onboarding users
- [ ] Waitlist banner component created
- [ ] Sidebar disables locked items
- [ ] All protected pages gated
- [ ] Server actions gated
- [ ] Admin activation actions added
- [ ] Auth callback updated
- [ ] Manual testing completed for all 5 test cases
- [ ] Build passes

---

## NOTES

### Design Decisions

1. **Status column default is `'active'`** — This ensures existing users are not affected by the migration. New users get `'onboarding'` from the trigger function. This is intentional asymmetry.

2. **`platform_launched` acts as a global override** — When true, all users are treated as active regardless of their individual status. This is simpler than updating every user's status on launch (though the admin bulk-activate action exists for permanent status changes).

3. **No redirect from layout** — Status routing is handled per-page rather than in the layout to avoid circular redirect issues with the onboarding page (which is itself under `/dashboard/`). The dashboard main page handles the onboarding redirect, and each feature page handles its own gating.

4. **Onboarding is minimal (3 steps)** — Per the hackathon context, we keep onboarding lean. The PRD mentions "welcome → profile → project URL → preferences" but we simplify to "welcome → profile (website + expertise) → done". Project URL and notification preferences can be done from their respective pages during the waitlist period.

5. **Profile RLS allows self-update** — The existing RLS policy `auth.uid() = id` for UPDATE on profiles already allows users to update their own profile, including the status field. This is acceptable for onboarding since the `completeOnboarding` action validates the transition (`onboarding` → `waitlisted` only). For production hardening, consider adding a database constraint or trigger to prevent arbitrary status changes via direct Supabase client calls.

### Risks

1. **RLS allows self-update of status** — A technically savvy user could use the Supabase client directly to set their status to `'active'`. For hackathon scope this is acceptable. Post-hackathon, add a trigger or RPC function to enforce valid transitions.

2. **Race condition on new user trigger** — There's a small window between auth user creation and profile creation where the auth callback might not find a profile. Handle gracefully by defaulting to `/dashboard` which will retry on next load.

3. **Settings caching** — `getSettings()` fetches from DB on every call. For the layout (which runs on every page navigation), this adds a DB query. Acceptable for hackathon; consider caching in production.
