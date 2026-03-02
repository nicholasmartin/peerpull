# Feature: Toast Notification System & Active Project Limit UX (PRD 7.9)

The following plan should be complete, but validate documentation and codebase patterns before implementing.

Pay special attention to naming of existing utils, types, and models. Import from the right files.

## Feature Description

A unified toast notification system using Sonner that provides immediate, consistent visual feedback for every user action across the entire app. This replaces 4 inconsistent ad-hoc feedback patterns (invisible `encodedRedirect` URL params, light-themed `FormMessage`, scattered inline `useState` errors, and silent redirects) with a single toast layer. Additionally, the active project limit gets proactive UX guardrails so users see limits before hitting server-side errors.

## User Stories

**As a dashboard user**, I want to see success/error messages after every action (submitting feedback requests, reviews, referral code changes), so that I know whether my action succeeded or failed.

**As a builder submitting a feedback request**, I want to see my active project count and limit on the listing page, so that I know before clicking "New Request" whether I can submit.

**As a user on the new request page**, I want to be blocked from seeing the form if I've hit my project limit, so that I don't waste time filling it out.

## Problem Statement

Dashboard pages don't read `searchParams` from `encodedRedirect()`, making all error/success messages invisible. 15 calls to `encodedRedirect()` across 5 server actions produce messages that only appear in the URL bar. Client-callable actions (`getNextReview`, `changeReferralCode`, `approveReview`, `rejectReview`) return `{ error }` objects that most components don't display. Users get zero confirmation for successful mutations.

## Solution Statement

Install Sonner, add `<Toaster />` to root layout, create a `<ToastFromParams />` bridge in the dashboard layout that auto-reads URL `error`/`success` params and displays them as toasts. Then progressively wire up client components to call `toast()` after server actions. Add server-side limit checks to the request-feedback pages. Fix FormMessage dark theme.

## Feature Metadata

**Feature Type**: New Capability + Enhancement
**Estimated Complexity**: Medium
**Primary Systems Affected**: Root layout, dashboard layout, all client components calling server actions, request-feedback pages, FormMessage component
**Dependencies**: `sonner` npm package (external)

---

## CONTEXT REFERENCES

### Relevant Codebase Files — MUST READ BEFORE IMPLEMENTING

| File | Lines | Why |
|------|-------|-----|
| `app/layout.tsx` | 1-39 | Root layout — add `<Toaster />` here |
| `app/actions.ts` | 1-397 | ALL server actions — understand every `encodedRedirect` call and `{ error }` return |
| `utils/utils.ts` | 1-16 | `encodedRedirect()` definition — understand the URL param pattern |
| `components/form-message.tsx` | 1-24 | FormMessage — needs dark theme fix |
| `app/(protected)/dashboard/layout.tsx` | 1-26 | Dashboard layout — add `<ToastFromParams />` here |
| `components/protected/dashboard/layout/DashboardShell.tsx` | 1-32 | Client shell — understand the component hierarchy |
| `components/protected/dashboard/layout/DashboardContent.tsx` | 1-37 | Content wrapper — understand sidebar margin logic |
| `app/(protected)/dashboard/request-feedback/page.tsx` | 1-181 | Listing page — add limit checks, disable button |
| `app/(protected)/dashboard/request-feedback/new/page.tsx` | 1-179 | New form — add server-side limit gate |
| `app/(protected)/dashboard/submit-feedback/get-next-review-button.tsx` | all | Client component with inline error — migrate to toast |
| `app/(protected)/dashboard/submit-feedback/[id]/review/review-session.tsx` | 40, 52, 67-75, 91-94 | Review session error handling — migrate to toast |
| `app/(protected)/dashboard/request-feedback/[id]/review-actions.tsx` | 1-45 | Approve/reject — add toast feedback |
| `app/(protected)/dashboard/invite/page.tsx` | 33-38, 132-146, 215-217 | Referral code change — migrate to toast |
| `app/(protected)/dashboard/admin/users/page.tsx` | 26, 42-74, 149-157 | Admin inline error pattern — migrate to toast |
| `utils/supabase/settings.ts` | 1-54 | `getSettings()` and `SystemSettings` type |
| `app/globals.css` | all | Custom CSS — reference for animation/styling patterns |
| `.agents/plans/active-project-limit-ux.md` | all | Existing plan spec for limit UX |

