# Feature: 7.2 Terminology Migration — "Pull Request" → "Feedback Request"

The following plan should be complete, but validate documentation and codebase patterns before implementing.

Pay special attention to naming of existing utils, types, and models. Import from the right files.

## Feature Description

Replace all occurrences of "Pull Request" / "PullRequest" / "pull_request" terminology with "Feedback Request" / "FeedbackRequest" / "feedback_request" across the entire codebase — database schema, server actions, page components, UI copy, and documentation. The route paths (`/request-feedback`, `/submit-feedback`) are already correct and stay unchanged.

## User Story

As a non-technical founder using PeerPull
I want the platform to use "Feedback Request" instead of "Pull Request"
So that the UI language is intuitive and doesn't confuse me with developer jargon

## Problem Statement

The codebase uses developer-centric "Pull Request" terminology inherited from the original concept. This confuses non-technical users (founders, makers, investors) who don't know what a "Pull Request" means. There are 120+ occurrences across 26+ files.

## Solution Statement

Perform a comprehensive rename across all layers: database table/columns → server actions → page components → UI labels → documentation. Execute as a single atomic effort to avoid partial migration confusion.

## Feature Metadata

**Feature Type**: Refactor
**Estimated Complexity**: Medium
**Primary Systems Affected**: Database schema, server actions, all dashboard pages, public marketing pages, components
**Dependencies**: None — purely a rename operation

---

## CONTEXT REFERENCES

### Relevant Codebase Files — MUST READ BEFORE IMPLEMENTING

#### Database Layer
- `supabase/migrations/20260218000000_create_mvp_tables.sql` — Original table creation (`pull_requests` table, lines 10-24), RLS policies (lines 57-67), FK `pull_request_id` on reviews (line 29)
- `supabase/migrations/20260221000000_fifo_queue.sql` — Queue sequence `pull_requests_queue_seq` (line 12), index `idx_pull_requests_queue_position` (lines 15-16), RPC functions referencing `pull_requests` throughout
- `supabase/migrations/20260222000000_beta_launch_economy.sql` — RPC functions and ALTER TABLE statements referencing `pull_requests`
- `supabase/migrations/20260218000002_fix_review_update_rls.sql` — RLS policy references `pull_request_id`
- `supabase/migrations/20260221200000_seed_feature_requests.sql` — Seed INSERT statements into `pull_requests`

#### Server Actions
- `app/actions.ts` — `submitPullRequest()` function (line 159), `.from("pull_requests")` queries (lines 195, 205), `pull_request_id` column refs (lines 335, 345, 371, 381), error messages (lines 190, 222)

#### Dashboard Pages
- `app/(protected)/dashboard/page.tsx` — Main dashboard: `.from("pull_requests")` (lines 18, 36, 43), join syntax `pull_requests!inner` (line 30), UI labels "PullRequest" (lines 85, 95, 124, 132, 171, 190, 193)
- `app/(protected)/dashboard/request-feedback/page.tsx` — `PullRequestsPage` function (line 9), `.from("pull_requests")` (line 15), variables `activePRs`/`completedPRs` (lines 21, 24), tab label "Active PullRequests" (line 89)
- `app/(protected)/dashboard/request-feedback/[id]/page.tsx` — `PullRequestDetailPage` (line 17), `.from("pull_requests")` (line 24), `.eq("pull_request_id", id)` (line 37)
- `app/(protected)/dashboard/request-feedback/new/page.tsx` — `import { submitPullRequest }` (line 5), `form action={submitPullRequest}` (line 55)
- `app/(protected)/dashboard/request-feedback/drafts/[id]/page.tsx` — `DraftPullRequestPage` (line 10), "Draft PullRequest" heading (line 17)
- `app/(protected)/dashboard/submit-feedback/page.tsx` — `.select("*, pull_requests(*)")` (lines 19, 27), `.pull_request_id` refs (lines 93, 103), `.pull_requests?.title` (lines 94, 139)
- `app/(protected)/dashboard/submit-feedback/[id]/review/page.tsx` — `.from("pull_requests")` (line 17), `.eq("pull_request_id", id)` (line 35), `pullRequest={}` prop (line 45)
- `app/(protected)/dashboard/submit-feedback/[id]/review/review-session.tsx` — `interface PullRequestData` (line 15), `pullRequest` prop (lines 28, 31), usage throughout (lines 105-187)
- `app/(protected)/dashboard/admin/page.tsx` — `.from("pull_requests")` (line 28)
- `app/(protected)/dashboard/profile/page.tsx` — `.from("pull_requests")` (line 26), "PullRequests" label (line 65)
- `app/(protected)/dashboard/help/page.tsx` — "PullRequest" in FAQ content (lines 26, 54, 74, 147)
- `app/(protected)/dashboard/peerpoints/page.tsx` — "PullRequest submitted" (line 104), "Submit a PullRequest" (line 140)
- `app/(protected)/dashboard/settings/page.tsx` — "PullRequest" in notification labels (lines 310, 316, 326, 336, 350, 352, 539, 570)

