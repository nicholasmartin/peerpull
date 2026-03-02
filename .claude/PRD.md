# PeerPull — Product Requirements Document

**Version:** 1.0
**Date:** March 2, 2026
**Status:** Hackathon Week

---

## 1. Executive Summary

PeerPull is a peer-to-peer feedback exchange platform built for indie builders, founders, and makers. The core mechanic is a credit-based exchange: you give a quality video review of another builder's product, and you earn the right to receive one back. This enforced reciprocity ensures every piece of feedback is credible, useful, and comes from someone who understands what it means to build something.

The platform is already functional with a working feedback exchange loop, PeerPoints economy, video recording and playback, referral system, and admin dashboard. This PRD defines the remaining features needed for public launch: account types, enhanced review quality controls, a pre-launch waitlist flow, notifications, profile improvements, and a terminology cleanup from the original "Pull Request" naming to the clearer "Feedback Request" / "Review" language.

**Tagline:** "Real feedback from real builders. Finally."

**MVP Goal Statement:** Launch PeerPull as a complete peer feedback exchange where every review you give earns you the right to get one back. The platform includes a credit-based exchange loop, reputation-driven profiles, three account types for builders, investors, and early adopters, and a quality scoring system that rewards genuine, helpful feedback.

---

## 2. Mission

**Mission Statement:** Give every indie builder access to honest, high-quality product feedback from peers who understand their journey — without paying for it, without begging for it, and without getting empty praise.

**Core Principles:**
1. **Enforced reciprocity** — You cannot receive without contributing. No lurkers, no free riders.
2. **Builder-to-builder credibility** — Every reviewer is also a builder, which means they understand the challenges and can give feedback that matters.
3. **Quality over quantity** — The credit economy and quality scoring system incentivize thoughtful, detailed reviews over rushed, low-effort ones.
4. **Transparency** — Points, quality scores, and reputation are visible and earned, never bought.
5. **Simplicity first** — Ship the core loop, learn from real usage, then layer on complexity.

---

## 3. Target Users

### Primary: Builders
- Indie hackers, solo founders, early-stage SaaS builders
- Technical comfort: high (comfortable with web apps, understand product development)
- Pain point: can't get honest, useful feedback — friends sugarcoat, agencies are expensive, generic platforms have no quality incentive
- Goal: receive actionable feedback and build credibility as a thoughtful reviewer

### Secondary: Investors
- Angel investors, micro-VCs, scouts looking for deal flow
- Technical comfort: moderate to high
- Pain point: hard to find promising early-stage products before they blow up
- Goal: discover vetted, actively developed products from real builders

### Tertiary: Early Adopters
- Product hunters, beta testers, people who want to use things before they go mainstream
- Technical comfort: moderate
- Pain point: wading through noise to find genuinely interesting new products
- Goal: early access to promising tools and products

---

## 4. MVP Scope

### In Scope (Hackathon Week)

**Core Functionality:**
- ✅ Credit-based feedback exchange loop (BUILT)
- ✅ Video screen recording reviews with mic (BUILT)
- ✅ PeerPoints economy with earn/spend/bonuses (BUILT)
- ✅ FIFO review queue with timeout recovery (BUILT)
- ✅ Referral system with editable codes (BUILT)
- ✅ Admin dashboard with economy controls (BUILT)
- ✅ Account type selection at signup (Builder / Investor / Early Adopter)
- ✅ Terminology migration: "Pull Request" → "Feedback Request" / "Review"
- ✅ Enhanced feedback quality panel (star rating, flags, text feedback to reviewer)
- ✅ Reviewer action signals (Follow, Engage, Invest/Acquire)
- ✅ Reviewer quality score (Phase 1: builder ratings)
- ✅ Unified profile page with builder + reviewer stats
- ✅ Pre-launch waitlist & onboarding flow
- ✅ Notification system (core review lifecycle events)
- ✅ Profile edit save functionality (currently broken)

**Technical:**
- ✅ Supabase Auth with email/password (BUILT)
- ✅ Supabase Storage for video uploads (BUILT)
- ✅ Row Level Security on all tables (BUILT)
- ✅ Server-side rendering with Next.js App Router (BUILT)
- ✅ New database migrations for new features

### Out of Scope

