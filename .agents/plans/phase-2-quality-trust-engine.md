# Feature: Phase 2 — Quality & Trust Engine

The following plan should be complete, but validate documentation and codebase patterns before implementing.

Pay special attention to naming of existing utils, types, and models. Import from the right files.

## Feature Description

Build the enhanced review quality controls and reviewer reputation system. This includes:
1. **Reviewer Action Signals** — let reviewers signal interest (follow/engage/invest) after reviewing a project
2. **Enhanced Feedback Quality Panel** — let builders rate/flag/respond to reviews they receive
3. **Reviewer Quality Score** — compute a reputation score from builder ratings
4. **Unified Profile Stats** — display builder + reviewer stats and quality score on the profile page

These features close the feedback loop: reviewers signal intent, builders evaluate quality, and the platform surfaces reputation — creating incentives for high-quality reviews.

## User Stories

**As a Reviewer**, I want to signal my interest in a project after reviewing it (follow/engage/invest), so that the Builder knows their product resonated with me.

**As a Builder**, I want to rate, flag, and respond to reviews I receive, so that low-quality reviewers are identified and high-quality reviewers are rewarded.

**As a User**, I want to see my quality score and stats on my profile, so that I can track my reputation and contributions.

## Problem Statement

Currently, the review cycle ends abruptly: a reviewer submits, the builder can only approve/reject. There's no way to signal interest, rate quality, or build reviewer reputation. This limits the platform's ability to incentivize quality and surface deal flow.

## Solution Statement

Add three boolean signal columns to reviews (follow/engage/invest), three builder evaluation columns (rating/flags/feedback), compute a quality score on profiles, and display aggregated stats. The approve/reject flow is enhanced — not replaced — with a quality panel shown before the approve/reject buttons.

## Feature Metadata

**Feature Type**: New Capability
**Estimated Complexity**: Medium-High
**Primary Systems Affected**: reviews table, profiles table, review submission UI, feedback detail UI, profile page, server actions
**Dependencies**: No external dependencies. All within existing Supabase + Next.js stack.

---

## CONTEXT REFERENCES

### Relevant Codebase Files — MUST READ BEFORE IMPLEMENTING

| File | Lines | Why |
|------|-------|-----|
| `app/actions.ts` | 289-328 | `submitReview` action — add signal fields to FormData + RPC call |
| `app/actions.ts` | 355-390 | `approveReview` action — add builder_rating/flags/feedback before approve |
| `app/actions.ts` | 513-546 | `rejectReview` action — same pattern, add quality fields before reject |
| `app/(protected)/dashboard/submit-feedback/[id]/review/review-session.tsx` | Full file | Review submission UI — add signal checkboxes after the review form |
| `app/(protected)/dashboard/request-feedback/[id]/page.tsx` | Full file | Feedback detail page — add quality panel + signal display |
| `app/(protected)/dashboard/request-feedback/[id]/review-actions.tsx` | Full file | Current approve/reject buttons — enhance with quality panel |
| `app/(protected)/dashboard/profile/page.tsx` | Full file | Profile page — add stats section + quality score |
| `components/protected/dashboard/EditProfileForm.tsx` | Full file | Profile form patterns |
| `types/database.types.ts` | Full file | Current DB types — must update after migration |
| `supabase/migrations/20260303000000_atomic_review_submit.sql` | Full file | `submit_review_atomic` RPC — must update to handle signals |
| `supabase/migrations/20260218000000_create_mvp_tables.sql` | Full file | Original schema reference |
| `utils/supabase/settings.ts` | Full file | Settings helper pattern |

### New Files to Create

| File | Purpose |
|------|---------|
| `supabase/migrations/20260304000000_phase2_quality_trust.sql` | Migration: add columns to reviews + profiles, create quality score RPC |
| `components/protected/dashboard/ReviewQualityPanel.tsx` | Client component: star rating + flags + text feedback for builders |
| `components/protected/dashboard/ReviewerSignals.tsx` | Client component: follow/engage/invest checkboxes on review form |
| `components/protected/dashboard/SignalBadges.tsx` | Display component: show signal badges on feedback detail page |
| `components/protected/dashboard/QualityScoreBadge.tsx` | Display component: quality score visual on profile |
| `components/protected/dashboard/ProfileStats.tsx` | Display component: builder + reviewer stat cards |

### Patterns to Follow

