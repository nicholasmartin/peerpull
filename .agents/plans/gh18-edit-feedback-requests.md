# Feature: Edit Feedback Requests After Creation (GH #18)

The following plan should be complete, but validate documentation and codebase patterns before implementing.

Pay special attention to naming of existing utils, types, and models. Import from the right files.

## Feature Description

Users cannot edit feedback requests after creation. This is especially painful for users who submitted during onboarding (which only captures title + URL), and for anyone needing to fix typos, update URLs, or enrich project details (description, stage, categories, focus areas, questions). This feature adds an edit page, a server action for updates, status-based edit restrictions, and proper draft support.

## User Story

As a builder who submitted a feedback request
I want to edit my project details after creation
So that I can add missing information, fix mistakes, and provide better context for reviewers.

## Problem Statement

1. Onboarding only captures title + URL. Users have no way to add description, stage, categories, focus areas, or questions afterward.
2. Draft projects show a "not supported" message at `/request-feedback/drafts/[id]`.
3. There is no edit UI anywhere in the feedback request flow.

## Solution Statement

- Create an edit page at `/dashboard/request-feedback/[id]/edit` that reuses the same form fields as the creation page, pre-filled with existing data.
- Add an `updateFeedbackRequest` server action with ownership validation and status-based field restrictions.
- Add a `publishDraftFeedbackRequest` server action to transition drafts to open (with points/limit checks).
- Add Edit buttons on both the detail page and the listing page.
- Replace the broken draft page with a redirect to the edit page.

## Feature Metadata

**Feature Type**: New Capability
**Estimated Complexity**: Medium
**Primary Systems Affected**: `app/actions.ts`, feedback request pages, listing page
**Dependencies**: None (RLS already supports UPDATE for owners)

---

## CONTEXT REFERENCES

### Relevant Codebase Files - YOU MUST READ THESE BEFORE IMPLEMENTING!

- `app/actions.ts` (lines 243-335) - Why: `submitFeedbackRequest` is the pattern to mirror for the update action. Shows form field extraction, validation, settings check, PostHog tracking.
- `app/actions.ts` (lines 215-237) - Why: `requireActiveUser` helper used for gating mutations.
- `app/(protected)/dashboard/request-feedback/new/page.tsx` (full file) - Why: Contains the form fields (CATEGORIES, FOCUS_AREAS, STAGES constants), form layout, and styling to reuse in the edit page.
- `app/(protected)/dashboard/request-feedback/[id]/page.tsx` (full file) - Why: Detail page where the Edit button will be added. Shows `isOwner` check pattern.
- `app/(protected)/dashboard/request-feedback/page.tsx` (full file) - Why: Listing page where Edit button will be added to the Actions column.
- `app/(protected)/dashboard/request-feedback/drafts/[id]/page.tsx` (full file) - Why: Broken draft page to be replaced with redirect to edit.
- `supabase/migrations/20260309000000_add_draft_status_to_feedback_requests.sql` - Why: Shows draft status constraint.
- `types/database.types.ts` - Why: TypeScript types for feedback_requests table columns.

### New Files to Create

- `app/(protected)/dashboard/request-feedback/[id]/edit/page.tsx` - Edit page (server component) that fetches the feedback request and renders the pre-filled form.
- `components/protected/dashboard/FeedbackRequestForm.tsx` - Shared form component used by both the new and edit pages. Contains form fields, constants, and client-side pre-fill logic.

### Files to Modify

- `app/actions.ts` - Add `updateFeedbackRequest` and `publishDraftFeedbackRequest` server actions.
- `app/(protected)/dashboard/request-feedback/[id]/page.tsx` - Add Edit button for owner when status is draft/open.
- `app/(protected)/dashboard/request-feedback/page.tsx` - Add Edit link in Actions column.
- `app/(protected)/dashboard/request-feedback/drafts/[id]/page.tsx` - Replace with redirect to edit page.
- `app/(protected)/dashboard/request-feedback/new/page.tsx` - Refactor to use the shared form component.

