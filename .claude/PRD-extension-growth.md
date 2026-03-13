# PeerPull Companion Extension & Growth Pages - Product Requirements Document

**Version:** 1.0
**Date:** March 13, 2026
**Status:** Planning
**Supplements:** `.claude/PRD.md` (core platform PRD)

---

## 1. Executive Summary

PeerPull's core feedback loop works, but the recording experience is a bottleneck. Users must navigate to the PeerPull dashboard, go through multiple steps, deal with browser screen-picker dialogs, and record from within the app rather than from the product they're reviewing. This friction reduces review completion rates and limits the platform's growth potential.

This PRD defines two tightly coupled initiatives that solve this problem and unlock a viral acquisition channel:

1. **PeerPull Companion Extension** for Chrome that transforms the recording experience. The extension uses Chrome's Side Panel API to provide a persistent review companion that sits alongside the target website. Reviewers can pull the next item from the queue, see the builder's briefing questions, and record directly on the product's site, all without visiting the PeerPull dashboard. The extension supports two modes: internal (queue-based, PeerPoints economy) and external (freeform public reviews for growth).

2. **Shareable Feedback Pages** that turn external reviews into a viral referral engine. When a reviewer records feedback for a product found on Reddit, Product Hunt, or IndieHackers, PeerPull generates a public landing page with the video, reviewer profile, auto-scraped product metadata, and a signup CTA with the reviewer's referral code baked in. The reviewer shares the URL with the product builder, delivering free value while driving signups.

**Core value proposition:** Make recording feedback as easy as clicking a button, and turn every external review into a growth opportunity.

**MVP Goal Statement:** Ship a Chrome extension that handles both internal queue reviews and external public reviews, with auto-generated shareable pages that track referral conversions through PostHog.

---

## 2. Mission

**Mission Statement:** Remove every unnecessary step between "I want to give feedback" and "feedback delivered," while turning the act of reviewing into PeerPull's primary growth engine.

**Core Principles:**

1. **Zero friction recording.** The extension eliminates screen picker dialogs, multi-step navigation, and context switching. Click, record, done.
2. **One recording method.** The extension is the primary recording experience. No confusion between "dashboard recording" and "extension recording." The dashboard retains a fallback recorder for users without the extension, but the extension is the recommended path.
3. **Growth through generosity.** External reviews deliver genuine value to product builders before asking anything in return. The referral is a natural byproduct, not a sales pitch.
4. **Internal and external are distinct.** Internal reviews participate in the PeerPoints economy (queue, points, quality scores). External reviews operate outside the economy entirely. The incentive for external reviews is referral bonuses, not direct points.
5. **Track everything.** Every shareable page tracks video plays, CTA clicks, referral source, and registration conversions via PostHog.

---

## 3. Target Users

### Primary: Existing PeerPull Reviewers (Extension)
- Already use PeerPull to give and receive feedback
- Frustrated by the multi-step dashboard recording flow
- Technical comfort: high (Chrome extension installation is familiar)
- Pain point: recording friction reduces willingness to review
- Goal: faster, smoother review experience that lets them review more products in less time

### Secondary: PeerPull Growth Ambassadors (Shareable Pages)
- Active PeerPull users who want to earn referral bonuses
- Browse communities where builders ask for feedback (Reddit, IndieHackers, Product Hunt)
- Pain point: no easy way to create and share professional feedback while driving signups
- Goal: record quick feedback for strangers, share it, and earn referral points when they sign up

### Tertiary: Product Builders Receiving Unsolicited Feedback (Landing Page Visitors)
- Indie builders, founders, makers who posted asking for feedback somewhere
- May have never heard of PeerPull
- Receive a link to a shareable feedback page
- Pain point: they asked for feedback and someone actually delivered, now they want more
- Goal: watch the feedback video, learn about the reviewer, and potentially sign up for PeerPull

---

## 4. MVP Scope

### In Scope

**Chrome Extension - Core:**
- ✅ Chrome Side Panel UI with PeerPull branding and auth state
- ✅ Supabase auth integration (login once, persist session via `chrome.storage`)
- ✅ Display PeerPoints balance, quality score, and notification badge count
- ✅ Internal review mode: fetch next queued item, display briefing, auto-navigate to target URL
- ✅ External review mode: detect current page URL, record freeform feedback
- ✅ Tab capture recording via `chrome.tabCapture` API (no screen picker dialog)
- ✅ Microphone capture with device selection
- ✅ Recording controls in side panel: start, pause/resume, stop, abandon/redo
- ✅ Progress bar showing minimum duration threshold and maximum duration limit
- ✅ Duration constraints enforced (same `min_video_duration` / `max_video_duration` from `system_settings`)
- ✅ Post-recording preview with option to redo
- ✅ Video upload to Supabase Storage directly from extension
- ✅ Navigation confirmation modal when moving to next review ("Don't show again" option)
- ✅ Internal review submission form in side panel (text feedback, signals, star rating)
- ✅ External review: one-click generate shareable page after recording

**Chrome Extension - Technical:**
- ✅ Manifest V3 (required for Chrome Web Store)
- ✅ Monorepo structure (`extension/` directory in project root)
- ✅ Shared TypeScript types between extension and web app
- ✅ Self-hosted/unlisted distribution for initial development
- ✅ Extension icon with badge for notification count

