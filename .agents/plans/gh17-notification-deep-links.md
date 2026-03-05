# Feature: Notification Deep Links (GH #17)

The following plan should be complete, but validate documentation and codebase patterns and task sanity before you start implementing.

Pay special attention to naming of existing utils types and models. Import from the right files etc.

## Feature Description

Update the notification system so that clicking a notification in the dropdown navigates directly to the relevant detail page, instead of generic listing pages. This requires adding a `link_url` column to the notifications table and populating it at notification creation time.

## User Story

As a PeerPull user
I want clicking a notification to take me directly to the relevant page
So that I can immediately see and act on what the notification is about

## Problem Statement

The `getNotificationRoute()` function in `NotificationDropdown.tsx` (line 49-52) ignores the `reference_id` stored on each notification and routes to generic listing pages:
- `review_received` goes to `/dashboard/request-feedback` (listing)
- Everything else goes to `/dashboard/submit-feedback` (listing)

Users must manually find the relevant item after clicking, which is a poor experience.

## Solution Statement

Add a `link_url` text column to the `notifications` table and populate it with the correct deep link at notification creation time. The `NotificationDropdown` component then uses `notification.link_url` directly instead of computing a route from the type. This avoids any client-side lookups and is the simplest, most performant approach.

### Deep link mapping

| Notification Type | Deep Link | Data Needed |
|---|---|---|
| `review_received` | `/dashboard/request-feedback/{feedback_request_id}` | `feedback_request_id` (available at call site) |
| `review_approved` | `/dashboard/request-feedback/{feedback_request_id}` | `feedback_request_id` (available via review join) |
| `review_rejected` | `/dashboard/submit-feedback` | None (generic, no detail page for reviewer) |
| `review_rated` | `/dashboard/request-feedback/{feedback_request_id}` | `feedback_request_id` (needs to be fetched) |

**Rationale for link targets:**
- `review_received`: Builder wants to see the feedback on their project, so link to the feedback request detail page where reviews are listed.
- `review_approved`: Reviewer wants to see the project where their review was accepted. The feedback request detail page shows all reviews including theirs.
- `review_rejected`: Reviewer gets a generic link to browse more projects. There's no "rejected review detail" page.
- `review_rated`: Reviewer wants to see the rating context. The feedback request detail page shows quality ratings.

## Feature Metadata

**Feature Type**: Enhancement
**Estimated Complexity**: Low
**Primary Systems Affected**: `notifications` table, `create_notification` RPC, `utils/notifications.tsx`, `app/actions.ts`, `NotificationDropdown.tsx`
**Dependencies**: None (no new packages)

---

## CONTEXT REFERENCES

### Relevant Codebase Files, IMPORTANT: YOU MUST READ THESE FILES BEFORE IMPLEMENTING!

- `components/header/NotificationDropdown.tsx` (all lines) - The dropdown component. `getNotificationRoute()` at lines 49-52 must be replaced. `handleNotificationClick()` at line 110-120 uses it. The `Notification` interface at line 9-17 needs `link_url` added.
- `utils/notifications.tsx` (all lines) - `createNotification()` function and `CreateNotificationParams` interface. Must add `linkUrl` param and pass it to the RPC.
- `app/actions.ts` (lines 338-355) - `submitReview`: `review_received` call site. Has `notifData.feedback_request_id` available at line 341.
- `app/actions.ts` (lines 390-428) - `approveReview`: `review_approved` call site. Has `review.feedback_request_id` at line 393.
- `app/actions.ts` (lines 575-600) - `rateReviewAction`: `review_rated` call site. Does NOT currently fetch `feedback_request_id`. Needs to add it to the select at line 582.
- `app/actions.ts` (lines 602-644) - `rejectReview`: `review_rejected` call site. Has `review.feedback_request_id` at line 609.
- `supabase/migrations/20260305000000_phase4_notifications.sql` - Current notifications schema and `create_notification` RPC. Shows the existing columns and function signature.
- `app/(protected)/dashboard/request-feedback/[id]/page.tsx` - The feedback request detail page (target for deep links). Takes `id` as param, which is the `feedback_request_id`.

### New Files to Create

- `supabase/migrations/20260305100000_add_notification_link_url.sql` - Migration to add `link_url` column and update the `create_notification` RPC

### Patterns to Follow