- ❌ Token/cryptocurrency economy (Phase 2 — future vision only)
- ❌ AI-powered review summarization or quality scoring
- ❌ Community features (forums, events, discussions)
- ❌ OAuth social login (Google, GitHub)
- ❌ Mobile app or PWA
- ❌ Real-time chat between builders
- ❌ Public API
- ❌ Achievement/badge system (beyond quality score)
- ❌ Draft feedback requests

---

## 5. User Stories

### Builder Stories

1. **As a Builder, I want to submit my project for feedback**, so that I can receive honest video reviews from other builders who understand my challenges.
   - *Example: Sarah submits her SaaS landing page with 3 specific questions about her value proposition. It costs her PeerPoints and enters the review queue.*

2. **As a Builder, I want to rate and evaluate the feedback I receive**, so that low-quality reviewers are identified and high-quality reviewers are rewarded.
   - *Example: Sarah receives a video review. She rates it 4/5 stars, leaves a thank-you note to the reviewer, and sees that the reviewer indicated interest in following her project.*

3. **As a Builder, I want to see my profile with both my builder and reviewer stats**, so that I can track my reputation and contributions in one place.
   - *Example: Sarah's profile shows 3 projects submitted, 12 reviews received (avg 3.8 stars), and on the reviewer side: 8 reviews given with a 4.2 quality score.*

4. **As a Builder, I want to flag fraudulent or low-effort reviews**, so that the platform maintains quality standards and my points aren't wasted.
   - *Example: Sarah receives a 30-second review where the reviewer clearly didn't look at her product. She flags it as "low effort" and gives it 1 star.*

### Reviewer Stories

5. **As a Reviewer, I want to record a screen + mic video review**, so that I can give detailed, visual feedback and earn PeerPoints.
   - *Example: After completing a thorough 4-minute review, Marcus earns 1 PeerPoint plus a 2-point first-review bonus.*

6. **As a Reviewer, I want to indicate my interest in a project after reviewing it**, so that the Builder knows their product resonated with me.
   - *Example: After reviewing a promising fintech tool, Marcus selects "Interested in Following" and "Interested in Engaging" to signal he'd use the product.*

### Pre-Launch Stories

7. **As a new user, I want to set up my account and profile before launch**, so that I'm ready to start reviewing as soon as the platform goes live.
   - *Example: Alex signs up, picks "Builder" as their account type, fills in their profile, adds their project URL, and enters a "Ready for Launch" waiting state.*

### Notification Stories

8. **As a user, I want to receive email notifications for key events**, so that I know when someone has reviewed my project or when I've been assigned a review.
   - *Example: Sarah gets an email saying "You received new feedback on SubCashFlow" with a link to view the video review. She also gets notified when a reviewer rates her feedback.*

---

## 6. Core Architecture & Patterns

### High-Level Architecture
```
Next.js 15 (App Router) → Supabase (Auth + DB + Storage)
├── Server Components (data fetching, auth checks)
├── Server Actions (mutations in app/actions.ts)
├── Client Components (interactive UI, video recording)
└── Supabase RPC Functions (SECURITY DEFINER for economy logic)
```

### Directory Structure
```
app/
├── (auth-pages)/        # Sign up, sign in, password reset
├── (protected)/         # Dashboard and all authenticated routes
│   └── dashboard/
│       ├── request-feedback/    # Submit + view feedback requests
│       ├── submit-feedback/     # Review queue + active reviews
│       ├── peerpoints/          # Balance + transaction history
│       ├── profile/             # Unified profile page
│       ├── settings/            # Notification preferences
│       ├── invite/              # Referral system
│       └── admin/               # Admin dashboard + controls
├── (public)/            # Landing page
└── actions.ts           # All server actions
components/
├── ui/                  # shadcn/ui base components
├── protected/           # Dashboard layout + feature components
├── public/              # Landing page sections
└── feedback/            # Screen recorder + review components
supabase/
└── migrations/          # Timestamped SQL migration files
utils/supabase/          # Client configs (client, server, middleware)
```

### Key Design Patterns
- **Server Actions** for all data mutations (`app/actions.ts`)
- **SECURITY DEFINER RPCs** for sensitive economy operations (point transfers, queue management)
- **Row Level Security** on every table
- **Settings-driven configuration** via `system_settings` table (admin-editable)
- **FIFO queue with SKIP LOCKED** for fair, concurrent review assignment