**Server Action Pattern** (from `app/actions.ts`):
```typescript
export async function actionName(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/signin");
  // ... validation ...
  // ... supabase operation ...
  // ... encodedRedirect or return { error/success } ...
}
```

**Client Component Pattern** (from `review-session.tsx`):
- "use client" directive
- Props interface defined inline or nearby
- State via useState, form submission via FormData
- Toast feedback via `toast.success()` / `toast.error()` from sonner
- Tailwind dark theme classes: `bg-dark-card`, `border-dark-border`, `text-dark-text`, `text-gray-400`

**Database Migration Pattern** (from existing migrations):
- Timestamped filename: `YYYYMMDDHHMMSS_descriptive_name.sql`
- RLS policies: `ENABLE ROW LEVEL SECURITY` + named policies
- RPCs: `SECURITY DEFINER` + `SET search_path = public`
- Comments explain purpose

**UI Component Styling** (dark theme tokens):
- Card: `bg-dark-card border border-dark-border rounded-xl p-6`
- Heading: `text-lg font-semibold text-white`
- Subtext: `text-sm text-gray-400`
- Button primary: shadcn `<Button>` component
- Badge: shadcn `<Badge>` or custom `bg-{color}-500/10 text-{color}-400 rounded-full px-3 py-1 text-xs`

---

## IMPLEMENTATION PLAN

### Phase 1: Database Migration

Add new columns to `reviews` and `profiles`, create the quality score recalculation RPC, and update `submit_review_atomic` to accept signal parameters.

### Phase 2: Reviewer Action Signals (PRD 7.3)

Add follow/engage/invest checkboxes to the review submission form. Update the `submitReview` action and `submit_review_atomic` RPC to persist signals. Display signals on the builder's feedback detail page.

### Phase 3: Enhanced Feedback Quality Panel (PRD 7.4)

Build a quality evaluation panel (star rating, flags, text feedback) shown to builders on their feedback detail page. Create server actions for `rateReview`. Wire the panel into the existing approve/reject flow — builders evaluate quality first, then approve/reject.

### Phase 4: Reviewer Quality Score (PRD 7.5)

Create an RPC to compute `quality_score` from builder ratings. Trigger recalculation when a builder rates a review. Display the score on the reviewer's profile (minimum 3 rated reviews).

### Phase 5: Unified Profile Stats (PRD 7.6)

Add builder stats (projects submitted, reviews received, avg rating, signals received) and reviewer stats (reviews given, quality score, avg rating given, approval rate) to the profile page.

---

## STEP-BY-STEP TASKS

### Task 1: CREATE `supabase/migrations/20260304000000_phase2_quality_trust.sql`

Database migration adding all Phase 2 schema changes in a single transaction.

**IMPLEMENT:**

