# Feature: Session 2 — UI Cleanup & Onboarding Redesign (GH #8 + #7)

The following plan should be complete, but validate documentation and codebase patterns before implementing.

Pay special attention to naming of existing utils, types, and models. Import from the right files.

## Feature Description

Two related cleanup efforts before PeerPull can be shared publicly:

1. **GH #8 — Remove all placeholder, dummy, and non-functional content.** The codebase has accumulated starter-kit boilerplate (unused components, dead links, hardcoded dummy data, mock content). Everything fake must be deleted or replaced with real data.

2. **GH #7 — Redesign the onboarding page.** The current 3-step onboarding flow looks generic. It needs the PeerPull logo, brand-voice copy, and visual polish to match the dark/gold theme of the rest of the app.

## User Story

As a new user signing up for PeerPull,
I want a polished onboarding experience with no broken/fake content,
So that I trust the platform and understand its value immediately.

## Problem Statement

The codebase ships dead OAuth buttons, lorem ipsum modals, hardcoded dummy names, fake video tutorials, `href="#"` dead links, and a generic-looking onboarding wizard. Sharing PeerPull publicly in this state would undermine credibility.

## Solution Statement

Delete all unused boilerplate components (~30 files), fix placeholder content in the 4 live files that have issues, and redesign the onboarding flow with proper branding, improved copy, and visual polish.

## Feature Metadata

**Feature Type**: Cleanup + Enhancement
**Estimated Complexity**: Medium
**Primary Systems Affected**: Auth components, public footer, help page, user dropdown, onboarding flow, dashboard-layout dead code
**Dependencies**: None — purely frontend changes with no DB/migration work

---

## CONTEXT REFERENCES

### Relevant Codebase Files — YOU MUST READ THESE BEFORE IMPLEMENTING

| File | Why |
|------|-----|
| `components/header/UserDropdown.tsx` (line 37) | Placeholder avatar `owner.svg` — needs real avatar from `profile.avatar_url` |
| `components/header/UserDropdown.tsx` (lines 110, 135) | Menu items pointing to wrong routes |
| `components/public/layout/Footer.tsx` (lines 24-33) | 3 dead `href="#"` links — the LIVE footer |
| `app/(protected)/dashboard/help/page.tsx` (full file) | Entire page is mock data — needs realistic simplification |
| `components/protected/dashboard/OnboardingFlow.tsx` (full file, 248 lines) | Onboarding redesign target |
| `app/(protected)/dashboard/onboarding/page.tsx` (23 lines) | Page wrapper — may need background treatment |
| `components/public/home/Hero.tsx` | Brand voice reference — punchy, direct, founder-to-founder |
| `app/globals.css` | Hero glow animations for reference; onboarding has none currently |
| `utils/supabase/profiles.ts` (line 9) | `Profile` type has `avatar_url: string | null` |

### Files/Directories to DELETE (confirmed unused — zero imports)

| Path | Reason |
|------|--------|
| `components/auth/SignUpForm.tsx` | Orphaned template — actual signup is inline in page.tsx |
| `components/auth/SignInForm.tsx` | Orphaned template — actual signin is inline in page.tsx |
| `components/public/home/Footer.tsx` | Superseded by `components/public/layout/Footer.tsx` |
| `components/user-profile/UserMetaCard.tsx` | Hardcoded dummy data, never imported |
| `components/user-profile/UserInfoCard.tsx` | Hardcoded dummy data, never imported |
| `components/user-profile/UserAddressCard.tsx` | Hardcoded dummy data, never imported |
| `components/tables/BasicTableOne.tsx` | Fake user table, never imported |
| `components/example/` (entire directory, 5 files) | Lorem ipsum modal demos |
| `components/form/form-elements/` (entire directory, 10 files) | Form showcase boilerplate |
| `components/ui/video/VideosExample.tsx` | Rickroll embeds |
| `components/videos/` (entire directory, 4 files) | More rickroll embeds |
| `components/dashboard-layout/` (entire directory, 5 files) | Dead duplicate of `protected/dashboard/layout/` |
| `public/images/user/user-02.jpg` | Unreferenced stock photo |
| `public/images/user/user-02.svg` | Unreferenced stock illustration |

**Note:** `public/images/user/owner.svg` — keep for now as fallback, but stop using it as the default avatar in UserDropdown after the fix.

### New Files to Create

None — all changes are edits to existing files or deletions.

### Patterns to Follow

