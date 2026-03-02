# Active Project Limit UX Improvements

## Context

When a user already has an active project in the queue and tries to create another, the server action redirects to `/dashboard/request-feedback?error=You can only have 1 active project...` but:
1. The listing page never reads `searchParams`, so the error is invisible (only shown in URL bar)
2. The "New Request" button is always visible with no warning
3. The `/new` form page has no pre-check — user fills the whole form before hitting the error

## Changes

### 1. Show error/success messages on the listing page

**File:** `app/(protected)/dashboard/request-feedback/page.tsx`

- **Handled by the toast system (PRD 7.9):** The `<ToastFromParams />` bridge component in the dashboard layout automatically reads `error`/`success` query params from `encodedRedirect` and displays them as toasts. No per-page `searchParams` handling needed.
- This means `submitFeedbackRequest` errors (insufficient points, limit reached) will automatically appear as toasts on redirect.

### 2. Disable "New Request" button when limit is hit

**File:** `app/(protected)/dashboard/request-feedback/page.tsx`

- Fetch `active_project_limit` from settings using `getSettings()` from `@/utils/supabase/settings`
- Count active projects already in queue (status `open` with `queue_position IS NOT NULL`) — reuse the data already fetched
- If at limit: replace the "New Request" link/button with a disabled button + tooltip text explaining the limit
- Show a small info banner below the header: "You have 1/1 active projects in the queue."

### 3. Block the `/new` form page when limit is hit

**File:** `app/(protected)/dashboard/request-feedback/new/page.tsx`

- Convert to async server component
- Fetch user, settings, and active project count server-side
- If at limit: instead of rendering the form, show a clear message card with:
  - "Active project limit reached" heading
  - Explanation that the limit is currently {n}
  - Link back to the listing page
- This prevents users from even seeing the form when they can't submit

### 4. Style FormMessage for dark theme

**File:** `components/form-message.tsx`

The current FormMessage uses light theme colors (`bg-green-100 text-green-800`, `bg-red-100 text-red-800`). Update to dark-theme-friendly styles that match the dashboard aesthetic. **Note:** With the toast system (PRD 7.9), FormMessage is retained only for inline auth page validation. Dashboard action feedback uses toasts instead.

## Files Modified

- `app/(protected)/dashboard/request-feedback/page.tsx` — searchParams, settings check, conditional button
- `app/(protected)/dashboard/request-feedback/new/page.tsx` — server-side limit gate
- `components/form-message.tsx` — dark theme styling

## Verification

1. With an active project: visit `/dashboard/request-feedback` — "New Request" button should be disabled with limit info
2. With an active project: navigate directly to `/dashboard/request-feedback/new` — should see limit-reached card, not the form
3. With no active projects: both pages should work normally
4. After a failed submit (if somehow reached): error message should display as a styled banner on the listing page
5. `npm run build` passes