**Shareable Feedback Pages:**
- ✅ Public route: `peerpull.com/r/{referral_code}/{short_id}`
- ✅ Video player (hosted on Supabase Storage)
- ✅ Reviewer profile card (name, avatar, expertise, quality score, review count)
- ✅ Auto-scraped product metadata (page title from `<title>` tag, favicon, OG image)
- ✅ Target site URL display
- ✅ CTA: "Want more feedback like this? Submit your project on PeerPull" with referral auto-applied
- ✅ Reviewer can edit and delete their public pages from the dashboard
- ✅ Pages are indexable by search engines (SEO-friendly, proper meta tags, OG tags)
- ✅ PostHog event tracking: page views, video plays, CTA clicks, signup conversions, referral source

**API Layer:**
- ✅ Next.js Route Handlers (`app/api/...`) for extension communication
- ✅ Zod schema validation on all API endpoints
- ✅ JWT-based auth (Supabase access token in Authorization header)
- ✅ Endpoints: auth verify, queue fetch, review submission, external review creation, video upload URL, settings fetch

**Dashboard Updates:**
- ✅ "My Public Reviews" section for managing external review pages
- ✅ Existing in-dashboard recorder preserved as fallback
- ✅ Extension install prompt/banner on review pages

### Out of Scope

- ❌ Safari extension (future consideration)
- ❌ Firefox extension (future consideration)
- ❌ Mobile recording of any kind (deprioritized)
- ❌ Mobile-responsive consumption of shareable pages (later enhancement)
- ❌ AI-generated summary of the reviewed product on shareable pages (future, noted as idea)
- ❌ AI transcription or summary of the review video (future)
- ❌ Chrome Web Store submission (will use self-hosted/unlisted initially, submit later)
- ❌ Video expiry/purge system for external reviews (future cost optimization)
- ❌ Conversion of external reviews into internal feedback requests on signup
- ❌ Detection of products already on PeerPull during external review
- ❌ Report/abuse mechanism on shareable pages
- ❌ PWA or desktop app
- ❌ Public API documentation for third parties

---

## 5. User Stories

### Extension Stories

1. **As a reviewer, I want to record feedback while browsing the actual product site**, so that I can give more natural, contextual reviews without switching between PeerPull and the product.
   - *Example: Marcus installs the extension, opens the side panel, clicks "Next Review," and the extension navigates him to SubCashFlow's landing page. He sees the builder's questions in the side panel and records his screen + voice as he explores the product naturally.*

2. **As a reviewer, I want to pull the next review from the queue directly from the extension**, so that I can review multiple products in a session without going back to the dashboard each time.
   - *Example: Marcus finishes a review, clicks "Submit," and the extension shows "Review submitted! You earned 1 PeerPoint." He clicks "Next Review" and the extension navigates to the next product in the queue, showing the new briefing.*

3. **As a reviewer, I want to pause and resume my recording**, so that I can collect my thoughts or handle interruptions without losing my progress.
   - *Example: During a review, Marcus's phone rings. He clicks "Pause" in the side panel, takes the call, then clicks "Resume" and continues where he left off.*

4. **As a reviewer, I want to redo my recording if I make a mistake**, so that I can deliver quality feedback without starting the entire flow over.
   - *Example: Marcus stumbles over his words 10 seconds into a recording. He clicks "Abandon," confirms, and immediately starts a new recording on the same product.*

5. **As a reviewer, I want to see a progress bar showing minimum and maximum recording duration**, so that I know exactly when I've met the minimum requirement and how much time I have left.
   - *Example: The side panel shows a progress bar. The first segment (0 to 60s) is highlighted in amber with a "minimum" label. Once Marcus passes 60 seconds, it turns green. The bar continues filling toward the 300s maximum.*

### Shareable Page Stories

6. **As a growth ambassador, I want to record quick feedback for a product I found on Reddit and share a link**, so that I can deliver value to the builder and earn referral bonuses when they sign up.
   - *Example: Nick sees a "Show HN" post. He clicks the PeerPull extension, hits "Record This Page," gives 2 minutes of feedback, clicks "Generate," and gets `peerpull.com/r/nickm/x7k9p2`. He posts the link as a comment on the HN thread.*

7. **As a product builder who received an unsolicited review, I want to watch the feedback and learn about the reviewer**, so that I can decide if the feedback is credible and if PeerPull is worth trying.
   - *Example: Sarah clicks the link Nick posted. She sees a clean page with Nick's video review of her landing page, his profile (4.2 quality score, 15 reviews given, expertise in SaaS/UI), the auto-detected title and favicon of her site, and a CTA to submit her site on PeerPull.*

8. **As a reviewer, I want to manage my public review pages from the dashboard**, so that I can edit or delete pages I no longer want public.
   - *Example: Nick goes to Dashboard > My Public Reviews, sees a list of his external reviews with view counts and CTA click counts. He deletes an old one for a product that shut down.*

### Technical Stories

9. **As a developer, I want the extension to communicate with PeerPull via well-structured API routes**, so that the extension and web app share a clean contract that can evolve independently.
   - *Example: The extension calls `POST /api/v1/reviews/external` with Zod-validated payload. The endpoint creates the external review record, generates the shareable page slug, and returns the public URL.*

---

## 6. Core Architecture & Patterns

### High-Level Architecture

```
Chrome Extension (Manifest V3)
├── Side Panel (React/Preact UI)
│   ├── Auth State (Supabase JWT via chrome.storage)
│   ├── Internal Review Mode (queue, briefing, submission)
│   └── External Review Mode (detect URL, record, generate page)
├── Background Service Worker
│   ├── Tab Capture (chrome.tabCapture API)
│   ├── Auth Token Management
│   └── Notification Badge Updates
├── Content Script (minimal)
│   └── Page metadata extraction (title, favicon, OG tags)
│
│   Communicates via
│       ↓
│
Next.js API Routes (app/api/v1/...)
├── Auth: verify token, get profile
├── Queue: get next review, submit review
├── External: create external review, generate page
├── Upload: signed URL for Supabase Storage
├── Settings: fetch system settings (durations, limits)
│
│   Reads/writes
│       ↓
│
Supabase (existing infrastructure)
├── Auth (JWT verification)
├── PostgreSQL (new: external_reviews table)
├── Storage (video uploads, same bucket)
└── RLS (policies for new table)
```

