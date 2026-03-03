# PeerPull — Project Tracker

> **Single source of truth for what's done, what's next, and what's blocked.**
> Last updated: 2026-03-03

---

## Current Sprint

**Focus:** Phase 1 completion — finish remaining infrastructure before moving to quality features.

| Priority | Feature | Status | Blocker |
|----------|---------|--------|---------|
| 1 | Active Project Limit UX (PRD 7.9B) | 🟡 Partial | Needs verification |
| 2 | Reviewer Action Signals (PRD 7.3) | ⬜ Not Started | — |
| 3 | Enhanced Feedback Quality Panel (PRD 7.4) | ⬜ Not Started | — |
| 4 | Reviewer Quality Score (PRD 7.5) | ⬜ Not Started | Depends on 7.4 |

---

## Phase 1: Foundation & Cleanup — 🟢 Mostly Complete

| # | Feature | PRD Ref | Status | Commit / Evidence |
|---|---------|---------|--------|-------------------|
| 1.1 | Terminology migration (PR → Feedback Request) | 7.2 | ✅ Done | `7bbc89d` + migration `20260302100000` |
| 1.2 | Toast notification system (Sonner) | 7.9A | ✅ Done | `0c72795`, Toaster in layout.tsx, ToastFromParams bridge |
| 1.3 | Active project limit UX | 7.9B | 🟡 Partial | Plan exists in `.agents/plans/active-project-limit-ux.md` — needs verification |
| 1.4 | Dark theme FormMessage | 7.9C | ✅ Done | `f885321` |
| 1.5 | Account type selection at signup | 7.1 | ✅ Done | Migration `20260218000000`, signup form updated |
| 1.6 | Profile edit save | 7.6 | ✅ Done | `6e61a87` (merged branch) |
| 1.7 | Atomic review submission (data integrity) | Roadmap | ✅ Done | `b7cd6dd`, migration `20260303000000` |
| 1.8 | Fix review_cost default (1→2) | Roadmap | ✅ Done | `2858237` |
| 1.9 | Dynamic video duration from settings | Roadmap | ✅ Done | `67b7a85`→`f48f94f` |
| 1.10 | Avatar upload + storage bucket | Roadmap | ✅ Done | `94213f8`, migration `20260303100000` |

## Phase 2: Quality & Trust Engine — ⬜ Not Started

| # | Feature | PRD Ref | Status | Notes |
|---|---------|---------|--------|-------|
| 2.1 | Reviewer action signals (follow/engage/invest) | 7.3 | ⬜ Not Started | Add signal columns to reviews, UI on review submit + detail page |
| 2.2 | Enhanced feedback quality panel | 7.4 | ⬜ Not Started | Star rating, flags, text feedback on received reviews |
| 2.3 | Reviewer quality score (Phase 1) | 7.5 | ⬜ Not Started | Depends on 2.2 — needs builder_rating data |
| 2.4 | Quality score on unified profile | 7.5/7.6 | ⬜ Not Started | Depends on 2.3 |
| 2.5 | Builder + reviewer stats on profile | 7.6 | ⬜ Not Started | Aggregation queries for profile page |

## Phase 3: Waitlist & Onboarding — 🟢 Done

| # | Feature | PRD Ref | Status | Commit / Evidence |
|---|---------|---------|--------|-------------------|
| 3.1 | Profile status field (onboarding/waitlisted/active) | 7.7 | ✅ Done | Migration `20260302200000` |
| 3.2 | platform_launched system setting | 7.7 | ✅ Done | Migration `20260302200000` |
| 3.3 | Onboarding flow (welcome → profile → confirm) | 7.7 | ✅ Done | `ad92f6e`, OnboardingFlow.tsx |
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
| 4.7 | Unified profile with all stats | 7.6 | ⬜ Not Started | Depends on Phase 2 quality score |
| 4.8 | End-to-end user journey polish | — | ⬜ Not Started | Final QA pass |

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

---

## Known Issues / Tech Debt

| Issue | Severity | Notes |
|-------|----------|-------|
| `ignoreBuildErrors: true` in next.config | Medium | TS errors bypassed on build |
| OAuth buttons are placeholders | Low | Google/GitHub login not functional |
| No test framework | Medium | No vitest/jest — hackathon trade-off |
| Untracked `types/` directory | Low | Needs investigation — should it be committed? |

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
