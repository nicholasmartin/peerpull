# PeerPull Launch Roadmap (3-4 Weeks)

## Context

PeerPull is a beta-ready MVP with the core feedback loop fully functional: signup (3 free points) -> submit project (1 point) -> review others via screen recording (earn 1 point) -> approve/reject reviews -> auto-requeue. The admin panel, economy system, referral system, and FIFO queue are all built.

**Goal:** Ship the remaining trust, quality, and growth features needed for a community launch on Indie Hackers / X / Reddit + personal network outreach. Economy config is locked in (1:1 ratio for launch).

---

## Week 1: Launch Blockers (Trust & Correctness)

### 1.1 Revert Video Duration to Production Values [S]
- Change `MIN_DURATION` from 5 -> 60 in `hooks/useScreenRecorder.ts:13`
- Update UI text in `app/(protected)/dashboard/submit-feedback/[id]/review/review-session.tsx` (lines 47, 214, 216)
- New migration: `ALTER TABLE reviews` constraint back to `BETWEEN 60 AND 300`

### 1.2 Email Notifications [L]
Send transactional emails at 3 trigger points:
1. Reviewer submits a review -> notify PR owner
2. PR owner approves review -> notify reviewer
3. PR owner rejects review -> notify reviewer

**Approach:** Use Resend (free tier) called from existing server actions in `app/actions.ts` (`submitReview` line 252, `approveReview` line 301, `rejectReview` line 338). Add `utils/email.ts` utility + inline HTML templates. Add `email_notifications` boolean to profiles for opt-out (needed by Settings in week 3).

### 1.3 Duplicate URL Detection [M]
In `app/actions.ts` `submitPullRequest` (line 159): normalize submitted URL (strip protocol, www, trailing slash, query params), query `pull_requests` for same user + matching normalized URL + status='open'. Block with clear error if found.

### 1.4 Wire Up Profile Edit [M]
The profile page has an "Edit Profile" tab with inputs but the Save button does nothing. Add `updateProfile` server action in `app/actions.ts`, wire up the form in `app/(protected)/dashboard/profile/page.tsx`. The profiles RLS already allows self-updates.

### 1.5 Active Project Limit - Better UX [S]
Backend already enforces the limit. Add a check on `app/(protected)/dashboard/request-feedback/new/page.tsx` to show a clear message when user already has an active project, instead of letting them fill the whole form and hit a generic error.

---

## Week 2: Quality & Safety (Prevent Gaming)

### 2.1 Reviewer Reputation System [L]
**Migration:** Add to profiles: `reviewer_avg_rating NUMERIC(3,2)`, `total_reviews_given INTEGER DEFAULT 0`, `total_ratings_received INTEGER DEFAULT 0`. Create `update_reviewer_reputation(reviewer_id)` function that recalculates from reviews table.

**Display:** Show reputation on profile page and as a badge next to reviewer name on PR detail pages (`app/(protected)/dashboard/request-feedback/[id]/page.tsx`).

### 2.2 Low-Quality Reviewer Penalties [M]
Modify `complete_review_and_charge()` DB function: if reviewer's `reviewer_avg_rating < 3.5` AND `total_ratings_received >= 3`, award 0 points on alternating reviews (track with `penalty_skip_next` boolean on profiles). Show warning on submit-feedback page if reviewer has low reputation.

### 2.3 IP-Based Signup Rate Limiting [M]
New table: `signup_ips (id, ip_address, user_id, created_at)`. In `signUpAction` (`app/actions.ts` line 9): extract IP from `x-forwarded-for` header, check count in last 30 days, block if >= 2.

### 2.4 Onboarding Flow [M]
Add `has_completed_onboarding` boolean to profiles. New component `components/onboarding/OnboardingModal.tsx` - a 3-4 step modal explaining: PeerPoints, how to submit, how to review, quality expectations. Show on dashboard if flag is false. Add `completeOnboarding` server action.

---

## Week 3: Growth Enablers (Distribution & Retention)