### Directory Structure

```
extension/                          # Chrome extension (monorepo)
├── manifest.json                   # Manifest V3 config
├── package.json                    # Extension dependencies
├── tsconfig.json                   # TypeScript config (extends root)
├── src/
│   ├── background/
│   │   └── service-worker.ts       # Background service worker
│   ├── sidepanel/
│   │   ├── index.html              # Side panel entry
│   │   ├── App.tsx                 # Main side panel app
│   │   ├── components/
│   │   │   ├── AuthGate.tsx        # Login form / auth state
│   │   │   ├── ReviewQueue.tsx     # Internal review queue UI
│   │   │   ├── ExternalReview.tsx  # External review flow
│   │   │   ├── RecordingPanel.tsx  # Recording controls + progress bar
│   │   │   ├── SubmissionForm.tsx  # Post-recording form (internal)
│   │   │   ├── PreviewPanel.tsx    # Post-recording preview (external)
│   │   │   └── StatusBar.tsx       # Points, score, notifications badge
│   │   └── hooks/
│   │       ├── useTabCapture.ts    # chrome.tabCapture recording logic
│   │       └── useApi.ts           # API client for PeerPull backend
│   ├── content/
│   │   └── metadata-extractor.ts   # Extract page title, favicon, OG data
│   └── shared/
│       ├── api-client.ts           # Fetch wrapper with auth headers
│       ├── storage.ts              # chrome.storage helpers
│       └── types.ts                # Shared types (mirrors web app types)
├── icons/                          # Extension icons (16, 32, 48, 128)
└── build/                          # Build output

app/api/v1/                         # New API routes (in existing Next.js app)
├── auth/
│   └── verify/route.ts             # Verify JWT, return profile
├── queue/
│   ├── next/route.ts               # GET: fetch next review assignment
│   └── submit/route.ts             # POST: submit internal review
├── external-reviews/
│   ├── route.ts                    # POST: create external review + page
│   └── [id]/route.ts              # PATCH/DELETE: edit/delete external review
├── upload/
│   └── signed-url/route.ts        # POST: get signed upload URL
└── settings/
    └── route.ts                    # GET: fetch system settings

app/(public)/r/
└── [code]/
    └── [slug]/
        └── page.tsx                # Shareable feedback page (SSR, public)

types/
└── api.ts                          # Zod schemas + TypeScript types for API contract
```

### Key Design Patterns

**Extension-Backend Communication:**
- Extension stores Supabase JWT in `chrome.storage.local`
- All API requests include `Authorization: Bearer <jwt>` header
- API routes validate JWT using `supabase.auth.getUser()` server-side
- Zod schemas validate request bodies, shared between extension and API routes via `types/api.ts`

**Recording Flow (Extension):**
- `chrome.tabCapture.capture()` for tab video (no screen picker, captures active tab)
- `navigator.mediaDevices.getUserMedia({ audio })` for microphone
- Audio streams merged via `AudioContext` (same pattern as existing `useScreenRecorder`)
- `MediaRecorder` with WebM/VP9 encoding (same codec preference as existing)
- Chunked upload to Supabase Storage via signed URL

**Internal vs External Mode:**
- Both modes share the same recording infrastructure (`RecordingPanel`)
- Internal mode adds: queue fetch, briefing display, submission form with text/signals/rating
- External mode adds: page metadata extraction, one-click page generation, shareable URL output
- Mode is selected in the side panel UI, not implicit

**Shareable Pages:**
- Server-rendered Next.js page at `/r/[code]/[slug]`
- Fetches external review data + reviewer profile server-side
- Public page, no auth required to view
- PostHog client-side tracking for video play, CTA click
- SEO: `<title>`, `<meta description>`, OG tags generated from product metadata + reviewer name
- Referral code extracted from URL path, passed to signup CTA as query param

---

## 7. Features - Detailed Specifications

### 7.1 Chrome Extension - Side Panel UI

**Purpose:** Provide a persistent, always-accessible review companion that sits alongside the target website.

**Side Panel States:**

| State | Content |
|-------|---------|
| Logged Out | PeerPull branding, email/password login form, link to sign up on web |
| Idle (Home) | Points balance, quality score, notification badge, "Next Review" button, "Record This Page" button |
| Briefing (Internal) | Target product info (title, URL, description), builder's questions, "Open Site & Record" button |
| Recording | Recording controls (pause/resume/stop/abandon), duration timer, progress bar (min/max thresholds), mic indicator |
| Preview | Video preview player, "Redo" and "Continue" buttons |
| Submission (Internal) | Text feedback field, signal toggles (follow/engage/invest), submit button |
| Submission (External) | Auto-detected product info preview, "Generate Page" button, loading state |
| Result (External) | Shareable URL (with copy button), "Open Page" link, "Record Another" button |

**Side Panel Behavior:**
- Opens via extension icon click or keyboard shortcut
- Persists across tab navigation (Chrome Side Panel API behavior)
- Remembers auth state across browser restarts via `chrome.storage.local`
- Updates notification badge count periodically (polling every 60 seconds)
- Width: Chrome default side panel width (user-resizable)

### 7.2 Recording System

**Purpose:** Provide a smooth, no-friction recording experience that captures the active tab's content plus microphone audio.