---

## 7. Features — Detailed Specifications

### 7.1 Account Types (NEW)

**Purpose:** Segment users by motivation and unlock future type-specific features.

**Implementation:**
- Add `account_type` field to `profiles` table: `'builder' | 'investor' | 'early_adopter'`, default `'builder'`
- Add account type selection to signup form (radio buttons or card-style selector)
- Display account type as a badge on the user's profile
- Phase 1: cosmetic only — no feature gating based on type
- Phase 2 (future): type-specific dashboard views and features

**Signup Flow Change:**
```
Name → Email → Password → Account Type (Builder/Investor/Early Adopter) → Referral Code → Create Account
```

### 7.2 Terminology Migration (CLEANUP)

**Purpose:** Replace confusing developer-centric "Pull Request" language with user-friendly terms.

**Rename Map:**
| Old Term | New Term |
|---|---|
| Pull Request | Feedback Request |
| PR | Feedback Request / Review |
| Submit a PR | Request Feedback |
| pull_requests (DB table) | `feedback_requests` (via migration rename) |
| pull_request_id (FK columns) | `feedback_request_id` |
| PullRequestDetailPage | FeedbackRequestDetailPage |

**Scope:**
- Database: rename `pull_requests` table → `feedback_requests`, update all FK column names
- Server actions: rename functions and variables
- UI: update all labels, headings, navigation items, breadcrumbs
- URL routes: `/request-feedback` path stays (already correct)
- RPC functions: update `assign_queue_position`, `get_next_review`, `complete_review_and_charge` to reference new table name

### 7.3 Reviewer Action Signals (NEW)

**Purpose:** Let reviewers signal interest in projects they review, creating lightweight deal flow for Builders.

**Post-Review Signals (optional, shown after review submission):**
- **Follow** — "I want to follow this project's progress"
- **Engage** — "I'm interested in using or buying this product"
- **Invest/Acquire** — "I'm interested in investing in or acquiring this"

**Implementation:**
- Add columns to `reviews` table:
  - `signal_follow boolean DEFAULT false`
  - `signal_engage boolean DEFAULT false`
  - `signal_invest boolean DEFAULT false`
- Show as toggle/checkbox options on the review submission form (after recording + text fields)
- Display on Builder's feedback detail page alongside each review (visible only to the feedback request owner)
- These are strictly private — only the Builder who submitted the feedback request sees them

### 7.4 Enhanced Feedback Quality Panel (NEW)

**Purpose:** Give Builders structured tools to evaluate the feedback they receive, replacing the current simple approve/reject with richer quality signals.

**Builder Actions When Viewing a Received Review:**
1. **Quality Rating** (1-5 stars) — "How useful was this review?"
2. **Issue Flags** (multi-select) — low effort, spam/fake, irrelevant, off-topic, other
3. **Text Feedback** — open text field for feedback to the reviewer (e.g., "Thanks, the UX suggestions were spot on" or "This didn't address my questions")
4. **View Reviewer Signals** — see Follow/Engage/Invest indicators if the reviewer selected any
5. **Approve / Reject** — final action (kept from current system)

**Implementation:**
- Add columns to `reviews` table:
  - `builder_rating smallint CHECK (builder_rating IS NULL OR builder_rating BETWEEN 1 AND 5)`
  - `builder_flags text[] DEFAULT '{}'`
  - `builder_feedback text`
- Update the feedback detail page UI to show the quality panel before approve/reject
- Builder rating and flags feed into the reviewer's quality score

### 7.5 Reviewer Quality Score (NEW — Phased)

**Purpose:** Build a transparent reputation metric that incentivizes high-quality reviews and surfaces reliable reviewers.

**Phase 1 (Hackathon):**
- Score = weighted average of `builder_rating` values received across all reviews
- Flag penalties: each flag reduces effective score (e.g., -0.5 per flag instance)
- Formula: `quality_score = (sum of builder_ratings / count) - (total_flags * 0.5)`
- Minimum 3 rated reviews before score is displayed (avoids noise from small samples)
- Display on the reviewer's profile

**Phase 2 (Post-Launch):**
- Add engagement signals: video duration relative to minimum, text detail length, time spent reviewing
- Weight formula: 70% builder ratings, 30% engagement metrics