```sql
-- ============================================================
-- Phase 2: Quality & Trust Engine
-- ============================================================

-- 1. Reviewer Action Signals on reviews
ALTER TABLE reviews ADD COLUMN signal_follow boolean NOT NULL DEFAULT false;
ALTER TABLE reviews ADD COLUMN signal_engage boolean NOT NULL DEFAULT false;
ALTER TABLE reviews ADD COLUMN signal_invest boolean NOT NULL DEFAULT false;

-- 2. Builder Feedback Quality on reviews
ALTER TABLE reviews ADD COLUMN builder_rating smallint CHECK (builder_rating IS NULL OR builder_rating BETWEEN 1 AND 5);
ALTER TABLE reviews ADD COLUMN builder_flags text[] NOT NULL DEFAULT '{}';
ALTER TABLE reviews ADD COLUMN builder_feedback text;

-- 3. Quality score on profiles
ALTER TABLE profiles ADD COLUMN quality_score numeric(3,2);

-- 4. Update submit_review_atomic to accept signal params
-- IMPORTANT: This is a CREATE OR REPLACE that preserves the EXACT existing logic
-- from migration 20260303000000_atomic_review_submit.sql, adding only the 3 signal
-- params (with defaults so existing callers are unaffected).
-- READ supabase/migrations/20260303000000_atomic_review_submit.sql FIRST to verify.
CREATE OR REPLACE FUNCTION public.submit_review_atomic(
  p_review_id uuid,
  p_reviewer_id uuid,
  p_video_url text,
  p_video_duration integer,
  p_rating integer,
  p_strengths text DEFAULT NULL,
  p_improvements text DEFAULT NULL,
  p_signal_follow boolean DEFAULT false,
  p_signal_engage boolean DEFAULT false,
  p_signal_invest boolean DEFAULT false
)
RETURNS void AS $$
DECLARE
  v_pr_id uuid;
  v_review_status text;
  v_owner_id uuid;
  v_owner_balance integer;
  v_review_reward integer;
  v_review_cost integer;
  v_first_bonus integer;
  v_requeue_limit integer;
  v_requeue_min_balance integer;
  v_current_requeue integer;
  v_is_first_review boolean;
BEGIN
  -- Validate review belongs to reviewer and get current status
  SELECT r.feedback_request_id, r.status INTO v_pr_id, v_review_status
  FROM public.reviews r
  WHERE r.id = p_review_id AND r.reviewer_id = p_reviewer_id;

  IF v_pr_id IS NULL THEN
    RAISE EXCEPTION 'Review not found or does not belong to reviewer';
  END IF;

  IF v_review_status != 'in_progress' THEN
    RAISE EXCEPTION 'Review is not in in_progress status (current: %)', v_review_status;
  END IF;

  -- Update the review row (CHANGED: added signal columns)
  UPDATE public.reviews
  SET video_url = p_video_url,
      video_duration = p_video_duration,
      rating = p_rating,
      strengths = p_strengths,
      improvements = p_improvements,
      signal_follow = p_signal_follow,
      signal_engage = p_signal_engage,
      signal_invest = p_signal_invest,
      status = 'submitted',
      submitted_at = now()
  WHERE id = p_review_id;

  -- ── Economy logic (from complete_review_and_charge) ──

  -- Read settings
  v_review_reward := COALESCE(public.get_setting('review_reward_amount')::integer, 1);
  v_review_cost := COALESCE(public.get_setting('review_cost_amount')::integer, 2);
  v_first_bonus := COALESCE(public.get_setting('first_review_bonus_amount')::integer, 2);
  v_requeue_limit := COALESCE(public.get_setting('auto_requeue_limit')::integer, 3);
  v_requeue_min_balance := COALESCE(public.get_setting('auto_requeue_min_balance')::integer, 1);

  -- Get owner
  SELECT fr.user_id INTO v_owner_id
  FROM public.feedback_requests fr
  WHERE fr.id = v_pr_id;

  -- Check if this is the reviewer's first completed review
  SELECT NOT EXISTS (
    SELECT 1 FROM public.peer_point_transactions
    WHERE user_id = p_reviewer_id AND type = 'earned_review'
  ) INTO v_is_first_review;

  -- Award reviewer
  UPDATE public.profiles SET peer_points_balance = peer_points_balance + v_review_reward WHERE id = p_reviewer_id;
  INSERT INTO public.peer_point_transactions (user_id, amount, type, reference_id)
  VALUES (p_reviewer_id, v_review_reward, 'earned_review', p_review_id);

  -- Award first review bonus if applicable
  IF v_is_first_review AND v_first_bonus > 0 THEN
    UPDATE public.profiles SET peer_points_balance = peer_points_balance + v_first_bonus WHERE id = p_reviewer_id;
    INSERT INTO public.peer_point_transactions (user_id, amount, type, reference_id)
    VALUES (p_reviewer_id, v_first_bonus, 'first_review_bonus', p_review_id);
  END IF;

  -- Charge owner
  UPDATE public.profiles SET peer_points_balance = peer_points_balance - v_review_cost WHERE id = v_owner_id;
  INSERT INTO public.peer_point_transactions (user_id, amount, type, reference_id)
  VALUES (v_owner_id, -v_review_cost, 'spent_submission', v_pr_id);

  -- Clear claimed_at
  UPDATE public.feedback_requests SET claimed_at = NULL, timeout_queue_position = NULL WHERE id = v_pr_id;

  -- Get current requeue count
  SELECT COALESCE(requeue_count, 0) INTO v_current_requeue
  FROM public.feedback_requests WHERE id = v_pr_id;

  -- Auto-re-queue if under limit and owner has enough balance
  SELECT peer_points_balance INTO v_owner_balance
  FROM public.profiles WHERE id = v_owner_id;

  IF v_current_requeue < v_requeue_limit AND v_owner_balance >= v_requeue_min_balance THEN
    UPDATE public.feedback_requests
    SET queue_position = nextval('public.feedback_requests_queue_seq'),
        requeue_count = COALESCE(requeue_count, 0) + 1
    WHERE id = v_pr_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 5. Recalculate quality score RPC
CREATE OR REPLACE FUNCTION recalculate_quality_score(p_reviewer_id uuid)
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_avg numeric;
  v_flag_count int;
  v_rated_count int;
  v_score numeric;
BEGIN
  -- Count rated reviews (only reviews where the builder gave a rating)
  SELECT count(*), COALESCE(avg(builder_rating), 0)
  INTO v_rated_count, v_avg
  FROM reviews
  WHERE reviewer_id = p_reviewer_id
    AND builder_rating IS NOT NULL;

  -- Count total flag instances across all reviews
  SELECT COALESCE(sum(array_length(builder_flags, 1)), 0)
  INTO v_flag_count
  FROM reviews
  WHERE reviewer_id = p_reviewer_id
    AND builder_flags <> '{}';

  -- Minimum 3 rated reviews to get a score
  IF v_rated_count < 3 THEN
    UPDATE profiles SET quality_score = NULL WHERE id = p_reviewer_id;
    RETURN NULL;
  END IF;

  -- Formula: avg rating - (flags * 0.5), clamped to [0, 5]
  v_score := GREATEST(0, LEAST(5, v_avg - (v_flag_count * 0.5)));
  v_score := ROUND(v_score, 2);

  UPDATE profiles SET quality_score = v_score WHERE id = p_reviewer_id;
  RETURN v_score;
END;
$$;

-- 6. RLS: builder_rating/flags/feedback can only be set by the feedback request owner
-- (This is enforced in the server action, not RLS, since the existing reviews UPDATE policy
-- already restricts to reviewer_id = auth.uid(). The builder rates via a dedicated server action
-- that uses the service role implicitly through SECURITY DEFINER pattern.)

-- 7. Server action for rating: we'll create a SECURITY DEFINER function
CREATE OR REPLACE FUNCTION rate_review(
  p_review_id uuid,
  p_rater_id uuid,
  p_builder_rating smallint,
  p_builder_flags text[] DEFAULT '{}',
  p_builder_feedback text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_review reviews%ROWTYPE;
  v_fr feedback_requests%ROWTYPE;
BEGIN
  SELECT * INTO v_review FROM reviews WHERE id = p_review_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Review not found'; END IF;
  IF v_review.status NOT IN ('submitted', 'approved', 'rejected') THEN
    RAISE EXCEPTION 'Review not in ratable state';
  END IF;

  -- Verify the rater owns the feedback request
  SELECT * INTO v_fr FROM feedback_requests WHERE id = v_review.feedback_request_id;
  IF v_fr.user_id <> p_rater_id THEN
    RAISE EXCEPTION 'Only the project owner can rate reviews';
  END IF;

  -- Update the review with builder feedback
  UPDATE reviews SET
    builder_rating = p_builder_rating,
    builder_flags = p_builder_flags,
    builder_feedback = p_builder_feedback
  WHERE id = p_review_id;

  -- Recalculate reviewer's quality score
  PERFORM recalculate_quality_score(v_review.reviewer_id);
END;
$$;
```

