# Feature: Clean Up Placeholder, Dummy, and Non-Functional Content (GH #8)

The following plan should be complete, but its important that you validate documentation and codebase patterns and task sanity before you start implementing.

Pay special attention to naming of existing utils types and models. Import from the right files etc.

## Feature Description

Remove all placeholder content, dummy data, dead code components, and non-functional UI elements left over from the starter-kit template. Replace hardcoded mock data with real data where applicable. This is a pre-launch cleanup to ensure nothing looks broken, fake, or staged.

## User Story

As a founder visiting PeerPull
I want every page and UI element to show real, functional content
So that the platform feels polished, trustworthy, and production-ready

## Problem Statement

The codebase has accumulated ~20+ unused template components, hardcoded dummy data (fake users, fake pricing, fake video tutorials), dead `href="#"` links, and placeholder "coming soon" sections. Shipping these would make the product look unfinished.

## Solution Statement

Systematically delete all unused components, remove fake data from active pages, wire real user data where placeholders exist (UserDropdown avatar), simplify placeholder pages (community, help videos, settings billing), and fix remaining dead links.

## Feature Metadata

**Feature Type**: Cleanup / Bug Fix
**Estimated Complexity**: Medium
**Primary Systems Affected**: components/, app/(protected)/dashboard/, app/(public)/, public/images/
**Dependencies**: None — purely subtractive cleanup + minor wiring fixes

---

## CRITICAL: ITEMS THAT ARE NOW IMPLEMENTED (DO NOT REMOVE)

The GitHub issue #8 was filed before several features were implemented. The following items from the original issue are NOW FUNCTIONAL and must NOT be touched:

| Item | Status | Evidence |
|------|--------|----------|
| **OAuth buttons (Google, GitHub, LinkedIn, Twitch)** | FUNCTIONAL | `components/auth/OAuthButtons.tsx` — calls `supabase.auth.signInWithOAuth()` |
| **Terms of Service page** | FUNCTIONAL | `app/(public)/terms/page.tsx` — full legal content |
| **Privacy Policy page** | FUNCTIONAL | `app/(public)/privacy/page.tsx` — full legal content |
| **Layout Footer** (`components/public/layout/Footer.tsx`) | FUNCTIONAL | Links to `/terms`, `/privacy` — used in `app/(public)/layout.tsx` |
| **Navbar** | FUNCTIONAL | All anchor links work with smooth scrolling |
| **Help page FAQs** | FUNCTIONAL | Real FAQ content with 5 PeerPull-specific Q&As |
| **Settings page** (account, notifications, appearance tabs) | FUNCTIONAL | Database-backed notification prefs, theme switching |
| **Invite page** | FUNCTIONAL | Full referral system with DB integration |
| **NotificationDropdown** | FUNCTIONAL | Real-time Supabase subscriptions |
| **Active AppSidebar** (`components/protected/dashboard/layout/AppSidebar.tsx`) | FUNCTIONAL | All nav items point to real routes |

---

## CONTEXT REFERENCES

### Relevant Codebase Files — MUST READ BEFORE IMPLEMENTING