**Dark theme tokens** (from `tailwind.config.ts`):
- `dark-bg` (#0a0a0b), `dark-card` (#141416), `dark-surface` (#1c1c1f)
- `dark-border` (#27272a), `dark-text` (#fafafa), `dark-text-muted` (#71717a)
- `blue-primary` (#d4a853 — warm gold), `teal-accent` (#e8c778 — lighter gold)
- `primary` = same gold (#d4a853), `primary-muted` (#b8912e for hover)

**Brand voice** (from Hero.tsx):
- Punchy, direct, founder-to-founder
- Short sentences, active verbs
- "Real Feedback From Real Builders", "Give a review, get a review"

**Component patterns:**
- Server Components by default, `"use client"` only when needed
- Lucide React for icons (already used everywhere)
- `cn()` from `@/lib/utils` for conditional classes
- shadcn/ui components from `@/components/ui/`

---

## IMPLEMENTATION PLAN

### Phase 1: Delete Unused Files (~30 files)

Mass deletion of confirmed-unused boilerplate. No code changes needed — just `git rm`.

### Phase 2: Fix Live Files with Placeholder Content (4 files)

1. **UserDropdown** — Show real avatar, fix menu item hrefs
2. **Public Footer** — Remove dead links, simplify
3. **Help Page** — Strip fake content, create honest minimal page

### Phase 3: Onboarding Redesign (2 files)

Redesign `OnboardingFlow.tsx` with logo, brand copy, and visual polish. Minor wrapper update in the page file.

---

## STEP-BY-STEP TASKS

### Task 1: DELETE all unused boilerplate files

**ACTION:** Remove ~30 files confirmed as unused.

```bash
# Auth form templates (unused — actual forms are inline in page.tsx)
git rm components/auth/SignUpForm.tsx
git rm components/auth/SignInForm.tsx

# Duplicate/superseded footer
git rm components/public/home/Footer.tsx

# User profile templates with hardcoded dummy data
git rm components/user-profile/UserMetaCard.tsx
git rm components/user-profile/UserInfoCard.tsx
git rm components/user-profile/UserAddressCard.tsx

# Fake data table
git rm components/tables/BasicTableOne.tsx

# Example modal directory (5 files)
git rm -r components/example/

# Form element showcase directory (10 files)
git rm -r components/form/form-elements/

# Video boilerplate
git rm components/ui/video/VideosExample.tsx
git rm -r components/videos/

# Dead dashboard-layout duplicate (5 files)
git rm -r components/dashboard-layout/

# Unreferenced stock images
git rm public/images/user/user-02.jpg
git rm public/images/user/user-02.svg
```

**VALIDATE:** `npm run build` — should pass with no import errors. If any deletion breaks an import, that file was actually used and needs investigation.

**GOTCHA:** Some of these directories may contain an index.ts barrel file that re-exports. Check before deleting if `git rm -r` shows unexpected files. The audit confirmed none of these are imported, but build verification is the safety net.

---

### Task 2: UPDATE `components/header/UserDropdown.tsx` — Fix avatar + menu links

**PATTERN:** `utils/supabase/profiles.ts` — Profile type has `avatar_url: string | null`

**Changes:**

1. **Line 37** — Replace hardcoded `owner.svg` with the user's real avatar, falling back to initials:

Replace the `<Image>` tag (lines 33-39) with:
```tsx
{profile?.avatar_url ? (
  <Image
    width={44}
    height={44}
    src={profile.avatar_url}
    alt="User"
    className="rounded-full object-cover"
  />
) : (
  <span className="flex h-full w-full items-center justify-center rounded-full bg-primary/20 text-sm font-medium text-primary">
    {(profile?.first_name?.[0] || user?.email?.[0] || "U").toUpperCase()}
  </span>
)}
```

2. **Line 110** — Change `href="/profile"` to `href="/dashboard/settings"` for "Account settings"

3. **Line 135** — Change `href="/profile"` to `href="/dashboard/help"` for "Support"

**VALIDATE:** `npm run build` passes. Visually: avatar should show initials for users without an uploaded avatar, and the dropdown menu items should navigate to correct pages.

---

### Task 3: UPDATE `components/public/layout/Footer.tsx` — Remove dead links

**Current state:** Three `<Link href="#">` elements for Terms, Privacy, Contact (lines 24-33).

**Change:** Remove the dead links entirely. Keep the left side (logo + copyright). Replace the right side with a simple email contact link:

```tsx
<div className="flex flex-wrap justify-center gap-6 md:gap-8">
  <a href="mailto:support@peerpull.com" className="text-sm text-dark-text-muted hover:text-dark-text transition-colors duration-200">
    support@peerpull.com
  </a>
</div>
```

**RATIONALE:** No Terms/Privacy pages exist. Shipping dead links is worse than omitting them. A mailto link provides a real contact channel.

**IMPORTS:** Remove the `Link` import from `next/link` since it's no longer needed.

**VALIDATE:** `npm run build`. Visual check: footer should show just the logo/copyright on the left and the email on the right.

---

### Task 4: UPDATE `app/(protected)/dashboard/help/page.tsx` — Replace mock content with honest minimal page

**Current state:** 373 lines of mock data — fake FAQs, fake video tutorials with fake view counts, non-functional contact form, non-functional "Start Chat" button.

**Change:** Rewrite as a simple, honest help page with:
- Keep the FAQs tab with the existing 5 FAQ entries (they're actually well-written PeerPull-specific content, not lorem ipsum — just remove the `// Mock data` comment)
- **Remove** the "Popular Topics" section (all links are non-functional `cursor-pointer` spans)
- **Remove** the Guides & Tutorials tab entirely (fake video thumbnails, fake view counts, non-functional "Read More" buttons)
- **Simplify** the Contact Support tab:
  - Keep the email support card with a real `mailto:support@peerpull.com` link
  - Remove the "Live Chat" card (no chat system exists)
  - Remove the full contact form (no server action handles it)
  - Remove the privacy policy `href="#"` link
- Change from 3-tab layout to 2-tab layout: "FAQs" and "Contact"

**IMPORTS:** Remove unused imports: `FileText`, `BookOpen`, `Video`, `ArrowRight`, `Textarea`, `CheckCircle2`. Keep: `Search`, `HelpCircle`, `MessageSquare`, `Mail`.

**VALIDATE:** `npm run build`. Navigate to `/dashboard/help` — FAQs should work, Contact should show just an email card.

---

### Task 5: UPDATE `components/protected/dashboard/OnboardingFlow.tsx` — Redesign

**Current state:** Generic 3-step wizard (248 lines) with Lucide icons as heroes, bland copy, no logo, no brand personality.

**Changes to Step 0 (Welcome):**

1. Replace the `Sparkles` icon hero with the PeerPull logo:
```tsx
import Image from "next/image";

{/* Replace the Sparkles circle with: */}
<Image
  src="/images/logo/logo-dark.svg"
  alt="PeerPull"
  width={64}
  height={64}
  className="mx-auto"
/>
```

2. Update the headline and description to match brand voice:
```tsx
<h1 className="font-montserrat text-2xl font-bold text-dark-text">
  Welcome to PeerPull{profile.first_name ? `, ${profile.first_name}` : ""}
</h1>
<p className="mt-3 text-dark-text-muted max-w-md mx-auto">
  Give a video review, get a video review. Real feedback from founders who get it.
</p>
```

3. Refresh the 3 feature cards with more specific, compelling copy:
   - Card 1: "Record a video review" / "Walk through another founder's product and share what you honestly think — 2-5 minutes."
   - Card 2: "Earn PeerPoints" / "Every review you give earns credits. Better reviews earn a higher quality score."
   - Card 3: "Get feedback on yours" / "Spend your points to put your product in front of other builders."

4. CTA button text: change from "Let's Get Started" to "Submit Your Project" (more direct).

**Changes to Step 1 (Submit Your Project):**

Minimal changes — the form works well functionally:
- Add a subtle helper text under the URL field: `<p className="text-xs text-dark-text-muted mt-1">Where reviewers will go to try your product</p>`

**Changes to Step 2 (Waitlist Confirmation):**

1. Replace `CheckCircle2` hero with the logo again (consistency).
2. Update headline to be more exciting:
```tsx
<h2 className="font-montserrat text-2xl font-bold text-dark-text">
  You&apos;re in.
</h2>
<p className="mt-3 text-dark-text-muted max-w-md mx-auto">
  Your project is queued for reviews. We&apos;ll notify you when PeerPull goes live
  and the feedback starts rolling in.
</p>
```
3. Update the "while you wait" list:
   - "Complete your profile" (not "Edit your profile and add more details")
   - "Share your referral link — earn 3 bonus PeerPoints per signup"
   - "You already have 5 PeerPoints to start with"

**IMPORTS:** Add `Image` from `next/image`. Remove `Sparkles` from lucide imports.

**VALIDATE:** `npm run build`. Navigate to `/dashboard/onboarding` (requires a user in `onboarding` status). All 3 steps should render correctly with the new copy and logo.

---

### Task 6: UPDATE `app/(protected)/dashboard/onboarding/page.tsx` — Minor wrapper enhancement

**Current state:** Simple centered flex wrapper (23 lines).

**Change:** Make the wrapper full-height to center better:

```tsx
<div className="flex min-h-[80vh] items-center justify-center py-8 px-4">
  <OnboardingFlow profile={profile} />
</div>
```

Just bumps `min-h-[60vh]` to `min-h-[80vh]` and adds `px-4` for mobile padding.

**VALIDATE:** `npm run build`.

---

## TESTING STRATEGY

### No automated tests (hackathon project — no test framework configured)

### Manual Validation

1. **Build check:** `npm run build` must pass after every task
2. **Dead import check:** After Task 1 deletions, grep for any broken imports:
   ```bash
   # These should return zero results after cleanup:
   grep -r "SignUpForm\|SignInForm" app/ components/ --include="*.tsx" --include="*.ts"
   grep -r "UserMetaCard\|UserInfoCard\|UserAddressCard" app/ components/ --include="*.tsx" --include="*.ts"
   grep -r "BasicTableOne" app/ components/ --include="*.tsx" --include="*.ts"
   grep -r "dashboard-layout" app/ components/ --include="*.tsx" --include="*.ts"
   grep -r "VideosExample" app/ components/ --include="*.tsx" --include="*.ts"
   ```
3. **Visual check (dev server):**
   - Public footer: no dead links, shows email
   - UserDropdown: shows initials (or avatar if user has one), menu items navigate correctly
   - Help page: FAQs work, Contact shows email card only, no fake video tutorials
   - Onboarding: logo visible, brand-voice copy, all 3 steps functional

---

## VALIDATION COMMANDS

### Level 1: Build

```bash
npm run build
```

### Level 2: Dead Import Scan

```bash
grep -rn "from.*dashboard-layout\|from.*SignUpForm\|from.*SignInForm\|from.*UserMetaCard\|from.*BasicTableOne\|from.*VideosExample\|from.*form-elements\|from.*ModalExample\|from.*components/videos" app/ components/ --include="*.tsx" --include="*.ts"
```

Should return zero results.

### Level 3: Remaining Placeholder Scan

```bash
grep -rn 'href="#"' app/ components/ --include="*.tsx" --include="*.ts"
grep -rn "lorem\|Lorem" app/ components/ --include="*.tsx" --include="*.ts"
grep -rn "owner\.svg" app/ components/ --include="*.tsx" --include="*.ts"
grep -rn "Mock data\|mock data" app/ components/ --include="*.tsx" --include="*.ts"
```

All should return zero results after cleanup.

### Level 4: Manual Validation

- Visit `/` — footer has email link, no dead links
- Visit `/dashboard/help` — FAQs accordion works, Contact tab shows email card
- Click user dropdown — avatar shows initials, "Account settings" goes to `/dashboard/settings`, "Support" goes to `/dashboard/help`
- Sign up a new user → onboarding page shows logo, brand copy, all 3 steps work

---

## ACCEPTANCE CRITERIA

- [ ] All ~30 unused boilerplate files deleted
- [ ] `npm run build` passes
- [ ] Zero `href="#"` dead links remain in the codebase
- [ ] Zero `lorem` / `Mock data` references remain
- [ ] UserDropdown shows real avatar or initials (not `owner.svg`)
- [ ] UserDropdown menu items link to correct pages
- [ ] Public footer has no dead links
- [ ] Help page has no fake video tutorials or non-functional forms
- [ ] Onboarding shows PeerPull logo on steps 0 and 2
- [ ] Onboarding copy matches brand voice (direct, founder-to-founder)
- [ ] All 3 onboarding steps render and function correctly

---

## COMPLETION CHECKLIST

- [ ] Task 1: Boilerplate deletion complete
- [ ] Task 2: UserDropdown avatar + links fixed
- [ ] Task 3: Footer dead links removed
- [ ] Task 4: Help page simplified
- [ ] Task 5: Onboarding redesigned
- [ ] Task 6: Onboarding page wrapper updated
- [ ] All validation commands pass
- [ ] `npm run build` succeeds
- [ ] No dead imports remaining

---

## NOTES

- **Scope boundary:** The OAuth buttons on the actual signin/signup pages (`OAuthButtons.tsx`) are NOT removed — those are real Supabase OAuth implementations (just need provider config). The orphaned `SignUpForm.tsx` and `SignInForm.tsx` with fake buttons ARE deleted since they're never rendered.
- **Help page approach:** We keep the FAQs because they're actually good PeerPull-specific content. We only remove the clearly fake parts (video tutorials with fake stats, non-functional chat/form).
- **Onboarding is functional:** We're only changing presentation — the `submitOnboardingProject` server action, the profile status transitions, and the form submission logic stay exactly the same.
- **No new components:** Everything is edits to existing files or deletions. No new files created.
- **`owner.svg` kept on disk** as fallback but no longer referenced in code after the UserDropdown fix. Can be deleted in a future cleanup pass.
