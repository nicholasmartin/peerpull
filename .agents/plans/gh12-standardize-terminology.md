# Feature: GH #12 — Standardize Terminology (Feedback vs Review vs Rating)

The following plan should be complete, but validate documentation and codebase patterns before implementing.

Pay special attention to naming of existing utils, types, and models. Import from the right files. This is a **UI-only** change — no database migrations, no route path changes, no RPC function renames.

## Feature Description

Standardize the terminology across the entire PeerPull platform so that "feedback", "review", and "rating" each have one clear, unambiguous meaning. Currently these three terms are used interchangeably, creating confusion about what each word means depending on context (e.g., "Get a Review" sounds like receiving feedback, not giving it).

## User Story

As a PeerPull user
I want consistent, unambiguous terminology across the platform
So that I immediately understand what each action, label, and stat means without guessing from context

## Problem Statement

The terms "feedback", "review", and "rating" are used interchangeably. "Get a Review" could mean receive or give. "Submit Feedback" could mean either direction. The reviewer's project rating and the builder's quality rating are both called "rating". This creates a confusing, unprofessional user experience.

## Solution Statement

Adopt a standardized vocabulary where:
- **Feedback** = the video/audio recording sent to a project owner (the core deliverable)
- **Feedback Request** = the project submission requesting feedback (already mostly correct)
- **Give Feedback** = the act of recording and submitting feedback for someone else's project
- **Get Next Project** = being assigned the next project to give feedback on
- **Project Rating** = the 1-5 star rating a reviewer gives to the project
- **Feedback Rating** = the 1-5 star rating a builder gives to received feedback quality
- **Accept / Reject** = builder's decision on received feedback (keep as Approve/Reject — widely understood)

Apply this vocabulary to all UI labels, headings, button text, toast messages, descriptions, and stat labels. No database changes required.

## Feature Metadata

**Feature Type**: Refactor (UI copy only)
**Estimated Complexity**: Medium (many files, simple per-file changes, high risk of missed spots)
**Primary Systems Affected**: All dashboard pages, sidebar nav, landing page sections, server action messages, notification messages
**Dependencies**: None — purely UI string replacements

---

## CONTEXT REFERENCES

### Relevant Codebase Files — YOU MUST READ THESE BEFORE IMPLEMENTING!

**Navigation & Layout:**
- `components/protected/dashboard/layout/AppSidebar.tsx` (line 44) — Sidebar nav "Submit Feedback" label

**Give Feedback flow (formerly "Submit Feedback"):**
- `app/(protected)/dashboard/submit-feedback/page.tsx` — Page heading, tab labels, instruction steps, empty states
- `app/(protected)/dashboard/submit-feedback/get-next-review-button.tsx` — "Get Next Review" button, heading text
- `app/(protected)/dashboard/submit-feedback/[id]/review/review-session.tsx` — "Review Briefing", "Your Review", "Rating" label, "Submit Review" button

**Request Feedback flow:**
- `app/(protected)/dashboard/request-feedback/page.tsx` — Status badges ("In Review"), table column "reviews", empty state text
- `app/(protected)/dashboard/request-feedback/[id]/page.tsx` — Tab labels, empty states, "Review Summary" card title
- `app/(protected)/dashboard/request-feedback/[id]/review-actions.tsx` — Toast messages "Review approved/rejected"
- `app/(protected)/dashboard/request-feedback/new/page.tsx` (lines 109, 153, 215) — "reviewer" references in placeholder/heading text

**Quality & Stats:**
- `components/protected/dashboard/ReviewQualityPanel.tsx` — "Rate this Review" heading, flag labels, button text, toast messages
- `components/protected/dashboard/ProfileStats.tsx` (lines 51-80) — "Reviews Received/Given", "Avg Rating" labels, "As a Reviewer" heading
- `components/protected/dashboard/SignalBadges.tsx` (line 35) — "Reviewer interest signals" caption

**Dashboard Home:**
- `app/(protected)/dashboard/page.tsx` — "Reviews Given" stat, "Available Reviews" heading, "Browse Review Queue", "Start Reviewing", various descriptions