**Files to DELETE (unused template components):**
- `components/auth/SignUpForm.tsx` — Legacy form, replaced by `OAuthButtons.tsx` + inline form in `app/(auth-pages)/signup/page.tsx`
- `components/auth/SignInForm.tsx` — Legacy form, replaced by `OAuthButtons.tsx` + inline form in `app/(auth-pages)/signin/page.tsx`
- `components/user-profile/UserMetaCard.tsx` — Hardcoded "Musharof Chowdhury", fake social links, never imported
- `components/user-profile/UserInfoCard.tsx` — Never imported
- `components/user-profile/UserAddressCard.tsx` — Never imported
- `components/tables/BasicTableOne.tsx` — 5 fake user rows, never imported
- `components/tables/Pagination.tsx` — Never imported
- `components/ui/video/VideosExample.tsx` — Rickroll YouTube IDs, never imported
- `components/ui/video/YouTubeEmbed.tsx` — Only used by VideosExample, never imported elsewhere
- `components/example/ModalExample/DefaultModal.tsx` — Lorem ipsum, never imported
- `components/example/ModalExample/FormInModal.tsx` — Fake names/emails, never imported
- `components/example/ModalExample/FullScreenModal.tsx` — Lorem ipsum, never imported
- `components/example/ModalExample/VerticallyCenteredModal.tsx` — Placeholder, never imported
- `components/example/ModalExample/ModalBasedAlerts.tsx` — Lorem ipsum, never imported
- `components/form/form-elements/FileInputExample.tsx` — Demo component, never imported
- `components/form/form-elements/DefaultInputs.tsx` — Demo component, never imported
- `components/form/form-elements/InputStates.tsx` — Demo component, never imported
- `components/videos/FourIsToThree.tsx` — Unused video aspect-ratio demos
- `components/videos/OneIsToOne.tsx` — Unused
- `components/videos/SixteenIsToNine.tsx` — Unused
- `components/videos/TwentyOneIsToNine.tsx` — Unused
- `components/calendar/Calendar.tsx` — FullCalendar demo, never imported
- `components/common/GridShape.tsx` — Never imported
- `components/common/PageBreadCrumb.tsx` — Never imported
- `components/common/ChartTab.tsx` — Never imported
- `components/common/ComponentCard.tsx` — Only imported by other unused demo components
- `components/dashboard-layout/AppSidebar.tsx` — Old sidebar with placeholder routes (/analytics, /billing, etc.), replaced by `components/protected/dashboard/layout/AppSidebar.tsx`
- `components/dashboard-layout/AppHeader.tsx` — Old layout, replaced by `components/protected/dashboard/layout/AppHeader.tsx`
- `components/dashboard-layout/Backdrop.tsx` — Old layout, replaced
- `components/dashboard-layout/DashboardContent.tsx` — Old layout, replaced
- `components/dashboard-layout/DashboardShell.tsx` — Old layout (only imports other old layout files)
- `components/public/home/Footer.tsx` — Dead `href="#"` links, NOT rendered (layout Footer is used instead)
- `components/public/home/Pricing.tsx` — Fake $29/$79/$199 SaaS pricing, NOT rendered on homepage
- `components/public/home/SocialProof.tsx` — Fake "Brand A/B/C/D/E" logos, NOT rendered
- `components/public/home/ForExperiencedFounders.tsx` — Fake testimonial "Michael R.", NOT rendered
- `components/charts/bar/BarChartOne.tsx` — Never imported
- `components/charts/line/LineChartOne.tsx` — Never imported
- `public/images/user/user-02.jpg` — Stock photo, only referenced from unused BasicTableOne
- `public/images/user/user-02.svg` — Stock illustration, unreferenced

**Files to MODIFY (active code with placeholder content):**
- `components/header/UserDropdown.tsx` (line 37) — Hardcoded `owner.svg` avatar, needs real avatar from profile
- `app/(protected)/dashboard/help/page.tsx` (lines 236-273) — Fake video tutorials with mock view counts
- `app/(protected)/dashboard/help/page.tsx` (line 356) — Dead `href="#"` privacy link
- `app/(protected)/dashboard/settings/page.tsx` (lines 521-636) — Entire billing tab is fake data ($29 Pro plan, fake features)
- `app/(protected)/dashboard/settings/page.tsx` (line 425) — "Session management coming soon"
- `app/(protected)/dashboard/community/page.tsx` (entire file) — All three tabs are placeholder "coming soon"

### Patterns to Follow

**UserDropdown avatar fix — follow the pattern from AppHeader:**
The profile object is already passed as a prop (`profile: Profile | null`). The `Profile` type from `@/utils/supabase/profiles` includes `avatar_url`. Use it with a fallback to initials.

**Removing components safely:**
- Delete the file
- Grep for any remaining imports/references
- Verify build still works

**"Coming soon" pages — keep the route, simplify the content:**
Community page should remain as a single card with a friendly message (not fake tabs pretending features exist).

---

## IMPLEMENTATION PLAN

### Phase 1: Delete Unused Template Components (bulk cleanup)

Delete ~35 files across 7 directories. These are all verified as unused (zero imports from active code).

### Phase 2: Fix Active Pages with Placeholder Content

Fix 4 active pages that have fake/placeholder content embedded in otherwise functional code.

### Phase 3: Wire Real Data (UserDropdown Avatar)

Replace the hardcoded `owner.svg` with the user's actual avatar from their profile, with initials fallback.

### Phase 4: Clean Up Orphaned Assets

Remove stock images only referenced by deleted components.

### Phase 5: Verify No Dead Imports

Run build, grep for broken imports, confirm clean.

---

## STEP-BY-STEP TASKS

### Task 1: DELETE — Unused template component directories