### New Files to Create

| File | Purpose |
|------|---------|
| `components/toast-from-params.tsx` | Client component bridge: reads URL `error`/`success` searchParams → triggers toast → cleans URL |

### Relevant Documentation

- [Sonner GitHub](https://github.com/emilkowalski/sonner) — Installation and basic API
- [Sonner Docs: Toaster](https://sonner.emilkowal.ski/toaster) — All Toaster component props
- [Sonner Docs: Toast](https://sonner.emilkowal.ski/toast) — All toast() variants and options
- [Sonner Docs: Styling](https://sonner.emilkowal.ski/styling) — Custom styling, Tailwind integration, `classNames`, `unstyled` mode
- [Toast in Server Components](https://buildui.com/posts/toast-messages-in-react-server-components) — Pattern for bridging server redirects to client toasts

### Sonner API Quick Reference

**Installation:** `npm install sonner`

**Toaster props (key ones for this project):**
| Prop | Type | Default | Our Value |
|------|------|---------|-----------|
| `theme` | `'light' \| 'dark' \| 'system'` | `'light'` | `'dark'` |
| `position` | string | `'bottom-right'` | `'top-right'` |
| `richColors` | boolean | `false` | `true` |
| `closeButton` | boolean | `false` | `true` |
| `visibleToasts` | number | `3` | `3` |
| `duration` | number | `4000` | `5000` |
| `toastOptions` | object | — | Custom classNames for dark theme |
| `expand` | boolean | `false` | `false` |

**Toast variants:**
```typescript
import { toast } from "sonner";

toast("Default message");
toast.success("Action completed");
toast.error("Something went wrong");
toast.warning("Approaching limit");
toast.info("No items in queue");
toast.loading("Uploading...");
toast.dismiss(toastId);
```

**Per-toast options:**
```typescript
toast.error("Message", {
  duration: 8000,        // errors persist longer
  description: "Details",
  action: { label: "Retry", onClick: () => {} },
});
```

### Patterns to Follow

**Server Action return pattern (keep as-is):**
```typescript
// Pattern A: encodedRedirect for form submissions
return encodedRedirect("error", "/dashboard/request-feedback", "Error message");

// Pattern B: return objects for client-callable actions
return { error: "Error message" };
return { success: true };
```

**Client-side action result → toast pattern (NEW):**
```typescript
const result = await someServerAction(data);
if (result && "error" in result) {
  toast.error(result.error);
} else {
  toast.success("Action completed!");
}
```

**Dark theme color tokens used in codebase:**
- Background: `dark-bg`, `dark-card`, `dark-surface`
- Text: `dark-text`
- Border: `dark-border`
- Error inline: `bg-red-500/10 text-red-400` (admin pattern)
- Success inline: `bg-green-500/10 text-green-400` (admin pattern)
- Warning inline: `text-yellow-400`, `bg-yellow-500/10`

**Naming conventions:**
- Component files: PascalCase (e.g., `ToastFromParams.tsx`)
- Utility files: kebab-case (e.g., `form-message.tsx`)
- `"use client"` directive on all interactive components

---

## IMPLEMENTATION PLAN

### Phase 1: Foundation — Install Sonner & Add Provider

Install the library and place `<Toaster />` in root layout so toasts work on every page.

### Phase 2: Bridge — `<ToastFromParams />` Component

Create the bridge component that reads `searchParams` (`?error=...`, `?success=...`) and auto-triggers toasts. Place it in the dashboard layout. This instantly fixes all invisible `encodedRedirect` messages across all dashboard pages.

### Phase 3: Client Component Migration

Update client components that call server actions directly to use `toast()` instead of inline error state. This covers: GetNextReviewButton, ReviewSession, ReviewActions, Invite page, Admin users page.

### Phase 4: Active Project Limit UX

Add server-side limit checks to the listing page (disable button) and new request page (block form). Per `.agents/plans/active-project-limit-ux.md`.

### Phase 5: FormMessage Dark Theme Fix

Update FormMessage colors for dark theme compatibility on auth pages.

---

## STEP-BY-STEP TASKS

### Task 1: INSTALL sonner package

- **IMPLEMENT**: Run `npm install sonner`
- **VALIDATE**: `npm ls sonner` shows installed version

### Task 2: UPDATE `app/layout.tsx` — Add `<Toaster />` provider

- **IMPLEMENT**: Import `Toaster` from `sonner` and add it inside `<body>` after `<SidebarProvider>`
- **PATTERN**: Place as sibling to `{children}`, not inside `SidebarProvider`
- **IMPORTS**: `import { Toaster } from "sonner";`
- **CONFIGURATION**:
  ```tsx
  <Toaster
    theme="dark"
    position="top-right"
    richColors
    closeButton
    visibleToasts={3}
    duration={5000}
    toastOptions={{
      classNames: {
        toast: "!bg-[#1a1f2e] !border-[#2d3348]",
        title: "!text-gray-100",
        description: "!text-gray-400",
        closeButton: "!bg-[#2d3348] !border-[#3d4458] !text-gray-400",
      },
    }}
  />
  ```
- **GOTCHA**: `<Toaster />` can live in a server component (it renders a client portal internally). Place it right before closing `</body>` tag, outside `<SidebarProvider>`.
- **GOTCHA**: Sonner's `richColors` prop gives success/error/warning/info distinct colors automatically. With `theme="dark"` these already look good on dark backgrounds. The `!important` prefix on classNames is required to override Sonner defaults.
- **VALIDATE**: `npm run build` passes. Dev server shows no errors.

### Task 3: CREATE `components/toast-from-params.tsx` — Bridge component

- **IMPLEMENT**: Client component that reads `error` and `success` URL search params, triggers `toast.error()` or `toast.success()`, then cleans the URL using `window.history.replaceState()`.
- **IMPORTS**: `"use client"`, `useEffect`, `useSearchParams` from `next/navigation`, `toast` from `sonner`
- **PATTERN**:
  ```tsx
  "use client";

  import { useEffect } from "react";
  import { useSearchParams } from "next/navigation";
  import { toast } from "sonner";

  export function ToastFromParams() {
    const searchParams = useSearchParams();

    useEffect(() => {
      const error = searchParams.get("error");
      const success = searchParams.get("success");

      if (error) {
        toast.error(error, { duration: 8000 });
        // Clean URL without triggering navigation
        const url = new URL(window.location.href);
        url.searchParams.delete("error");
        window.history.replaceState({}, "", url.toString());
      }

      if (success) {
        toast.success(success);
        const url = new URL(window.location.href);
        url.searchParams.delete("success");
        window.history.replaceState({}, "", url.toString());
      }
    }, [searchParams]);

    return null;
  }
  ```
- **GOTCHA**: `useSearchParams()` requires wrapping in `<Suspense>` when used in a component rendered by a server component. The dashboard layout is a server component, so we need a Suspense boundary.
- **GOTCHA**: Error toasts get `duration: 8000` (8s) per PRD spec. Success toasts use default 5s.
- **VALIDATE**: Navigate to `/dashboard/request-feedback?error=Test%20error` — toast should appear. URL should clean up.

### Task 4: UPDATE `app/(protected)/dashboard/layout.tsx` — Add ToastFromParams

- **IMPLEMENT**: Import `ToastFromParams` and `Suspense`, add as sibling to `DashboardShell`
- **PATTERN**:
  ```tsx
  import { Suspense } from "react";
  import { ToastFromParams } from "@/components/toast-from-params";

  // Inside return:
  return (
    <>
      <Suspense fallback={null}>
        <ToastFromParams />
      </Suspense>
      <DashboardShell user={user} profile={profile}>{children}</DashboardShell>
    </>
  );
  ```
- **GOTCHA**: The `<Suspense>` wrapper is required because `useSearchParams()` in `ToastFromParams` causes the nearest Suspense boundary to be used during static rendering. Without it, Next.js will error.
- **VALIDATE**: `npm run build` passes. Visit any dashboard page with `?error=test` — toast appears.

### Task 5: UPDATE `app/(protected)/dashboard/submit-feedback/get-next-review-button.tsx` — Migrate to toast

- **IMPLEMENT**: Replace inline `message` state with `toast()` calls
- **READ FILE FIRST** — understand current structure
- Remove `const [message, setMessage] = useState<string | null>(null);`
- Replace `setMessage(result.error)` with `toast.info(result.error)` (use `info` because "no projects in queue" is informational, not an error)
- Replace actual errors with `toast.error(result.error)`
- Remove the inline message display JSX
- **IMPORTS**: Add `import { toast } from "sonner";`
- **GOTCHA**: The "No projects available in the queue" message is user-facing info, not an error. Use `toast.info()` for this specific case. Use `toast.error()` for "Failed to get next review".
- **VALIDATE**: Click "Get a Review" with empty queue — info toast appears. No inline yellow text.

### Task 6: UPDATE `app/(protected)/dashboard/submit-feedback/[id]/review/review-session.tsx` — Migrate to toast

- **READ FILE FIRST** — this is a complex component (~329 lines)
- **IMPLEMENT**:
  - Add `import { toast } from "sonner";`
  - Keep `error` state for inline form validation (rating, text length) that should stay visible near the form
  - For video upload failure (line ~72): add `toast.error("Failed to upload video: " + uploadError.message)` alongside existing `setError()`
  - For server action errors (line ~91-94): add `toast.error(result.error)` alongside existing `setError()`
  - For successful submit: the action already does `redirect()` which navigates away — the `<ToastFromParams />` bridge handles success messages if we add them to the redirect
- **GOTCHA**: Don't remove `setError()` entirely — the inline error display near the submit button is still useful as a secondary indicator. Add toast as the primary notification.
- **VALIDATE**: Submit a review with invalid data — toast error appears. Upload failure — toast error appears.

### Task 7: UPDATE `app/(protected)/dashboard/request-feedback/[id]/review-actions.tsx` — Add toast feedback

- **READ FILE FIRST**
- **IMPLEMENT**:
  - Add `import { toast } from "sonner";`
  - After `approveReview()` call: `toast.success("Review approved")`
  - After `rejectReview()` call: `toast.success("Review rejected")`
  - Handle error returns: `if (result && "error" in result) toast.error(result.error)`
- **GOTCHA**: Currently these functions call `router.refresh()` after the action. The toast must fire before refresh. Sonner toasts persist across client-side navigations/refreshes automatically.
- **VALIDATE**: Approve a review — green success toast. Reject a review — success toast.

### Task 8: UPDATE `app/(protected)/dashboard/invite/page.tsx` — Migrate referral toast

- **READ FILE FIRST**
- **IMPLEMENT**:
  - Add `import { toast } from "sonner";`
  - Line ~132-146 (handleConfirm): Replace `setCodeError(result.error)` with `toast.error(result.error)`
  - On success: add `toast.success("Referral code updated!")` after existing success logic
  - Remove `codeError` state and its inline display (lines ~33, ~215-217) — toast handles it
- **GOTCHA**: Keep client-side validation (regex check) as inline feedback since it fires on every keystroke. Only migrate the server action result to toast.
- **VALIDATE**: Change referral code — success toast. Try taken code — error toast.

### Task 9: UPDATE `app/(protected)/dashboard/admin/users/page.tsx` — Migrate admin toast

- **READ FILE FIRST**
- **IMPLEMENT**:
  - Add `import { toast } from "sonner";`
  - Line ~42-74 (handleInject): Replace `setMessage({ type: "error", text: result.error })` with `toast.error(result.error)`
  - Replace `setMessage({ type: "success", text: "Injected..." })` with `toast.success("Injected...")`
  - Remove `message` state (line ~26) and inline message display (lines ~149-157)
- **VALIDATE**: Inject points — success toast. Invalid input — error toast. No inline colored div.

### Task 10: UPDATE `app/(protected)/dashboard/request-feedback/page.tsx` — Active project limit UX

- **READ FILE FIRST** — understand current data fetching and layout
- **IMPLEMENT**:
  - Import `getSettings` from `@/utils/supabase/settings`
  - Fetch settings server-side: `const settings = await getSettings();`
  - Count active queued projects from the already-fetched data (filter `activeFeedbackRequests` for those with `queue_position IS NOT NULL` status `open`) OR do a separate count query
  - Pass `activeCount`, `limit` to the page JSX
  - If `activeCount >= limit`:
    - Disable "New Request" link/button: render as `<Button disabled>` with tooltip/title explaining limit
    - Show info text below header: `"You have {activeCount}/{limit} active project(s) in the queue"`
  - If under limit: show count as subtle info text: `"{activeCount}/{limit} active"`
- **PATTERN**: Follow the existing page structure — server component with data fetching at top
- **GOTCHA**: The existing page fetches feedback requests with `supabase.from("feedback_requests").select("*").eq("user_id", user.id)`. Active queued count = filter for `status === "open"` AND `queue_position !== null`. The data may already be available from the existing query.
- **VALIDATE**: With 1 active project and limit=1: button is disabled, info text shows "1/1". With 0: button enabled, shows "0/1".

### Task 11: UPDATE `app/(protected)/dashboard/request-feedback/new/page.tsx` — Server-side limit gate

- **READ FILE FIRST**
- **IMPLEMENT**:
  - Convert to async server component (add `async` to the default export function)
  - Import `createClient` from `@/utils/supabase/server` and `getSettings` from `@/utils/supabase/settings`
  - Fetch user, settings, and active project count server-side
  - If at limit: render a "Limit Reached" card instead of the form:
    ```tsx
    <div className="max-w-md mx-auto mt-16 text-center">
      <div className="bg-dark-card border border-dark-border rounded-xl p-8">
        <h2 className="text-xl font-semibold text-dark-text mb-3">Active Project Limit Reached</h2>
        <p className="text-gray-400 mb-6">
          You can only have {settings.active_project_limit} active project{settings.active_project_limit !== 1 ? "s" : ""} in the queue at a time.
          Complete or remove an existing project to submit a new one.
        </p>
        <Link href="/dashboard/request-feedback" className="...">
          Back to My Requests
        </Link>
      </div>
    </div>
    ```
  - If under limit: render the form as normal
- **GOTCHA**: The current page is a plain component (no `async`, no data fetching). It needs to become an async server component. The form itself may use `"use client"` — if so, extract the form into a separate client component and keep the page as the server gate.
- **VALIDATE**: With active project at limit: `/dashboard/request-feedback/new` shows limit card, not form. Without: shows form normally.

### Task 12: UPDATE `components/form-message.tsx` — Dark theme styling

- **READ FILE FIRST**
- **IMPLEMENT**: Replace light theme colors with dark-theme-compatible colors:
  ```tsx
  // Success: dark green
  <div className="bg-emerald-500/10 text-emerald-400 border-l-4 border-emerald-500 px-4 py-3 rounded">

  // Error: dark red
  <div className="bg-red-500/10 text-red-400 border-l-4 border-red-500 px-4 py-3 rounded">

  // Info: dark blue
  <div className="bg-blue-500/10 text-blue-400 border-l-4 border-blue-500 px-4 py-3 rounded">
  ```
- **PATTERN**: Matches the dark theme inline pattern used in admin pages (`bg-green-500/10 text-green-400`)
- **VALIDATE**: Visit `/signin` with `?error=Test` — message renders with dark styling. Visit `/signup` with `?success=Test` — green dark styling.

### Task 13: UPDATE `app/actions.ts` — Add success message to submitFeedbackRequest redirect

- **IMPLEMENT**: Change the success redirect (line ~229) from plain `redirect()` to `encodedRedirect`:
  ```typescript
  return encodedRedirect("success", redirectTo, "Feedback Request created and added to queue!");
  ```
- **GOTCHA**: The current code does `return redirect(redirectTo)` with no message. The `<ToastFromParams />` bridge will automatically pick up the success param and show a toast.
- **VALIDATE**: Submit a new feedback request — success toast appears on redirect.

---

## TESTING STRATEGY

### Manual Validation (No test framework configured)

**Toast System Tests:**
1. Visit `/dashboard?error=Test%20error%20message` — red error toast in top-right, 8s duration
2. Visit `/dashboard?success=Test%20success` — green success toast, 5s duration
3. Visit `/dashboard?error=First&success=Second` — both toasts appear
4. URL cleans up after toast fires (no `?error=` in URL bar)
5. Toast persists during client-side navigation within dashboard
6. Maximum 3 toasts visible; older ones auto-dismiss
7. Close button (X) dismisses toast immediately
8. Toast has dark theme styling matching dashboard

**Action-Specific Tests:**
| Action | Trigger | Expected Toast |
|--------|---------|----------------|
| Submit feedback request (success) | Fill form, submit | `toast.success("Feedback Request created...")` |
| Submit feedback request (no points) | Submit with 0 points | `toast.error("You need at least X PeerPoints...")` |
| Submit feedback request (at limit) | Submit with active project | `toast.error("You can only have X active...")` |
| Get next review (empty queue) | Click "Get a Review" | `toast.info("No projects available...")` |
| Get next review (error) | RPC fails | `toast.error("Failed to get next review")` |
| Submit review (validation) | Missing rating | `toast.error("Please select a star rating")` |
| Approve review | Click Approve | `toast.success("Review approved")` |
| Reject review | Click Reject | `toast.success("Review rejected")` |
| Change referral code (success) | Change code | `toast.success("Referral code updated!")` |
| Change referral code (taken) | Use taken code | `toast.error("That code is already taken")` |
| Admin inject points | Inject points | `toast.success("Injected X points...")` |

**Active Project Limit Tests:**
1. With 1 active project (limit=1): `/dashboard/request-feedback` — "New Request" button disabled, "1/1 active" shown
2. With 0 active projects: Button enabled, "0/1 active" shown
3. With 1 active project: Navigate to `/dashboard/request-feedback/new` directly — see limit card, not form
4. With 0 active projects: See form normally

**FormMessage Dark Theme Tests:**
1. Visit `/signin?error=Bad%20password` — dark red styling
2. Visit `/signup?success=Check%20email` — dark green styling

### Edge Cases

- Double-click submit (toast should not fire twice)
- Very long error message (toast should handle gracefully, possibly truncate)
- Network error during action (toast.error with generic message)
- Browser back/forward with query params (toast should not re-fire — replaceState cleans URL)
- Multiple rapid toasts (max 3 visible, queue behavior)

---

## VALIDATION COMMANDS

### Level 1: Build Check
```bash
npm run build
```
Must pass with zero new errors (existing TS errors are ignored via `ignoreBuildErrors: true`).

### Level 2: Dev Server
```bash
npm run dev
```
No console errors on page load. Toaster renders in DOM (inspect for `[data-sonner-toaster]` attribute).

### Level 3: Package Verification
```bash
npm ls sonner
```
Shows installed version.

### Level 4: Manual Validation
Navigate through every action in the app and verify toasts appear per the testing strategy above.

---

## ACCEPTANCE CRITERIA

- [ ] `sonner` installed and `<Toaster />` in root layout with dark theme config
- [ ] `<ToastFromParams />` bridge in dashboard layout — all `encodedRedirect` messages auto-display as toasts
- [ ] URL params (`?error=`, `?success=`) cleaned after toast fires
- [ ] Error toasts persist for 8 seconds, success toasts for 5 seconds
- [ ] Max 3 visible toasts, close button on all
- [ ] `GetNextReviewButton` uses toast instead of inline message
- [ ] `ReviewSession` fires toast on upload/submit errors
- [ ] `ReviewActions` fires toast on approve/reject
- [ ] Invite page fires toast on referral code change result
- [ ] Admin users page fires toast on point injection result
- [ ] `submitFeedbackRequest` success redirect includes success message for toast
- [ ] Request-feedback listing page shows active count vs limit, disables button at limit
- [ ] Request-feedback new page gates with limit-reached card when at limit
- [ ] `FormMessage` uses dark theme colors
- [ ] `npm run build` passes
- [ ] No regressions in existing functionality

---

## COMPLETION CHECKLIST

- [ ] All 13 tasks completed in order
- [ ] Each task validation passed
- [ ] `npm run build` succeeds
- [ ] Manual testing confirms all toasts fire correctly
- [ ] Active project limit UX works for both at-limit and under-limit states
- [ ] FormMessage dark theme verified on auth pages
- [ ] No inline error patterns remain (except where intentionally kept as secondary indicators)

---

## NOTES

### Design Decisions

1. **Sonner over Radix Toast**: PRD explicitly specifies Sonner. It's ~3KB, works in server components, has built-in accessibility, and doesn't require a Context provider pattern.

2. **`richColors` enabled**: Gives success (green), error (red), warning (amber), info (blue) distinct colors out of the box. Combined with `theme="dark"` this produces dark-friendly colors without extensive custom styling.

3. **Keep `encodedRedirect` pattern**: Don't change server action signatures. The `<ToastFromParams />` bridge is the least-invasive way to surface existing messages. Server actions that return `{ error }` objects get toast calls at the component level.

4. **Keep some inline errors**: `ReviewSession` keeps `setError()` alongside `toast.error()` because the inline error near the submit button provides positional context. Toast is the primary notification; inline is secondary.

5. **`useSearchParams` + Suspense**: Next.js 15 requires Suspense when `useSearchParams()` is used in a component rendered by a server component. The dashboard layout wraps `<ToastFromParams />` in `<Suspense fallback={null}>`.

6. **URL cleanup via `replaceState`**: Prevents toast re-firing on back/forward navigation. Uses `window.history.replaceState` (not `router.replace`) to avoid triggering a Next.js navigation.

### Risks

- **Sonner version compatibility**: Current Next.js is 15.5.12, React 19. Sonner supports React 18+. Should work but verify during installation.
- **`replaceState` timing**: If the effect fires before the toast animation starts, the toast may not render. `useEffect` runs after paint, so this should be fine — the searchParams are read synchronously, toast is triggered, then URL is cleaned.
- **Stale `searchParams` on client navigation**: `useSearchParams()` updates on every navigation, so the `useEffect` dependency array `[searchParams]` ensures re-runs on param changes.

### Existing Plan Integration

This plan supersedes the toast-related items in `.agents/plans/active-project-limit-ux.md`. The limit UX tasks (Tasks 10-11) implement that plan's items 2 and 3. Item 1 (toast messages) is handled by Tasks 3-4. Item 4 (FormMessage dark theme) is Task 12.
