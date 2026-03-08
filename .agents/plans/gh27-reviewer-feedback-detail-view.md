# Feature: Reviewer Feedback Detail View (GH #27)

The following plan should be complete, but validate documentation and codebase patterns before implementing.

Pay special attention to naming of existing utils, types, and models. Import from the right files.

## Feature Description

Reviewers currently see their completed feedback as static, non-clickable table rows on `/dashboard/feedback/completed`. This feature adds a dedicated detail page at `/dashboard/feedback/[id]` where reviewers can see the full details of feedback they gave: their recorded video, written notes, star rating, project owner's response (approved/rejected), builder quality rating, and points earned.

## User Story

As a reviewer
I want to click on my completed feedback entries to see the full details
So that I can revisit my video, written notes, and see how the project owner responded to my feedback

## Problem Statement

Reviewers have no way to revisit their past feedback. The completed feedback table shows only project name, status, date, and points with no clickable elements or detail views.

## Solution Statement

1. Make each row in the completed feedback table clickable, linking to `/dashboard/feedback/[reviewId]`
2. Create a new detail page at `app/(protected)/dashboard/feedback/[id]/page.tsx` that shows the reviewer's own feedback in full detail
3. The page fetches the review by ID, verifies the current user is the reviewer, and displays video playback, written strengths/improvements, star rating, status, and builder rating if given

## Feature Metadata

**Feature Type**: New Capability
**Estimated Complexity**: Low-Medium
**Primary Systems Affected**: Feedback completed page, new feedback detail route
**Dependencies**: None (all DB fields already exist, RLS already permits reviewer reads)

---

## CONTEXT REFERENCES

### Relevant Codebase Files YOU MUST READ BEFORE IMPLEMENTING

- `app/(protected)/dashboard/feedback/completed/page.tsx` (all 75 lines) - The table that needs clickable rows
- `app/(protected)/dashboard/projects/[id]/page.tsx` (all 279 lines) - Owner's project detail page; mirror its layout patterns (back arrow, Card, video playback, strengths/improvements grid, star rating display)
- `app/(protected)/dashboard/feedback/[id]/review/page.tsx` (all 62 lines) - Existing route under feedback/[id]; the new page.tsx sits alongside this `review/` subfolder
- `components/protected/dashboard/ReviewQualityPanel.tsx` (all 169 lines) - Shows builder rating/flags/feedback in read-only mode; reuse the read-only display pattern
- `components/protected/dashboard/SignalBadges.tsx` (all 39 lines) - Read-only signal display; reuse for reviewer's own signals
- `components/ui/card/index.tsx` - Card, CardHeader, CardTitle, CardContent components
- `components/ui/badge/Badge.tsx` - Badge component with variant/color props
- `types/database.types.ts` (lines 243-262) - Reviews table Row type with all available fields

### New Files to Create

- `app/(protected)/dashboard/feedback/[id]/page.tsx` - Reviewer's feedback detail page (Server Component)

### Files to Modify

- `app/(protected)/dashboard/feedback/completed/page.tsx` - Make table rows clickable with Link

### Patterns to Follow

**Page Structure Pattern** (from `projects/[id]/page.tsx`):
```tsx
// Back navigation + title header
<div className="flex items-center space-x-2">
  <Link href="/dashboard/feedback/completed" className="text-dark-text-muted hover:text-dark-text">
    <ArrowLeft className="h-5 w-5" />
  </Link>
  <h1 className="text-xl font-semibold">{title}</h1>
</div>
```

**Video Playback Pattern** (from `projects/[id]/page.tsx` line 190-192):
```tsx
<div className="rounded-md overflow-hidden bg-black">
  <video src={review.video_url} controls className="w-full max-h-[400px]" />
</div>
```

**Strengths/Improvements Grid Pattern** (from `projects/[id]/page.tsx` lines 195-208):
```tsx
<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
  {review.strengths && (
    <div>
      <h3 className="font-medium text-green-400 mb-2">Strengths</h3>
      <p className="text-dark-text-muted text-sm">{review.strengths}</p>
    </div>
  )}
  {review.improvements && (
    <div>
      <h3 className="font-medium text-amber-400 mb-2">Areas for Improvement</h3>
      <p className="text-dark-text-muted text-sm">{review.improvements}</p>
    </div>
  )}
</div>
```