Delete the following entire directories and their contents:

```
components/example/ModalExample/     (5 files)
components/videos/                   (4 files)
components/calendar/                 (1 file)
components/charts/bar/               (1 file)
components/charts/line/              (1 file)
```

Also delete the now-empty parent dirs if they become empty (components/example/, components/charts/).

**VALIDATE:** `grep -rn "ModalExample\|FourIsToThree\|OneIsToOne\|SixteenIsToNine\|TwentyOneIsToNine\|Calendar\|BarChartOne\|LineChartOne" app/ components/ --include="*.tsx" --include="*.ts"` — should return zero results from active code.

---

### Task 2: DELETE — Unused individual components

Delete these individual files:

```
components/auth/SignUpForm.tsx
components/auth/SignInForm.tsx
components/user-profile/UserMetaCard.tsx
components/user-profile/UserInfoCard.tsx
components/user-profile/UserAddressCard.tsx
components/tables/BasicTableOne.tsx
components/tables/Pagination.tsx
components/ui/video/VideosExample.tsx
components/ui/video/YouTubeEmbed.tsx
components/form/form-elements/FileInputExample.tsx
components/form/form-elements/DefaultInputs.tsx
components/form/form-elements/InputStates.tsx
components/common/GridShape.tsx
components/common/PageBreadCrumb.tsx
components/common/ChartTab.tsx
components/common/ComponentCard.tsx
```

After deletion, check if these parent directories are now empty and can be removed:
- `components/user-profile/` (if all 3 files deleted)
- `components/tables/` (if both files deleted)
- `components/ui/video/` (if both files deleted)

**VALIDATE:** `grep -rn "SignUpForm\|SignInForm\|UserMetaCard\|UserInfoCard\|UserAddressCard\|BasicTableOne\|Pagination\|VideosExample\|YouTubeEmbed\|FileInputExample\|DefaultInputs\|InputStates\|GridShape\|PageBreadCrumb\|ChartTab\|ComponentCard" app/ components/ --include="*.tsx" --include="*.ts"` — should return zero results from active code.

---

### Task 3: DELETE — Old dashboard-layout directory

Delete the entire old dashboard layout directory (replaced by `components/protected/dashboard/layout/`):

```
components/dashboard-layout/AppSidebar.tsx
components/dashboard-layout/AppHeader.tsx
components/dashboard-layout/Backdrop.tsx
components/dashboard-layout/DashboardContent.tsx
components/dashboard-layout/DashboardShell.tsx
```

Remove the `components/dashboard-layout/` directory.

**GOTCHA:** The old `DashboardShell.tsx` imports from other old layout files — but it itself is NOT imported anywhere in active code. The active shell is at `components/protected/dashboard/layout/DashboardShell.tsx`.

**VALIDATE:** `grep -rn "from.*dashboard-layout" app/ components/ --include="*.tsx" --include="*.ts"` — should return zero results (the only references are within the old directory itself).

---

### Task 4: DELETE — Unused homepage components

Delete these three homepage components (they exist as files but are NOT imported in `app/(public)/page.tsx`):

```
components/public/home/Footer.tsx
components/public/home/Pricing.tsx
components/public/home/SocialProof.tsx
components/public/home/ForExperiencedFounders.tsx
```

**IMPORTANT — DO NOT DELETE:**
- `components/public/layout/Footer.tsx` — This IS the active footer used in `app/(public)/layout.tsx`
- Any other components imported in `app/(public)/page.tsx` (Hero, Problem, HowItWorks, FAQ, CTASection)

**VALIDATE:** `grep -rn "home/Footer\|home/Pricing\|SocialProof\|ForExperiencedFounders" app/ components/ --include="*.tsx" --include="*.ts"` — should return zero results.

---

### Task 5: UPDATE — UserDropdown avatar (wire real data)

**File:** `components/header/UserDropdown.tsx`

**IMPLEMENT:** Replace the hardcoded `owner.svg` (line 37) with the user's actual avatar from `profile.avatar_url`, with a fallback to initials.

Replace lines 33-39:
```tsx
<span className="mr-3 overflow-hidden rounded-full h-11 w-11">
  <Image
    width={44}
    height={44}
    src="/images/user/owner.svg"
    alt="User"
  />
</span>
```