**VALIDATE:** `npx supabase db push` (or `supabase migration up` on linked project) — migration applies without errors.

**GOTCHA:** The existing `submit_review_atomic` function signature changes — the new version has 3 extra params with defaults, so existing calls (without signals) still work. Verify by checking `app/actions.ts:submitReview` calls.

---

### Task 2: UPDATE `types/database.types.ts`

Regenerate or manually update the TypeScript types to reflect the new columns.

**IMPLEMENT:**
- Run `npx supabase gen types typescript --linked > types/database.types.ts` if linked
- OR manually add the following to the `reviews` Row/Insert/Update interfaces:
  - `signal_follow: boolean` (Row), `signal_follow?: boolean` (Insert/Update)
  - `signal_engage: boolean`, `signal_invest: boolean` — same pattern
  - `builder_rating: number | null`, `builder_flags: string[]`, `builder_feedback: string | null`
- Add to `profiles` Row/Insert/Update: `quality_score: number | null`
- Add to Functions: `rate_review`, `recalculate_quality_score`

**VALIDATE:** `npx tsc --noEmit` should pass (note: `ignoreBuildErrors` is on, but types should still be correct).

---

### Task 3: CREATE `components/protected/dashboard/ReviewerSignals.tsx`

Client component: three toggle checkboxes for follow/engage/invest shown on the review submission form.