**Migration naming:** Timestamp-based, incrementing from last migration. Last notification migration is `20260307000000`, so use `20260308000000` or similar.

**RPC pattern (from existing `create_notification`):**
```sql
CREATE OR REPLACE FUNCTION public.create_notification(
  p_user_id uuid,
  p_type text,
  p_title text,
  p_message text DEFAULT NULL,
  p_reference_id uuid DEFAULT NULL
)
RETURNS uuid AS $$
...
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
```

**Notification creation pattern (from `utils/notifications.tsx` line 30-36):**
```typescript
const { error: rpcError } = await supabase.rpc("create_notification", {
  p_user_id: params.userId,
  p_type: params.type,
  p_title: params.title,
  p_message: params.message || null,
  p_reference_id: params.referenceId || null,
});
```

**Error handling:** Non-blocking, wrap in try/catch, log errors, never throw.

---

## IMPLEMENTATION PLAN

### Phase 1: Database Migration

Add `link_url` column to notifications table and update the `create_notification` RPC to accept and store it.

### Phase 2: Backend Integration

Update `CreateNotificationParams` and the `createNotification` function to pass `linkUrl` through to the RPC. Update all 4 call sites in `app/actions.ts` to provide the correct deep link URL.

### Phase 3: Frontend Update

Update `NotificationDropdown.tsx` to use `notification.link_url` for navigation instead of the type-based routing function.

---

## STEP-BY-STEP TASKS

### Task 1: CREATE `supabase/migrations/20260308000000_add_notification_link_url.sql`

- **IMPLEMENT**: Add `link_url` text column and update the RPC
- **CONTENT**:
  ```sql
  -- Add link_url column to notifications
  ALTER TABLE public.notifications ADD COLUMN link_url text;

  -- Update create_notification RPC to accept link_url parameter
  CREATE OR REPLACE FUNCTION public.create_notification(
    p_user_id uuid,
    p_type text,
    p_title text,
    p_message text DEFAULT NULL,
    p_reference_id uuid DEFAULT NULL,
    p_link_url text DEFAULT NULL
  )
  RETURNS uuid AS $$
  DECLARE
    v_notification_id uuid;
  BEGIN
    INSERT INTO public.notifications (user_id, type, title, message, reference_id, link_url)
    VALUES (p_user_id, p_type, p_title, p_message, p_reference_id, p_link_url)
    RETURNING id INTO v_notification_id;

    RETURN v_notification_id;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
  ```
- **GOTCHA**: The new `p_link_url` parameter has a DEFAULT NULL, so existing callers (if any) are not broken.
- **VALIDATE**: `supabase db push` or `supabase migration up` succeeds

### Task 2: UPDATE `utils/notifications.tsx` - Add linkUrl to params and RPC call

- **IMPLEMENT**:
  1. Add `linkUrl?: string` to `CreateNotificationParams` interface (after `rating`)
  2. Add `p_link_url: params.linkUrl || null` to the `supabase.rpc("create_notification", {...})` call at line 35
- **PATTERN**: Follows existing optional param pattern (`referenceId`, `productTitle`, `rating`)
- **VALIDATE**: `npm run build` passes

### Task 3: UPDATE `app/actions.ts` - Pass linkUrl to all 4 createNotification calls

- **IMPLEMENT**: Add `linkUrl` field to each `createNotification` call with the correct deep link path (relative, no domain prefix needed).

  1. **`review_received`** (line 347-354): The `feedback_request_id` is available as `notifData.feedback_request_id` (fetched at line 341 in the `.select("feedback_request_id, feedback_requests(...)")` query).
     ```typescript
     linkUrl: `/dashboard/request-feedback/${notifData.feedback_request_id}`,
     ```

  2. **`review_approved`** (line 419-426): The `feedback_request_id` is available as `review.feedback_request_id` (fetched at line 393).
     ```typescript
     linkUrl: `/dashboard/request-feedback/${review.feedback_request_id}`,
     ```

  3. **`review_rated`** (line 588-596): The `feedback_request_id` is NOT currently in the select query. Update the select at line 582 from:
     ```typescript
     .select("reviewer_id, feedback_requests(title)")
     ```
     to:
     ```typescript
     .select("reviewer_id, feedback_request_id, feedback_requests(title)")
     ```
     Then add to the createNotification call:
     ```typescript
     linkUrl: `/dashboard/request-feedback/${reviewForNotif.feedback_request_id}`,
     ```

  4. **`review_rejected`** (line 634-641): The `feedback_request_id` is available as `review.feedback_request_id` (fetched at line 609). For rejected reviews, link to submit-feedback (browse more projects):
     ```typescript
     linkUrl: `/dashboard/submit-feedback`,
     ```