**Recording via `chrome.tabCapture`:**
- Captures the active tab's visible content as a `MediaStream`
- No screen/window picker dialog required (major UX improvement over `getDisplayMedia`)
- Combined with microphone audio via `AudioContext` mixing (same pattern as existing `useScreenRecorder.ts`)
- `MediaRecorder` encodes to WebM (VP9 preferred, VP8 fallback)

**Recording Controls (Side Panel):**
- **Start:** Begins capture of active tab + selected microphone
- **Pause/Resume:** Pauses the `MediaRecorder` without stopping streams. Timer pauses. Progress bar pauses.
- **Stop:** Ends recording, generates preview blob, shows preview panel
- **Abandon:** Stops recording, discards data, returns to idle/briefing state. Confirmation prompt: "Discard this recording?"

**Progress Bar:**
- Visual progress bar spanning from 0 to `max_video_duration`
- Segmented display:
  - 0 to `min_video_duration`: amber/gold segment, "Save" button disabled
  - `min_video_duration` to `max_video_duration`: green segment, "Save" button enabled
  - At `max_video_duration`: recording auto-stops
- Shows elapsed time as `MM:SS` and remaining time
- Warning indicator when approaching maximum (last 30 seconds)

**Duration Constraints:**
- `min_video_duration` and `max_video_duration` fetched from `system_settings` via API
- Same values used for both internal and external reviews
- Enforced client-side (button disabled before min, auto-stop at max)

**Post-Recording Preview:**
- Shows a brief video preview (first few seconds auto-play, muted)
- Two options: "Redo" (discard and re-record) or "Continue" (proceed to submission)
- For external reviews: "Continue" leads directly to page generation

**Video Upload:**
- Extension requests a signed upload URL from the API (`POST /api/v1/upload/signed-url`)
- Uploads video blob directly to Supabase Storage using the signed URL
- Upload progress indicator in the side panel
- On failure: retry button, error message, video blob preserved locally so user doesn't lose the recording

### 7.3 Internal Review Mode

**Purpose:** Allow reviewers to complete queue-assigned reviews entirely from the extension, without visiting the PeerPull dashboard.

**Flow:**
1. User clicks "Next Review" in the side panel
2. Extension calls `GET /api/v1/queue/next` to fetch and claim the next queued item
3. Side panel shows briefing: product title, URL, description, builder's focus areas and questions
4. User clicks "Open Site & Record"
5. Extension navigates the active tab to the product's URL
6. Recording starts automatically (or user clicks "Start Recording")
7. User reviews the product while the side panel shows recording controls
8. User stops recording, sees preview, clicks "Continue"
9. Side panel shows submission form: text feedback, signal toggles (follow/engage/invest)
10. User clicks "Submit Review"
11. Extension calls `POST /api/v1/queue/submit` with video URL, text, signals
12. Side panel shows confirmation: "Review submitted! You earned 1 PeerPoint."
13. "Next Review" button available to continue reviewing

**Navigation Confirmation:**
- When auto-navigating to the next review's URL, show a modal: "You're about to navigate to [product URL]. Any unsaved work on this page will be lost."
- Checkbox: "Don't show this again" (persisted in `chrome.storage.local`)
- Buttons: "Go" (navigates) and "Cancel" (stays on current page)

**Queue Edge Cases:**
- No items in queue: "No projects in the queue right now. Check back soon, or record a public review instead!" with "Record This Page" button
- Queue fetch error: error toast in side panel, retry button
- Review timeout (if user takes too long): handled server-side by existing timeout/requeue logic

### 7.4 External Review Mode

**Purpose:** Allow users to record freeform feedback for any website and generate a shareable public page, driving referral signups.

**Flow:**
1. User is browsing any website (e.g., a product they found on Reddit)
2. User opens the PeerPull extension side panel
3. User clicks "Record This Page"
4. Content script extracts page metadata: `<title>`, favicon URL, OG image, OG description, canonical URL
5. Recording starts (tab capture + microphone)
6. User records feedback while browsing the site naturally
7. User stops recording, sees preview, clicks "Continue"
8. Side panel shows auto-detected product info (title, favicon) for confirmation
9. User clicks "Generate Page"
10. Extension uploads video and calls `POST /api/v1/external-reviews` with video URL + metadata
11. API creates the `external_reviews` record, generates short slug, returns shareable URL
12. Side panel shows the URL with a "Copy Link" button and "Open Page" link

**Metadata Extraction (Content Script):**
- Runs on the active tab when "Record This Page" is clicked
- Extracts: `document.title`, favicon (`link[rel="icon"]`), OG image (`meta[property="og:image"]`), OG description (`meta[property="og:description"]`), canonical URL (`link[rel="canonical"]` or `window.location.href`)
- Sent to the side panel via `chrome.runtime.sendMessage`
- Stored with the external review record

**No Additional Input Required:**
- The reviewer does not fill in title, description, or any metadata manually
- Everything is auto-detected from the page
- This keeps the flow as fast as possible: record, stop, generate, share

### 7.5 Shareable Feedback Pages

**Purpose:** Public landing pages that showcase an external review and drive PeerPull signups via embedded referral links.

**URL Structure:** `peerpull.com/r/{referral_code}/{short_id}`
- `referral_code`: the reviewer's customizable referral code from their profile
- `short_id`: 6-character alphanumeric slug generated on creation (e.g., `x7k9p2`)
- Example: `peerpull.com/r/nickm/x7k9p2`

**Page Layout:**

