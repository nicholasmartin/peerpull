# PeerPull — Project Tracker

> **Single source of truth for what's done, what's next, and what's blocked.**
> Last updated: 2026-03-04

---

## Current Sprint

**Focus:** Phases 1–3 complete. Phase 4 — Notifications & Polish is next.

| Priority | Feature | Status | Blocker |
|----------|---------|--------|---------|
| 1 | Notifications table + RLS (PRD 7.8) | ⬜ Not Started | — |
| 2 | In-app notification bell + dropdown (PRD 7.8) | ⬜ Not Started | Depends on 4.1 |
| 3 | End-to-end user journey polish | ⬜ Not Started | — |

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

## Phase 4: Notifications & Polish — ⬜ Not Started

| # | Feature | PRD Ref | Status | Notes |
|---|---------|---------|--------|-------|
| 4.1 | Notifications table + RLS | 7.8 | ⬜ Not Started | New migration needed |
| 4.2 | Notification preferences table | 7.8 | ⬜ Not Started | New migration needed |
| 4.3 | In-app notification bell + dropdown | 7.8 | ⬜ Not Started | AppHeader component |
| 4.4 | Create notifications on review lifecycle events | 7.8 | ⬜ Not Started | Server actions update |
| 4.5 | Email notifications (Mailgun) | 7.8 | ⬜ Not Started | External service integration |
| 4.6 | Notification preferences in settings page | 7.8 | ⬜ Not Started | Settings page UI |
| 4.7 | Unified profile with all stats | 7.6 | ✅ Done | Completed in Phase 2 — `f9a2a5d`, ProfileStats.tsx + QualityScoreBadge.tsx |
| 4.8 | End-to-end user journey polish | — | ⬜ Not Started | Final QA pass |

---

## GitHub Issues

> Synced from [nicholasmartin/peerpull/issues](https://github.com/nicholasmartin/peerpull/issues) on 2026-03-03

| # | Title | State | Severity | Notes |
|---|-------|-------|----------|-------|
| [#2](https://github.com/nicholasmartin/peerpull/issues/2) | Signup with existing email shows success message instead of error | Open | Medium | `signUpAction` missing `identities` length check — fix is a one-liner in `app/actions.ts` |
| [#3](https://github.com/nicholasmartin/peerpull/issues/3) | Sidebar: allow expanding Feedback menu when user is not active | Fixed | Low | Resolved by removing lock gating entirely — `5a413a0` |
| [#4](https://github.com/nicholasmartin/peerpull/issues/4) | Redesign auth pages to match dark gold theme | Open (likely done) | Medium | Commit `f885321` applied dark/gold theme to auth pages — may need verification and issue closure |

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
| Duplicate email signup shows success | Medium | [GH #2](https://github.com/nicholasmartin/peerpull/issues/2) | `signUpAction` missing `identities` length check |
| ~~Sidebar Feedback menu hidden for non-active users~~ | ~~Low~~ | [GH #3](https://github.com/nicholasmartin/peerpull/issues/3) | Fixed — lock gating removed `5a413a0` |
| `ignoreBuildErrors: true` in next.config | Medium | — | TS errors bypassed on build |
| OAuth buttons are placeholders | Low | — | Google/GitHub login not functional |
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