**IMPLEMENT:**
```
"use client";

Props: none (uses hidden form inputs — the parent form reads them)
State: signalFollow, signalEngage, signalInvest (booleans)

Render:
- Section with heading "Interest Signals" and subtext "Optional — let the builder know if their product resonated with you"
- Three styled checkbox rows:
  1. Follow icon + "I want to follow this project's progress"
  2. Engage icon + "I'm interested in using or buying this product"
  3. Invest icon + "I'm interested in investing in or acquiring this"
- Hidden inputs: <input type="hidden" name="signal_follow" value={signalFollow ? "true" : "false"} />
  (repeat for engage, invest)
- Style: dark card with subtle border, checkboxes use existing shadcn Checkbox component
```

**PATTERN:** Mirror the star rating section already in `review-session.tsx` for layout consistency.
**IMPORTS:** `@/components/ui/checkbox` (existing shadcn checkbox), `lucide-react` icons (Eye, ShoppingBag, TrendingUp or similar)

**VALIDATE:** Component renders in the review form without errors.

---

### Task 4: UPDATE `app/(protected)/dashboard/submit-feedback/[id]/review/review-session.tsx`

Add the `ReviewerSignals` component to the review submission form, and pass signal values in the FormData.

**IMPLEMENT:**
- Import `ReviewerSignals` component
- Place `<ReviewerSignals />` in the post-recording form section, after the Improvements textarea and before the Submit button
- The hidden inputs from ReviewerSignals will be included in the FormData automatically
- No other changes needed — the parent form's `onSubmit` handler already submits all form data

**VALIDATE:** Record a test review → signals visible in form → submit succeeds.

---

### Task 5: UPDATE `app/actions.ts` — `submitReview` action

Pass signal fields from FormData to the `submit_review_atomic` RPC.

**IMPLEMENT:**
- Extract signal values from formData:
  ```typescript
  const signalFollow = formData.get("signal_follow") === "true";
  const signalEngage = formData.get("signal_engage") === "true";
  const signalInvest = formData.get("signal_invest") === "true";
  ```
- Update the `supabase.rpc("submit_review_atomic", { ... })` call to include:
  ```typescript
  p_signal_follow: signalFollow,
  p_signal_engage: signalEngage,
  p_signal_invest: signalInvest,
  ```

**VALIDATE:** Submit a review with signals checked → verify in Supabase dashboard that `signal_follow`/`signal_engage`/`signal_invest` columns are `true` on the review row.

---

### Task 6: CREATE `components/protected/dashboard/SignalBadges.tsx`

Display component showing which signals a reviewer selected. Used on the builder's feedback detail page.

**IMPLEMENT:**
```
Props: { signalFollow: boolean, signalEngage: boolean, signalInvest: boolean }

Render (only if at least one signal is true):
- Row of badge pills:
  - signalFollow → pill with Eye icon + "Wants to Follow" (blue-500/10 bg)
  - signalEngage → pill with ShoppingBag icon + "Wants to Engage" (emerald-500/10 bg)
  - signalInvest → pill with TrendingUp icon + "Wants to Invest" (amber-500/10 bg)
- Subtext: "Reviewer interest signals — only you can see these"
```

**VALIDATE:** Renders correctly with various signal combinations.

---

### Task 7: CREATE `components/protected/dashboard/ReviewQualityPanel.tsx`

Client component for builders to rate a review they received. Shows star rating, flag checkboxes, text feedback field, and submit button.

**IMPLEMENT:**
```
"use client";

Props: { reviewId: string, existingRating?: number, existingFlags?: string[], existingFeedback?: string }

State: rating (1-5), selectedFlags (string[]), feedback (string), isSubmitting (boolean)

Flag options (multi-select checkboxes):
- "low_effort" → "Low effort review"
- "spam" → "Spam or fake"
- "irrelevant" → "Irrelevant to my project"
- "off_topic" → "Off-topic / didn't address questions"

Render:
- Card with heading "Rate this Review"
- 5-star interactive rating (clickable stars, highlight on hover)
  - Use Star icon from lucide-react, filled vs outlined
- Flag section (collapsible or always visible): "Report issues (optional)"
  - Checkbox list of flag options
- Text feedback textarea: "Feedback to reviewer (optional)" with placeholder
- Submit button: calls `rateReviewAction` server action
- If existingRating provided, show in read-only mode with "Update" option

On submit:
- Call rateReviewAction(reviewId, rating, selectedFlags, feedback)
- toast.success("Review rated!") or toast.error(result.error)
```

**PATTERN:** Star rating interaction mirrors the existing 5-star rating in `review-session.tsx` (reviewer rates the product). Reuse the same star rendering logic.