```
┌─────────────────────────────────────────────────────┐
│  PeerPull Logo (small, top-left)                    │
│                                                     │
│  ┌───────────────────────────────────────────────┐  │
│  │                                               │  │
│  │           Video Player (large)                │  │
│  │                                               │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
│  ┌─────────────────┐  ┌───────────────────────────┐ │
│  │  Product Info    │  │  Reviewer Profile         │ │
│  │  [favicon] Title │  │  [avatar] Name            │ │
│  │  URL (linked)    │  │  Quality: 4.2 ★           │ │
│  │  OG description  │  │  15 reviews given         │ │
│  │                  │  │  Expertise: SaaS, UI/UX   │ │
│  └─────────────────┘  └───────────────────────────┘ │
│                                                     │
│  ┌───────────────────────────────────────────────┐  │
│  │  Want more feedback like this?                │  │
│  │  Submit your project on PeerPull and get      │  │
│  │  video reviews from real builders.            │  │
│  │                                               │  │
│  │  [ Get Free Feedback → ]                      │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
│  Footer: "Powered by PeerPull" + links              │
└─────────────────────────────────────────────────────┘
```

**Page Features:**
- Server-side rendered (Next.js Server Component at `app/(public)/r/[code]/[slug]/page.tsx`)
- Responsive design (readable on mobile, even though recording is desktop-only)
- Dark theme consistent with PeerPull branding
- Video auto-loads but does not auto-play (poster/thumbnail from first frame)
- Reviewer profile card shows: avatar, full name, quality score (if available, requires 3+ rated reviews), total reviews given, expertise tags
- Product info shows: favicon, page title, URL (clickable), OG description (if available)
- CTA button links to `peerpull.com/signup?ref={referral_code}`
- SEO meta tags: `<title>`, `<meta name="description">`, OG tags for social sharing

**PostHog Tracking Events:**
- `external_review_page_viewed` - page load (with referral source/UTM params)
- `external_review_video_played` - user clicked play on the video
- `external_review_cta_clicked` - user clicked the signup CTA
- `external_review_signup_completed` - user completed registration (tracked on signup page via referral code attribution)

All events include properties: `review_id`, `reviewer_id`, `referral_code`, `product_url`, `utm_source`, `utm_medium`, `referrer`

### 7.6 API Layer

**Purpose:** Provide structured, validated API endpoints for the Chrome extension to communicate with the PeerPull backend.

**Base Path:** `/api/v1/`

**Authentication:** All endpoints (except the public shareable page) require a valid Supabase JWT in the `Authorization: Bearer <token>` header. The API validates the token using `supabase.auth.getUser()`.

**Validation:** All request bodies validated with Zod schemas. Schemas defined in `types/api.ts` and shared between extension and API routes.

**Endpoints:**

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/api/v1/auth/verify` | Verify JWT, return user profile (points, score, notification count) |
| `GET` | `/api/v1/queue/next` | Claim and return next queued review assignment |
| `POST` | `/api/v1/queue/submit` | Submit completed internal review (video URL, text, signals) |
| `POST` | `/api/v1/external-reviews` | Create external review record + generate shareable page |
| `PATCH` | `/api/v1/external-reviews/:id` | Update external review metadata |
| `DELETE` | `/api/v1/external-reviews/:id` | Delete external review + shareable page |
| `POST` | `/api/v1/upload/signed-url` | Generate signed Supabase Storage upload URL |
| `GET` | `/api/v1/settings` | Fetch system settings (video duration limits, etc.) |

**Error Response Format:**
```json
{
  "error": {
    "code": "INSUFFICIENT_POINTS",
    "message": "You need at least 2 PeerPoints to submit a feedback request."
  }
}
```

**Success Response Format:**
```json
{
  "data": { ... },
  "meta": { "timestamp": "2026-03-13T..." }
}
```

### 7.7 Dashboard Updates

**Purpose:** Add external review management to the existing dashboard and encourage extension adoption.

**My Public Reviews Section:**
- New dashboard page: `/dashboard/projects/public-reviews` (or similar, fits existing nav structure)
- Table listing all external reviews created by the user
- Columns: product name (from scraped title), date created, views (from PostHog or stored count), CTA clicks, shareable URL
- Actions: copy URL, edit, delete (with confirmation modal)
- Edit allows: no fields to edit initially (metadata is auto-scraped), but delete is available

**Extension Install Prompt:**
- On review pages (e.g., `/dashboard/feedback/[id]/review`), show a subtle banner: "Try the PeerPull Extension for a smoother recording experience"
- Dismissible, persisted via cookie/localStorage
- Links to the self-hosted extension download (later: Chrome Web Store link)

---

## 8. Technology Stack

### Chrome Extension
- **Manifest V3** (required for new Chrome extensions)
- **TypeScript** (same version as main app, 5.7)
- **React 19** or **Preact** (for side panel UI, lighter weight, same JSX patterns)
- **TailwindCSS** (matching the main app's design tokens for visual consistency)
- **Vite** or **webpack** (extension bundler)
- **chrome.tabCapture API** (tab video capture)
- **chrome.sidePanel API** (persistent side panel)
- **chrome.storage API** (local auth token persistence)
- **MediaRecorder API** (video encoding, same as existing)

### API Layer (additions to existing Next.js app)
- **Next.js Route Handlers** (`app/api/v1/...`)
- **Zod** (request/response validation, new dependency)
- **@supabase/supabase-js** (existing, used for JWT verification and DB operations)

### Shareable Pages (additions to existing Next.js app)
- **Next.js Server Components** (SSR for SEO)
- **PostHog JS SDK** (existing, client-side event tracking)
- **Supabase Storage** (existing, video hosting)

### New Dependencies
| Package | Purpose | Location |
|---------|---------|----------|
| `zod` | API request/response validation | Main app |
| `vite` or `webpack` | Extension bundler | Extension |
| `@anthropic-ai/sdk` or similar | (Future) AI page summary | Not in MVP |

---

## 9. Security & Configuration

### Extension Authentication
- User logs in via the side panel (email/password, same Supabase Auth)
- Supabase returns a JWT access token + refresh token
- Tokens stored in `chrome.storage.local` (encrypted by Chrome, per-extension isolation)
- Access token included in all API requests as `Authorization: Bearer <token>`
- Token refresh handled automatically using the refresh token before expiry
- Logout clears `chrome.storage.local`

### API Security
- All `/api/v1/` routes verify the JWT using `supabase.auth.getUser()`
- If token is invalid or expired: 401 response
- Zod validation rejects malformed payloads with 400 response
- Rate limiting: not in MVP scope, but endpoint structure supports adding it later
- CORS: API routes configured to accept requests from the extension's origin (`chrome-extension://<id>`)