**PeerPoints:**
- `app/(protected)/dashboard/peerpoints/page.tsx` (lines 103, 106, 129, 139) — Transaction type labels, empty state, "How PeerPoints Work" copy

**Server Actions & Notifications:**
- `app/actions.ts` — Error messages, notification titles/messages (lines 228, 284, 335, 350-351, 396-422, 560-590, 609-634)

**Settings:**
- `app/(protected)/dashboard/settings/notifications/page.tsx` (lines 15-20) — NOTIFICATION_EVENTS labels and descriptions use "Review" terms

**Onboarding & Waitlist:**
- `components/protected/dashboard/OnboardingFlow.tsx` (lines 117-119) — "Review others" card
- `components/protected/dashboard/GettingStartedChecklist.tsx` (lines 44-56, 165) — Step labels/descriptions
- `components/protected/dashboard/WaitlistBanner.tsx` (line 25-27) — Waitlist description text

**Landing Page (public):**
- `components/public/home/HowItWorks.tsx` — Step titles and descriptions
- `components/public/home/Hero.tsx` (lines 36-38, 64) — Badge label, tagline
- `components/public/home/Solution.tsx` (line 41) — "one thoughtful review"
- `components/public/home/Problem.tsx` (lines 75-78) — Multiple bullet points
- `components/public/home/FAQ.tsx` (lines 40-75) — FAQ answers
- `components/public/home/CTASection.tsx` (lines 9-24) — Badge, description text
- `app/layout.tsx` (line 17) — Meta description

### New Files to Create

None — this is entirely edits to existing files.

### Patterns to Follow

**Naming Conventions:** Keep all variable names, component names, TypeScript interfaces, and DB column references unchanged. Only change user-facing string literals.

**What NOT to change:**
- Database table/column names (`reviews`, `rating`, `builder_rating`, etc.)
- URL route paths (`/submit-feedback`, `/request-feedback`, etc.)
- TypeScript variable names (`review`, `reviews`, `reviewerStats`, etc.)
- Component names (`ReviewQualityPanel`, `ReviewerSignals`, etc.)
- Import statements
- Notification type enum values (`review_received`, `review_approved`, etc.) — these are DB-coupled
- CSS class names

**What TO change:**
- All user-visible string literals in JSX (headings, labels, button text, descriptions, empty states)
- Toast messages (calls to `toast.success()`, `toast.error()`)
- Notification title/message strings in `actions.ts` (these are stored in DB but are display text)
- Server action error message strings
- HTML meta description

---

## STANDARDIZED VOCABULARY REFERENCE

Use this mapping for every change. When in doubt, consult this table:

| Concept | New Term | Old Term(s) Being Replaced |
|---------|----------|---------------------------|
| The video/recording sent to a project owner | **feedback** | review, video review |
| A project submission requesting feedback | **Feedback Request** | (already correct) |
| The act of giving feedback to someone's project | **Give Feedback** | Submit Feedback, review, reviewing |
| Getting assigned a project to give feedback on | **Get Next Project** | Get a Review, Get Next Review |
| The star rating a feedback-giver gives to the project | **Project Rating** | Rating, star rating |
| The star rating a builder gives to received feedback | **Feedback Rating** | Rate Review, builder_rating display |
| The person giving feedback | **feedback giver** (in prose) | reviewer |
| Profile section for feedback-giving stats | **As a Feedback Giver** | As a Reviewer |
| Count of feedback given | **Feedback Given** | Reviews Given |
| Count of feedback received | **Feedback Received** | Reviews Received |
| Average rating of feedback quality | **Avg Feedback Rating** | Avg Rating Given |
| Average project rating received | **Avg Project Rating** | Avg Rating Received |

**Important nuance for public/marketing pages:** On the landing page, "review" is acceptable in casual marketing copy where it reads naturally (e.g., "give a review, get a review" is a known tagline). The strict vocabulary applies to the **dashboard UI** where users take actions and interpret data. For landing pages, prioritize clarity and natural reading over strict vocabulary — but still fix obvious inconsistencies.

---

## IMPLEMENTATION PLAN