### Patterns to Follow

**Server Action Pattern** (from `submitFeedbackRequest`):
```typescript
export async function actionName(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/signin");
  // ... validation ...
  // ... database operation ...
  // ... PostHog tracking ...
  return encodedRedirect("success", "/path", "Message");
}
```

**Form Field Extraction Pattern**:
```typescript
const title = formData.get("title")?.toString();
const categories = formData.getAll("categories").map(String).filter(Boolean);
const questions = [
  formData.get("question1")?.toString(),
  formData.get("question2")?.toString(),
  formData.get("question3")?.toString(),
].filter(Boolean) as string[];
```

**Ownership Check Pattern** (from detail page):
```typescript
const isOwner = pr.user_id === user.id;
```

**Styling**: Dark theme classes (`border-gray-700 bg-gray-800`, `text-gray-300`, `bg-gray-900`, etc.). Form inputs use `border-gray-600 bg-gray-900 text-white placeholder-gray-500 focus:border-blue-500`.

**Button Pattern** (existing): `<Button variant="outline" size="sm">` for table actions.

**Redirect Pattern**: `encodedRedirect("success"|"error", path, message)` from `@/utils/utils`.

---

## IMPLEMENTATION PLAN

### Phase 1: Extract Shared Form Component

Extract the form fields and constants (CATEGORIES, FOCUS_AREAS, STAGES) from the new page into a shared `FeedbackRequestForm` component. This component accepts optional `defaultValues` for pre-filling in edit mode, and a `formAction` prop for the server action. This avoids duplicating the form markup.

### Phase 2: Server Actions

Add two new server actions:
1. `updateFeedbackRequest(formData)` - Updates an existing feedback request. Validates ownership and status-based restrictions (only draft/open can be fully edited; in_review allows only description, focus_areas, questions).
2. `publishDraftFeedbackRequest(formData)` - Transitions a draft to open status: runs the same points/limit checks as `submitFeedbackRequest`, then updates status and assigns queue position.

### Phase 3: Edit Page

Create the edit page as a server component that fetches the feedback request, validates ownership and editability, and renders the shared form with pre-filled values.

### Phase 4: UI Entry Points

- Detail page: Add "Edit" button next to the status badge (only for owner, only when editable).
- Listing page: Add "Edit" link in the Actions column alongside "View".
- Draft page: Replace placeholder with redirect to edit page.

---

## STEP-BY-STEP TASKS

### Task 1: CREATE `components/protected/dashboard/FeedbackRequestForm.tsx`

This is a **client component** (needs `"use client"` since checkboxes need `defaultChecked` based on props).

- **IMPLEMENT**: A reusable form component that renders all feedback request form fields.
- **PROPS**:
  ```typescript
  type FeedbackRequestFormProps = {
    action: (formData: FormData) => void;
    defaultValues?: {
      id?: string;
      title?: string;
      url?: string | null;
      description?: string | null;
      stage?: string | null;
      categories?: string[] | null;
      focus_areas?: string[] | null;
      questions?: string[] | null;
    };
    submitLabel: string;        // "Submit Request" or "Save Changes" or "Publish"
    showPublishButton?: boolean; // For drafts: show both Save Draft and Publish
    publishAction?: (formData: FormData) => void; // Server action for publish
  };
  ```
- **INCLUDE**: The CATEGORIES, FOCUS_AREAS, STAGES constants (move from new page).
- **INCLUDE**: Hidden input `<input type="hidden" name="id" value={defaultValues?.id} />` when editing.
- **PRE-FILL**: Use `defaultValue` on text/textarea/select inputs, `defaultChecked` on checkboxes.
- **QUESTIONS**: Pre-fill question1/question2/question3 from `defaultValues.questions` array (index 0, 1, 2).
- **PATTERN**: Mirror the exact form markup and styling from `request-feedback/new/page.tsx`.
- **GOTCHA**: Checkbox `defaultChecked` needs to compare against the `defaultValues.categories` and `defaultValues.focus_areas` arrays. Use `defaultValues?.categories?.includes(cat)`.
- **VALIDATE**: `npm run build` passes.