**Star Rating Display Pattern** (from `projects/[id]/page.tsx` lines 160-172):
```tsx
<div className="flex">
  {[...Array(5)].map((_, i) => (
    <svg
      key={i}
      xmlns="http://www.w3.org/2000/svg"
      className={`h-4 w-4 ${i < (review.rating || 0) ? "text-yellow-400" : "text-dark-text-muted/50"}`}
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  ))}
</div>
```

**Status Badge Pattern** (from `feedback/completed/page.tsx` lines 40-48):
```tsx
<Badge variant="outline" className={
  review.status === "approved"
    ? "bg-dark-surface text-green-400"
    : review.status === "rejected"
    ? "bg-dark-surface text-red-400"
    : "bg-dark-surface text-yellow-400"
}>
```

**Auth + Data Fetching Pattern** (every Server Component page):
```tsx
const supabase = await createClient();
const { data: { user } } = await supabase.auth.getUser();
if (!user) return redirect("/signin");
```

**Naming Convention**: kebab-case files, PascalCase components, camelCase variables
**Import alias**: `@/*` maps to project root

---

## IMPLEMENTATION PLAN

### Phase 1: Make Completed Feedback Rows Clickable

Update the existing completed feedback table to wrap each row's project title in a `Link` component pointing to `/dashboard/feedback/[reviewId]`.

### Phase 2: Create Reviewer Feedback Detail Page

Create a Server Component at `app/(protected)/dashboard/feedback/[id]/page.tsx` that:
1. Fetches the review by ID
2. Verifies the current user is the reviewer (authorization)
3. Joins the feedback_requests table for project context
4. Displays all review details in a Card-based layout matching the project detail page style

### Phase 3: Validation

Manual testing of both the clickable rows and the detail page across all three statuses.

---

## STEP-BY-STEP TASKS

### Task 1: UPDATE `app/(protected)/dashboard/feedback/completed/page.tsx`

Make table rows clickable by linking the project title to the detail view.

- **IMPLEMENT**: Import `Link` from `next/link`. Wrap the project title text in `<td>` (line 38) with a `<Link>` to `/dashboard/feedback/${review.id}`. Add hover styling.
- **PATTERN**: In-progress page uses `Link` for navigation (`feedback/in-progress/page.tsx` line 30)
- **IMPORTS**: `import Link from "next/link";`
- **GOTCHA**: Link to `/dashboard/feedback/${review.id}` using the review ID, not the feedback_request_id. The detail page will look up the review by its own ID.
- **GOTCHA**: Also make the entire row clickable with cursor-pointer and hover:bg styling for better UX. Use `onClick` with `router.push` on `<tr>` OR simply style the `<Link>` on the project name column. Since this is a Server Component, use the Link approach on the project title cell only (no client interactivity needed).
- **VALIDATE**: `npm run build` should pass. Navigate to `/dashboard/feedback/completed` and verify project names are rendered as links.

### Task 2: CREATE `app/(protected)/dashboard/feedback/[id]/page.tsx`

Create the reviewer's feedback detail page.

- **IMPLEMENT**: Server Component that:
  1. Extracts `id` from params (same pattern as `projects/[id]/page.tsx` line 22)
  2. Auth check: get user, redirect to `/signin` if not authenticated
  3. Fetch the review by ID: `supabase.from("reviews").select("*, feedback_requests(*)").eq("id", id).single()`
  4. Authorization: if `review.reviewer_id !== user.id`, redirect to `/dashboard/feedback/completed` (reviewer can only see their own)
  5. Redirect to `/dashboard/feedback/completed` if review not found
  6. Render the detail view with:
     - Back arrow linking to `/dashboard/feedback/completed`
     - Title: project name from `review.feedback_requests.title`
     - Status badge (approved/rejected/submitted) using the same color pattern
     - Submission date
     - Card with video playback (if video_url exists)
     - Card with written feedback (strengths + improvements in 2-col grid)
     - Card with your rating (star display) and reviewer signals (SignalBadges)
     - Card with builder's response (only if builder_rating exists): show builder rating as stars, flags as badges, and builder_feedback text
     - Points earned indicator (approved = +1, otherwise 0)

- **PATTERN**: Mirror `projects/[id]/page.tsx` layout structure (back arrow, cards, video, text grid)
- **IMPORTS**:
  ```
  import React from "react";
  import Link from "next/link";
  import { redirect } from "next/navigation";
  import { ArrowLeft, Video, Star } from "lucide-react";
  import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
  import { Badge } from "@/components/ui/badge";
  import { createClient } from "@/utils/supabase/server";
  import { SignalBadges } from "@/components/protected/dashboard/SignalBadges";
  ```