### Video Upload Security
- Extension requests a signed upload URL from the API (signed URLs are time-limited)
- Upload goes directly to Supabase Storage (extension never handles the storage service key)
- Server-side validation of uploaded file type and size before creating review records

### External Review Privacy
- External reviews are explicitly public content created by the reviewer
- The reviewer chooses to make it public by clicking "Generate Page"
- Reviewer can delete at any time via dashboard
- No personal data of the product builder is stored (only public page metadata)
- Shareable pages do not require authentication to view

### Configuration
- Extension reads system settings (`min_video_duration`, `max_video_duration`) from the API on launch
- Settings cached in `chrome.storage.local` with a TTL (refresh every 24 hours)
- Extension version displayed in the side panel footer for debugging

### Environment Variables (new)
```
# No new env vars required for MVP
# Extension uses the same NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
# These are public keys, safe to bundle into the extension
```

---

## 10. API Specification

### `GET /api/v1/auth/verify`

Verify the caller's JWT and return their profile summary.

**Headers:** `Authorization: Bearer <jwt>`

**Response 200:**
```json
{
  "data": {
    "id": "uuid",
    "full_name": "Nick Martin",
    "avatar_url": "https://...",
    "referral_code": "nickm",
    "peer_points_balance": 12,
    "quality_score": 4.2,
    "status": "active",
    "unread_notification_count": 3
  }
}
```

### `GET /api/v1/queue/next`

Claim the next available review from the FIFO queue. Uses the existing `get_next_review` RPC.

**Headers:** `Authorization: Bearer <jwt>`

**Response 200:**
```json
{
  "data": {
    "review_id": "uuid",
    "feedback_request": {
      "id": "uuid",
      "title": "SubCashFlow",
      "url": "https://subcashflow.com",
      "description": "SaaS billing management tool",
      "questions": ["Is the pricing page clear?", "Would you sign up?"],
      "focus_areas": ["landing_page", "pricing"]
    }
  }
}
```

**Response 200 (empty queue):**
```json
{
  "data": null,
  "meta": { "message": "No projects in the queue right now." }
}
```

### `POST /api/v1/queue/submit`

Submit a completed internal review. Uses the existing `submit_review_atomic` RPC.

**Headers:** `Authorization: Bearer <jwt>`

**Request Body:**
```json
{
  "review_id": "uuid",
  "video_url": "https://supabase.storage/...",
  "duration": 185,
  "feedback_text": "Great landing page, but pricing is confusing...",
  "signal_follow": true,
  "signal_engage": false,
  "signal_invest": false
}
```

**Response 200:**
```json
{
  "data": {
    "points_earned": 1,
    "new_balance": 13
  }
}
```

### `POST /api/v1/external-reviews`

Create an external review and generate the shareable page.

**Headers:** `Authorization: Bearer <jwt>`

**Request Body:**
```json
{
  "video_url": "https://supabase.storage/...",
  "duration": 120,
  "target_url": "https://example-product.com",
  "target_title": "Example Product - Build Better Things",
  "target_favicon_url": "https://example-product.com/favicon.ico",
  "target_og_image_url": "https://example-product.com/og.png",
  "target_og_description": "The fastest way to build better products."
}
```

**Response 201:**
```json
{
  "data": {
    "id": "uuid",
    "slug": "x7k9p2",
    "shareable_url": "https://peerpull.com/r/nickm/x7k9p2",
    "created_at": "2026-03-13T..."
  }
}
```

### `POST /api/v1/upload/signed-url`

Generate a signed URL for uploading a video to Supabase Storage.

**Headers:** `Authorization: Bearer <jwt>`

**Request Body:**
```json
{
  "filename": "review-1710345600.webm",
  "content_type": "video/webm"
}
```

**Response 200:**
```json
{
  "data": {
    "signed_url": "https://supabase.storage/.../upload?token=...",
    "path": "reviews/uuid/review-1710345600.webm"
  }
}
```

### `GET /api/v1/settings`

Fetch system settings relevant to the extension.

**Headers:** `Authorization: Bearer <jwt>`

**Response 200:**
```json
{
  "data": {
    "min_video_duration": 60,
    "max_video_duration": 300,
    "review_reward": 1,
    "platform_launched": true
  }
}
```

---

## 11. Success Criteria

### MVP Success Definition

The extension is ready for early user testing when a PeerPull user can install it, log in, complete an internal queue review entirely from the extension (without visiting the dashboard), and record an external review that generates a working shareable page with PostHog tracking.

### Functional Requirements