### 3.1 Public Profile Pages [M]
New page at `app/(public)/u/[code]/page.tsx` using referral_code as the slug. Display name, expertise, review count, reputation, projects. Add OG meta tags for social sharing. Link from internal profile page.

### 3.2 Social Sharing for Approved Reviews [S]
After approving a review on `app/(protected)/dashboard/request-feedback/[id]/page.tsx`, show "Share on X" / "Share on LinkedIn" buttons. Pre-populate tweet text with project name + referral link.

### 3.3 Community Page (Leaderboard) [M]
Build out `app/(protected)/dashboard/community/page.tsx`: top reviewers leaderboard (by count + reputation), recent activity feed, community-wide stats (total reviews, users, avg rating).

### 3.4 Settings Page [S]
Build out `app/(protected)/dashboard/settings/page.tsx`: notification preferences (email on/off), link to password change, account info. Wire to `updateSettings` server action.

### 3.5 Landing Page Social Proof [S]
The `SocialProof.tsx` component exists but isn't included on the page. Add it to `app/(public)/page.tsx` with beta tester quotes or curated testimonials. Add real stats if available.

---

## Week 4: Polish & Launch Prep

### 4.1 Error Handling Audit [M]
- Fix `submitReview` in actions.ts (line 288-296): if `complete_review_and_charge` RPC fails, review is marked submitted but points never transfer. Add rollback/retry.
- Replace hardcoded duration check in `review-session.tsx` with system setting value
- Add loading/error states to pages missing them

### 4.2 Help Page Content [S]
Populate `app/(protected)/dashboard/help/page.tsx` with FAQ, how-it-works guide, review quality guidelines, point economy explanation. Static content.

### 4.3 SEO & Meta Tags [S]
Add OG tags and Twitter cards to landing page and public profiles. Add `public/robots.txt` and `app/sitemap.ts`.

### 4.4 Mobile Responsiveness [S]
Screen recording is desktop-only - add mobile detection warning. Audit dashboard, profile, and landing page on mobile viewports.

### 4.5 Launch Day Prep [S]
- Seed queue with 5-10 real projects from your network
- Prepare IH/Reddit/X posts with screenshots
- End-to-end test: signup with referral -> submit project -> claim review -> record -> submit -> approve -> check email notification
- Set up Vercel analytics monitoring

---

## Summary

| Week | Item | Size | Category |
|------|------|------|----------|
| 1 | Revert video duration | S | Trust |
| 1 | Email notifications (3 triggers) | L | Retention |
| 1 | Duplicate URL detection | M | Anti-gaming |
| 1 | Wire up profile edit | M | Trust |
| 1 | Active project limit UX | S | UX |
| 2 | Reviewer reputation system | L | Quality |
| 2 | Low-quality penalties | M | Anti-gaming |
| 2 | IP-based signup limiting | M | Anti-gaming |
| 2 | Onboarding flow | M | Activation |
| 3 | Public profile pages | M | Growth |
| 3 | Social sharing buttons | S | Growth |
| 3 | Community page / leaderboard | M | Retention |
| 3 | Settings page | S | Polish |
| 3 | Landing page social proof | S | Conversion |
| 4 | Error handling audit | M | Reliability |
| 4 | Help page content | S | Trust |
| 4 | SEO & meta tags | S | Discovery |
| 4 | Mobile responsiveness | S | UX |
| 4 | Launch day prep | S | Launch |

**Size key:** S = half day or less, M = 1-2 days, L = 2-3 days

---

## If Behind Schedule - Cut List

**Never cut:** Video duration revert, email notifications, duplicate URL detection

**Can defer 1 week post-launch:** IP rate limiting, low-quality penalties (monitor manually), onboarding

**Can add post-launch:** Public profiles, community page, social sharing, settings, help content

---

## Verification

After each week, test the full user flow end-to-end:
1. Sign up with referral code -> verify bonus points awarded
2. Submit a project -> verify queue placement + point deduction
3. Claim a review from queue -> record video (60s+) -> submit with rating
4. As PR owner: receive email notification -> approve review
5. As reviewer: receive approval email -> check points earned
6. Verify reputation updates on profile
7. Admin panel: check metrics reflect activity correctly