**Phase 3 (Future):**
- Add consistency metrics: approval rate, flag rate, abandonment rate
- Weight formula: 50% builder ratings, 25% engagement, 25% consistency

**Implementation:**
- Add `quality_score numeric(3,2)` to `profiles` table (computed/cached)
- Create a function or scheduled job to recalculate scores when new ratings come in
- Display on profile with a visual indicator (e.g., score badge, star display)

### 7.6 Unified Profile Page (ENHANCE)

**Purpose:** Single profile page showing a user's full identity — both as a builder receiving feedback and as a reviewer giving feedback.

**Profile Layout:**
```
┌─────────────────────────────────────────┐
│  Avatar  Name  Account Type Badge       │
│  Email   Website   Member Since         │
│  [Edit Profile]                         │
├─────────────────────────────────────────┤
│  BUILDER STATS          REVIEWER STATS  │
│  Projects submitted     Reviews given   │
│  Reviews received       Quality score   │
│  Avg rating received    Avg rating given│
│  Interest signals       Approval rate   │
│  (follow/engage/invest) (approved/total)│
├─────────────────────────────────────────┤
│  EXPERTISE TAGS                         │
│  [SaaS] [UI/UX] [Marketing]            │
├─────────────────────────────────────────┤
│  ACTIVE PROJECT(S)                      │
│  Project name + URL + status            │
└─────────────────────────────────────────┘
```

**Implementation:**
- Wire up the existing Edit Profile form (save action currently missing)
- Add builder and reviewer stat aggregation queries
- Add account type badge display
- Add quality score display (once Phase 1 scoring is built)

### 7.7 Pre-Launch Waitlist & Onboarding (NEW)

**Purpose:** Let users sign up and prepare their accounts before the platform fully launches, creating anticipation and ensuring a smooth launch day experience.

**User Flow:**
1. **Sign up** — name, email, password, account type, optional referral code
2. **Onboarding** — welcome screen → complete profile → add project URL → set notification preferences
3. **Waitlisted state** — account is set up, user sees a "Ready for Launch" dashboard state
4. **Launch day** — admin flips `platform_launched` setting, all waitlisted users become active

**What's Accessible During Waitlist:**
- ✅ Complete and edit profile
- ✅ Add/update project URL
- ✅ Set notification preferences
- ✅ Invite others via referral link
- ✅ View their PeerPoints balance

**What's Locked Until Launch:**
- ❌ Submitting feedback requests
- ❌ Reviewing others' projects
- ❌ Spending points

**Implementation:**
- Add `status` field to `profiles`: `'onboarding' | 'waitlisted' | 'active'`, default `'onboarding'`
- Add `platform_launched` to `system_settings` (boolean string, default `'false'`)
- Update `handle_new_user()` to set initial status to `'onboarding'`
- Dashboard layout checks `profile.status` and `platform_launched` setting:
  - If `onboarding`: show onboarding checklist
  - If `waitlisted` and platform not launched: show "Ready for Launch" state with limited nav
  - If `active` or platform launched: full dashboard access
- Onboarding completion transitions status from `onboarding` → `waitlisted`
- Admin can manually activate individual users or flip the global launch switch

### 7.8 Notification System (NEW)

**Purpose:** Keep users informed about key events in the review lifecycle without overwhelming them.

**Notification Events (Core Review Lifecycle):**

| Event | Description | Email Default |
|---|---|---|
| `review_received` | Someone submitted a video review on your feedback request | ON |
| `review_approved` | The Builder approved your review | ON |
| `review_rejected` | The Builder rejected your review | ON |
| `review_rated` | The Builder rated your review (quality rating) | ON |

**Channels:**
- **Email** — enabled by default for all events, user can opt out per event
- **Browser push notifications** — opt-in, user enables in settings
- **In-app notification bell** — always on, shows unread count in dashboard header

**Implementation:**

*Database:*
- `notifications` table: `id`, `user_id`, `type` (enum matching events above), `title`, `message`, `reference_id`, `read boolean DEFAULT false`, `created_at`
- `notification_preferences` table: `user_id`, `event_type`, `email_enabled boolean DEFAULT true`, `push_enabled boolean DEFAULT false`
- Seed default preferences on user creation

*UI:*
- Notification bell icon in `AppHeader` with unread badge count
- Dropdown showing recent notifications with mark-as-read
- Full notifications page (optional, could just be dropdown)
- Settings page section for toggling preferences per event type