### Phase 1: Core Dashboard Navigation & Layout

Update the sidebar and page headings that define the primary user mental model.

### Phase 2: Give Feedback Flow (highest confusion area)

Fix the "Submit Feedback" → "Give Feedback" flow, including the "Get Next Review" → "Get Next Project" button, instruction steps, and review session page.

### Phase 3: Request Feedback Flow

Fix the feedback request detail page, quality panel, review actions, and stat labels.

### Phase 4: Dashboard Home & PeerPoints

Fix dashboard stats, quick actions, and PeerPoints transaction labels.

### Phase 5: Onboarding, Waitlist & Checklist

Fix onboarding cards, waitlist banner, and getting started checklist.

### Phase 6: Server Action Messages & Notifications

Fix all user-facing error/success strings and notification title/message text in actions.ts.

### Phase 7: Landing Page & Meta

Fix public-facing marketing copy for consistency.

### Phase 8: Final Grep Validation

Search for any remaining inconsistencies.

---

## STEP-BY-STEP TASKS

IMPORTANT: Execute every task in order, top to bottom. Each task is atomic and independently testable.

---

### Task 1: UPDATE `components/protected/dashboard/layout/AppSidebar.tsx`

**Changes:**
- Line 44: `"Submit Feedback"` → `"Give Feedback"`

**VALIDATE:** `grep -n "Submit Feedback" components/protected/dashboard/layout/AppSidebar.tsx` should return no results.

---

### Task 2: UPDATE `app/(protected)/dashboard/submit-feedback/page.tsx`

**Changes (all are string literal replacements):**
- Line 58: `"Submit Feedback"` h1 heading → `"Give Feedback"`
- Line 62: `"Get a Review"` tab trigger → `"Get Next Project"`
- Line 70: `"How Reviewing Works"` CardTitle → `"How Giving Feedback Works"`
- Line 71: `"Follow these steps to complete a review and earn PeerPoints"` → `"Follow these steps to give feedback and earn PeerPoints"`
- Line 76: `"Click \"Get Next Review\""` → `"Click \"Get Next Project\""`
- Line 77 desc: `"Review the project details, focus areas, and questions to address"` → `"Read the project details, focus areas, and questions to address"`
- Line 80 desc: `"Narrate your thoughts as you review for richer feedback"` → `"Narrate your thoughts as you explore for richer feedback"`
- Line 81 title: `"Record your review"` → `"Record your feedback"`
- Line 81 desc: `"Navigate the project while sharing your honest feedback aloud (1–5 minutes)"` → keep as-is (already says "feedback")
- Line 82 desc: `"Rate the project, add written notes, and submit"` → keep as-is (clear enough)
- Line 30: `"The review queue will be available when the platform launches."` → `"The feedback queue will be available when the platform launches."`
- Line 98: `"1 PeerPoint per review"` → `"1 PeerPoint per feedback given"`
- Line 130: `"Continue Review"` button → `"Continue"`
- Line 139: `"No assigned reviews"` → `"No assigned projects"`
- Line 141: `"Click \"Get a Review\" to get assigned the next project in the queue."` → `"Click \"Get Next Project\" to get assigned the next project in the queue."`
- Line 192: `"No completed reviews"` → `"No completed feedback"`
- Line 194: `"Complete your first review to see it here."` → `"Give your first feedback to see it here."`

**VALIDATE:** `grep -n "review" app/(protected)/dashboard/submit-feedback/page.tsx` — verify only variable names remain, no user-facing strings.

---

### Task 3: UPDATE `app/(protected)/dashboard/submit-feedback/get-next-review-button.tsx`

**Changes:**
- Line 32: `"Ready to review?"` → `"Ready to give feedback?"`
- Line 36: `"+1 PeerPoint for each completed review."` → `"+1 PeerPoint for each feedback you give."`
- Line 44: `"Get Next Review"` → `"Get Next Project"`

**VALIDATE:** `grep -n "review" app/(protected)/dashboard/submit-feedback/get-next-review-button.tsx` — only variable/function names should remain.

---