#### Components
- `components/protected/dashboard/GettingStartedChecklist.tsx` — `import { submitPullRequest }` (line 7), `await submitPullRequest(formData)` (line 123)
- `components/public/home/HowItWorks.tsx` — "Submit Your PullRequest" (line 9)
- `components/public/home/Problem.tsx` — "as a PullRequest" (line 82)
- `components/public/home/Solution.tsx` — "as a PullRequest" (line 27)
- `components/public/home/FAQ.tsx` — "as a PullRequest" (line 71)

#### Documentation (lower priority)
- `docs/project.md`, `docs/ui_mockup.md`, `docs/homepage.md`, `docs/launch-roadmap.md`

### New Files to Create

- `supabase/migrations/<timestamp>_rename_pull_requests_to_feedback_requests.sql` — Database migration for the rename

### Patterns to Follow

**Database Migration Pattern:** See existing migrations in `supabase/migrations/`. Each migration is a timestamped SQL file. Use `ALTER TABLE ... RENAME TO ...` and `ALTER TABLE ... RENAME COLUMN ...` for renames.

**Server Action Pattern:** Actions in `app/actions.ts` use `.from("table_name")` for Supabase queries and `encodedRedirect()` for responses.

**Naming Conventions:**
- Database: `snake_case` — `feedback_requests`, `feedback_request_id`
- TypeScript interfaces: `PascalCase` — `FeedbackRequestData`
- TypeScript variables: `camelCase` — `feedbackRequest`, `activeFeedbackRequests`
- Functions: `camelCase` — `submitFeedbackRequest`
- Page components: `PascalCase` — `FeedbackRequestDetailPage`

---

## IMPLEMENTATION PLAN

### Phase 1: Database Migration
Create a new SQL migration that renames the table, columns, indexes, sequences, constraints, and updates all RPC functions atomically.

### Phase 2: Server Actions
Update `app/actions.ts` — rename `submitPullRequest` to `submitFeedbackRequest`, update all table references and column names.

### Phase 3: Dashboard Pages & Components
Update all `.from("pull_requests")` → `.from("feedback_requests")`, rename component functions, update variable names, fix UI copy.

### Phase 4: Public/Marketing Pages
Update landing page components with new terminology.

### Phase 5: Documentation
Update docs files (lowest priority, can be deferred).

---

## STEP-BY-STEP TASKS

### Task 1: CREATE `supabase/migrations/<timestamp>_rename_pull_requests_to_feedback_requests.sql`

Generate the timestamp as `YYYYMMDD000000` format using the current date or the next available timestamp after the last migration.

**IMPLEMENT:** A single atomic migration that performs all renames. The migration must:

1. **Rename the table:**
```sql
ALTER TABLE public.pull_requests RENAME TO feedback_requests;
```

2. **Rename the FK column on `reviews` table:**
```sql
ALTER TABLE public.reviews RENAME COLUMN pull_request_id TO feedback_request_id;
```