With:
```tsx
<span className="mr-3 overflow-hidden rounded-full h-11 w-11 bg-dark-surface flex items-center justify-center">
  {profile?.avatar_url ? (
    <Image
      width={44}
      height={44}
      src={profile.avatar_url}
      alt="User"
      referrerPolicy="no-referrer"
      className="rounded-full object-cover"
    />
  ) : (
    <span className="text-sm font-medium text-dark-text">
      {(profile?.first_name?.[0] || user?.email?.[0] || "U").toUpperCase()}
    </span>
  )}
</span>
```

**PATTERN:** Follow the `referrerPolicy="no-referrer"` pattern already used for OAuth avatars elsewhere in the codebase (see Phase 5.8 in TRACKER.md).

**VALIDATE:** Start dev server, log in, verify the dropdown shows the user's real avatar or initials instead of the generic SVG.

---

### Task 6: UPDATE — Help page (remove fake video tutorials, fix dead link)

**File:** `app/(protected)/dashboard/help/page.tsx`

**IMPLEMENT:**

A) **Remove the fake video tutorials section** (lines 235-273). Replace the entire "Video Tutorials" `<div>` block with nothing (just delete it). The tutorials had fake view counts (2.5k, 1.8k, 1.2k views) and no actual video content.

B) **Fix the dead privacy link** (line 356). Change:
```tsx
<a href="#" className="text-primary hover:underline ">
```
To:
```tsx
<a href="/privacy" className="text-primary hover:underline">
```

**VALIDATE:** Visit `/dashboard/help`, confirm no fake video tutorials appear, confirm privacy link navigates to `/privacy`.

---

### Task 7: UPDATE — Settings page (remove fake billing tab, clean up session placeholder)

**File:** `app/(protected)/dashboard/settings/page.tsx`

**IMPLEMENT:**

A) **Remove the entire billing tab.** PeerPull uses a credit-based (PeerPoints) model, not subscription billing. The billing tab has fake $29/month pricing that contradicts the actual product model.

Remove:
1. The "billing" `TabsTrigger` from the tabs list
2. The entire `<TabsContent value="billing">` block (lines 521-636)
3. Any `CreditCard` icon import if no longer needed

B) **Simplify the "Active Sessions" card** (lines 416-428). Replace "Session management coming soon" with a cleaner message:
```tsx
<CardContent>
  <p className="text-sm text-dark-text-muted">
    You are currently signed in on this device.
  </p>
</CardContent>
```

**VALIDATE:** Visit `/dashboard/settings`, confirm billing tab is gone, confirm session card shows clean message.

---

### Task 8: UPDATE — Community page (simplify placeholder)

**File:** `app/(protected)/dashboard/community/page.tsx`

**IMPLEMENT:** Replace the three fake tabs (Founders, Events, Discussions) with a single clean placeholder card. The current UI pretends three features exist — it should just be honest that community features are planned.

Replace the entire file content with:
```tsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function CommunityPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Community</h1>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <Users className="mb-4 h-12 w-12 text-dark-text-muted" />
          <h3 className="text-lg font-medium text-dark-text">Community features coming soon</h3>
          <p className="mt-2 text-sm text-dark-text-muted max-w-md">
            Connect with other founders, share feedback, and participate in community events.
            We&apos;re building this next.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
```

**VALIDATE:** Visit `/dashboard/community`, confirm single clean card without fake tabs.

---

### Task 9: DELETE — Orphaned image assets

Delete these image files that are only referenced from now-deleted components:

```
public/images/user/user-02.jpg
public/images/user/user-02.svg
```

**KEEP:** `public/images/user/owner.svg` — still a useful generic fallback asset even though it's no longer hardcoded in UserDropdown.

**VALIDATE:** `grep -rn "user-02" app/ components/ --include="*.tsx" --include="*.ts"` — should return zero results.

---

### Task 10: VERIFY — No dead imports, build still works

**IMPLEMENT:**

1. Run a broad grep for any imports referencing deleted files:
```bash
grep -rn "dashboard-layout\|SignUpForm\|SignInForm\|UserMetaCard\|UserInfoCard\|UserAddressCard\|BasicTableOne\|VideosExample\|YouTubeEmbed\|ModalExample\|FileInputExample\|DefaultInputs\|InputStates\|GridShape\|PageBreadCrumb\|ChartTab\|ComponentCard\|home/Footer\|home/Pricing\|SocialProof\|ForExperiencedFounders\|BarChartOne\|LineChartOne\|FourIsToThree\|SixteenIsToNine\|OneIsToOne\|TwentyOneIsToNine" app/ components/ --include="*.tsx" --include="*.ts"
```

