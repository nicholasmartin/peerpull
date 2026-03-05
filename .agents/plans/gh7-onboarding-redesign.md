# Feature: GH #7 — Redesign Onboarding Page

The following plan should be complete, but validate documentation and codebase patterns before implementing.

Pay special attention to naming of existing utils, types, and models. Import from the right files.

## Feature Description

Redesign the onboarding experience as a standalone full-screen page that hides the dashboard shell (sidebar, header). The new onboarding lives at `/onboarding` with its own minimal layout inspired by the auth pages pattern: logo header, subtle gold glow background, centered content. The 3-step flow is condensed to 2 steps: a welcome+project form step and a confirmation step. Copy is refreshed to match PeerPull's direct, founder-to-founder brand voice.

## User Story

As a new user who just signed up for PeerPull,
I want a big, bold, distraction-free onboarding experience,
So that I can submit my project quickly without being overwhelmed by dashboard UI I can't use yet.

## Problem Statement

The current onboarding is rendered inside the dashboard shell (sidebar + header), making it feel cluttered for a user who has zero context yet. The UI uses generic Lucide icons as heroes, bland filler copy, and no brand identity. The owner wants onboarding to feel like its own standalone experience — "big, bold, very clean... only focus on that and nothing else."

## Solution Statement

1. Move onboarding from `/dashboard/onboarding` to `/onboarding` in a new `(onboarding)` route group with a dedicated minimal layout (logo header + gold glow background, no sidebar/header).
2. Condense the 3-step wizard to 2 steps: (A) welcome intro + project form combined, (B) confirmation/waitlist.
3. Refresh all copy to match PeerPull's brand voice. Add the logo. Remove generic icon heroes.
4. Update the 2 redirect references and add `/onboarding` to middleware protection.

## Feature Metadata

**Feature Type**: Enhancement
**Estimated Complexity**: Medium
**Primary Systems Affected**: Onboarding flow, routing, middleware, auth callback
**Dependencies**: None — purely frontend + routing changes, no DB/migration work

---

## CONTEXT REFERENCES

### Relevant Codebase Files — YOU MUST READ THESE BEFORE IMPLEMENTING

| File | Why |
|------|-----|
| `components/protected/dashboard/OnboardingFlow.tsx` (full, 250 lines) | Current onboarding component — rewrite target |
| `app/(protected)/dashboard/onboarding/page.tsx` (23 lines) | Current page wrapper — will be deleted and recreated at new path |
| `app/(auth-pages)/layout.tsx` (37 lines) | **Template for the new onboarding layout** — minimal header + gold glow + centered content |
| `app/(protected)/dashboard/layout.tsx` (43 lines) | Dashboard shell layout — onboarding currently lives under this, we're extracting it out |
| `utils/supabase/middleware.ts` (lines 42-51) | Route protection logic — must add `/onboarding` to protected paths |
| `app/auth/callback/route.ts` (line 41) | Redirects new OAuth users to `/dashboard/onboarding` — must update to `/onboarding` |
| `app/(protected)/dashboard/page.tsx` (line 18) | Redirects onboarding users to `/dashboard/onboarding` — must update to `/onboarding` |
| `app/actions.ts` (lines 430-490) | `submitOnboardingProject` server action — keep as-is, just import from new location |
| `components/public/home/Hero.tsx` | Brand voice reference — punchy, direct copy style |
| `app/globals.css` (lines 75-105) | Existing glow animations and grid background for reference |
| `utils/supabase/profiles.ts` | Profile type with `status: 'onboarding' | 'waitlisted' | 'active'` |

### New Files to Create

| Path | Purpose |
|------|---------|
| `app/(onboarding)/layout.tsx` | Minimal standalone layout (logo header + gold glow, no sidebar) |
| `app/(onboarding)/onboarding/page.tsx` | Server component wrapper (auth check, profile fetch, redirect if not onboarding) |

### Files to Modify

| Path | Change |
|------|--------|
| `components/protected/dashboard/OnboardingFlow.tsx` | Full rewrite — 2-step flow, new copy, logo, brand styling |
| `utils/supabase/middleware.ts` | Add `/onboarding` to protected route check |
| `app/auth/callback/route.ts` | Change redirect from `/dashboard/onboarding` to `/onboarding` |
| `app/(protected)/dashboard/page.tsx` | Change redirect from `/dashboard/onboarding` to `/onboarding` |

### Files to Delete

| Path | Reason |
|------|--------|
| `app/(protected)/dashboard/onboarding/page.tsx` | Replaced by `app/(onboarding)/onboarding/page.tsx` |

### Patterns to Follow

**Auth pages layout pattern** (`app/(auth-pages)/layout.tsx`):
- Absolute-positioned gold glow: `bg-blue-primary/5 blur-[120px]`
- Minimal header: logo image + "PeerPull" text
- Centered content card: `max-w-md` on `dark-card` background
- `min-h-screen flex flex-col` wrapper

