# Feature: Admin User Detail Page

The following plan should be complete, but its important that you validate documentation and codebase patterns and task sanity before you start implementing.

Pay special attention to naming of existing utils types and models. Import from the right files etc.

## Feature Description

Add an admin user detail page at `/dashboard/admin/users/[id]` that provides a condensed overview of a user's entire account. Accessible by clicking a user's name in the admin users list. Displays profile info, projects (feedback requests), feedback given, feedback received, PeerPoints transaction history, and referrals in a single scrollable page.

## User Story

As an admin
I want to click a user in the admin users list and see a full overview of their account
So that I can quickly understand their activity, diagnose issues, and make informed decisions without querying the database

## Problem Statement

The admin users page only shows a flat table with name, balance, status, and join date. To understand what a user has done on the platform, an admin must manually query the database or navigate multiple pages. There is no way to see a user's projects, reviews, transactions, or referrals from the admin panel.

## Solution Statement

Create a server component page at `/dashboard/admin/users/[id]` that fetches all relevant data for a user and displays it in organized card sections. The admin users list will link each user's name to this detail page. A back link returns to the users list.

## Feature Metadata

**Feature Type**: New Capability
**Estimated Complexity**: Medium
**Primary Systems Affected**: Admin dashboard, users page
**Dependencies**: None (all tables and data already exist)

---

## CONTEXT REFERENCES

### Relevant Codebase Files IMPORTANT: YOU MUST READ THESE FILES BEFORE IMPLEMENTING!

- `app/(protected)/dashboard/admin/layout.tsx` - Admin layout with `is_admin` gate (already protects all child routes)
- `app/(protected)/dashboard/admin/admin-nav.tsx` - Admin tab navigation (Users tab already highlights for `/dashboard/admin/users/*` paths via `startsWith`)
- `app/(protected)/dashboard/admin/users/page.tsx` - Current users list (client component, will add Link on user names)
- `app/(protected)/dashboard/admin/actions.ts` - Admin server actions with `requireAdmin()` pattern
- `app/(protected)/dashboard/profile/page.tsx` - Profile page with stats aggregation queries (mirror this pattern)
- `app/(protected)/dashboard/peerpoints/page.tsx` - Transaction history table (mirror table structure)
- `components/protected/dashboard/ProfileStats.tsx` - Reusable stats component
- `components/protected/dashboard/QualityScoreBadge.tsx` - Quality score badge
- `utils/supabase/profiles.ts` - `Profile` type definition and `getUserProfile()` helper
- `utils/supabase/server.ts` - Server-side Supabase client
- `types/database.types.ts` - Full database type definitions

### New Files to Create

- `app/(protected)/dashboard/admin/users/[id]/page.tsx` - Admin user detail page (server component)

### Files to Modify

- `app/(protected)/dashboard/admin/users/page.tsx` - Add Link on user names to navigate to detail page

### Patterns to Follow

**Admin Auth:** The admin layout already gates access via `is_admin` check. The detail page lives under `/dashboard/admin/users/[id]` so it inherits this protection automatically. No additional auth needed in the page itself.

**Admin Nav:** The `AdminNav` component uses `pathname.startsWith(item.href)` for the Users tab, so `/dashboard/admin/users/[id]` will correctly highlight the Users tab. No nav changes needed.

**Server Component Pattern:** The profile page and peerpoints page are both server components that fetch data directly. Mirror this pattern.

**Data Fetching:** Use the server Supabase client (`createClient()` from `utils/supabase/server.ts`). Fetch all data in parallel where possible. Admin RLS: the Supabase client uses the admin user's session, but RLS on `profiles` allows users to only read their own row. For reading another user's profile, we need to use the `service_role` or use a pattern that works. Looking at the current admin users page, it uses the *client-side* Supabase and queries `profiles` successfully for all users, which means RLS on profiles allows reading all rows (likely `SELECT` is open or has an admin exception). The same should work server-side.

**Table Styling:** Follow the exact table pattern from `peerpoints/page.tsx`:
```tsx
<div className="rounded-md border border-dark-border bg-dark-card overflow-hidden">
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead>
        <tr className="border-b border-dark-border">
          <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider font-medium text-dark-text-muted">Header</th>
        </tr>
      </thead>
      <tbody>
        <tr className="border-b border-dark-border/50">
          <td className="px-4 py-4">Content</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
```

**Card Pattern:**
```tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
```

**Status Badge Colors:**
- Active: `text-green-400`, `bg-green-500/10`
- Waitlisted: `text-yellow-400`, `bg-yellow-500/10`
- Onboarding: `text-blue-400`, `bg-blue-500/10`

**Transaction Type Labels (from peerpoints page):**
```tsx
const typeLabels: Record<string, string> = {
  earned_review: "Feedback submitted",
  spent_submission: "Feedback Request submitted",
  signup_bonus: "Welcome bonus",
  first_review_bonus: "First feedback bonus",
  referral_bonus: "Referral bonus",
  admin_injection: "Bonus points",
};
// For admin_injection with reason, show the reason instead
```