**VALIDATE:** Component renders, stars are clickable, form submits.

---

### Task 8: ADD `rateReviewAction` to `app/actions.ts`

Server action for builders to rate a review.

**IMPLEMENT:**
```typescript
export async function rateReviewAction(
  reviewId: string,
  rating: number,
  flags: string[],
  feedback: string | null
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/signin");

  if (rating < 1 || rating > 5) return { error: "Rating must be between 1 and 5" };

  const validFlags = ["low_effort", "spam", "irrelevant", "off_topic"];
  const sanitizedFlags = flags.filter(f => validFlags.includes(f));

  const { error } = await supabase.rpc("rate_review", {
    p_review_id: reviewId,
    p_rater_id: user.id,
    p_builder_rating: rating,
    p_builder_flags: sanitizedFlags,
    p_builder_feedback: feedback?.trim() || null,
  });

  if (error) {
    return { error: error.message || "Failed to rate review" };
  }

  return { success: true };
}
```

**VALIDATE:** Call action from ReviewQualityPanel → verify `builder_rating`, `builder_flags`, `builder_feedback` saved on review row, and `quality_score` updated on reviewer's profile.

---

### Task 9: UPDATE `app/(protected)/dashboard/request-feedback/[id]/page.tsx`

Enhance the feedback detail page to show:
1. Signal badges for each review (only visible to project owner)
2. Quality panel for submitted reviews that haven't been rated yet
3. Existing builder rating if already rated

**IMPLEMENT:**
- Fetch reviews with the new signal and builder_rating columns in the Supabase select:
  ```typescript
  .select("*, signal_follow, signal_engage, signal_invest, builder_rating, builder_flags, builder_feedback, reviewer:profiles!reviewer_id(first_name, last_name, quality_score)")
  ```
- For each review card:
  - After the video player / review content, add `<SignalBadges>` component (if any signal is true)
  - Below that, add `<ReviewQualityPanel>` if the review is in `submitted`/`approved`/`rejected` status
  - If `builder_rating` already exists, show it in read-only mode
- Keep existing approve/reject buttons (`review-actions.tsx`) below the quality panel

**GOTCHA:** The signals are private — only the feedback request owner should see them. Since this page already gates access to the project owner via the user check, this is inherently safe.

**VALIDATE:** Navigate to a feedback request with submitted reviews → see signal badges and quality panel.

---

### Task 10: UPDATE `app/(protected)/dashboard/request-feedback/[id]/review-actions.tsx`

The existing approve/reject component. No major changes needed, but ensure it works alongside the new quality panel. If the quality panel and approve/reject are in the same view, consider:
- Quality rating is optional before approve/reject (builders can approve without rating)
- The approve/reject action signatures don't change

**IMPLEMENT:** Minor layout adjustment if needed to visually separate the quality panel from approve/reject buttons. Add a subtle divider or spacing.

**VALIDATE:** Approve and reject still work correctly after the quality panel is added above.

---

### Task 11: CREATE `components/protected/dashboard/QualityScoreBadge.tsx`

Display component for a user's quality score. Shows the numeric score with a visual indicator.

**IMPLEMENT:**
```
Props: { score: number | null, ratedCount?: number }

Render:
- If score is null: show "No score yet" with tooltip "Complete 3+ reviews to earn a quality score"
- If score exists:
  - Colored badge: green ≥ 4.0, yellow ≥ 3.0, red < 3.0
  - Format: "★ 4.25" or similar
  - Subtle text: "Based on {ratedCount} ratings"
```

**VALIDATE:** Renders correctly with null, low, medium, and high scores.

---

### Task 12: CREATE `components/protected/dashboard/ProfileStats.tsx`

Display component showing builder and reviewer stats side-by-side.

**IMPLEMENT:**
```
Props: {
  builderStats: { projectsSubmitted: number, reviewsReceived: number, avgRatingReceived: number | null, signalsReceived: { follow: number, engage: number, invest: number } }
  reviewerStats: { reviewsGiven: number, qualityScore: number | null, avgRatingGiven: number | null, approvalRate: number | null }
}

Render:
- Two-column grid (stacks on mobile):
  Left column: "As a Builder" heading
    - Projects Submitted: count
    - Reviews Received: count
    - Avg Rating Received: stars or "—"
    - Interest Signals: "{follow} follow · {engage} engage · {invest} invest"
  Right column: "As a Reviewer" heading
    - Reviews Given: count
    - Quality Score: <QualityScoreBadge />
    - Avg Rating Given: stars or "—"
    - Approval Rate: percentage or "—"
```