### Task 4: UPDATE `app/(protected)/dashboard/submit-feedback/[id]/review/review-session.tsx`

**Changes:**
- Line 143: `"Review Briefing"` → `"Project Briefing"`
- Line 213: `"How to record your review"` → `"How to record your feedback"`
- Line 218 title: `"Narrate your review"` → `"Narrate your feedback"`
- Line 218 desc: keep as-is (already says "think out loud")
- Line 219 desc: `"click \"Stop Recording\", then rate and submit your feedback"` → keep as-is (already says "feedback")
- Line 272: `"Your Review"` CardTitle → `"Your Feedback"`
- Line 277: `"Rating"` label → `"Project Rating"`
- Line 346: `"Submit Review"` / `"Submitting Review..."` → `"Submit Feedback"` / `"Submitting Feedback..."`

**VALIDATE:** `grep -n '".*[Rr]eview' app/(protected)/dashboard/submit-feedback/[id]/review/review-session.tsx` — only code references should remain.

---

### Task 5: UPDATE `app/(protected)/dashboard/request-feedback/page.tsx`

**Changes:**
- Line 46: `"In Review"` status label → `"In Progress"` (clearer — the project is being worked on, not "reviewed")
- Line 63: `"1 PeerPoint per review received, not upfront"` → `"1 PeerPoint per feedback received, not upfront"`
- Line 79: `"Once your projects have been reviewed, they'll appear here."` → `"Once your projects have received feedback, they'll appear here."`
- Line 139: `"{pr.reviews?.length || 0} reviews"` → `"{pr.reviews?.length || 0} feedback"` (Note: keep `pr.reviews` as variable — only change the display string suffix)
- Line 182: same change as line 139

**VALIDATE:** `grep -n '".*review' app/(protected)/dashboard/request-feedback/page.tsx` — only code references should remain.

---

### Task 6: UPDATE `app/(protected)/dashboard/request-feedback/[id]/page.tsx`

**Changes:**
- Line 50: `"In Review"` status → `"In Progress"`
- Line 231: `"Feedback will appear here once reviewers submit their reviews."` → `"Feedback will appear here once other builders submit their feedback."`
- Line 243: `"Review Summary"` CardTitle → `"Feedback Summary"`

**VALIDATE:** `grep -n '".*[Rr]eview' app/(protected)/dashboard/request-feedback/[id]/page.tsx` — only code references should remain.

---

### Task 7: UPDATE `app/(protected)/dashboard/request-feedback/[id]/review-actions.tsx`

**Changes:**
- Line 20: `toast.success("Review approved")` → `toast.success("Feedback approved")`
- Line 32: `toast.success("Review rejected")` → `toast.success("Feedback rejected")`

**VALIDATE:** `grep -n "Review" app/(protected)/dashboard/request-feedback/[id]/review-actions.tsx` — only import names and component name should remain.

---

### Task 8: UPDATE `app/(protected)/dashboard/request-feedback/new/page.tsx`

**Changes:**
- Line 109: `"charged when a reviewer completes their review, not upfront"` → `"charged when someone gives you feedback, not upfront"`
- Line 153: `placeholder="Tell reviewers what your project does..."` → `placeholder="Tell others what your project does and what feedback you're looking for..."`
- Line 215: `"Specific Questions for Reviewers"` → `"Specific Questions for Feedback Givers"`

**VALIDATE:** `grep -n "reviewer" app/(protected)/dashboard/request-feedback/new/page.tsx` should return no results.

---

### Task 9: UPDATE `components/protected/dashboard/ReviewQualityPanel.tsx`

**Changes:**
- Line 12: `"Low effort review"` → `"Low effort feedback"`
- Line 49: `toast.error("Please select a star rating")` → `toast.error("Please select a rating")` (minor cleanup)
- Line 59: `toast.success("Review rated!")` → `toast.success("Feedback rated!")`
- Line 71: `"Rate this Review"` → `"Rate this Feedback"`
- Line 131: `"Feedback to reviewer (optional)"` → `"Note to feedback giver (optional)"`
- Line 135: `placeholder="Any specific feedback for the reviewer..."` → `placeholder="Any specific notes for the person who gave feedback..."`
- Line 163: `"Rate Review"` → `"Rate Feedback"`, `"Update Rating"` → keep as-is, `"Rating..."` → keep as-is