3. **Rename the FK column on `peer_point_transactions` table** (if it has one — verify first):
```sql
-- Only if pull_request_id exists on this table
ALTER TABLE public.peer_point_transactions RENAME COLUMN pull_request_id TO feedback_request_id;
```

4. **Rename the sequence:**
```sql
ALTER SEQUENCE public.pull_requests_queue_seq RENAME TO feedback_requests_queue_seq;
```

5. **Rename indexes:**
```sql
ALTER INDEX idx_pull_requests_queue_position RENAME TO idx_feedback_requests_queue_position;
```

6. **Update RPC functions** — DROP and re-CREATE the following functions with `feedback_requests` references:
   - `assign_queue_position(p_pr_id uuid)` → update internal references to `feedback_requests`
   - `get_next_review(p_reviewer_id uuid)` → update `FROM pull_requests` and `pull_request_id` refs
   - `complete_review_and_charge(p_reviewer_id uuid, p_review_id uuid)` → update all refs
   - Any other RPCs that reference `pull_requests`

7. **Update RLS policies** — DROP and re-CREATE policies on `feedback_requests` table (policies auto-transfer on table rename but verify names):
```sql
-- Policies transfer automatically with table rename, but rename them for clarity:
ALTER POLICY pull_requests_select ON public.feedback_requests RENAME TO feedback_requests_select;
ALTER POLICY pull_requests_insert ON public.feedback_requests RENAME TO feedback_requests_insert;
ALTER POLICY pull_requests_update ON public.feedback_requests RENAME TO feedback_requests_update;
```

8. **Update RLS policies on `reviews` table** that reference `pull_request_id`:
   - DROP and re-CREATE the `reviews_select` policy to reference `feedback_request_id` instead of `pull_request_id`

**PATTERN:** Follow the existing migration format in `supabase/migrations/20260222000000_beta_launch_economy.sql` for RPC function recreation patterns.

**GOTCHA:**
- The RPC functions use `SECURITY DEFINER` — preserve this.
- PostgreSQL `ALTER TABLE RENAME` automatically updates FK constraints, but RPC function bodies are stored as text and must be manually updated.
- Read ALL existing RPC functions in the migration files to get their current signatures and bodies before rewriting them.
- Ensure `SKIP LOCKED` and queue logic is preserved exactly.

**VALIDATE:** After applying migration, verify with:
```sql
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'feedback_requests';
SELECT column_name FROM information_schema.columns WHERE table_name = 'reviews' AND column_name = 'feedback_request_id';
```

---

### Task 2: UPDATE `app/actions.ts`

**IMPLEMENT:**
1. Rename function `submitPullRequest` → `submitFeedbackRequest` (line 159)
2. Replace ALL `.from("pull_requests")` → `.from("feedback_requests")` (lines ~195, 205, and any others)
3. Replace ALL `pull_request_id` column references → `feedback_request_id` (lines ~335, 345, 371, 381)
4. Update error messages: "PullRequest" → "Feedback Request" (lines ~190, 222)
5. Update any comments referencing "pull request"

**IMPORTS:** No new imports needed.

**GOTCHA:** The function `submitPullRequest` is imported by other files — all importers must be updated in subsequent tasks.

**VALIDATE:** `npx next build` should succeed (TS errors are ignored but check for import errors).

---

### Task 3: UPDATE `app/(protected)/dashboard/request-feedback/new/page.tsx`

**IMPLEMENT:**
1. Change import `{ submitPullRequest }` → `{ submitFeedbackRequest }` (line 5)
2. Change `form action={submitPullRequest}` → `form action={submitFeedbackRequest}` (line 55)

**VALIDATE:** File has no TypeScript errors for the import.

---

### Task 4: UPDATE `components/protected/dashboard/GettingStartedChecklist.tsx`

**IMPLEMENT:**
1. Change import `{ submitPullRequest }` → `{ submitFeedbackRequest }` (line 7)
2. Change `await submitPullRequest(formData)` → `await submitFeedbackRequest(formData)` (line 123)

**VALIDATE:** Import resolves correctly.

---

### Task 5: UPDATE `app/(protected)/dashboard/page.tsx`