**Amount Colors:**
- Positive: `text-green-400`
- Negative: `text-red-400`

**Date Formatting:** `new Date(date).toLocaleDateString()`

**Empty State:** Center text with `text-dark-text-muted`, e.g. `<p className="text-sm text-dark-text-muted text-center py-6">No projects yet</p>`

---

## IMPLEMENTATION PLAN

### Phase 1: Create the Detail Page

Build the server component that fetches and displays all user data in organized sections.

### Phase 2: Link from Users List

Update the admin users list to make user names clickable, linking to the detail page.

---

## STEP-BY-STEP TASKS

### Task 1: CREATE `app/(protected)/dashboard/admin/users/[id]/page.tsx`

Server component that fetches all data for a given user ID and renders it.

**Page Structure:**

1. **Back link** to `/dashboard/admin/users` (use `ArrowLeft` icon from lucide-react + Link)

2. **Profile Header Card** (full width)
   - Avatar (Avatar/AvatarImage/AvatarFallback), name, email (from auth if possible, but we may not have access to another user's email via auth API, so use profile data), status badge, quality score badge, join date
   - Summary stats row: balance, projects count, reviews given count, reviews received count
   - Expertise tags as badges
   - Website link if present

3. **Two-column grid** (`grid grid-cols-1 lg:grid-cols-2 gap-6`) for the detail sections:

   **Left column:**

   a. **Projects Card** (feedback_requests where `user_id = targetId`)
      - Table with columns: Title, Status, Queue Position, Created
      - Status badge colored by status (open/claimed/closed/draft/live)
      - Show up to 20 most recent, ordered by created_at desc

   b. **Feedback Given Card** (reviews where `reviewer_id = targetId`)
      - Table: Project Title (join feedback_requests.title), Rating (stars), Duration, Status, Date
      - Need to join `feedback_requests` to get the project title
      - Show up to 20 most recent

   **Right column:**

   c. **Feedback Received Card** (reviews on their feedback_requests)
      - First get all their feedback_request IDs, then get reviews on those
      - Table: Project Title, Reviewer (join profiles for name), Builder Rating, Flags, Date
      - Show up to 20 most recent

   d. **PeerPoints History Card** (peer_point_transactions where `user_id = targetId`)
      - Mirror the peerpoints page table exactly
      - Table: Transaction (type label or reason), Date, Amount
      - Color-coded amounts (green positive, red negative)
      - Show all transactions

4. **Referrals Card** (full width, below the grid)
   - "Invited by" section: if `profile.invited_by` is set, look up that user's name from profiles
   - "Users Referred" table: query referrals where `inviter_id = targetId`, join invitee profiles
   - Table: Name, Status, Bonus Awarded, Date

**Data Queries (run in parallel where possible):**

```tsx
// 1. Profile
const { data: profile } = await supabase
  .from("profiles")
  .select("*")
  .eq("id", userId)
  .single();

// 2. Feedback requests (projects)
const { data: feedbackRequests } = await supabase
  .from("feedback_requests")
  .select("id, title, status, queue_position, created_at, url")
  .eq("user_id", userId)
  .order("created_at", { ascending: false })
  .limit(20);

// 3. Reviews given (as reviewer) - join feedback_requests for title
const { data: reviewsGiven } = await supabase
  .from("reviews")
  .select("id, rating, video_duration, status, created_at, submitted_at, feedback_request_id, feedback_requests(title)")
  .eq("reviewer_id", userId)
  .order("created_at", { ascending: false })
  .limit(20);

// 4. Reviews received (on their projects)
const requestIds = feedbackRequests?.map(r => r.id) ?? [];
const { data: reviewsReceived } = requestIds.length > 0
  ? await supabase
      .from("reviews")
      .select("id, builder_rating, builder_flags, builder_feedback, status, created_at, reviewer_id, feedback_request_id, feedback_requests(title), profiles!reviews_reviewer_id_fkey(first_name, last_name)")
      .in("feedback_request_id", requestIds)
      .order("created_at", { ascending: false })
      .limit(20)
  : { data: [] };

// 5. Transactions
const { data: transactions } = await supabase
  .from("peer_point_transactions")
  .select("*")
  .eq("user_id", userId)
  .order("created_at", { ascending: false });

// 6. Referrals (as inviter)
const { data: referralsGiven } = await supabase
  .from("referrals")
  .select("id, invitee_id, bonus_awarded, status, created_at, profiles!referrals_invitee_id_profiles_fkey(first_name, last_name)")
  .eq("inviter_id", userId)
  .order("created_at", { ascending: false });

// 7. Invited by (if profile.invited_by is set)
let invitedByProfile = null;
if (profile?.invited_by) {
  const { data } = await supabase
    .from("profiles")
    .select("first_name, last_name, id")
    .eq("id", profile.invited_by)
    .single();
  invitedByProfile = data;
}
```

**IMPORTANT Notes on Joins:**
- The `reviews` table has `reviewer_id` FK to `profiles`. The Supabase join syntax is: `profiles!reviews_reviewer_id_fkey(first_name, last_name)` but this may not match the exact FK name. If the join fails, fall back to a separate query to fetch reviewer names.
- For `feedback_requests` join from reviews: `feedback_requests(title)` should work since `feedback_request_id` is the FK.
- For referrals: use the explicit FK names from database.types.ts: `profiles!referrals_invitee_id_profiles_fkey(first_name, last_name)`.

**Handle missing user:** If `profile` is null after the query, render a "User not found" message with a back link.

**IMPORTS needed:**
```tsx
import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, ArrowUpRight, ArrowDownRight, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { QualityScoreBadge } from "@/components/protected/dashboard/QualityScoreBadge";
import { createClient } from "@/utils/supabase/server";
```

**VALIDATE:** `npm run build` should complete without errors (TS errors are ignored but JSX/import errors will still fail).

---

### Task 2: UPDATE `app/(protected)/dashboard/admin/users/page.tsx`

Make user names in the table clickable links to the detail page.

**Changes:**
1. Add `import Link from "next/link";` at the top
2. In the table body, wrap the user name cell content in a Link:

**Current code (line ~198-200):**
```tsx
<td className="px-4 py-3 font-medium text-dark-text">
  {u.first_name} {u.last_name}
</td>
```

**New code:**
```tsx
<td className="px-4 py-3 font-medium">
  <Link href={`/dashboard/admin/users/${u.id}`} className="text-primary hover:underline">
    {u.first_name} {u.last_name}
  </Link>
</td>
```

**VALIDATE:** Navigate to `/dashboard/admin/users`, verify names are clickable gold links, and clicking navigates to the detail page.

---

## TESTING STRATEGY

No test framework is configured. Validation is manual.

### Manual Validation Steps

1. Navigate to `/dashboard/admin/users` and verify user names are now clickable links (gold colored)
2. Click a user name and verify the detail page loads at `/dashboard/admin/users/[id]`
3. Verify the "Users" tab in admin nav remains highlighted on the detail page
4. Verify the back link returns to the users list
5. Verify all 6 sections render with correct data:
   - Profile header shows avatar, name, status, quality score, balance, join date, expertise
   - Projects table shows the user's feedback requests
   - Feedback Given table shows reviews they submitted
   - Feedback Received table shows reviews on their projects
   - PeerPoints History shows their transaction ledger
   - Referrals shows who invited them and who they invited
6. Test with a user who has no activity (empty states should display gracefully)
7. Test with a non-existent user ID (should show "User not found")

---

## VALIDATION COMMANDS

### Level 1: Build

```bash
npm run build
```

### Level 2: Manual Navigation

1. Start dev server: `npm run dev`
2. Log in as admin
3. Go to `/dashboard/admin/users`
4. Click a user name
5. Verify all sections load correctly

---

## ACCEPTANCE CRITERIA

- [ ] New page at `/dashboard/admin/users/[id]` renders all 6 sections
- [ ] User names in admin users list are clickable links to the detail page
- [ ] Admin nav "Users" tab stays highlighted on the detail page
- [ ] Back link navigates to `/dashboard/admin/users`
- [ ] Profile header shows: avatar, name, status badge, quality score, balance, join date, expertise, website
- [ ] Projects section shows feedback requests with title, status, queue position, date
- [ ] Feedback Given shows reviews as reviewer with project title, rating, duration, status, date
- [ ] Feedback Received shows reviews on their projects with reviewer name, builder rating, flags, date
- [ ] PeerPoints History mirrors the peerpoints page table format
- [ ] Referrals shows invited-by and users-referred
- [ ] Empty states render gracefully for sections with no data
- [ ] Non-existent user ID shows "User not found" with back link
- [ ] Page follows existing dark theme styling conventions
- [ ] `npm run build` passes

---

## COMPLETION CHECKLIST

- [ ] Detail page created and renders correctly
- [ ] Users list updated with clickable links
- [ ] All 6 sections display correct data
- [ ] Empty states handled
- [ ] 404 case handled
- [ ] Build passes
- [ ] Manual testing confirms feature works

---

## NOTES

- The admin layout already handles auth/admin gating, so the detail page inherits protection.
- The AdminNav `startsWith` check means the Users tab auto-highlights on child routes. No nav changes needed.
- RLS: The admin users page already reads all profiles from the client side successfully, so server-side reads should also work. If any join queries fail due to RLS, fall back to separate queries.
- This is a read-only page. No mutations or server actions needed.
- All data exists in current tables. No migrations required.