### Task 2: UPDATE `app/(protected)/dashboard/request-feedback/new/page.tsx`

- **REFACTOR**: Replace inline form with `<FeedbackRequestForm>` component.
- **KEEP**: All server-side checks (auth, active user, project limit) remain in this server component.
- **KEEP**: The Card wrapper, header text, and back link in the server component.
- **IMPORT**: `import { FeedbackRequestForm } from "@/components/protected/dashboard/FeedbackRequestForm"`.
- **PASS**: `action={submitFeedbackRequest}`, `submitLabel="Submit Request"`, no `defaultValues`.
- **VALIDATE**: New request page still works visually and functionally. `npm run build` passes.

### Task 3: ADD `updateFeedbackRequest` server action in `app/actions.ts`

- **IMPLEMENT**: New exported async function:
  ```typescript
  export async function updateFeedbackRequest(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return redirect("/signin");

    const id = formData.get("id")?.toString();
    if (!id) return encodedRedirect("error", "/dashboard/request-feedback", "Missing feedback request ID");

    // Fetch existing record
    const { data: existing } = await supabase
      .from("feedback_requests")
      .select("id, user_id, status")
      .eq("id", id)
      .single();

    if (!existing) return encodedRedirect("error", "/dashboard/request-feedback", "Feedback request not found");

    // Ownership check (defense-in-depth, RLS also enforces)
    if (existing.user_id !== user.id) {
      return encodedRedirect("error", "/dashboard/request-feedback", "You can only edit your own feedback requests");
    }

    // Status-based editability
    const editableStatuses = ["draft", "open", "in_review"];
    if (!editableStatuses.includes(existing.status)) {
      return encodedRedirect("error", `/dashboard/request-feedback/${id}`, "Completed or closed requests cannot be edited");
    }

    // Extract form fields
    const title = formData.get("title")?.toString();
    const url = formData.get("url")?.toString() || null;
    const description = formData.get("description")?.toString() || null;
    const stage = formData.get("stage")?.toString() || null;
    const categories = formData.getAll("categories").map(String).filter(Boolean);
    const focusAreas = formData.getAll("focus_areas").map(String).filter(Boolean);
    const questions = [
      formData.get("question1")?.toString(),
      formData.get("question2")?.toString(),
      formData.get("question3")?.toString(),
    ].filter(Boolean) as string[];

    if (!title) {
      return encodedRedirect("error", `/dashboard/request-feedback/${id}/edit`, "Project name is required");
    }

    // Build update payload based on status
    let updatePayload: Record<string, any>;
    if (existing.status === "in_review") {
      // Limited editing: only description, focus areas, questions
      updatePayload = { description, focus_areas: focusAreas, questions };
    } else {
      // Full editing for draft and open
      updatePayload = { title, url, description, stage, categories, focus_areas: focusAreas, questions };
    }

    const { error } = await supabase
      .from("feedback_requests")
      .update(updatePayload)
      .eq("id", id);

    if (error) {
      return encodedRedirect("error", `/dashboard/request-feedback/${id}/edit`, "Failed to update feedback request");
    }

    // PostHog tracking
    const posthog = getPostHogClient();
    posthog.capture({
      distinctId: user.id,
      event: "feedback_request_updated",
      properties: {
        feedback_request_id: id,
        status: existing.status,
        fields_updated: Object.keys(updatePayload),
      },
    });

    return encodedRedirect("success", `/dashboard/request-feedback/${id}`, "Feedback request updated");
  }
  ```
- **IMPORTS**: Uses same imports already at top of file (createClient, encodedRedirect, redirect, getPostHogClient).
- **PLACEMENT**: After `submitFeedbackRequest` (around line 335).
- **GOTCHA**: Do NOT change status or queue_position in the update. Those are system-controlled.
- **VALIDATE**: `npm run build` passes.

### Task 4: ADD `publishDraftFeedbackRequest` server action in `app/actions.ts`