**PATTERN:** Follow the existing stats grid in `profile/page.tsx` (the 3-stat grid with Feedback Requests, Reviews, PeerPoints).

**VALIDATE:** Renders with both populated and empty stats.

---

### Task 13: UPDATE `app/(protected)/dashboard/profile/page.tsx`

Replace the simple stats with the full ProfileStats component. Add quality score badge. Run aggregation queries server-side.

**IMPLEMENT:**
- Add aggregation queries (all server-side in the page component).
  NOTE: Supabase JS does NOT support subqueries in `.in()`. Use two sequential queries.
  ```typescript
  // Builder stats — Step 1: get this user's feedback request IDs
  const { data: myRequests } = await supabase
    .from("feedback_requests")
    .select("id")
    .eq("user_id", user.id);

  const projectsSubmitted = myRequests?.length ?? 0;
  const myRequestIds = myRequests?.map(r => r.id) ?? [];

  // Builder stats — Step 2: get reviews on those feedback requests
  const { data: receivedReviews } = myRequestIds.length > 0
    ? await supabase
        .from("reviews")
        .select("builder_rating, signal_follow, signal_engage, signal_invest, status")
        .in("feedback_request_id", myRequestIds)
    : { data: [] };

  // Reviewer stats (simple — single query, no subquery needed)
  const { data: givenReviews } = await supabase
    .from("reviews")
    .select("rating, status, builder_rating")
    .eq("reviewer_id", user.id)
    .in("status", ["submitted", "approved", "rejected"]);
  ```
- Compute aggregations:
  ```typescript
  const reviewsReceived = receivedReviews?.length ?? 0;
  const avgRatingReceived = receivedReviews?.filter(r => r.builder_rating)... // compute avg
  const signalsReceived = {
    follow: receivedReviews?.filter(r => r.signal_follow).length ?? 0,
    engage: receivedReviews?.filter(r => r.signal_engage).length ?? 0,
    invest: receivedReviews?.filter(r => r.signal_invest).length ?? 0,
  };
  const reviewsGiven = givenReviews?.length ?? 0;
  const approvalRate = givenReviews?.length ? givenReviews.filter(r => r.status === 'approved').length / givenReviews.length : null;
  ```
- Replace the existing simple stat grid with `<ProfileStats>` component
- Add `<QualityScoreBadge score={profile.quality_score} />` in the sidebar card

**GOTCHA:** The profile page uses a server component. All aggregation happens server-side. The `ProfileStats` and `QualityScoreBadge` components should be server components too (no "use client") since they just display data.

**VALIDATE:** Profile page renders with real stats. Check with a user who has reviews and one who doesn't.

---

### Task 14: UPDATE `types/database.types.ts` (if not auto-generated)

Ensure the `rate_review` and `recalculate_quality_score` function types are present.

**IMPLEMENT:**
Add to Functions section:
```typescript
rate_review: {
  Args: { p_review_id: string; p_rater_id: string; p_builder_rating: number; p_builder_flags?: string[]; p_builder_feedback?: string | null }
  Returns: undefined
}
recalculate_quality_score: {
  Args: { p_reviewer_id: string }
  Returns: number | null
}
```

**VALIDATE:** TypeScript compilation passes when calling these RPCs.

---

## TESTING STRATEGY

### No Automated Tests (Hackathon)

Per CLAUDE.md: "No test framework is configured." All validation is manual.

### Manual Test Plan

**Test 1: Reviewer Signals Flow**
1. Log in as User A → create a feedback request
2. Log in as User B → claim review → record video → check Follow + Engage signals → submit
3. Log in as User A → navigate to feedback request detail → verify signal badges visible
4. Verify signal badges do NOT show when no signals selected

**Test 2: Builder Quality Rating Flow**
1. With User A viewing a submitted review → use the quality panel:
   - Select 4 stars, no flags, type "Great review!"
   - Click Rate → verify toast success
   - Refresh → rating shows in read-only mode
2. Verify builder_rating, builder_flags, builder_feedback saved in DB
3. Check reviewer's profile → quality_score still null (need 3 ratings minimum)

**Test 3: Quality Score Calculation**
1. Have 3 different builders rate User B's reviews (ratings: 4, 5, 3)
2. Check User B's profile → quality_score = (4+5+3)/3 = 4.00
3. Flag one review with "low_effort" → score becomes 4.00 - 0.5 = 3.50