**IMPLEMENT:**
1. Replace ALL `.from("pull_requests")` → `.from("feedback_requests")` (lines 18, 36, 43)
2. Replace `.select("*, pull_requests!inner(user_id)")` → `.select("*, feedback_requests!inner(user_id)")` (line 30)
3. Replace `.eq("pull_requests.user_id", ...)` → `.eq("feedback_requests.user_id", ...)` (line 31)
4. Replace ALL UI text: "PullRequest" → "Feedback Request", "PullRequests" → "Feedback Requests" (lines 85, 95, 124, 132, 171, 190, 193)
5. Rename any variables like `pullRequests` → `feedbackRequests` if they exist

**VALIDATE:** Page renders without errors.

---

### Task 6: UPDATE `app/(protected)/dashboard/request-feedback/page.tsx`

**IMPLEMENT:**
1. Rename function `PullRequestsPage` → `FeedbackRequestsPage` (line 9)
2. Replace `.from("pull_requests")` → `.from("feedback_requests")` (line 15)
3. Rename variables: `activePRs` → `activeFeedbackRequests`, `completedPRs` → `completedFeedbackRequests` (lines 21, 24 and all usages)
4. Rename any `pullRequests` variable → `feedbackRequests`
5. Update tab label "Active PullRequests" → "Active Feedback Requests" (line 89)

**VALIDATE:** Page loads and displays data correctly.

---

### Task 7: UPDATE `app/(protected)/dashboard/request-feedback/[id]/page.tsx`

**IMPLEMENT:**
1. Rename function `PullRequestDetailPage` → `FeedbackRequestDetailPage` (line 17)
2. Replace `.from("pull_requests")` → `.from("feedback_requests")` (line 24)
3. Replace `.eq("pull_request_id", id)` → `.eq("feedback_request_id", id)` (line 37)
4. Rename any local variables `pullRequest` → `feedbackRequest`

**VALIDATE:** Detail page loads for an existing record.

---

### Task 8: UPDATE `app/(protected)/dashboard/request-feedback/drafts/[id]/page.tsx`

**IMPLEMENT:**
1. Rename function `DraftPullRequestPage` → `DraftFeedbackRequestPage` (line 10)
2. Update heading "Draft PullRequest" → "Draft Feedback Request" (line 17)
3. Update any `.from("pull_requests")` → `.from("feedback_requests")`
4. Update any `pull_request_id` → `feedback_request_id`

**VALIDATE:** Page renders.

---

### Task 9: UPDATE `app/(protected)/dashboard/submit-feedback/page.tsx`

**IMPLEMENT:**
1. Replace `.select("*, pull_requests(*)")` → `.select("*, feedback_requests(*)")` (lines 19, 27)
2. Replace `.pull_request_id` → `.feedback_request_id` (lines 93, 103)
3. Replace `.pull_requests?.title` → `.feedback_requests?.title` (lines 94, 139)
4. Update `href` paths if they reference `pull_request_id` in URL construction

**VALIDATE:** Submit feedback listing page renders with review data.

---

### Task 10: UPDATE `app/(protected)/dashboard/submit-feedback/[id]/review/page.tsx`

**IMPLEMENT:**
1. Replace `.from("pull_requests")` → `.from("feedback_requests")` (line 17)
2. Replace `.eq("pull_request_id", id)` → `.eq("feedback_request_id", id)` (line 35)
3. Rename prop `pullRequest={}` → `feedbackRequest={}` (line 45)

**VALIDATE:** Review page loads for a valid review.

---

### Task 11: UPDATE `app/(protected)/dashboard/submit-feedback/[id]/review/review-session.tsx`

**IMPLEMENT:**
1. Rename `interface PullRequestData` → `interface FeedbackRequestData` (line 15)
2. Rename prop `pullRequest: PullRequestData` → `feedbackRequest: FeedbackRequestData` (line 31)
3. Replace ALL usages of `pullRequest.` → `feedbackRequest.` throughout the component (lines 105-187)
4. Update the prop name in the component function signature (line 28)

