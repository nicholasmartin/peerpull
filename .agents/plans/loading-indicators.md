# Feature: Consistent Loading Indicators (GH #15)

The following plan should be complete, but its important that you validate documentation and codebase patterns and task sanity before you start implementing.

Pay special attention to naming of existing utils types and models. Import from the right files etc.

## Feature Description

Add a layered loading feedback system across the entire PeerPull app: a top-of-page navigation progress bar, skeleton loading pages for all dashboard routes, a shared Spinner component, fixed SubmitButton disabled state, standardized button loading patterns, and clickable card/link feedback.

## User Story

As a PeerPull user
I want to see immediate visual feedback when I click links, submit forms, or trigger actions
So that I know the app is responding and don't double-click or feel confused by silent loading

## Problem Statement

The app has no visible loading feedback for route navigation and inconsistent loading states across interactive elements. SubmitButton uses `aria-disabled` but not `disabled`, there are no `loading.tsx` skeleton pages, no Suspense boundaries with meaningful fallbacks, and each component reimplements its own loading pattern differently (text-only "Submitting...", manual useState, etc.).

## Solution Statement

Implement a 6-layer loading feedback system:
1. **Route navigation progress bar** — thin gold bar at top of viewport on every client-side navigation
2. **Skeleton loading pages** — `loading.tsx` files for all dashboard routes with animate-pulse placeholders
3. **Shared Spinner component** — extracted from OAuthButtons, reusable across all buttons
4. **SubmitButton fix** — add `disabled={pending}` + Spinner
5. **Standardized button loading** — all action buttons use Spinner + disabled pattern
6. **Clickable card feedback** — subtle loading state on dashboard navigation cards

## Feature Metadata

**Feature Type**: Enhancement
**Estimated Complexity**: Medium
**Primary Systems Affected**: Root layout, all dashboard pages, all interactive button components
**Dependencies**: `next-nprogress-bar` package (or custom progress bar)

---

## CONTEXT REFERENCES

### Relevant Codebase Files IMPORTANT: YOU MUST READ THESE FILES BEFORE IMPLEMENTING!

- `app/layout.tsx` (lines 1-56) — Why: Root layout where progress bar provider must be added
- `components/submit-button.tsx` (lines 1-23) — Why: SubmitButton with broken disabled state — must fix
- `components/auth/OAuthButtons.tsx` (lines 106-109) — Why: Existing spinner SVG to extract into shared component
- `components/ui/button.tsx` (lines 1-56) — Why: Base Button component, already has `disabled:opacity-50 disabled:pointer-events-none`
- `components/protected/dashboard/EditProfileForm.tsx` (lines 310-321) — Why: Uses useTransition + text-only loading, needs Spinner
- `components/protected/dashboard/OnboardingFlow.tsx` (lines 187-194) — Why: Uses useTransition + text-only loading, needs Spinner
- `app/(protected)/dashboard/submit-feedback/get-next-review-button.tsx` (lines 37-43) — Why: Uses useTransition + text-only loading, needs Spinner
- `app/(protected)/dashboard/request-feedback/[id]/review-actions.tsx` (lines 37-56) — Why: Uses useState loading + no spinner on Approve/Reject buttons
- `app/(protected)/dashboard/admin/users/page.tsx` (lines 141-147, 159-174, 231-248) — Why: Multiple action buttons with text-only loading
- `app/(protected)/dashboard/submit-feedback/[id]/review/review-session.tsx` (line 45) — Why: Uses useState `submitting` — needs Spinner on submit
- `app/(protected)/dashboard/page.tsx` (lines 109-126) — Why: Quick action Link cards that need click feedback
- `app/(protected)/dashboard/layout.tsx` (lines 1-43) — Why: Dashboard layout with Suspense, wraps all pages
- `components/protected/dashboard/layout/DashboardShell.tsx` (lines 1-30) — Why: Dashboard shell component
- `app/(protected)/dashboard/settings/page.tsx` (line 1) — Why: Client component, will need loading.tsx even though data fetches client-side
- `components.json` — Why: shadcn/ui config, `rsc: true`, style: "default"
- `lib/utils.ts` — Why: `cn()` utility for conditional classes

