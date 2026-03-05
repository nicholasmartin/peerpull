# PeerPull — Project Tracker

> **Single source of truth for what's done, what's next, and what's blocked.**
> Last updated: 2026-03-05 (GH #16 text size preference implemented)

---

## Current Sprint

**Focus:** Phase 4 manual testing + terminology cleanup before launch.

| Priority | Feature | Status | Blocker |
|----------|---------|--------|---------|
| 1 | Manual test Phase 4 notifications (4.1–4.6) | ⬜ Not Started | Needs 2 users for lifecycle tests |
| 2 | End-to-end user journey polish (4.8) | ⬜ Not Started | After 4.1–4.6 verified |
| 3 | Standardize terminology: feedback vs review vs rating (GH #12) | ✅ Done | `551820a` — 31 files, build passes |
| 4 | Redesign onboarding page (GH #7) | ✅ Done | `d6e0fcd` — standalone `/onboarding` route, 2-step branded flow |
| 5 | Smart OAuth avatar management (GH #13) | ⬜ Not Started | Low priority — cosmetic |
| 6 | React Email templates for notifications (GH #14) | ✅ Done | `a1c23b1` — 8 email files + pipeline wired, needs manual testing |
| 7 | Notification deep links (GH #17) | ✅ Done | `link_url` column + 4 call sites wired, build passes, needs migration push |

---

## Phase 1: Foundation & Cleanup — 🟢 Complete

| # | Feature | PRD Ref | Status | Commit / Evidence |
|---|---------|---------|--------|-------------------|
| 1.1 | Terminology migration (PR → Feedback Request) | 7.2 | ✅ Done | `7bbc89d` + migration `20260302100000` |
| 1.2 | Toast notification system (Sonner) | 7.9A | ✅ Done | `0c72795`, Toaster in layout.tsx, ToastFromParams bridge |
| 1.3 | Active project limit UX | 7.9B | ✅ Done | Verified: 3-layer guard (listing page, new page gate, action fallback) |
| 1.4 | Dark theme FormMessage | 7.9C | ✅ Done | `f885321` |
| 1.5 | Account type selection at signup | 7.1 | ✅ Done | Migration `20260218000000`, signup form updated |
| 1.6 | Profile edit save | 7.6 | ✅ Done | `6e61a87` (merged branch) |
| 1.7 | Atomic review submission (data integrity) | Roadmap | ✅ Done | `b7cd6dd`, migration `20260303000000` |
| 1.8 | Fix review_cost default (1→2) | Roadmap | ✅ Done | `2858237` |
| 1.9 | Dynamic video duration from settings | Roadmap | ✅ Done | `67b7a85`→`f48f94f` |
| 1.10 | Avatar upload + storage bucket | Roadmap | ✅ Done | `94213f8`, migration `20260303100000` |

## Phase 2: Quality & Trust Engine — 🟢 Complete

> **Plan:** `.agents/plans/phase-2-quality-trust-engine.md` (14 tasks, 4 migrations)

| # | Feature | PRD Ref | Status | Notes |
|---|---------|---------|--------|-------|
| 2.1 | Reviewer action signals (follow/engage/invest) | 7.3 | ✅ Done | `f9a2a5d`, migrations `20260304000000`–`000001` |
| 2.2 | Enhanced feedback quality panel | 7.4 | ✅ Done | `f9a2a5d`, ReviewQualityPanel.tsx, rate_review RPC |
| 2.3 | Reviewer quality score (Phase 1) | 7.5 | ✅ Done | `f9a2a5d`, recalculate_quality_score RPC (`000002`) |
| 2.4 | Quality score on unified profile | 7.5/7.6 | ✅ Done | `f9a2a5d`, QualityScoreBadge.tsx on profile sidebar |
| 2.5 | Builder + reviewer stats on profile | 7.6 | ✅ Done | `f9a2a5d`, ProfileStats.tsx with server-side aggregation |

## Phase 3: Waitlist & Onboarding — 🟢 Done

| # | Feature | PRD Ref | Status | Commit / Evidence |
|---|---------|---------|--------|-------------------|
| 3.1 | Profile status field (onboarding/waitlisted/active) | 7.7 | ✅ Done | Migration `20260302200000` |
| 3.2 | platform_launched system setting | 7.7 | ✅ Done | Migration `20260302200000` |
| 3.3 | Onboarding flow (welcome → project submit → confirm) | 7.7 | ✅ Done | `ad92f6e`, refactored `0da38f5` — now creates feedback_request on onboarding |
| 3.4 | Waitlisted dashboard state | 7.7 | ✅ Done | WaitlistBanner.tsx, nav gating |
| 3.5 | Admin launch switch | 7.7 | ✅ Done | Admin settings page |

## Phase 4: Notifications & Polish — 🟡 In Progress

> **Plan:** `.agents/plans/phase-4-notifications.md` (13 tasks)
> **⚠️ Code complete but NOT yet manually tested.** Requires end-to-end testing with 2 users across all 4 lifecycle events before marking phase as complete.

| # | Feature | PRD Ref | Status | Notes |
|---|---------|---------|--------|-------|
| 4.1 | Notifications table + RLS | 7.8 | 🟡 Coded, untested | `461d375`, migration `20260305000000`, `create_notification` + `get_user_email` RPCs |
| 4.2 | Notification preferences table | 7.8 | 🟡 Coded, untested | `461d375`, migration `20260305000000`, RLS with INSERT/UPDATE/SELECT |
| 4.3 | In-app notification bell + dropdown | 7.8 | 🟡 Coded, untested | `461d375`, NotificationDropdown.tsx rewritten with Realtime subscription |
| 4.4 | Create notifications on review lifecycle events | 7.8 | 🟡 Coded, untested | `461d375`, wired into submitReview, approveReview, rejectReview, rateReviewAction |
| 4.5 | Email notifications (Mailgun) | 7.8 | 🟡 Coded, untested | `461d375`, `utils/mailgun.ts`, graceful skip if not configured |
| 4.6 | Notification preferences in settings page | 7.8 | 🟡 Coded, untested | `461d375`, 4 PRD events with email toggles, persists via server action |
| 4.7 | Unified profile with all stats | 7.6 | ✅ Done | Completed in Phase 2 — `f9a2a5d`, ProfileStats.tsx + QualityScoreBadge.tsx |
| 4.8 | End-to-end user journey polish | — | ⬜ Not Started | Final QA pass |

## Phase 5: OAuth Social Login — 🟢 Complete

> **Plan:** `.agents/plans/oauth-social-login.md` (6 tasks)
> All 4 social logins (Google, GitHub, LinkedIn, Twitch) implemented and working.

| # | Feature | PRD Ref | Status | Notes |
|---|---------|---------|--------|-------|
| 5.1 | Update `handle_new_user()` trigger for OAuth metadata | 13 | ✅ Done | Migrations `20260306000000` + `000001` (fix), parses OAuth name/avatar + signup bonus/referral/onboarding |
| 5.2 | OAuthButtons client component | 13 | ✅ Done | `components/auth/OAuthButtons.tsx` — preserves `?ref=` through OAuth redirect chain |
| 5.3 | Add OAuth buttons to signin page | 13 | ✅ Done | Above form with "Or continue with email" divider |
| 5.4 | Add OAuth buttons to signup page | 13 | ✅ Done | Same pattern as signin |
| 5.5 | Local dev config (config.toml) | 13 | ✅ Done | All 4 providers enabled |
| 5.6 | .env.example update | 13 | ✅ Done | 8 OAuth credential placeholders |
| 5.7 | OAuth referral passthrough | 13 | ✅ Done | `OAuthButtons.tsx` + `auth/callback/route.ts` — redeems referral on OAuth signup |
| 5.8 | OAuth avatar display fix | 13 | ✅ Done | `referrerPolicy="no-referrer"` on AvatarImage for external URLs |

---

## GitHub Issues

> Synced from [nicholasmartin/peerpull/issues](https://github.com/nicholasmartin/peerpull/issues) on 2026-03-03

| # | Title | State | Severity | Notes |
|---|-------|-------|----------|-------|
| [#2](https://github.com/nicholasmartin/peerpull/issues/2) | Signup with existing email shows success message instead of error | Closed | Medium | `identities` length check + verify-email page — `a2fb4ff` |
| [#3](https://github.com/nicholasmartin/peerpull/issues/3) | Sidebar: allow expanding Feedback menu when user is not active | Closed | Low | Resolved by removing lock gating entirely — `5a413a0` |
| [#4](https://github.com/nicholasmartin/peerpull/issues/4) | Redesign auth pages to match dark gold theme | Closed | Medium | Verified and closed — commit `f885321` applied dark/gold theme to all auth pages |
| [#6](https://github.com/nicholasmartin/peerpull/issues/6) | Redirect to email verification page after signup | Closed | Medium | Dedicated verify-email page — `a2fb4ff` |
| [#7](https://github.com/nicholasmartin/peerpull/issues/7) | Redesign onboarding page — update logos, copy, and visual polish | Open | Medium | ✅ Done — `d6e0fcd`, standalone `/onboarding` route, 2-step branded flow |
| [#10](https://github.com/nicholasmartin/peerpull/issues/10) | Admin activate user silently fails — RLS blocks update | Closed | High | Fixed — SECURITY DEFINER RPCs |
| [#8](https://github.com/nicholasmartin/peerpull/issues/8) | Clean up all placeholder, dummy, and non-functional content | Open | Medium | ✅ Done — `15eb1e5` |
| [#9](https://github.com/nicholasmartin/peerpull/issues/9) | Clean up sidebar navigation for waitlisted users | Open | Low | ✅ Done — `f6431de` |
| [#11](https://github.com/nicholasmartin/peerpull/issues/11) | Audit light/dark theme system and plan for dual-theme support | Open | Medium | ✅ Done — `3e2dbcd`, CSS var foundation, 14 visual bug fixes, ThemeProvider wired |
| [#13](https://github.com/nicholasmartin/peerpull/issues/13) | Smart avatar management for OAuth users | Open | Low | Refresh provider avatar on login, preserve custom uploads |
| [#12](https://github.com/nicholasmartin/peerpull/issues/12) | Standardize terminology: feedback vs review vs rating | Open | Medium | ✅ Done — `551820a`, 31 files, UI-only, no DB changes |
| [#14](https://github.com/nicholasmartin/peerpull/issues/14) | Use React Email for templated notification emails | Open | Medium | ✅ Done — `a1c23b1`, needs manual testing with Mailgun |
| [#15](https://github.com/nicholasmartin/peerpull/issues/15) | Add consistent loading indicators across all interactions | Open | Medium | ✅ Done — `93e7b53` |
| [#16](https://github.com/nicholasmartin/peerpull/issues/16) | Add user-configurable text size preference | Open | Low | ✅ Done — TextSizeContext + appearance page wired, needs manual testing |
| [#17](https://github.com/nicholasmartin/peerpull/issues/17) | Notification deep links to detail pages | Open | Medium | ✅ Done, needs `supabase db push` for migration |

---

## Non-PRD / Infrastructure Work Done

| Feature | Status | Commit / Evidence |
|---------|--------|-------------------|
| Homepage redesign (gold theme) | ✅ Done | `36a87b6` |
| Hero animations + countdown | ✅ Done | `63f611d`, `0f2b58c` |
| Auth pages dark/gold theme | ✅ Done | `f885321` |
| Dashboard UI redesign (dark theme) | ✅ Done | `ed8cf75` |
| FIFO review queue | ✅ Done | `3db77d4` |
| Referral system + editable codes | ✅ Done | `7b802d9`, `d809375` |
| Beta economy + admin dashboard | ✅ Done | `d809375` |
| Cascade delete on auth.users | ✅ Done | `ac6870d` |
| Referral code lowercase fix | ✅ Done | `bd5927b` |
| Star rating required for reviews | ✅ Done | `de2eea9` |
| Windows dev .next lock workaround | ✅ Done | `16a56c2` |
| Next.js CVE patch | ✅ Done | `33044c6` |
| Trigger function search_path fix | ✅ Done | `1eda108` |
| Fix auto_queue_position trigger (stale sequence ref) | ✅ Done | `0da38f5`, migration `20260303200000` |
| Remove sidebar lock gating + platform_launched prop threading | ✅ Done | `5a413a0` |

---

## Known Issues / Tech Debt

| Issue | Severity | Source | Notes |
|-------|----------|--------|-------|
| ~~Duplicate email signup shows success~~ | ~~Medium~~ | [GH #2](https://github.com/nicholasmartin/peerpull/issues/2) | Fixed — `a2fb4ff` |
| ~~Sidebar Feedback menu hidden for non-active users~~ | ~~Low~~ | [GH #3](https://github.com/nicholasmartin/peerpull/issues/3) | Fixed — lock gating removed `5a413a0` |
| `ignoreBuildErrors: true` in next.config | Medium | — | TS errors bypassed on build |
| ~~OAuth: GitHub/LinkedIn/Twitch untested~~ | ~~Low~~ | [GH #13](https://github.com/nicholasmartin/peerpull/issues/13) | Fixed — all 4 providers working |
| OAuth avatar refresh on login | Low | [GH #13](https://github.com/nicholasmartin/peerpull/issues/13) | Smart avatar management (custom vs provider) |
| No test framework | Medium | — | No vitest/jest — hackathon trade-off |
| Untracked `types/` directory | Low | — | Needs investigation — should it be committed? |

---

## Status Legend

| Icon | Meaning |
|------|---------|
| ✅ | Done and verified |
| 🟢 | Phase mostly/fully complete |
| 🟡 | In progress or partially done |
| 🔴 | Blocked |
| ⬜ | Not started |

---

## How This Tracker Works

- **Updated by:** Claude during `/plan-feature`, `/execute`, `/commit`, and `/status` sessions
- **Location:** Project root (`TRACKER.md`) — versioned in git
- **Canonical source:** This file is the single source of truth for project progress
- **PRD reference:** Features map to PRD sections (e.g., "PRD 7.3" = Section 7.3 in `.claude/PRD.md`)
- **GitHub issues:** Synced from [nicholasmartin/peerpull](https://github.com/nicholasmartin/peerpull/issues)