**GOTCHA:** This component receives the prop from Task 10's page — both must use the same prop name.

**VALIDATE:** Review session renders with project data.

---

### Task 12: UPDATE `app/(protected)/dashboard/admin/page.tsx`

**IMPLEMENT:**
1. Replace `.from("pull_requests")` → `.from("feedback_requests")` (line 28)
2. Update any variable names or UI labels

**VALIDATE:** Admin page loads.

---

### Task 13: UPDATE `app/(protected)/dashboard/profile/page.tsx`

**IMPLEMENT:**
1. Replace `.from("pull_requests")` → `.from("feedback_requests")` (line 26)
2. Update "PullRequests" label → "Feedback Requests" (line 65)

**VALIDATE:** Profile page shows correct counts.

---

### Task 14: UPDATE `app/(protected)/dashboard/help/page.tsx`

**IMPLEMENT:**
1. Replace ALL "PullRequest" → "Feedback Request" in FAQ content (lines 26, 54, 74, 147)

**VALIDATE:** Help page renders with updated text.

---

### Task 15: UPDATE `app/(protected)/dashboard/peerpoints/page.tsx`

**IMPLEMENT:**
1. Replace "PullRequest submitted" → "Feedback Request submitted" (line 104)
2. Replace "Submit a PullRequest" → "Submit a Feedback Request" (line 140)

**VALIDATE:** PeerPoints page renders correctly.

---

### Task 16: UPDATE `app/(protected)/dashboard/settings/page.tsx`

**IMPLEMENT:**
1. Replace ALL "PullRequest" → "Feedback Request" in notification labels and plan descriptions (lines 310, 316, 326, 336, 350, 352, 539, 570)

**VALIDATE:** Settings page renders with updated labels.

---

### Task 17: UPDATE `components/public/home/HowItWorks.tsx`

**IMPLEMENT:**
1. Replace "Submit Your PullRequest" → "Submit Your Feedback Request" (line 9)

---

### Task 18: UPDATE `components/public/home/Problem.tsx`

**IMPLEMENT:**
1. Replace "as a PullRequest" → "as a Feedback Request" (line 82)

---

### Task 19: UPDATE `components/public/home/Solution.tsx`

**IMPLEMENT:**
1. Replace "as a PullRequest" → "as a Feedback Request" (line 27)

---

### Task 20: UPDATE `components/public/home/FAQ.tsx`

**IMPLEMENT:**
1. Replace "as a PullRequest" → "as a Feedback Request" (line 71)

---

### Task 21: UPDATE Documentation Files

**IMPLEMENT:** Update terminology in these docs files (lower priority):
1. `docs/project.md` — Replace all "PullRequest" / "pull_requests" references
2. `docs/ui_mockup.md` — Replace all "PullRequest" references
3. `docs/homepage.md` — Replace "PullRequest" references
4. `docs/launch-roadmap.md` — Replace `submitPullRequest` and `pull_requests` references

---

### Task 22: UPDATE `CLAUDE.md`

**IMPLEMENT:**
1. Update line 122: Change note about migration being "in progress" to reflect completion
2. Update Database Tables section: `pull_requests` → `feedback_requests` with updated column names
3. Update any other references to old terminology

---

### Task 23: VERIFY — Full Codebase Search

**IMPLEMENT:** Run a final grep across the entire codebase for any remaining occurrences:
```bash
grep -ri "pull.request" --include="*.ts" --include="*.tsx" --include="*.sql" app/ components/ supabase/migrations/ lib/ utils/ hooks/ context/
```

Any remaining matches (excluding old migration files and docs) must be fixed.

**GOTCHA:** Old migration SQL files (before the new rename migration) will still contain `pull_requests` — this is expected and correct. Do NOT modify historical migration files. Only the new migration file and application code should use `feedback_requests`.

---

## TESTING STRATEGY

### No Automated Tests
This project has no test framework configured. Validation is manual.