2. Run the build:
```bash
npm run build
```

**VALIDATE:** Zero grep hits on deleted component names. Build succeeds.

---

## TESTING STRATEGY

### No automated tests (hackathon project — no test framework configured)

### Manual Validation Checklist

1. **Homepage** (`/`) — renders correctly, no missing components
2. **Sign in** (`/signin`) — OAuth buttons still work, no dead buttons
3. **Sign up** (`/signup`) — OAuth buttons still work, no dead buttons
4. **Dashboard** (`/dashboard`) — sidebar navigation works, all links lead to real pages
5. **UserDropdown** — shows real avatar or initials, not generic SVG
6. **Help page** (`/dashboard/help`) — FAQs display, no fake video tutorials, privacy link works
7. **Settings** (`/dashboard/settings`) — no billing tab, session card is clean
8. **Community** (`/dashboard/community`) — single clean card, no fake tabs
9. **Profile** (`/dashboard/profile`) — still works (was not modified)
10. **Invite** (`/dashboard/invite`) — still works (was not modified)

---

## VALIDATION COMMANDS

### Level 1: Dead Import Check
```bash
grep -rn "dashboard-layout\|SignUpForm\|SignInForm\|UserMetaCard\|BasicTableOne\|VideosExample\|ModalExample\|home/Footer\|home/Pricing\|SocialProof\|ForExperiencedFounders" app/ components/ --include="*.tsx" --include="*.ts"
```
Expected: Zero results

### Level 2: Build
```bash
npm run build
```
Expected: Build succeeds (TS errors ignored via `ignoreBuildErrors: true`, so focus on runtime errors)

### Level 3: Dev Server Smoke Test
```bash
npm run dev
```
Visit key pages manually per the checklist above.

---

## ACCEPTANCE CRITERIA

- [ ] All ~35 unused template components deleted
- [ ] Old `components/dashboard-layout/` directory deleted
- [ ] 4 unused homepage components deleted (home/Footer, Pricing, SocialProof, ForExperiencedFounders)
- [ ] UserDropdown shows real avatar or initials (not `owner.svg`)
- [ ] Help page has no fake video tutorials or mock view counts
- [ ] Help page privacy link points to `/privacy` (not `href="#"`)
- [ ] Settings page has no billing tab with fake pricing
- [ ] Settings session card has clean message (not "coming soon")
- [ ] Community page has single clean placeholder card (not fake tabs)
- [ ] Stock images (`user-02.jpg`, `user-02.svg`) deleted
- [ ] Zero dead imports referencing deleted files
- [ ] Build succeeds
- [ ] **NO functional features were removed** (OAuth, Terms, Privacy, Footer links, etc.)

---

## COMPLETION CHECKLIST

- [ ] All tasks (1-10) completed in order
- [ ] Each task validation passed
- [ ] Dead import grep returns zero results
- [ ] `npm run build` succeeds
- [ ] Manual smoke test of key pages passes
- [ ] All acceptance criteria met

---

## NOTES

### What we're NOT doing (intentional exclusions):

1. **"Coming Soon" platform launch gates** in `submit-feedback/page.tsx` and `request-feedback/new/page.tsx` — these are intentional feature gates for pre-launch, not placeholder content.

2. **Help page FAQs** — these are real, PeerPull-specific content (not mock data). Keep them.

3. **Settings page 2FA "Setup" button** — this is a reasonable UI element for a future feature, not fake data. Keep it.

4. **Font Size selector in appearance tab** — this is a UI element that could be wired up later. It's not fake data. Keep it.

5. **`components/form/` base components** (Form.tsx, Label.tsx, Select.tsx, etc.) — these ARE used by active code. Only the `form-elements/` showcase components are unused.

6. **`components/shared/ThemeDebug.tsx`** — dev tool, harmless to keep.

7. **Old `components/public/home/` components that ARE rendered** (Hero, Problem, HowItWorks, FAQ, CTASection, WhyNow, UseCases, JoinWaitlist, Comparison, Solution) — DO NOT DELETE.

### Confidence Score: 9/10

High confidence because:
- All deletions are verified unused (zero imports from active code)
- Modifications are minimal and well-scoped
- The only risk is missing an import reference, which the grep + build validation catches
- The UserDropdown fix follows an established pattern (avatar_url + referrerPolicy)