**Test 4: Profile Stats**
1. Navigate to User B's profile → see "As a Reviewer" stats
2. Navigate to User A's profile → see "As a Builder" stats
3. Verify counts match actual data

**Test 5: Edge Cases**
- Review with no signals → no signal badges section rendered
- User with 0 reviews → stats show zeros gracefully
- User with < 3 rated reviews → quality score shows "No score yet"
- Approve/reject still works after quality panel added

---

## VALIDATION COMMANDS

### Level 1: Build

```bash
npm run build
```

Expect: Build succeeds (TS errors ignored but no runtime crashes).

### Level 2: Migration

```bash
npx supabase db push
```

Expect: Migration applies cleanly. No errors.

### Level 3: Dev Server

```bash
npm run dev
```

Navigate through all affected pages: review session, feedback detail, profile.

### Level 4: Manual Validation

Follow the manual test plan above. Every test case must pass.

---

## ACCEPTANCE CRITERIA

- [ ] Three signal checkboxes (follow/engage/invest) appear on review submission form
- [ ] Signals persist to database on review submit
- [ ] Signal badges display on builder's feedback detail page (only when signals are true)
- [ ] Quality panel (stars, flags, text feedback) renders on feedback detail page for submitted reviews
- [ ] Builder can rate a review → data persists → toast confirmation
- [ ] Quality score recalculates when a builder rates a review
- [ ] Quality score shows on profile after 3+ rated reviews
- [ ] Quality score shows null/placeholder for < 3 rated reviews
- [ ] Profile stats show builder and reviewer aggregations
- [ ] Existing approve/reject flow still works
- [ ] Existing review submission flow still works (signals are optional)
- [ ] No regressions in PeerPoints economy
- [ ] Dark theme styling consistent across all new components

---

## COMPLETION CHECKLIST

- [ ] Migration applied and verified
- [ ] Types updated
- [ ] ReviewerSignals component created and integrated
- [ ] SignalBadges component created and integrated
- [ ] ReviewQualityPanel component created and integrated
- [ ] rateReviewAction server action created
- [ ] QualityScoreBadge component created
- [ ] ProfileStats component created and integrated
- [ ] Profile page updated with aggregation queries
- [ ] All manual tests pass
- [ ] `npm run build` succeeds
- [ ] All pages render correctly in dev

---

## NOTES

### Design Decisions

1. **Signals are optional, not required** — we don't want to slow down the review submission flow. Default is all false.

2. **Quality rating is separate from approve/reject** — a builder can approve a review but rate it low (e.g., "approved but wasn't very helpful"). This gives honest quality data without penalizing the reviewer's economy (points are already earned at submit time).

3. **SECURITY DEFINER for `rate_review`** — the existing RLS on reviews only allows the reviewer to update their own review. The builder needs to write `builder_rating` etc. on someone else's review. Using a SECURITY DEFINER function bypasses RLS safely with ownership verification inside the function.

4. **Quality score formula is simple** — Phase 1 intentionally uses just `avg(builder_rating) - (flags * 0.5)`. This can be enhanced in Phase 2/3 per the PRD. The `recalculate_quality_score` function is the single place to change the formula later.

5. **Profile aggregation queries run server-side** — no client-side fetching. The profile page is a server component, so all stats are computed before render. This keeps things fast and avoids loading states.

6. **No separate "rated" notification** — the PRD mentions `review_rated` as a notification event (Phase 4). We're NOT implementing notifications in Phase 2. The `rate_review` RPC is designed so a notification trigger can be added later.

### Risks

- **RPC signature change**: The `submit_review_atomic` replacement preserves the exact existing logic line-by-line (verified against `20260303000000_atomic_review_submit.sql`), adding only 3 signal params with defaults. Existing callers are unaffected. If Supabase caches function signatures, a client restart may be needed after migration.
- **Two-query pattern for received reviews**: Supabase JS does not support subqueries in `.in()`. The plan uses two sequential queries: first fetch feedback_request IDs, then fetch reviews by those IDs. Guard the second query with `myRequestIds.length > 0` to avoid an empty `.in([])` call.
- **`numeric(3,2)` precision**: Quality score stored as `numeric(3,2)` — max value 9.99. Since scores are 0-5, this is fine. But if the formula changes, consider `numeric(4,2)`.

### Tracker Items

This plan covers TRACKER.md items: 2.1, 2.2, 2.3, 2.4, 2.5.