- **GOTCHA**: This route coexists with `feedback/[id]/review/page.tsx`. Next.js handles this fine since `page.tsx` is at `[id]/` level and the existing review page is at `[id]/review/` level. No conflict.
- **GOTCHA**: RLS already allows reviewers to SELECT their own reviews (policy `reviews_select` checks `auth.uid() = reviewer_id`), so no migration needed.
- **GOTCHA**: Do NOT show the ReviewQualityPanel (that's the owner's interactive rating tool). Instead, show the builder_rating/builder_flags/builder_feedback as read-only display if they exist.
- **GOTCHA**: Do NOT show SignalBadges disclaimer text ("only you can see these") since this is the reviewer's own page, not the owner's. The SignalBadges component already handles this, but verify it renders correctly.
- **GOTCHA**: Never use em dashes in any text copy.
- **VALIDATE**: `npm run build` should pass. Navigate to `/dashboard/feedback/[reviewId]` for reviews in each status (submitted, approved, rejected) and verify all sections render.

---

## TESTING STRATEGY

No test framework is configured (hackathon project), so validation is manual only.

### Manual Test Cases

1. **Completed table links**: Navigate to `/dashboard/feedback/completed`, verify each project name is a clickable link
2. **Detail page - Approved review**: Click an approved review, verify video plays, strengths/improvements shown, status shows "Approved" in green, points show "+1"
3. **Detail page - Rejected review**: Click a rejected review, verify status shows "Rejected" in red, points show "0"
4. **Detail page - Submitted review**: Click a submitted (pending) review, verify status shows "Submitted" in yellow
5. **Builder rating display**: If builder has rated the review, verify stars and flags display correctly
6. **Authorization**: Try accessing a review ID that belongs to another user, verify redirect to completed page
7. **404 handling**: Try accessing a non-existent review ID, verify redirect to completed page

---

## VALIDATION COMMANDS

### Level 1: Build Check

```bash
npm run build
```

### Level 4: Manual Validation

1. Start dev server: `npm run dev`
2. Log in as a user who has submitted reviews
3. Navigate to `/dashboard/feedback/completed`
4. Verify project names are clickable links
5. Click a completed review
6. Verify the detail page loads with all sections:
   - Back arrow navigation works
   - Video playback works (if video exists)
   - Strengths and improvements text display
   - Star rating displays correctly
   - Status badge shows correct color
   - Builder rating section shows if available
   - Points earned indicator is accurate

---

## ACCEPTANCE CRITERIA

- [x] Each completed feedback row links to a detail view via project name
- [ ] Detail view shows: video playback, written notes, status (approved/rejected/submitted), builder rating if given
- [ ] Works for all three statuses: submitted, approved, rejected
- [ ] Consistent styling with project detail page (`projects/[id]/page.tsx`)
- [ ] Authorization: reviewer can only see their own reviews
- [ ] Back navigation returns to completed feedback list
- [ ] Build passes with no new errors

---

## COMPLETION CHECKLIST

- [ ] Task 1 completed: completed table rows are clickable
- [ ] Task 2 completed: detail page created and renders all sections
- [ ] `npm run build` passes
- [ ] Manual testing confirms feature works for all 3 review statuses
- [ ] Authorization verified (redirect for non-owner access)
- [ ] Styling consistent with existing detail pages

---

## NOTES

**Design Decision: Standalone page vs. redirect to project page**
We chose a standalone `/dashboard/feedback/[id]` page rather than linking to `projects/[feedbackRequestId]` because:
1. The project detail page is owner-centric (shows approve/reject buttons, quality rating panel, signal badges with "only you can see" text)
2. RLS allows reviewer SELECT on reviews, but the project detail page fetches the feedback_request directly which may have different owner-only display logic
3. A dedicated reviewer view gives us freedom to show reviewer-specific context (points earned, builder's rating of their feedback) without complicating the owner's page

**RLS Confirmation**: The `reviews_select` policy allows `auth.uid() = reviewer_id`, so the reviewer can fetch their own review. The join to `feedback_requests(*)` works because feedback_requests has its own SELECT policy. No migration needed.

**Route Coexistence**: `feedback/[id]/page.tsx` (new) coexists with `feedback/[id]/review/page.tsx` (existing). Next.js resolves these as separate routes. No conflict.