*Email:*
- Triggered from server actions when relevant events occur
- Use Mailgun API for email delivery
- Simple, clean email templates — not over-designed

### 7.9 Toast Notification System & Active Project Limit UX (NEW)

**Purpose:** Replace invisible URL-bar error messages with visible toast notifications across the dashboard, and add proactive UX guardrails for the active project limit.

**Problem:**
Server actions use `encodedRedirect("error", path, message)` which appends `?error=...` to the URL, but most dashboard pages don't read `searchParams` or display `FormMessage`. Users see errors only in the URL bar — effectively invisible.

**Part A: Toast System**

*Approach:*
- Install `sonner` (lightweight toast library, works with Next.js Server Components)
- Add `<Toaster />` to the dashboard layout
- Create a `<ToastFromParams />` client component bridge that:
  - Reads `error` and `success` query params from the URL
  - Displays them as toasts on mount
  - Cleans up the URL (removes query params) after displaying
- Place `<ToastFromParams />` in the dashboard layout so ALL dashboard pages automatically get toast support for `encodedRedirect` errors

*This means:*
- No per-page `searchParams` handling needed
- All existing `encodedRedirect` calls (submit feedback request, points errors, etc.) automatically surface as toasts
- Auth pages continue using `FormMessage` inline (different layout)

**Part B: Active Project Limit UX**

*Listing page (`/dashboard/request-feedback`):*
- Fetch `active_project_limit` from settings server-side
- Count user's active queued projects (status `open`, `queue_position IS NOT NULL`)
- If at limit: disable "New Request" button, show info text: "You have 1/1 active projects in the queue"
- If under limit: show current count as subtle info text

*New request page (`/dashboard/request-feedback/new`):*
- Convert to async server component
- Server-side check: fetch user, settings, active count
- If at limit: render a "limit reached" card instead of the form, with explanation and link back
- This prevents users from filling out the entire form only to hit a server-side error

**Part C: Dark Theme FormMessage (minor)**
- Update `FormMessage` component colors for dark theme compatibility (used on auth pages)
- Error: dark red bg, light red text
- Success: dark green bg, light green text

---

## 8. Technology Stack

### Core
- **Next.js 15** (App Router, Server Components, Server Actions) — TypeScript
- **Supabase** — Auth, PostgreSQL database, Storage (video uploads), Edge Functions
- **TailwindCSS** — utility-first styling with custom dark theme
- **shadcn/ui** — component library (Button, Card, Tabs, Badge, Avatar, etc.)

### Key Libraries
- **React 19** — UI rendering
- **Lucide React** — icons
- **MediaRecorder API** — browser-native screen + mic recording
- **@supabase/ssr** — server-side Supabase client with cookie-based sessions

### Infrastructure
- **Vercel** — hosting and deployment (assumed)
- **Supabase Cloud** — managed PostgreSQL, Auth, Storage
- **Mailgun** — transactional email via Mailgun API

---

## 9. Security & Configuration

### Authentication
- Email/password via Supabase Auth with cookie-based sessions
- Middleware refreshes sessions on all routes
- Protected routes gated by server-side auth checks in layout components
- Admin routes additionally check `profiles.is_admin`

### Row Level Security
Every table has RLS enabled with policies ensuring:
- Users can only read/write their own data
- Reviews are visible to reviewer AND feedback request owner
- System settings readable by all authenticated users, writable only by admins
- Transactions visible only to the owning user