### New Files to Create

- `components/ui/spinner.tsx` — Shared animated spinner component with size variants
- `components/ui/skeleton.tsx` — shadcn/ui Skeleton primitive (animate-pulse block)
- `app/(protected)/dashboard/loading.tsx` — Dashboard home skeleton
- `app/(protected)/dashboard/request-feedback/loading.tsx` — Request feedback skeleton
- `app/(protected)/dashboard/submit-feedback/loading.tsx` — Submit feedback skeleton
- `app/(protected)/dashboard/peerpoints/loading.tsx` — PeerPoints skeleton
- `app/(protected)/dashboard/profile/loading.tsx` — Profile skeleton
- `app/(protected)/dashboard/admin/loading.tsx` — Admin skeleton
- `app/(protected)/dashboard/settings/loading.tsx` — Settings skeleton
- `app/(protected)/dashboard/community/loading.tsx` — Community skeleton
- `app/(protected)/dashboard/help/loading.tsx` — Help skeleton
- `components/ui/progress-bar.tsx` — Client-side navigation progress bar wrapper

### Relevant Documentation YOU SHOULD READ THESE BEFORE IMPLEMENTING!

- [Next.js Loading UI & Streaming](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming)
  - Specific section: loading.tsx convention
  - Why: Official pattern for skeleton loading in App Router