**VALIDATE:** `grep -n "review" components/protected/dashboard/ReviewQualityPanel.tsx` — only import/component/variable names should remain.

---

### Task 10: UPDATE `components/protected/dashboard/ProfileStats.tsx`

**Changes:**
- Line 51: `"Reviews Received"` → `"Feedback Received"`
- Line 52: `"Avg Rating Received"` → `"Avg Project Rating"`
- Line 72: `"As a Reviewer"` → `"As a Feedback Giver"`
- Line 74: `"Reviews Given"` → `"Feedback Given"`
- Line 79: `"Avg Rating Given"` → `"Avg Feedback Rating"`

**VALIDATE:** `grep -n "Review" components/protected/dashboard/ProfileStats.tsx` — only interface/variable names should remain.

---

### Task 11: UPDATE `components/protected/dashboard/SignalBadges.tsx`

**Changes:**
- Line 35: `"Reviewer interest signals — only you can see these"` → `"Interest signals from feedback givers — only you can see these"`

**VALIDATE:** `grep -n "Reviewer" components/protected/dashboard/SignalBadges.tsx` should return no results.

---

### Task 12: UPDATE `app/(protected)/dashboard/page.tsx`

**Changes:**
- Line 96: `"projects waiting for review"` → `"projects waiting for feedback"`
- Line 111: `"Submit Feedback Request"` → keep as-is (this is correct — it's the builder action)
- Line 115: `"Start Reviewing"` → `"Give Feedback"`
- Line 120: `"See your latest reviews"` → `"See your latest feedback"`
- Line 144: `"Reviews Given"` → `"Feedback Given"`
- Line 209: `"Earn Points by Reviewing"` → `"Earn Points by Giving Feedback"`
- Line 216: `"Available Reviews"` → `"Available Projects"`
- Line 219: `"project(s) waiting for your feedback"` → keep as-is (already correct)
- Line 219: `"No projects available for review right now"` → `"No projects available for feedback right now"`
- Line 223: `"Browse Review Queue"` → `"Browse Feedback Queue"`

**VALIDATE:** `grep -n '".*[Rr]eview' app/(protected)/dashboard/page.tsx` — only code/variable references should remain.

---

### Task 13: UPDATE `app/(protected)/dashboard/peerpoints/page.tsx`

**Changes:**
- Line 103: `"Review approved"` transaction label → `"Feedback approved"`
- Line 106: `"First review bonus"` → `"First feedback bonus"`
- Line 129: `"Review projects to earn PeerPoints!"` → `"Give feedback to earn PeerPoints!"`
- Line 139: `"Review other founders' projects to earn PeerPoints. You also get a bonus for your first review!"` → `"Give feedback on other founders' projects to earn PeerPoints. You also get a bonus for your first feedback!"`

**VALIDATE:** `grep -n "review" app/(protected)/dashboard/peerpoints/page.tsx` — should return no user-facing results.

---

### Task 14: UPDATE `components/protected/dashboard/OnboardingFlow.tsx`

**Changes:**
- Line 117-118: `"Review others"` card heading → `"Give feedback"`
- Line 119: `"Give honest video reviews to earn PeerPoints"` → `"Give honest video feedback to earn PeerPoints"`

**VALIDATE:** `grep -n "review" components/protected/dashboard/OnboardingFlow.tsx` — only code references should remain.

---

### Task 15: UPDATE `components/protected/dashboard/GettingStartedChecklist.tsx`

**Changes:**
- Line 44: `"Get your project in the review queue"` → `"Get your project in the feedback queue"`
- Line 49: `"Review another founder's project"` → `"Give feedback on another founder's project"`
- Line 50: `"Earn PeerPoints by giving feedback"` → keep as-is (already correct)
- Line 55: `"Get your first review"` → `"Get your first feedback"`
- Line 56: `"A peer will record video feedback on your project"` → keep as-is (already correct)
- Line 165: `"Start Reviewing"` → `"Start Giving Feedback"`

**VALIDATE:** `grep -n "review" components/protected/dashboard/GettingStartedChecklist.tsx` — should return no user-facing results.

---

### Task 16: UPDATE `components/protected/dashboard/WaitlistBanner.tsx`

**Changes:**
- Line 25-27: `"submit your projects for feedback and start reviewing other builders' work"` → `"submit your projects for feedback and start giving feedback on other builders' work"`

**VALIDATE:** `grep -n "reviewing" components/protected/dashboard/WaitlistBanner.tsx` should return no results.

---

### Task 17: UPDATE `app/actions.ts` — Error messages & notification text

**Changes (user-facing strings only — do NOT change variable names, function names, or notification type enum values):**

- Line 228: `"Review other projects to earn points!"` → `"Give feedback on other projects to earn points!"`
- Line 284: `"Failed to get next review"` → `"Failed to get next project"`
- Line 335: `"Failed to submit review"` → `"Failed to submit feedback"`
- Line 350: `title: "New review received"` → `title: "New feedback received"`
- Line 351: `"Someone submitted a video review for"` → `"Someone submitted video feedback for"`
- Line 396: `"Review not found"` → `"Feedback not found"`
- Line 397: `"Review is not in submitted state"` → `"Feedback is not in submitted state"`
- Line 405: `"Only the project owner can approve reviews"` → `"Only the project owner can approve feedback"`
- Line 415: `"Failed to approve review"` → `"Failed to approve feedback"`
- Line 421: `"Your review was approved!"` → `"Your feedback was approved!"`
- Line 422: `"Your review for \"${pr.title}\" was approved by the project owner"` → `"Your feedback for \"${pr.title}\" was approved by the project owner"`
- Line 574: `"Failed to rate review"` → `"Failed to rate feedback"`
- Line 589: `"Your review was rated"` → `"Your feedback was rated"`
- Line 590: `"rated your review ${rating}/5"` → `"rated your feedback ${rating}/5"`
- Line 609: `"Review not found"` → `"Feedback not found"`
- Line 610: `"Review is not in submitted state"` → `"Feedback is not in submitted state"`
- Line 618: `"Only the project owner can reject reviews"` → `"Only the project owner can reject feedback"`
- Line 627: `"Failed to reject review"` → `"Failed to reject feedback"`
- Line 633: `"Your review was not accepted"` → `"Your feedback was not accepted"`
- Line 634: `"Your review for \"${pr.title}\" was not accepted"` → `"Your feedback for \"${pr.title}\" was not accepted"`

**DO NOT CHANGE:** Function names (`submitReview`, `approveReview`, `rejectReview`, `rateReviewAction`), variable names, notification type values (`review_received`, etc.), or the `validTypes` array.

**VALIDATE:** `grep -n '".*review' app/actions.ts` — verify remaining matches are only variable names, function names, and DB enum values.

---

### Task 18: UPDATE `app/(protected)/dashboard/settings/notifications/page.tsx`

**Changes (update NOTIFICATION_EVENTS display labels and descriptions — do NOT change `key` values):**
- Line 16: `label: "New Review Received"` → `label: "New Feedback Received"`, `description: "When someone submits a review on your Feedback Request"` → `description: "When someone submits feedback on your Feedback Request"`
- Line 17: `label: "Review Approved"` → `label: "Feedback Approved"`, `description: "When a project owner approves your review"` → `description: "When a project owner approves your feedback"`
- Line 18: `label: "Review Not Accepted"` → `label: "Feedback Not Accepted"`, `description: "When a project owner does not accept your review"` → `description: "When a project owner does not accept your feedback"`
- Line 19: `label: "Review Rated"` → `label: "Feedback Rated"`, `description: "When a project owner rates your review"` → `description: "When a project owner rates your feedback"`

**DO NOT CHANGE:** The `key` values (`review_received`, `review_approved`, etc.) — these are DB enum values.

**VALIDATE:** `grep -n "review" app/(protected)/dashboard/settings/notifications/page.tsx` — only `key` values and code identifiers should remain.

---

### Task 19: UPDATE Landing Page Files

**`components/public/home/HowItWorks.tsx`:**
- Line 18: `"Review Other Projects"` → `"Give Feedback on Projects"`
- Line 20: `"Provide thoughtful reviews using our guided frameworks"` → `"Provide thoughtful feedback using our guided frameworks"`
- Line 21: `"Each review takes about 1-2 minutes"` → `"Each feedback session takes about 1-2 minutes"`
- Line 29: `"every review you give earns you one PeerPoint"` → `"every feedback you give earns you one PeerPoint"`
- Line 30: `"Each PeerPoint gets you one review on your project"` → `"Each PeerPoint gets you one feedback on your project"`

**`components/public/home/Hero.tsx`:**
- Line 36-38: `"Earn ${settings.reviewReward} Per Review"` → `"Earn ${settings.reviewReward} Per Feedback"`
- Line 64: `"Give a review, get a review."` → `"Give feedback, get feedback."`

**`components/public/home/Solution.tsx`:**
- Line 41: `"Receive one thoughtful review in return"` → `"Receive thoughtful feedback in return"`

**`components/public/home/Problem.tsx`:**
- Line 75: `"every reviewer on PeerPull is a founder or maker"` → `"every feedback giver on PeerPull is a founder or maker"`
- Line 76: `"get a detailed video review back"` → `"get detailed video feedback back"`
- Line 77: `"reviewers earn credits by giving thoughtful feedback, so low-effort reviews don't survive"` → `"feedback givers earn credits by being thorough, so low-effort feedback doesn't survive"`
- Line 78: `"give a review, get a review"` → `"give feedback, get feedback"`

**`components/public/home/FAQ.tsx`:**
- Line 41: `"give ${settings.reviewCost} review, get ${settings.reviewReward} back"` → `"give ${settings.reviewCost} feedback, get ${settings.reviewReward} back"`
- Line 42: `"points per review given"` → `"points per feedback given"`
- Line 63: `"bonus for your first review"` → `"bonus for your first feedback"`
- Line 67: `"All reviews must be approved by recipients before the reviewer earns PeerPoints"` → `"All feedback must be approved by recipients before the giver earns PeerPoints"`
- Line 68: `"guide reviewers to provide specific"` → `"guide feedback givers to provide specific"`

**`components/public/home/CTASection.tsx`:**
- Line 10-11: `"Earn ${settings.reviewReward} Per Review"` → `"Earn ${settings.reviewReward} Per Feedback"`
- Line 16: `"give just ${...} review${...} to get one back"` → `"give just ${...} feedback to get one back"`
- Line 20-21: `"Start reviewing and getting feedback immediately"` → `"Start giving and getting feedback immediately"`

**`app/layout.tsx`:**
- Line 15: `"Give a review, get a review."` → `"Give feedback, get feedback."`

**VALIDATE:** `grep -rn '".*[Rr]eview' components/public/home/ app/layout.tsx` — verify only code variable names remain.

---

### Task 20: Final Validation Sweep

Run a comprehensive grep across the entire codebase for remaining user-facing "review" strings:

```bash
grep -rn --include="*.tsx" --include="*.ts" '".*[Rr]eview' app/ components/ --exclude-dir=node_modules | grep -v "//\|import\|export\|const\|let\|var\|type\|interface\|function\|from\|reviews\.\|review\.\|review,\|review)\|reviewId\|reviewerId\|reviewer_id\|feedback_request"
```

This filters out code identifiers and should surface only string literals. Fix any remaining user-facing instances found.

---

## TESTING STRATEGY

### No Automated Tests

This project has no test framework configured. Validation is manual + grep-based.

### Manual Validation

1. **Sidebar:** Verify "Give Feedback" appears instead of "Submit Feedback"
2. **Give Feedback page:** Verify heading, tab labels, instruction steps, empty states all use new terms
3. **Get Next Project button:** Verify button says "Get Next Project" not "Get Next Review"
4. **Review session:** Verify "Project Briefing", "Your Feedback", "Project Rating", "Submit Feedback" labels
5. **Request Feedback listing:** Verify "In Progress" status badge, "feedback" count column
6. **Feedback Request detail:** Verify "Feedback Summary", "Rate this Feedback", toast messages
7. **Profile page:** Verify "Feedback Given/Received", "As a Feedback Giver", rating labels
8. **Dashboard home:** Verify "Feedback Given" stat, "Available Projects", "Give Feedback" quick action
9. **PeerPoints page:** Verify transaction labels, empty state, "How PeerPoints Work" copy
10. **Landing page:** Verify updated marketing copy reads naturally

---

## VALIDATION COMMANDS

### Level 1: Build Check

```bash
npm run build
```

Should complete without errors (note: `ignoreBuildErrors: true` is set, but we still want clean output).

### Level 2: Grep Audit

```bash
# Dashboard UI — should return ZERO user-facing "review" strings
grep -rn --include="*.tsx" '"[^"]*[Rr]eview[^"]*"' app/(protected)/ components/protected/ | grep -v "import\|from\|const\|let\|reviewId\|reviewer\|reviews\.\|review\.\|feedback_request\|ReviewQuality\|ReviewerSignals\|ReviewActions\|SignalBadges"

# Landing page — should return ZERO
grep -rn --include="*.tsx" '"[^"]*[Rr]eview[^"]*"' components/public/ app/layout.tsx | grep -v "import\|const\|settings\."
```

### Level 3: Visual Inspection

```bash
npm run dev
```

Navigate through all affected pages and verify terminology is consistent.

---

## ACCEPTANCE CRITERIA

- [ ] Sidebar shows "Give Feedback" instead of "Submit Feedback"
- [ ] "Get Next Project" button replaces "Get Next Review" / "Get a Review"
- [ ] All instruction steps use "feedback" not "review" for the deliverable
- [ ] "Project Rating" label on review session form
- [ ] "Rate this Feedback" panel heading
- [ ] "Feedback Given/Received" on profile and dashboard stats
- [ ] "As a Feedback Giver" section heading on profile
- [ ] "Available Projects" widget on dashboard home
- [ ] "In Progress" status badge replaces "In Review"
- [ ] All toast messages use "feedback" not "review"
- [ ] All notification title/message strings use "feedback" not "review"
- [ ] Transaction type labels on PeerPoints page use "feedback" not "review"
- [ ] Notification preference labels/descriptions on settings page use "feedback" not "review"
- [ ] Landing page copy updated consistently
- [ ] Meta description updated
- [ ] No database changes made
- [ ] No URL route changes made
- [ ] No component/function renames (code-only names stay as-is)
- [ ] `npm run build` succeeds

---

## COMPLETION CHECKLIST

- [ ] All 20 tasks completed in order
- [ ] Each task validation passed
- [ ] Full grep audit shows no remaining user-facing "review" strings in dashboard
- [ ] Build succeeds
- [ ] Visual inspection confirms natural reading across all pages
- [ ] No regressions — all pages render correctly

---

## NOTES

**Design decision — "In Review" → "In Progress":** The status "In Review" is confusing because "review" now ambiguously refers to feedback. "In Progress" is neutral and clear — someone is actively working on giving feedback for this project.

**Landing page tone:** The landing page uses slightly more relaxed vocabulary. Some instances of "review" in marketing copy were changed to "feedback" for consistency, but the overall tagline was updated to "Give feedback, get feedback" which maintains the punchy rhythm.

**Notification type enum values:** The DB enum values (`review_received`, `review_approved`, etc.) are NOT changed. These are internal identifiers stored in the database. Only the display `title` and `message` strings are updated. A future migration could rename these, but that's out of scope for this UI-only change.

**Risk: missed spots.** The grep-based validation in Task 19 is critical. The codebase has many files and the word "review" appears in variable names, imports, and DB queries throughout. The validation step must carefully distinguish between code identifiers (keep) and user-facing strings (change).

**Confidence Score: 8/10** — High confidence because changes are purely string replacements with no logic changes. Risk is only in missing a spot or making a string awkward. The comprehensive audit and grep validation mitigate this.