**Brand voice** (from Hero.tsx):
- "Real Feedback From Real Builders"
- Short, punchy sentences. Active verbs. No corporate filler.
- Gold accents: `blue-primary` (#d4a853), `teal-accent` (#e8c778)

**Component patterns:**
- `"use client"` only when needed (OnboardingFlow has state)
- `cn()` from `@/lib/utils` for conditional classes
- `font-montserrat` for headings, default Inter for body
- Dark theme tokens: `dark-bg`, `dark-card`, `dark-surface`, `dark-border`, `dark-text`, `dark-text-muted`

---

## IMPLEMENTATION PLAN

### Phase 1: Route Infrastructure
Create the new `(onboarding)` route group with its own layout, move the page, and update all redirects + middleware.

### Phase 2: Component Redesign
Rewrite OnboardingFlow.tsx with 2-step flow, brand copy, logo, and big bold styling.

### Phase 3: Cleanup
Delete the old onboarding page. Verify build + all routes.

---

## STEP-BY-STEP TASKS

### Task 1: CREATE `app/(onboarding)/layout.tsx` — Standalone onboarding layout

Create a minimal layout modeled after the auth pages layout. Structure:
- `min-h-screen flex flex-col` dark background wrapper
- Absolute-positioned gold glow overlay (`bg-blue-primary/5 blur-[120px] rounded-full w-[600px] h-[400px]` centered)
- Minimal header: PeerPull logo (`/images/logo/logo-dark.svg`) linked to `/`, no nav items
- `flex-1 flex items-center justify-center` content area for children
- No footer needed

**PATTERN**: Mirror `app/(auth-pages)/layout.tsx` lines 10-35 but widen max-width to `max-w-xl` for the larger onboarding form.

**IMPORTS**: `Image` from `next/image`, `Link` from `next/link`

**VALIDATE**: `npm run build` should compile (empty route group is fine)

---

### Task 2: CREATE `app/(onboarding)/onboarding/page.tsx` — Server component wrapper

Move the logic from `app/(protected)/dashboard/onboarding/page.tsx` but update:
- Same auth check + profile fetch pattern
- Redirect to `/signin` if no user (instead of relying on dashboard layout)
- Redirect to `/dashboard` if profile status is NOT `onboarding`
- Render `<OnboardingFlow profile={profile} />`
- Wider centering wrapper: `px-4 py-8` (layout handles vertical centering)

**PATTERN**: Mirror the existing `app/(protected)/dashboard/onboarding/page.tsx` exactly, just with updated redirect paths.

**IMPORTS**: `createClient` from `@/utils/supabase/server`, `getUserProfile` from `@/utils/supabase/profiles`, `redirect` from `next/navigation`, `OnboardingFlow` from `@/components/protected/dashboard/OnboardingFlow`

**VALIDATE**: `npm run build`

---

### Task 3: UPDATE `utils/supabase/middleware.ts` — Protect `/onboarding` route

**Line 43-46**: The current check is:
```ts
if (pathname.startsWith("/dashboard") || pathname.startsWith("/reset-password"))
```

Update to:
```ts
if (pathname.startsWith("/dashboard") || pathname.startsWith("/reset-password") || pathname.startsWith("/onboarding"))
```

This ensures unauthenticated users hitting `/onboarding` get redirected to `/signin`.

**VALIDATE**: `npm run build`

---

### Task 4: UPDATE `app/auth/callback/route.ts` — Fix redirect path

**Line 41**: Change:
```ts
return NextResponse.redirect(`${origin}/dashboard/onboarding`);
```
To:
```ts
return NextResponse.redirect(`${origin}/onboarding`);
```

**VALIDATE**: `npm run build`

---

### Task 5: UPDATE `app/(protected)/dashboard/page.tsx` — Fix redirect path

**Line 18**: Change:
```ts
return redirect("/dashboard/onboarding");
```
To:
```ts
return redirect("/onboarding");
```

**VALIDATE**: `npm run build`

---

### Task 6: REWRITE `components/protected/dashboard/OnboardingFlow.tsx` — 2-step branded flow

This is the main redesign. Condense from 3 steps to 2. Big, bold, clean.

**Step 0: Welcome + Project Form (combined)**

Layout:
- PeerPull logo at top (`/images/logo/logo-dark.svg`, 48x48)
- `font-montserrat text-3xl font-bold` heading: "Let's get your project listed" (or similar direct copy)
- Personalized if first_name available: "Hey {name}, let's get your project listed"
- 1-2 line subtext explaining the value prop: "Submit your project and you'll be first in line when builders start exchanging video feedback."
- Large, spacious form with Project Name + Project URL inputs
- Helper text under URL: "Where reviewers will go to try your product"
- Big gold CTA button: "Submit Project" with gradient (`from-blue-primary to-teal-accent`)
- No step indicator dots — just 2 steps, keep it invisible

**Step 1: Confirmation**

Layout:
- PeerPull logo at top (same)
- `font-montserrat text-3xl font-bold` heading: "You're in."
- Subtext: "Your project is queued. We'll notify you when PeerPull goes live and the feedback starts rolling in."
- 3 short bullet items (gold checkmarks, not green):
  - "Complete your profile to stand out"
  - "Share your referral link — earn 3 bonus PeerPoints per signup"
  - "You start with 5 PeerPoints in your balance"
- Big CTA: "Go to Dashboard" button (same gradient style)

**Styling notes:**
- Card: `rounded-2xl border border-dark-border bg-dark-card p-8 sm:p-12 w-full max-w-lg` — generous padding, large feel
- Inputs: `rounded-lg` (not `rounded-md`), `py-3` height for chunkier feel, `text-base` (not `text-sm`)
- Button: `py-3 text-base font-semibold rounded-lg` with gradient background and gold shadow glow
- No circular icon containers. Logo is the only visual anchor.
- Remove all step indicator UI (dots/numbers/lines)

**IMPORTS**: `useState`, `useTransition` from react, `useRouter` from next/navigation, `toast` from sonner, `Image` from next/image, `submitOnboardingProject` from `@/app/actions`, `Spinner` from `@/components/ui/spinner`, `Profile` from `@/utils/supabase/profiles`, `Check` from lucide-react (for confirmation bullets only)

**REMOVE**: `Sparkles`, `Users`, `Coins`, `Send`, `CheckCircle2`, `ArrowRight` imports. Remove the `steps` array and step indicator JSX.

**VALIDATE**: `npm run build`

---

### Task 7: DELETE `app/(protected)/dashboard/onboarding/page.tsx` — Remove old route

Delete the file. The old `/dashboard/onboarding` route is now dead — replaced by `/onboarding`.

**GOTCHA**: Verify no other files import from or reference this path (the grep in context already confirmed only 2 redirect references, both updated in Tasks 4-5).

**VALIDATE**: `npm run build` — should have zero broken imports

---

## TESTING STRATEGY

### No automated tests (hackathon project — no test framework configured)

### Manual Validation

1. **Build check**: `npm run build` must pass after every task
2. **Route check**: `/onboarding` should render the new flow for users with `status: 'onboarding'`
3. **Redirect check**: `/dashboard/onboarding` should 404 (old route deleted)
4. **Auth guard check**: Visiting `/onboarding` while logged out should redirect to `/signin`
5. **Status guard check**: Visiting `/onboarding` while `status: 'active'` should redirect to `/dashboard`
6. **Form submission**: Project name + URL submits correctly, transitions to confirmation step
7. **Dashboard redirect**: "Go to Dashboard" button navigates to `/dashboard`

---

## VALIDATION COMMANDS

### Level 1: Build

```bash
npm run build
```

### Level 2: Route Reference Scan

```bash
# Should return ZERO results for old path:
grep -rn "dashboard/onboarding" app/ components/ utils/ --include="*.tsx" --include="*.ts"
```

### Level 3: Manual Validation

- Sign up a new user (or set an existing user's status to `onboarding` in Supabase)
- Visit `/onboarding` — should see the new branded flow
- Visit `/dashboard` — should redirect to `/onboarding`
- Submit a project — should transition to confirmation
- Click "Go to Dashboard" — should navigate to `/dashboard`
- Visit `/onboarding` again — should redirect to `/dashboard` (status is now `waitlisted`)

---

## ACCEPTANCE CRITERIA

- [ ] Onboarding lives at `/onboarding` with its own minimal layout (no sidebar/header)
- [ ] Layout has: PeerPull logo header, gold glow background, centered card
- [ ] Flow is 2 steps: welcome+form and confirmation (no step dots/indicators)
- [ ] Copy is brand-voice: direct, founder-to-founder, no corporate filler
- [ ] PeerPull logo is the visual anchor (no generic Lucide icon heroes)
- [ ] Form inputs are large and spacious (chunky, easy to use)
- [ ] CTA buttons use gold gradient (`from-blue-primary to-teal-accent`)
- [ ] `/onboarding` is protected by middleware (redirects to `/signin` if not authenticated)
- [ ] All old `/dashboard/onboarding` references updated
- [ ] Old `app/(protected)/dashboard/onboarding/page.tsx` deleted
- [ ] `npm run build` passes
- [ ] `submitOnboardingProject` server action still works correctly

---

## COMPLETION CHECKLIST

- [ ] Task 1: Onboarding layout created
- [ ] Task 2: Onboarding page created
- [ ] Task 3: Middleware updated
- [ ] Task 4: Auth callback redirect updated
- [ ] Task 5: Dashboard redirect updated
- [ ] Task 6: OnboardingFlow rewritten
- [ ] Task 7: Old onboarding page deleted
- [ ] All validation commands pass
- [ ] `npm run build` succeeds

---

## NOTES

- **No DB changes**: The `submitOnboardingProject` action, profile status transitions, and all backend logic remain unchanged.
- **Component location**: OnboardingFlow.tsx stays at `components/protected/dashboard/` — it's still a protected/authenticated component. Moving it to a new directory would be a nice-to-have but isn't worth the churn.
- **Old plan**: `.agents/plans/session-2-cleanup-onboarding.md` covered GH #7 + #8 together. GH #8 cleanup tasks (Tasks 1-4 in that plan) were already completed in commit `15eb1e5`. Only the onboarding redesign (Tasks 5-6) remained, which this plan supersedes with the new standalone layout approach.
- **The owner's comment** is the key driver: "big, bold, very clean onboarding so there's only focus on that and nothing else."