- **IMPLEMENT**: New exported async function that transitions a draft to open:
  ```typescript
  export async function publishDraftFeedbackRequest(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return redirect("/signin");

    const activeCheck = await requireActiveUser(supabase, user.id);
    if (activeCheck.error) {
      return encodedRedirect("error", "/dashboard", activeCheck.error);
    }

    const id = formData.get("id")?.toString();
    if (!id) return encodedRedirect("error", "/dashboard/request-feedback", "Missing feedback request ID");

    // Fetch existing record
    const { data: existing } = await supabase
      .from("feedback_requests")
      .select("id, user_id, status, title")
      .eq("id", id)
      .single();

    if (!existing || existing.user_id !== user.id) {
      return encodedRedirect("error", "/dashboard/request-feedback", "Feedback request not found");
    }

    if (existing.status !== "draft") {
      return encodedRedirect("error", `/dashboard/request-feedback/${id}`, "Only draft requests can be published");
    }

    // Same checks as submitFeedbackRequest: points and project limit
    const settings = await getSettings();

    const { data: profile } = await supabase
      .from("profiles")
      .select("peer_points_balance")
      .eq("id", user.id)
      .single();

    if (!profile || profile.peer_points_balance < settings.review_cost_amount) {
      return encodedRedirect("error", `/dashboard/request-feedback/${id}/edit`, `You need at least ${settings.review_cost_amount} PeerPoint${settings.review_cost_amount !== 1 ? "s" : ""} to publish. Give feedback to earn points!`);
    }

    const { count: activeCount } = await supabase
      .from("feedback_requests")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("status", "open")
      .not("queue_position", "is", null);

    if ((activeCount ?? 0) >= settings.active_project_limit) {
      return encodedRedirect("error", `/dashboard/request-feedback/${id}/edit`, `You can only have ${settings.active_project_limit} active project${settings.active_project_limit !== 1 ? "s" : ""} in the queue at a time.`);
    }

    // Update status to open
    const { error: updateError } = await supabase
      .from("feedback_requests")
      .update({ status: "open" })
      .eq("id", id);

    if (updateError) {
      return encodedRedirect("error", `/dashboard/request-feedback/${id}/edit`, "Failed to publish feedback request");
    }

    // Assign queue position
    await supabase.rpc("assign_queue_position", { p_pr_id: id });

    const posthog = getPostHogClient();
    posthog.capture({
      distinctId: user.id,
      event: "feedback_request_published",
      properties: { feedback_request_id: id, title: existing.title },
    });

    return encodedRedirect("success", `/dashboard/request-feedback/${id}`, "Feedback request published and added to queue!");
  }
  ```
- **PLACEMENT**: Immediately after `updateFeedbackRequest`.
- **VALIDATE**: `npm run build` passes.

### Task 5: CREATE `app/(protected)/dashboard/request-feedback/[id]/edit/page.tsx`

- **IMPLEMENT**: Server component that:
  1. Fetches the feedback request by ID from Supabase.
  2. Validates user is authenticated and is the owner.
  3. Checks status is editable (draft, open, or in_review).
  4. Renders a Card with `<FeedbackRequestForm>` pre-filled with existing values.
  5. For drafts: shows both "Save Draft" and "Publish" buttons.
  6. For in_review: shows a notice that only some fields are editable, and disables title/url/stage/categories fields via a `restrictedFields` prop.
- **PATTERN**: Mirror the layout of `request-feedback/new/page.tsx` (back link, Card wrapper, header).
- **IMPORTS**:
  ```typescript
  import Link from "next/link";
  import { ArrowLeft, AlertCircle } from "lucide-react";
  import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
  import { FeedbackRequestForm } from "@/components/protected/dashboard/FeedbackRequestForm";
  import { updateFeedbackRequest, publishDraftFeedbackRequest } from "@/app/actions";
  import { createClient } from "@/utils/supabase/server";
  import { redirect } from "next/navigation";
  ```