- ✅ Extension installs from self-hosted package and persists login across browser restarts
- ✅ Side panel displays correct PeerPoints balance, quality score, and notification count
- ✅ Internal mode: user can fetch next review, see briefing, record, submit, and earn points
- ✅ External mode: user can record any page, auto-scrape metadata, and generate shareable URL
- ✅ Recording supports pause/resume with correct duration tracking
- ✅ Progress bar enforces minimum duration (button disabled) and maximum duration (auto-stop)
- ✅ User can abandon/redo a recording before submission
- ✅ Video uploads successfully to Supabase Storage from the extension
- ✅ Shareable pages render correctly with video, reviewer profile, product info, and CTA
- ✅ CTA links to signup with referral code pre-applied
- ✅ PostHog tracks page views, video plays, CTA clicks on shareable pages
- ✅ Reviewer can view and delete public reviews from the dashboard
- ✅ All API endpoints validate requests with Zod and return consistent error formats
- ✅ Dashboard in-app recorder continues to work as fallback

### Quality Indicators

- Extension side panel loads in under 1 second
- Recording starts within 500ms of clicking "Start" (no screen picker delay)
- Video upload completes reliably for files up to 100MB
- Shareable pages load in under 2 seconds (SSR)
- No recording data loss when navigating between tabs during recording
- PostHog events fire correctly and appear in the PostHog dashboard

### User Experience Goals

- A reviewer can complete a full internal review cycle (fetch, navigate, record, submit) in under 5 minutes for a 2-minute review
- An external review (record, generate page, copy URL) takes under 30 seconds of overhead beyond the actual recording time
- No confusion about internal vs external mode (clear visual distinction in side panel)

---

## 12. Implementation Phases

### Phase 1: API Layer & Database Foundation

**Goal:** Build the API infrastructure the extension will communicate with, and create the database schema for external reviews.

**Deliverables:**
- ✅ Install Zod, set up validation patterns in `types/api.ts`
- ✅ Create `external_reviews` database table with migration
- ✅ RLS policies for `external_reviews` (owner read/write, public read for published)
- ✅ `GET /api/v1/auth/verify` route
- ✅ `GET /api/v1/queue/next` route (wraps existing `get_next_review` RPC)
- ✅ `POST /api/v1/queue/submit` route (wraps existing `submit_review_atomic` RPC)
- ✅ `POST /api/v1/external-reviews` route (creates record + generates slug)
- ✅ `PATCH /api/v1/external-reviews/:id` and `DELETE /api/v1/external-reviews/:id` routes
- ✅ `POST /api/v1/upload/signed-url` route
- ✅ `GET /api/v1/settings` route
- ✅ CORS configuration for extension origin

**Validation:** All endpoints testable via curl/Postman with a valid Supabase JWT.

### Phase 2: Chrome Extension Core

**Goal:** Build the extension shell with auth, side panel, and recording capability.

**Deliverables:**
- ✅ Extension project scaffolding in `extension/` (Manifest V3, Vite/webpack, TypeScript, React/Preact, Tailwind)
- ✅ Side panel with login form and auth state persistence
- ✅ `chrome.tabCapture` recording integration with mic selection
- ✅ Recording controls: start, pause/resume, stop, abandon
- ✅ Progress bar with min/max duration enforcement
- ✅ Post-recording preview with redo option
- ✅ Video upload to Supabase Storage via signed URL
- ✅ Status bar showing points, quality score, notification badge (links to dashboard)
- ✅ Self-hosted distribution (`.crx` file or unpacked extension instructions)

**Validation:** Extension installs, user can log in, record a tab, and upload video successfully.

### Phase 3: Internal & External Review Flows

**Goal:** Wire up both review modes end-to-end through the extension.

**Deliverables:**
- ✅ Internal mode: queue fetch, briefing display, auto-navigate to product URL
- ✅ Internal mode: post-recording submission form (text feedback, signals)
- ✅ Internal mode: submit review and display points earned
- ✅ Navigation confirmation modal with "Don't show again" option
- ✅ External mode: content script for page metadata extraction
- ✅ External mode: one-click page generation after recording
- ✅ External mode: shareable URL display with copy button
- ✅ "Next Review" flow for consecutive internal reviews

**Validation:** Complete an internal review cycle from extension. Record an external review and generate a working shareable URL.

### Phase 4: Shareable Pages & Dashboard Integration

**Goal:** Build the public-facing shareable pages and add external review management to the dashboard.

**Deliverables:**
- ✅ Public route `app/(public)/r/[code]/[slug]/page.tsx`
- ✅ Page layout: video player, reviewer profile card, product info, CTA
- ✅ SEO meta tags and OG tags for social sharing
- ✅ PostHog event tracking (page view, video play, CTA click)
- ✅ CTA links to `/signup?ref={referral_code}` with referral auto-applied
- ✅ Dashboard: "My Public Reviews" page with list, view counts, delete action
- ✅ Dashboard: extension install prompt banner on review pages
- ✅ PostHog conversion tracking (signup with referral attribution)

**Validation:** Shareable page renders correctly, PostHog events fire, CTA leads to signup with referral pre-filled, reviewer can manage pages from dashboard.

---

## 13. Future Considerations

### Near-Term Enhancements
- **Chrome Web Store submission** once the extension is stable and tested with early users
- **AI-powered page summary** for shareable pages: scrape the product's homepage, generate a 2-3 sentence summary using an LLM, display on the shareable page to add context and make it feel more researched
- **AI video transcription** and key moments/timestamps on shareable pages
- **Video expiry system** for external reviews: configurable TTL (e.g., 90 days), expired videos show a "Video has expired" message with CTA to PeerPull
- **Edit external review metadata** from dashboard (title override, custom description)
- **Mobile-responsive shareable pages** (consumption only, not recording)