### Configuration
- **Environment variables:** `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Runtime settings:** `system_settings` table — admin-editable from dashboard (point values, queue limits, video duration constraints)
- **Feature flags:** `platform_launched` system setting controls waitlist → active transition

### Security Scope
- ✅ RLS on all tables
- ✅ SECURITY DEFINER on economy functions (prevents client-side point manipulation)
- ✅ Input validation in server actions
- ✅ CSRF protection via Next.js server actions
- ❌ Rate limiting (out of scope for hackathon)
- ❌ Content moderation on video uploads (out of scope)

---

## 10. Database Schema — New Tables & Changes

### New Columns on `profiles`
```sql
account_type text DEFAULT 'builder' CHECK (account_type IN ('builder', 'investor', 'early_adopter'))
status text DEFAULT 'onboarding' CHECK (status IN ('onboarding', 'waitlisted', 'active'))
quality_score numeric(3,2)
```

### New Columns on `reviews`
```sql
signal_follow boolean DEFAULT false
signal_engage boolean DEFAULT false
signal_invest boolean DEFAULT false
builder_rating smallint CHECK (builder_rating IS NULL OR builder_rating BETWEEN 1 AND 5)
builder_flags text[] DEFAULT '{}'
builder_feedback text
```

### New Table: `notifications`
```sql
id uuid PRIMARY KEY DEFAULT gen_random_uuid()
user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
type text NOT NULL CHECK (type IN ('review_received', 'review_approved', 'review_rejected', 'review_rated'))
title text NOT NULL
message text
reference_id uuid
read boolean DEFAULT false
created_at timestamptz DEFAULT now()
```

### New Table: `notification_preferences`
```sql
user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
event_type text NOT NULL CHECK (event_type IN ('review_received', 'review_approved', 'review_rejected', 'review_rated'))
email_enabled boolean DEFAULT true
push_enabled boolean DEFAULT false
PRIMARY KEY (user_id, event_type)
```

### Table Rename
```sql
ALTER TABLE pull_requests RENAME TO feedback_requests;
-- Update all FK columns, RPC functions, RLS policies, and indexes accordingly
```

### New System Settings
```sql
('platform_launched', 'false', 'queue', 'Platform Launched', 'Whether the platform is open for reviews')
```

---

## 11. Success Criteria

### MVP Success Definition
The platform is ready for public launch when a new user can sign up, complete onboarding, wait for launch, and then participate in the full give-a-review / get-a-review cycle with quality controls.

### Functional Requirements
- ✅ User can sign up and select an account type
- ✅ User completes onboarding and enters waitlisted state
- ✅ Waitlisted users can set up profile but cannot review or submit
- ✅ Admin can flip launch switch to activate all users
- ✅ Active user can submit a feedback request (costs points, enters queue)
- ✅ Active user can claim and complete a video review (earns points)
- ✅ Builder can rate received reviews (stars, flags, text feedback)
- ✅ Reviewer can indicate interest signals (follow, engage, invest)
- ✅ Builder sees interest signals on their feedback detail page (private)
- ✅ Reviewer quality score displays on profile after 3+ rated reviews
- ✅ Email notifications fire for core review lifecycle events
- ✅ Users can manage notification preferences in settings
- ✅ All UI uses "Feedback Request" / "Review" terminology (no "Pull Request")
- ✅ Profile edit saves successfully

### Quality Indicators
- Video recording works reliably across Chrome, Edge, and Firefox
- Review queue assigns fairly (FIFO, no starvation)
- Points economy balances correctly (no phantom points)
- Page load times under 2 seconds for dashboard pages

---

## 12. Implementation Phases

### Phase 1: Foundation & Cleanup (Days 1-2)
**Goal:** Clean up terminology and establish new database schema.

**Deliverables:**
- ✅ Database migration: rename `pull_requests` → `feedback_requests`, add new columns to `profiles` and `reviews`, create notification tables
- ✅ Update all RPC functions for new table name
- ✅ Terminology migration across all UI components and server actions
- ✅ Add `account_type` field and selection to signup form
- ✅ Wire up profile edit save action

**Validation:** App builds and all existing functionality works with new naming.

### Phase 2: Quality & Signals (Days 3-4)
**Goal:** Build the enhanced review quality controls and reviewer action signals.

**Deliverables:**
- ✅ Enhanced feedback quality panel (star rating, flags, text feedback)
- ✅ Reviewer action signals (follow, engage, invest) on review submission
- ✅ Display signals on Builder's feedback detail page
- ✅ Reviewer quality score calculation (Phase 1: builder ratings only)
- ✅ Quality score display on unified profile page

**Validation:** Complete a review cycle with quality rating and signals flowing correctly.

### Phase 3: Waitlist & Onboarding (Days 5-6)
**Goal:** Build the pre-launch flow so new signups enter a controlled onboarding experience.

**Deliverables:**
- ✅ Onboarding flow (welcome → profile → project URL → preferences)
- ✅ Waitlisted dashboard state with limited access
- ✅ Admin launch switch in system settings
- ✅ Status transitions: onboarding → waitlisted → active

**Validation:** New signup goes through onboarding, enters waitlist, and cannot access review features until admin launches.

### Phase 4: Notifications & Polish (Day 7)
**Goal:** Wire up notifications and polish everything for launch.

**Deliverables:**
- ✅ Notification creation for core review lifecycle events
- ✅ In-app notification bell with unread count
- ✅ Email notifications (via Mailgun API)
- ✅ Notification preferences in settings page
- ✅ Unified profile page with all stats
- ✅ End-to-end testing of complete user journey

**Validation:** Full user journey works: signup → onboard → waitlist → launch → submit project → receive review → rate review → get notified.

---

## 13. Future Considerations

### Post-Hackathon Enhancements
- **AI review summarization** — generate key takeaways from video reviews using transcription + LLM
- **Community features** — founder directory, discussion forums, events
- **Achievement/badge system** — gamification beyond quality score
- **OAuth login** — Google, GitHub for faster signup
- **Public profiles** — shareable profile pages showing builder reputation

### Token Economy (Phase 2 Vision)
- Cryptocurrency tokens earned by giving reviews
- Marketplace to buy tokens for feedback without reviewing
- Dynamic pricing based on supply/demand
- Self-regulating economy: high demand raises token price, incentivizing more reviews

### Advanced Quality Scoring
- Phase 2: engagement metrics (video duration, text length, response time)
- Phase 3: consistency metrics (approval rate, flag rate, abandonment rate)
- Potential ML model trained on quality signals

### Account Type Features
- **Investor dashboard:** deal flow feed of projects with high engagement signals
- **Early Adopter dashboard:** discovery feed sorted by quality score and newness
- **Builder analytics:** deeper insights on feedback trends and reviewer demographics

---

## 14. Risks & Mitigations

### 1. Quality Gaming
**Risk:** Users submit minimum-effort reviews to farm points.
**Mitigation:** Builder quality ratings + flag system create accountability. Low-quality reviewers accumulate poor quality scores, which will be visible and eventually used for queue priority.

### 2. Terminology Migration Breakage
**Risk:** Renaming `pull_requests` table breaks existing data, RPC functions, or RLS policies.
**Mitigation:** Single migration that renames table + updates all FK references, constraints, indexes, and RPC functions atomically. Test against production data clone before applying.

### 3. Cold Start After Launch
**Risk:** Not enough projects in queue for reviewers to review.
**Mitigation:** Seed queue with real projects from team/early users. The waitlist flow ensures a batch of users are ready at launch, creating immediate supply.

### 4. Email Deliverability
**Risk:** Notification emails land in spam or don't send reliably.
**Mitigation:** Use Mailgun for reliable transactional email delivery. Start with minimal email volume (core lifecycle only). Add unsubscribe links.

### 5. Video Recording Browser Compatibility
**Risk:** Screen recording doesn't work on all browsers/devices.
**Mitigation:** Already implemented with browser validation. Document supported browsers. Graceful error messages for unsupported environments.

---

## 15. Appendix

### Key Files Reference
| File | Purpose |
|---|---|
| `app/actions.ts` | All server actions (auth, feedback requests, reviews) |
| `app/(protected)/dashboard/` | All dashboard routes |
| `components/feedback/ScreenRecorder.tsx` | Video recording component |
| `hooks/useScreenRecorder.ts` | Recording logic hook |
| `supabase/migrations/` | Database migration files |
| `utils/supabase/server.ts` | Server-side Supabase client |
| `utils/supabase/settings.ts` | System settings helper |

### Current Database Tables
| Table | Status |
|---|---|
| `profiles` | BUILT — needs new columns |
| `pull_requests` → `feedback_requests` | BUILT — needs rename + new columns |
| `reviews` | BUILT — needs new columns |
| `peer_point_transactions` | BUILT — no changes |
| `system_settings` | BUILT — needs new setting |
| `referrals` | BUILT — no changes |
| `referral_code_history` | BUILT — no changes |
| `notifications` | NEW |
| `notification_preferences` | NEW |

### Related Documents
- `docs/peerpull_summary.md` — Original hackathon concept summary
- `docs/core/economic-simulation-launch.md` — Point economy mechanics, launch ratio strategy, health metric thresholds, and control levers
- `CLAUDE.md` — Development instructions and architecture notes