- **PROPS**: `params: Promise<{ id: string }>` (Next.js 15 async params pattern, matching the detail page).
- **HEADER TEXT**: "Edit Feedback Request" for open/in_review, "Edit Draft" for draft status.
- **DRAFT CTA**: For drafts, show a note: "This is a draft. Publish it to start receiving feedback."
- **IN_REVIEW NOTE**: "This project is currently being reviewed. Only description, focus areas, and questions can be edited."
- **VALIDATE**: `npm run build` passes. Navigating to `/dashboard/request-feedback/[id]/edit` shows the pre-filled form.

### Task 6: UPDATE `FeedbackRequestForm` to support restricted mode

- **ADD PROP**: `restrictedFields?: string[]` - array of field names to disable (for in_review status).
- **IMPLEMENT**: When a field name is in `restrictedFields`, render the input with `disabled` attribute and reduced opacity class (`opacity-50`).
- **USAGE**: Edit page passes `restrictedFields={["title", "url", "stage", "categories"]}` when status is `in_review`.
- **VALIDATE**: `npm run build` passes.

### Task 7: UPDATE `app/(protected)/dashboard/request-feedback/[id]/page.tsx` - Add Edit button

- **ADD**: Import `Pencil` from `lucide-react`.
- **ADD**: An Edit button next to the status badge in the header, visible only when `isOwner` AND status is draft, open, or in_review:
  ```tsx
  {isOwner && ["draft", "open", "in_review"].includes(pr.status) && (
    <Link href={`/dashboard/request-feedback/${pr.id}/edit`}>
      <Button variant="outline" size="sm" className="flex items-center gap-1.5">
        <Pencil className="h-3.5 w-3.5" />
        Edit
      </Button>
    </Link>
  )}
  ```
- **PLACEMENT**: In the header `<div>` between the title area and the status badge.
- **VALIDATE**: Detail page shows Edit button for owned draft/open/in_review requests but not for completed/closed.

### Task 8: UPDATE `app/(protected)/dashboard/request-feedback/page.tsx` - Add Edit link in listing

- **ADD**: Import `Pencil` from `lucide-react`.
- **ADD**: In the Actions `<td>` for active requests, add an Edit button alongside View:
  ```tsx
  <td className="px-4 py-4 flex items-center gap-2">
    <Link href={`/dashboard/request-feedback/${pr.id}/edit`}>
      <Button variant="outline" size="sm">
        <Pencil className="h-3.5 w-3.5 mr-1" />
        Edit
      </Button>
    </Link>
    <Link href={`/dashboard/request-feedback/${pr.id}`}>
      <Button variant="outline" size="sm">
        View
      </Button>
    </Link>
  </td>
  ```
- **NOTE**: Only show Edit for active requests (the active tab already filters to draft/open/in_review). Completed tab keeps just "View Feedback".
- **VALIDATE**: Listing page shows Edit + View buttons in the active tab.

### Task 9: UPDATE `app/(protected)/dashboard/request-feedback/drafts/[id]/page.tsx` - Redirect to edit

- **REFACTOR**: Replace the placeholder content with a redirect to the edit page:
  ```tsx
  import { redirect } from "next/navigation";

  type Props = {
    params: Promise<{ id: string }>;
  };

  export default async function DraftFeedbackRequestPage({ params }: Props) {
    const { id } = await params;
    redirect(`/dashboard/request-feedback/${id}/edit`);
  }
  ```
- **WHY**: The draft page was a placeholder that showed "not supported". Now drafts go to the edit page where they can be enriched and published.
- **VALIDATE**: Navigating to `/dashboard/request-feedback/drafts/[id]` redirects to the edit page.

---

## TESTING STRATEGY

### Manual Testing (no test framework configured)

**Test Case 1: Edit an open feedback request**
1. Create a new feedback request with all fields filled
2. Navigate to its detail page
3. Click Edit
4. Change title, description, add/remove categories
5. Save, verify changes appear on detail page
6. Verify toast shows "Feedback request updated"