### Medium-Term Opportunities
- **Safari Web Extension** using the same codebase (Safari supports WebExtensions API with some adaptations)
- **Firefox extension** (lower priority given market share)
- **Extension analytics dashboard** showing reviewers their external review performance (views, clicks, conversions) aggregated from PostHog
- **Ambassador program** with tiered rewards for high-performing external reviewers
- **Social sharing buttons** on shareable pages (Twitter/X, LinkedIn, Reddit)

### Long-Term Vision
- **Mobile recording** via native iOS/Android app with system screen capture APIs
- **Camera-only "quick take" reviews** as a lighter feedback format (works on mobile browsers)
- **Public reviewer profiles** linked from shareable pages, showcasing all public reviews
- **Embeddable review widget** that product builders can add to their own sites
- **API for third-party integrations** (e.g., Slack bot that posts new reviews)

---

## 14. Risks & Mitigations

### 1. chrome.tabCapture Permissions and Limitations
**Risk:** `chrome.tabCapture` requires the `tabCapture` permission and may have browser-specific quirks. It only captures the active tab, meaning if the user switches tabs during recording, the capture may stop or go blank.
**Mitigation:** Test thoroughly across Chrome versions. Handle tab-switch gracefully (pause recording or show warning). Document known limitations. Fall back to `getDisplayMedia` if `tabCapture` is unavailable in certain contexts.

### 2. Manifest V3 Service Worker Lifecycle
**Risk:** Manifest V3 service workers can be terminated by Chrome after inactivity, potentially interrupting long recordings or auth state management.
**Mitigation:** Recording is handled by the side panel (which stays alive while open), not the service worker. Auth tokens stored in `chrome.storage.local` persist independently of the service worker. Use `chrome.alarms` for periodic tasks instead of `setInterval` in the service worker.

### 3. Extension Adoption
**Risk:** Users may not install the extension, leaving the recording experience unchanged for them.
**Mitigation:** Dashboard recorder remains as fallback (no functionality is removed). Extension install prompts on review pages. Clear value proposition messaging: "Record reviews 3x faster with zero permission dialogs." Track extension vs dashboard recording usage to measure adoption.

### 4. Supabase Storage Costs for External Reviews
**Risk:** External reviews add video storage without PeerPoints cost to balance demand, potentially increasing storage costs significantly.
**Mitigation:** Monitor storage usage. Future: implement video expiry/purge for external reviews (noted in Future Considerations). Set maximum file size limits on uploads. Consider lower-resolution encoding for external reviews if cost becomes an issue.

### 5. Self-Hosted Extension Distribution
**Risk:** Self-hosted extensions require users to enable "Developer mode" in Chrome, which adds friction and may cause trust concerns. Chrome also shows warnings for non-Web-Store extensions.
**Mitigation:** Provide clear installation instructions with screenshots. Submit to Chrome Web Store as soon as the extension is stable (Phase 2 completion). Use the unlisted Web Store listing as an intermediate step if the review process is slow.

---

## 15. Appendix

### New Database Table: `external_reviews`

```sql
CREATE TABLE external_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  slug text NOT NULL UNIQUE,
  video_url text NOT NULL,
  duration integer NOT NULL,
  target_url text NOT NULL,
  target_title text,
  target_favicon_url text,
  target_og_image_url text,
  target_og_description text,
  status text NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'deleted')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX idx_external_reviews_reviewer ON external_reviews(reviewer_id);
CREATE INDEX idx_external_reviews_slug ON external_reviews(slug);

-- RLS
ALTER TABLE external_reviews ENABLE ROW LEVEL SECURITY;

-- Owner can do everything with their own reviews
CREATE POLICY "Users can manage own external reviews"
  ON external_reviews FOR ALL
  USING (auth.uid() = reviewer_id);

-- Anyone can read published reviews (for the public shareable page)
CREATE POLICY "Published external reviews are public"
  ON external_reviews FOR SELECT
  USING (status = 'published');
```

### Related Documents
- `.claude/PRD.md` - Core PeerPull platform PRD
- `hooks/useScreenRecorder.ts` - Existing recording logic (patterns to mirror in extension)
- `utils/supabase/client.ts` - Existing Supabase client setup
- `app/actions.ts` - Existing server actions (internal review submission logic to wrap in API routes)
- `lib/posthog-server.ts` - Existing PostHog server-side client
- `instrumentation-client.ts` - Existing PostHog client-side initialization

### Chrome Extension APIs Reference
- [Side Panel API](https://developer.chrome.com/docs/extensions/reference/api/sidePanel)
- [Tab Capture API](https://developer.chrome.com/docs/extensions/reference/api/tabCapture)
- [Storage API](https://developer.chrome.com/docs/extensions/reference/api/storage)
- [Manifest V3 Overview](https://developer.chrome.com/docs/extensions/develop/migrate/what-is-mv3)

### Extension Manifest Skeleton

```json
{
  "manifest_version": 3,
  "name": "PeerPull Companion",
  "version": "0.1.0",
  "description": "Record and share product feedback in seconds.",
  "permissions": [
    "tabCapture",
    "activeTab",
    "sidePanel",
    "storage"
  ],
  "side_panel": {
    "default_path": "sidepanel.html"
  },
  "background": {
    "service_worker": "background.js"
  },
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["content.js"],
      "run_at": "document_idle"
    }
  ],
  "icons": {
    "16": "icons/icon-16.png",
    "32": "icons/icon-32.png",
    "48": "icons/icon-48.png",
    "128": "icons/icon-128.png"
  },
  "action": {
    "default_icon": "icons/icon-32.png",
    "default_title": "PeerPull Companion"
  }
}
```