### Manual Verification
1. Run `npm run build` — should complete without errors
2. Run `npm run dev` and verify:
   - Dashboard page loads with correct "Feedback Request" labels
   - Request Feedback listing page shows existing data
   - Request Feedback detail page loads
   - Submit Feedback page shows review queue with project titles
   - Review session page loads with project data
   - Admin page shows stats
   - Profile page shows feedback request count
   - Settings page shows correct notification labels
   - Help page shows updated FAQ text
   - Landing page shows updated marketing copy

### Edge Cases
- Existing data in `pull_requests` table should seamlessly transfer to `feedback_requests`
- All RPC functions should work with new table/column names
- RLS policies should correctly enforce access control on renamed table
- Supabase joins using `feedback_requests!inner` syntax should work

---

## VALIDATION COMMANDS

### Level 1: Build Check
```bash
npm run build
```

### Level 2: Dev Server
```bash
npm run dev
```
Then manually navigate to each affected page.

### Level 3: Grep Verification
```bash
grep -ri "pull.request" --include="*.ts" --include="*.tsx" app/ components/ lib/ utils/ hooks/ context/
```
Should return 0 matches (excluding any intentional references in old migration SQL files).

### Level 4: Database Verification (after migration applied)
```sql
-- Table exists
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'feedback_requests';

-- Column renamed
SELECT column_name FROM information_schema.columns WHERE table_name = 'reviews' AND column_name = 'feedback_request_id';

-- RPC functions work
SELECT routine_name FROM information_schema.routines WHERE routine_schema = 'public' AND routine_name IN ('assign_queue_position', 'get_next_review', 'complete_review_and_charge');
```

---

## ACCEPTANCE CRITERIA

- [ ] Database migration renames `pull_requests` → `feedback_requests` and all FK columns
- [ ] All RPC functions updated to reference new table/column names
- [ ] RLS policies work correctly on renamed table
- [ ] `submitPullRequest` renamed to `submitFeedbackRequest` in actions.ts
- [ ] All `.from("pull_requests")` calls updated to `.from("feedback_requests")`
- [ ] All `pull_request_id` column references updated to `feedback_request_id`
- [ ] All UI text shows "Feedback Request" instead of "PullRequest" / "Pull Request"
- [ ] Landing page marketing copy updated
- [ ] `npm run build` succeeds
- [ ] All dashboard pages render correctly with existing data
- [ ] No remaining `pull_request` references in TS/TSX files (excluding old migration files)
- [ ] CLAUDE.md updated to reflect completed migration

---

## COMPLETION CHECKLIST

- [ ] All 23 tasks completed in order
- [ ] Database migration file created and syntactically valid
- [ ] `npm run build` passes
- [ ] All pages render correctly in dev server
- [ ] Full codebase grep confirms no remaining old terminology in app code
- [ ] CLAUDE.md reflects the completed migration

---

## NOTES

### Critical Ordering
The database migration (Task 1) must be applied to Supabase BEFORE the app code changes go live, since the app code will reference `feedback_requests` table. In development, apply the migration first, then update the code.

### Historical Migration Files
Do NOT modify any existing migration SQL files. The rename is a NEW migration. Old migrations referencing `pull_requests` are historical records and must stay unchanged.

### Route Paths Stay the Same
The URL routes (`/dashboard/request-feedback`, `/dashboard/submit-feedback`) are already using the correct terminology and do NOT need to change.

### Supabase Join Syntax
When using Supabase PostgREST joins like `.select("*, pull_requests(*)")`, the table name in the select string must match the actual database table name. After rename, this becomes `.select("*, feedback_requests(*)")`.

### Variable Naming Strategy
- `pullRequest` → `feedbackRequest`
- `pullRequests` → `feedbackRequests`
- `activePRs` → `activeFeedbackRequests`
- `completedPRs` → `completedFeedbackRequests`
- `PullRequestData` → `FeedbackRequestData`
- `PullRequestDetailPage` → `FeedbackRequestDetailPage`

### Confidence Score: 8/10
High confidence due to the mechanical nature of the rename. Main risk is missing an RPC function body reference in the SQL migration or a Supabase join syntax that breaks at runtime.