- **GOTCHA**: For `review_received`, the `notifData` variable already contains `feedback_request_id` from the select query at line 341. No additional fetch needed.
- **GOTCHA**: For `review_rated`, the select query must be updated to include `feedback_request_id`.
- **VALIDATE**: `npm run build` passes

### Task 4: UPDATE `components/header/NotificationDropdown.tsx` - Use link_url for navigation

- **IMPLEMENT**:
  1. Add `link_url: string | null` to the `Notification` interface (line 14, after `reference_id`)
  2. Delete the `getNotificationRoute()` function (lines 49-52) entirely
  3. Update `handleNotificationClick()` (line 119) to use `notification.link_url` with a fallback:
     ```typescript
     router.push(notification.link_url || "/dashboard");
     ```
- **GOTCHA**: Old notifications without `link_url` (created before migration) will have `null`. The fallback to `/dashboard` handles this gracefully.
- **VALIDATE**: `npm run build` passes

### Task 5: PUSH migration to Supabase

- **IMPLEMENT**: Push the new migration to the linked Supabase project
- **VALIDATE**: `supabase db push` succeeds, verify column exists in Supabase dashboard

---

## TESTING STRATEGY

### Unit Tests

No test framework configured. Skip automated tests.

### Edge Cases

- Old notifications (pre-migration) have `link_url = null`, should fallback to `/dashboard`
- `review_rejected` links to generic `/dashboard/submit-feedback` (no detail page for reviewer)
- If `feedback_request_id` is somehow null/missing at a call site, `linkUrl` should gracefully produce a usable fallback path
- Notification realtime subscription still works (new column doesn't affect `INSERT` events)

---

## VALIDATION COMMANDS

### Level 1: Syntax & Build

```bash
npm run build
```

### Level 2: Migration

```bash
supabase db push
```

### Level 3: Manual Validation

1. Start dev server: `npm run dev`
2. Trigger a `review_received` notification, click it, verify navigation to `/dashboard/request-feedback/{id}`
3. Trigger a `review_approved` notification, click it, verify navigation to `/dashboard/request-feedback/{id}`
4. Trigger a `review_rated` notification, click it, verify navigation to `/dashboard/request-feedback/{id}`
5. Trigger a `review_rejected` notification, click it, verify navigation to `/dashboard/submit-feedback`
6. Verify old notifications (if any exist) still work (fallback to `/dashboard`)

---

## ACCEPTANCE CRITERIA

- [ ] `link_url` column exists on `notifications` table
- [ ] `create_notification` RPC accepts `p_link_url` parameter
- [ ] All 4 `createNotification` call sites pass the correct `linkUrl`
- [ ] `NotificationDropdown` navigates using `link_url` instead of type-based routing
- [ ] Old notifications gracefully fallback to `/dashboard`
- [ ] `npm run build` passes
- [ ] No regressions in notification creation or display

---

## COMPLETION CHECKLIST

- [ ] All 5 tasks completed in order
- [ ] Migration pushed to Supabase
- [ ] `npm run build` succeeds
- [ ] Notification clicks navigate to correct detail pages
- [ ] Old notifications still work (fallback)
- [ ] Code follows project conventions

---

## NOTES

### Design Decision: `link_url` column vs client-side lookup

**Chosen approach:** Store a pre-computed `link_url` on the notification at creation time.

**Why not client-side lookup?** The `reference_id` stores a review ID, but `review_received` needs the `feedback_request_id` for the URL. A client-side lookup would require an extra Supabase query on every notification click, which adds latency and complexity.

**Why not store `feedback_request_id` as `reference_id`?** The `reference_id` is used for other purposes (linking back to the specific review). Overloading it would break that semantic.

**Why relative URLs?** Storing `/dashboard/request-feedback/{id}` instead of full URLs avoids hardcoding the domain and works across environments (dev, staging, production). The `router.push()` call handles relative paths natively.

### Backward Compatibility

Old notifications created before this migration will have `link_url = null`. The dropdown falls back to `/dashboard` in that case, which is a reasonable default. No data backfill is needed since notifications are transient and short-lived.