- [shadcn/ui Skeleton component](https://ui.shadcn.com/docs/components/skeleton)
  - Why: Standard skeleton primitive to install via shadcn CLI
- [next-nprogress-bar npm](https://www.npmjs.com/package/next-nprogress-bar)
  - Why: Progress bar library for App Router navigation (evaluate compatibility)

### Patterns to Follow

**Spinner SVG Pattern** (extracted from `OAuthButtons.tsx:106-109`):
```tsx
<svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
</svg>
```

**Button Loading Pattern** (standardize everywhere):
```tsx
<Button disabled={isPending}>
  {isPending && <Spinner size="sm" />}
  {isPending ? pendingText : children}
</Button>
```

**Skeleton Pattern** (use Tailwind animate-pulse on dark-surface blocks):
```tsx
<div className="animate-pulse space-y-4">
  <div className="h-4 w-1/3 rounded bg-dark-surface" />
  <div className="h-10 w-full rounded bg-dark-surface" />
</div>
```

**Dark Theme Colors for Skeletons:**
- Background: `bg-dark-surface` (already used across codebase)
- Card borders: `border-dark-border`
- Card backgrounds: `bg-dark-card`
- Animation: `animate-pulse` (built into Tailwind)

**Naming Conventions:**
- Component files: PascalCase (e.g., `Spinner.tsx`) but shadcn/ui components use kebab-case filenames (e.g., `spinner.tsx`)
- Loading files: `loading.tsx` (Next.js convention)
- Exports: named exports for reusable components, default exports for pages

---

## IMPLEMENTATION PLAN

### Phase 1: Foundation — Spinner + Skeleton Primitives

Create the two base UI primitives that everything else depends on.

**Tasks:**
- Install shadcn/ui Skeleton component (or create manually since shadcn CLI may not be available)
- Create shared Spinner component with size variants (sm, md, lg)

### Phase 2: Progress Bar — Route Navigation Feedback

Add a top-of-page progress bar for all client-side navigations.

**Tasks:**
- Evaluate `next-nprogress-bar` compatibility with Next.js 15 + React 19
- If compatible: install and add to root layout
- If not: implement a lightweight custom progress bar using `useTransition` or Next.js router events
- Must NOT convert root layout to client component (would break server component architecture)

### Phase 3: Fix SubmitButton + Standardize Button Loading

Fix the core SubmitButton component and update all interactive buttons.

**Tasks:**
- Fix SubmitButton: add `disabled={pending}` + Spinner
- Update all useTransition buttons with Spinner
- Update all useState loading buttons with Spinner

### Phase 4: Skeleton Loading Pages

Create `loading.tsx` files for every dashboard route.

**Tasks:**
- Create skeleton pages matching each route's layout structure
- Use animate-pulse blocks matching the card/table/grid shapes on each page

### Phase 5: Clickable Card Feedback

Add loading feedback to dashboard navigation cards.

**Tasks:**
- Add click feedback to Quick Action cards on dashboard homepage

---

## STEP-BY-STEP TASKS

IMPORTANT: Execute every task in order, top to bottom. Each task is atomic and independently testable.

### Task 1: CREATE `components/ui/skeleton.tsx`

- **IMPLEMENT**: Create the shadcn/ui Skeleton primitive. This is a simple `div` with `animate-pulse rounded-md bg-dark-surface` styling and className merge support.
- **PATTERN**: Follow shadcn/ui component pattern — named export, use `cn()` from `@/lib/utils`
- **IMPORTS**: `import { cn } from "@/lib/utils"`
- **IMPLEMENTATION**:
```tsx
import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-dark-surface", className)}
      {...props}
    />
  )
}

export { Skeleton }
```
- **VALIDATE**: `npx tsc --noEmit components/ui/skeleton.tsx` or verify no import errors in IDE

### Task 2: CREATE `components/ui/spinner.tsx`

- **IMPLEMENT**: Extract the animated SVG spinner from `OAuthButtons.tsx:106-109` into a shared component with size variants.
- **PATTERN**: Mirror OAuthButtons spinner SVG, use `cn()` for className merging
- **IMPORTS**: `import { cn } from "@/lib/utils"`
- **SIZES**: `sm` = `h-4 w-4`, `md` = `h-5 w-5`, `lg` = `h-8 w-8`
- **IMPLEMENTATION**:
```tsx
import { cn } from "@/lib/utils"

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-8 w-8",
} as const

export function Spinner({
  size = "md",
  className,
}: {
  size?: keyof typeof sizeClasses
  className?: string
}) {
  return (
    <svg
      className={cn("animate-spin", sizeClasses[size], className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}
```
- **VALIDATE**: Import in a test file or check for TS errors

### Task 3: UPDATE `components/submit-button.tsx` — Fix disabled + add Spinner

- **IMPLEMENT**: Add `disabled={pending}` (not just aria-disabled) and show Spinner when pending
- **IMPORTS**: Add `import { Spinner } from "@/components/ui/spinner"`
- **CHANGE**:
  - Line 19: Change `<Button type="submit" aria-disabled={pending} {...props}>` to `<Button type="submit" disabled={pending} aria-disabled={pending} {...props}>`
  - Line 20: Change `{pending ? pendingText : children}` to `{pending ? <><Spinner size="sm" />{pendingText}</> : children}`
- **GOTCHA**: Keep `aria-disabled` for accessibility alongside `disabled` for actual form prevention. The Button component already has `disabled:pointer-events-none disabled:opacity-50` styles.
- **VALIDATE**: `npm run build` — SubmitButton is used across auth pages (signin, signup, forgot-password, reset-password)

### Task 4: UPDATE `components/auth/OAuthButtons.tsx` — Use shared Spinner

- **IMPLEMENT**: Replace inline spinner SVG with shared Spinner component
- **IMPORTS**: Add `import { Spinner } from "@/components/ui/spinner"`
- **CHANGE**: Replace lines 106-109 (the inline SVG) with `<Spinner size="md" className="text-dark-text-muted" />`
- **VALIDATE**: Visual check — OAuth buttons should show same spinner as before

### Task 5: UPDATE `components/protected/dashboard/EditProfileForm.tsx` — Add Spinner to Save button

- **IMPLEMENT**: Add Spinner to the Save Changes button when `isPending`
- **IMPORTS**: Add `import { Spinner } from "@/components/ui/spinner"`
- **CHANGE**: Lines 314-319 — Update Save button:
  ```tsx
  <Button
    className="bg-primary hover:bg-primary-muted"
    onClick={handleSaveProfile}
    disabled={isPending}
  >
    {isPending && <Spinner size="sm" />}
    {isPending ? "Saving..." : "Save Changes"}
  </Button>
  ```
- **VALIDATE**: Navigate to /dashboard/profile, edit profile, click Save — should show spinner

### Task 6: UPDATE `components/protected/dashboard/OnboardingFlow.tsx` — Add Spinner to Submit button

- **IMPLEMENT**: Add Spinner to the "Submit Project" button on step 2 when `isPending`
- **IMPORTS**: Add `import { Spinner } from "@/components/ui/spinner"`
- **CHANGE**: Lines 187-194 — Update submit button:
  ```tsx
  <button
    onClick={handleSubmitProject}
    disabled={isPending}
    className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-primary-muted disabled:opacity-50 transition"
  >
    {isPending && <Spinner size="sm" />}
    {isPending ? "Submitting..." : "Submit Project"}
    {!isPending && <ArrowRight className="h-4 w-4" />}
  </button>
  ```
- **VALIDATE**: Navigate to /dashboard/onboarding, fill form, submit — should show spinner

### Task 7: UPDATE `app/(protected)/dashboard/submit-feedback/get-next-review-button.tsx` — Add Spinner

- **IMPLEMENT**: Add Spinner to the "Get Next Review" button
- **IMPORTS**: Add `import { Spinner } from "@/components/ui/spinner"`
- **CHANGE**: Lines 37-43 — Update Button:
  ```tsx
  <Button
    className="bg-primary hover:bg-primary-muted px-8 py-3 text-base"
    onClick={handleClick}
    disabled={isPending}
  >
    {isPending && <Spinner size="sm" />}
    {isPending ? "Finding a project..." : "Get Next Review"}
  </Button>
  ```
- **VALIDATE**: Navigate to /dashboard/submit-feedback, click Get Next Review — should show spinner

### Task 8: UPDATE `app/(protected)/dashboard/request-feedback/[id]/review-actions.tsx` — Add Spinner to Approve/Reject

- **IMPLEMENT**: Add Spinner to Approve and Reject buttons
- **IMPORTS**: Add `import { Spinner } from "@/components/ui/spinner"`
- **CHANGE**: Update both buttons to show Spinner when `loading`:
  ```tsx
  <Button
    onClick={handleApprove}
    disabled={loading}
    className="bg-green-600 hover:bg-green-700 text-white"
  >
    {loading && <Spinner size="sm" />}
    Approve
  </Button>
  <Button
    onClick={handleReject}
    disabled={loading}
    variant="outline"
    className="text-red-400 border-red-500/20 hover:bg-red-500/10 hover:text-red-300"
  >
    {loading && <Spinner size="sm" />}
    Reject
  </Button>
  ```
- **GOTCHA**: Both buttons share the same `loading` state, so both will show spinners simultaneously. This is acceptable since only one action can be in progress.
- **VALIDATE**: Navigate to a feedback request with a pending review, click Approve/Reject

### Task 9: UPDATE `app/(protected)/dashboard/admin/users/page.tsx` — Add Spinners to admin action buttons

- **IMPLEMENT**: Add Spinner to "Inject Points" button, "Activate All Waitlisted" button, and individual "Activate" buttons
- **IMPORTS**: Add `import { Spinner } from "@/components/ui/spinner"`
- **CHANGES**:
  1. Line 144 (Inject Points button): Add `{submitting && <Spinner size="sm" />}` before text
  2. Line 172 (Activate All button): Add `{activating === "all" && <Spinner size="sm" />}` before text
  3. Line 244 (Individual Activate buttons): Add `{activating === u.id && <Spinner size="sm" />}` before text
- **VALIDATE**: Navigate to /dashboard/admin/users — verify spinners appear on actions

### Task 10: UPDATE `app/(protected)/dashboard/submit-feedback/[id]/review/review-session.tsx` — Add Spinner to submit

- **IMPLEMENT**: Add Spinner to the review submit button
- **IMPORTS**: Add `import { Spinner } from "@/components/ui/spinner"`
- **CHANGE**: Find the submit button (search for `submitting` state usage) and add Spinner:
  ```tsx
  {submitting && <Spinner size="sm" />}
  ```
- **GOTCHA**: Must read the full file first to find the exact submit button location
- **VALIDATE**: Navigate to a review session, complete recording, click submit

### Task 11: CREATE `components/ui/progress-bar.tsx` — Navigation progress bar

- **IMPLEMENT**: Create a client-side navigation progress bar component. Two approaches (choose based on compatibility):

  **Option A — next-nprogress-bar (if compatible with Next.js 15 + React 19):**
  ```bash
  npm install next-nprogress-bar
  ```
  ```tsx
  "use client";
  import { AppProgressBar } from "next-nprogress-bar";

  export function NavigationProgressBar() {
    return (
      <AppProgressBar
        height="2px"
        color="#d4a853"
        options={{ showSpinner: false }}
        shallowRouting
      />
    );
  }
  ```

  **Option B — Custom implementation (fallback if library has issues):**
  Use Next.js router events via a custom hook that listens to route changes. Create a thin gold bar with CSS animation.
  ```tsx
  "use client";
  import { useEffect, useState } from "react";
  import { usePathname, useSearchParams } from "next/navigation";

  export function NavigationProgressBar() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
      setLoading(false);
      setProgress(100);
      const timer = setTimeout(() => setProgress(0), 200);
      return () => clearTimeout(timer);
    }, [pathname, searchParams]);

    // Intercept link clicks to detect navigation start
    useEffect(() => {
      const handleClick = (e: MouseEvent) => {
        const link = (e.target as HTMLElement).closest("a");
        if (link && link.href && link.href.startsWith(window.location.origin) && !link.target) {
          setLoading(true);
          setProgress(30);
        }
      };
      document.addEventListener("click", handleClick);
      return () => document.removeEventListener("click", handleClick);
    }, []);

    if (!loading && progress === 0) return null;

    return (
      <div
        className="fixed top-0 left-0 h-0.5 bg-[#d4a853] z-[9999] transition-all duration-300 ease-out"
        style={{ width: `${progress}%`, opacity: progress === 100 ? 0 : 1 }}
      />
    );
  }
  ```

- **GOTCHA**: Must be wrapped in `Suspense` if using `useSearchParams()` (Next.js 15 requirement). Wrap the component in a Suspense boundary in the layout.
- **VALIDATE**: Click links in the sidebar — should see a thin gold bar at the top of the page

### Task 12: UPDATE `app/layout.tsx` — Add NavigationProgressBar

- **IMPLEMENT**: Import and render `NavigationProgressBar` in root layout
- **IMPORTS**: Add `import { NavigationProgressBar } from "@/components/ui/progress-bar"`; add `import { Suspense } from "react"`
- **CHANGE**: Add inside `<body>`, before `<SidebarProvider>`:
  ```tsx
  <Suspense fallback={null}>
    <NavigationProgressBar />
  </Suspense>
  ```
- **GOTCHA**: Root layout is a Server Component — the progress bar component is a Client Component ("use client"), which is fine since Server Components can render Client Components as children. Do NOT add "use client" to the root layout.
- **VALIDATE**: `npm run dev` — click any navigation link, verify gold progress bar appears at top

### Task 13: CREATE `app/(protected)/dashboard/loading.tsx` — Dashboard home skeleton

- **IMPLEMENT**: Skeleton matching the dashboard page structure:
  - Welcome banner skeleton (full width card)
  - 4x Quick Action card skeletons (grid)
  - 3x Stat card skeletons
  - Table skeleton (Feedback Requests)
  - Right column: PeerPoints widget + Available Reviews
- **PATTERN**: Use `Skeleton` from `@/components/ui/skeleton`, wrap in same grid layout as `page.tsx`
- **IMPLEMENTATION**:
```tsx
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-md border border-dark-border bg-dark-card p-6">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="mt-2 h-4 w-72" />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-md border border-dark-border bg-dark-card p-4 space-y-2">
            <Skeleton className="h-4 w-24 mx-auto" />
            <Skeleton className="h-3 w-32 mx-auto" />
          </div>
        ))}
      </div>

      {/* Stats + Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-md border border-dark-border bg-dark-card p-4 text-center space-y-2">
                <Skeleton className="h-8 w-12 mx-auto" />
                <Skeleton className="h-3 w-20 mx-auto" />
              </div>
            ))}
          </div>
          {/* Table */}
          <div className="rounded-md border border-dark-border bg-dark-card p-6 space-y-4">
            <Skeleton className="h-4 w-32" />
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div className="rounded-md border border-dark-border bg-dark-card p-6 space-y-4">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-16 w-16 rounded-full mx-auto" />
            <Skeleton className="h-4 w-36 mx-auto" />
          </div>
          <div className="rounded-md border border-dark-border bg-dark-card p-6 space-y-3">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-9 w-full rounded-md" />
          </div>
        </div>
      </div>
    </div>
  )
}
```
- **VALIDATE**: Navigate to /dashboard — skeleton should flash briefly before content loads

### Task 14: CREATE `app/(protected)/dashboard/request-feedback/loading.tsx`

- **IMPLEMENT**: Skeleton matching request-feedback page: header + tabs + table rows
```tsx
import { Skeleton } from "@/components/ui/skeleton"

export default function RequestFeedbackLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-10 w-36 rounded-md" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-9 w-40 rounded-md" />
        <Skeleton className="h-9 w-32 rounded-md" />
      </div>
      <div className="rounded-md border border-dark-border bg-dark-card">
        <div className="p-4 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    </div>
  )
}
```
- **VALIDATE**: Navigate to /dashboard/request-feedback

### Task 15: CREATE `app/(protected)/dashboard/submit-feedback/loading.tsx`

- **IMPLEMENT**: Skeleton matching submit-feedback page: header + tabs + info card + button
```tsx
import { Skeleton } from "@/components/ui/skeleton"

export default function SubmitFeedbackLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-7 w-40" />
      <div className="flex gap-2">
        <Skeleton className="h-9 w-32 rounded-md" />
        <Skeleton className="h-9 w-36 rounded-md" />
        <Skeleton className="h-9 w-32 rounded-md" />
      </div>
      <div className="rounded-md border border-dark-border bg-dark-card p-8 space-y-4">
        <Skeleton className="h-5 w-64 mx-auto" />
        <Skeleton className="h-4 w-96 mx-auto" />
        <div className="space-y-3 pt-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full max-w-md mx-auto" />
          ))}
        </div>
        <Skeleton className="h-12 w-48 rounded-md mx-auto mt-4" />
      </div>
    </div>
  )
}
```
- **VALIDATE**: Navigate to /dashboard/submit-feedback

### Task 16: CREATE `app/(protected)/dashboard/peerpoints/loading.tsx`

- **IMPLEMENT**: Skeleton matching peerpoints page: header + 3 stat cards + transaction table
```tsx
import { Skeleton } from "@/components/ui/skeleton"

export default function PeerPointsLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-7 w-32" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-md border border-dark-border bg-dark-card p-6 space-y-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </div>
      <div className="rounded-md border border-dark-border bg-dark-card p-6 space-y-4">
        <Skeleton className="h-5 w-40" />
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    </div>
  )
}
```
- **VALIDATE**: Navigate to /dashboard/peerpoints

### Task 17: CREATE `app/(protected)/dashboard/profile/loading.tsx`

- **IMPLEMENT**: Skeleton matching profile page: sidebar (avatar + stats) + main content (tabs + cards)
```tsx
import { Skeleton } from "@/components/ui/skeleton"

export default function ProfileLoading() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Sidebar */}
      <div className="space-y-6">
        <div className="rounded-md border border-dark-border bg-dark-card p-6 space-y-4">
          <Skeleton className="h-24 w-24 rounded-full mx-auto" />
          <Skeleton className="h-5 w-32 mx-auto" />
          <Skeleton className="h-4 w-24 mx-auto" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-md border border-dark-border bg-dark-card p-3 text-center space-y-1">
              <Skeleton className="h-6 w-8 mx-auto" />
              <Skeleton className="h-3 w-12 mx-auto" />
            </div>
          ))}
        </div>
      </div>
      {/* Main content */}
      <div className="lg:col-span-2 space-y-6">
        <div className="flex gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-32 rounded-md" />
          ))}
        </div>
        <div className="rounded-md border border-dark-border bg-dark-card p-6 space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </div>
    </div>
  )
}
```
- **VALIDATE**: Navigate to /dashboard/profile

### Task 18: CREATE `app/(protected)/dashboard/admin/loading.tsx`

- **IMPLEMENT**: Skeleton matching admin page: header + 10 metric cards in grid
```tsx
import { Skeleton } from "@/components/ui/skeleton"

export default function AdminLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Skeleton className="h-7 w-36" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="rounded-md border border-dark-border bg-dark-card p-4 space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-7 w-12" />
          </div>
        ))}
      </div>
    </div>
  )
}
```
- **VALIDATE**: Navigate to /dashboard/admin

### Task 19: CREATE `app/(protected)/dashboard/settings/loading.tsx`

- **IMPLEMENT**: Skeleton for settings page: tab list + form cards
```tsx
import { Skeleton } from "@/components/ui/skeleton"

export default function SettingsLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-7 w-24" />
      <div className="flex gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-28 rounded-md" />
        ))}
      </div>
      <div className="rounded-md border border-dark-border bg-dark-card p-6 space-y-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        ))}
        <Skeleton className="h-10 w-32 rounded-md" />
      </div>
    </div>
  )
}
```
- **VALIDATE**: Navigate to /dashboard/settings

### Task 20: CREATE `app/(protected)/dashboard/community/loading.tsx`

- **IMPLEMENT**: Simple skeleton — header + card with icon placeholder
```tsx
import { Skeleton } from "@/components/ui/skeleton"

export default function CommunityLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-7 w-32" />
      <div className="rounded-md border border-dark-border bg-dark-card p-12 space-y-4">
        <Skeleton className="h-12 w-12 rounded-full mx-auto" />
        <Skeleton className="h-5 w-48 mx-auto" />
        <Skeleton className="h-4 w-64 mx-auto" />
      </div>
    </div>
  )
}
```
- **VALIDATE**: Navigate to /dashboard/community

### Task 21: CREATE `app/(protected)/dashboard/help/loading.tsx`

- **IMPLEMENT**: Skeleton matching help page: header + search + tabs + accordion items
```tsx
import { Skeleton } from "@/components/ui/skeleton"

export default function HelpLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-7 w-36" />
      <Skeleton className="h-10 w-full rounded-md" />
      <div className="flex gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-32 rounded-md" />
        ))}
      </div>
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-md" />
        ))}
      </div>
    </div>
  )
}
```
- **VALIDATE**: Navigate to /dashboard/help

### Task 22: UPDATE `app/(protected)/dashboard/page.tsx` — Add click feedback to Quick Action cards

- **IMPLEMENT**: Convert Quick Action `<Link>` cards to use a client wrapper that shows a subtle loading overlay on click. The simplest approach: wrap the Quick Actions grid in a client component that detects navigation.

  **Alternative simpler approach**: Add `group` class and a CSS-only active state:
  ```tsx
  <Link href="..." className="... active:opacity-70 active:scale-[0.98] transition-all">
  ```
  This provides instant tactile feedback without needing any client-side state.

- **CHANGE**: Update all 4 Quick Action `<Link>` elements (lines 110-126) to add `active:opacity-70 active:scale-[0.98]` to their className
- **GOTCHA**: Dashboard page is a Server Component. Adding CSS-only active states doesn't require a client boundary. If more complex loading states are needed (like a spinner overlay), a client wrapper component would be needed, but the CSS approach is sufficient for immediate feedback.
- **VALIDATE**: Navigate to /dashboard, click quick action cards — should see brief opacity/scale feedback

---

## TESTING STRATEGY

### Unit Tests

No test framework is configured (hackathon trade-off). Skip automated tests.

### Manual Testing Checklist

1. **Progress Bar**: Click sidebar links rapidly — gold bar should appear at top and complete
2. **SubmitButton**: Go to signin page, submit form — button should be disabled with spinner
3. **EditProfileForm**: Edit profile → Save — spinner should show in button
4. **OnboardingFlow**: Complete onboarding (if accessible) — submit button shows spinner
5. **GetNextReviewButton**: Click "Get Next Review" — spinner + text change
6. **ReviewActions**: Approve/Reject a review — buttons disabled + spinner
7. **Admin Users**: Inject points, activate user — all buttons show spinners
8. **Skeleton Pages**: Navigate between dashboard routes — skeletons should flash briefly
9. **Quick Action Cards**: Click dashboard cards — should feel responsive with active state

### Edge Cases

- Double-click prevention: all buttons must be `disabled` during pending state
- Progress bar shouldn't persist if navigation fails
- Skeletons should match the approximate layout of actual content to avoid layout shift
- OAuthButtons should still show spinner on the specific provider button being clicked

---

## VALIDATION COMMANDS

### Level 1: Syntax & Style

```bash
npm run build
```
Build should succeed (note: `ignoreBuildErrors: true` is set, so TS errors won't block — but aim for zero errors).

### Level 2: Dev Server Check

```bash
npm run dev
```
Verify dev server starts without runtime errors.

### Level 4: Manual Validation

1. Open `http://localhost:3000` — verify progress bar on navigation
2. Navigate to each dashboard route — verify skeleton loading pages appear
3. Test all button interactions listed in manual testing checklist above
4. Test on mobile viewport — verify skeletons are responsive
5. Check browser console for hydration warnings or errors

---

## ACCEPTANCE CRITERIA

- [ ] Visible progress bar (gold, 2px, top of viewport) on every route navigation
- [ ] Skeleton loading pages for all 9 dashboard routes
- [ ] SubmitButton actually disabled (not just aria-disabled) + shows spinner while pending
- [ ] All action buttons (Save, Approve, Reject, Activate, Get Next Review, Inject Points, Submit Project) show Spinner + are disabled while pending
- [ ] OAuthButtons uses shared Spinner component
- [ ] Quick Action cards on dashboard have active state feedback
- [ ] No interaction where user clicks and sees zero feedback
- [ ] Consistent visual language: same Spinner SVG, same skeleton style (dark-surface + animate-pulse)
- [ ] No hydration errors or console warnings from new components
- [ ] Root layout remains a Server Component (not converted to "use client")

---

## COMPLETION CHECKLIST

- [ ] All 22 tasks completed in order
- [ ] `npm run build` passes
- [ ] `npm run dev` starts without errors
- [ ] Manual testing confirms all loading indicators work
- [ ] Acceptance criteria all met
- [ ] No new console errors or warnings

---

## NOTES

### Design Decisions

1. **Custom progress bar vs next-nprogress-bar**: The plan provides both options. Try `next-nprogress-bar` first; if it has React 19 compatibility issues, use the custom implementation. The custom approach uses `usePathname` + `useSearchParams` to detect navigation completion and a click event listener to detect navigation start.

2. **No reusable skeleton sub-components**: Each `loading.tsx` file is self-contained with inline Skeleton usage rather than creating abstract `TableSkeleton`, `CardSkeleton` etc. This keeps things simple and avoids premature abstraction for 9 slightly different page layouts.

3. **CSS-only card feedback**: Quick Action cards use CSS `active:` states rather than a client component wrapper. This is the lightest approach that preserves the Server Component architecture of the dashboard page.

4. **Spinner inherits text color**: The Spinner uses `currentColor` for stroke/fill, so it automatically matches the button's text color without additional props.

### Risk Assessment

- **Low risk**: Spinner, Skeleton, SubmitButton fix, button updates — straightforward component changes
- **Medium risk**: Progress bar — depends on library compatibility or custom implementation complexity
- **Low risk**: loading.tsx files — standard Next.js convention, no side effects

### Confidence Score: 8/10

High confidence due to straightforward component patterns. The main risk is the progress bar library compatibility, but the fallback custom implementation mitigates that.