**Test Case 2: Edit a draft from onboarding**
1. Create a new user, go through onboarding, save project as draft
2. Navigate to listing page, click Edit on the draft
3. Add description, stage, categories, focus areas, questions
4. Click "Save Draft" (stays as draft)
5. Click "Publish" (transitions to open, enters queue)
6. Verify listing shows project as Open with queue position

**Test Case 3: Restricted editing for in_review**
1. Have a project that's currently in_review (claimed by reviewer)
2. Navigate to edit page
3. Verify title, URL, stage, categories are disabled
4. Verify description, focus areas, questions are editable
5. Save changes, verify only allowed fields updated

**Test Case 4: Cannot edit completed/closed requests**
1. Navigate to a completed feedback request's detail page
2. Verify no Edit button is shown
3. Attempt to navigate directly to `/request-feedback/[id]/edit`
4. Verify redirect back to detail page with error

**Test Case 5: Publish draft checks points and limits**
1. Create a draft project
2. Set PeerPoints balance to 0
3. Try to publish, verify error about insufficient points
4. Fill up to active project limit
5. Try to publish, verify error about limit reached

### Edge Cases

- Editing a request that doesn't exist (should redirect with error)
- Editing someone else's request (RLS blocks it, server action also checks)
- Publishing a non-draft (should show error)
- Submitting edit form with empty title (should show validation error)
- Draft redirect route (`/drafts/[id]`) correctly sends to edit page

---

## VALIDATION COMMANDS

### Level 1: Build Check
```bash
npm run build
```

### Level 2: Manual Navigation
- Visit `/dashboard/request-feedback` and verify Edit buttons appear
- Visit `/dashboard/request-feedback/[id]` and verify Edit button for owned projects
- Visit `/dashboard/request-feedback/[id]/edit` and verify form pre-fills
- Visit `/dashboard/request-feedback/drafts/[id]` and verify redirect to edit

### Level 3: Server Action Verification
- Submit the edit form and verify redirect with success toast
- Check database to confirm fields updated correctly
- Verify PostHog events appear in dashboard

---

## ACCEPTANCE CRITERIA

- [ ] Users can edit feedback requests they own (draft, open, in_review statuses)
- [ ] Edit page pre-fills all existing field values
- [ ] Draft requests can be published from the edit page (with points/limit validation)
- [ ] In_review requests restrict editing to description, focus areas, and questions only
- [ ] Completed and closed requests cannot be edited (no button shown, server action rejects)
- [ ] Ownership is validated both in the UI (isOwner check) and server action
- [ ] Edit buttons appear on both the detail page and listing page for editable requests
- [ ] Draft redirect route sends users to the edit page
- [ ] `npm run build` passes with no new errors
- [ ] PostHog events tracked for updates and publishes
- [ ] Form component is shared between new and edit pages (no duplication)

---

## COMPLETION CHECKLIST

- [ ] All tasks completed in order (1 through 9)
- [ ] `npm run build` passes
- [ ] Manual testing confirms edit flow works for draft, open, in_review
- [ ] Manual testing confirms publish draft flow works
- [ ] Manual testing confirms restricted editing for in_review
- [ ] Manual testing confirms no edit for completed/closed
- [ ] Listing page shows Edit buttons in active tab
- [ ] Detail page shows Edit button for owner
- [ ] Draft redirect works

---

## NOTES

- **No database migration needed.** The RLS UPDATE policy already allows owners to update their feedback_requests. The status CHECK constraint already includes all needed values.
- **Queue position preserved on edit.** When editing an open request, the queue_position is not changed. The user keeps their place in line.
- **Sub-features deferred.** The GH issue also mentions `feedback_goal` and pause/resume queue features as sub-items. These are NOT included in this plan and should be planned separately if desired.
- **The shared form component uses `"use client"` directive** because it needs `defaultChecked` on checkboxes which requires client-side rendering for proper hydration with dynamic values. The wrapper pages remain server components.
- **Never use em dashes in any copy.** Use commas, periods, or restructure sentences instead.
