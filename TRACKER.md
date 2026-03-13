# PeerPull — Project Tracker

> **Single source of truth for what's done, what's next, and what's blocked.**
> Last updated: 2026-03-13 (Phase 6.1 implemented)
>
> **Archive:** Completed phases 1-3, 5 and resolved issues moved to `docs/tracker-archive.md`

---

## Current Sprint

**Focus:** Finalize Phase 4 notifications testing, fix remaining UX bugs.

| Priority | Feature | Status | Blocker |
|----------|---------|--------|---------|
| 1 | Manual test Phase 4 notifications (4.1-4.6) | ⬜ Not Started | Needs 2 users for lifecycle tests |
| 2 | End-to-end user journey polish (4.8) | ⬜ Not Started | After 4.1-4.6 verified |
| 3 | Header dropdown z-index issues (GH #29) | ⬜ Not Started | — |
| 4 | Upload video immediately after recording (GH #28) | 🟡 Planned | Prevents data loss on page refresh |
| 5 | Cross-browser screen recording (GH #25) | 🟡 Partial | Chrome mic fix done, others remaining |

---

## Phase 4: Notifications & Polish — 🟡 In Progress

> **Plan:** `.agents/plans/phase-4-notifications.md`
> **⚠️ Code complete but NOT yet manually tested.**

| # | Feature | Status | Notes |
|---|---------|--------|-------|
| 4.1 | Notifications table + RLS | 🟡 Coded, untested | `461d375`, migration `20260305000000` |
| 4.2 | Notification preferences table | 🟡 Coded, untested | `461d375`, migration `20260305000000` |
| 4.3 | In-app notification bell + dropdown | 🟡 Coded, untested | `461d375`, NotificationDropdown.tsx |
| 4.4 | Create notifications on review lifecycle events | 🟡 Coded, untested | `461d375`, wired into server actions |
| 4.5 | Email notifications (Mailgun) | 🟡 Coded, untested | `461d375`, `utils/mailgun.ts` |
| 4.6 | Notification preferences in settings page | 🟡 Coded, untested | `461d375`, 4 PRD events with email toggles |
| 4.7 | Unified profile with all stats | ✅ Done | Completed in Phase 2 |
| 4.8 | End-to-end user journey polish | ⬜ Not Started | Final QA pass |

---

## Phase 6: Companion Extension & Growth Pages — 🟡 In Progress

> **PRD:** `.claude/PRD-extension-growth.md`
> Chrome extension for frictionless recording + shareable public feedback pages for viral growth.

| # | Feature | PRD Ref | Status | Notes |
|---|---------|---------|--------|-------|
| 6.1 | API layer + database foundation | §12 Phase 1 | ✅ Done | Zod validation, JWT auth, 7 route handlers, `external_reviews` table, migration `20260314000000` |
| 6.2 | Chrome extension core (auth, side panel, recording) | §12 Phase 2 | ⬜ Not Started | Manifest V3, `chrome.tabCapture`, pause/resume |
| 6.3 | Internal + external review flows | §12 Phase 3 | ⬜ Not Started | Queue integration, metadata extraction, page generation |
| 6.4 | Shareable pages + dashboard integration | §12 Phase 4 | ⬜ Not Started | Public pages at `/r/[code]/[slug]`, PostHog tracking |

---

## Open GitHub Issues

> Synced from [nicholasmartin/peerpull/issues](https://github.com/nicholasmartin/peerpull/issues) — last verified 2026-03-13

| # | Title | Severity | Notes |
|---|-------|----------|-------|
| [#5](https://github.com/nicholasmartin/peerpull/issues/5) | Harden submit_review_atomic RPC | Medium | ⬜ Tech debt |
| [#13](https://github.com/nicholasmartin/peerpull/issues/13) | Smart OAuth avatar management | Low | ⬜ Cosmetic |
| [#19](https://github.com/nicholasmartin/peerpull/issues/19) | Public-facing user profiles | Medium | ⬜ Future feature |
| [#21](https://github.com/nicholasmartin/peerpull/issues/21) | Inline field-level validation on auth forms | Low | ⬜ UX polish |
| [#22](https://github.com/nicholasmartin/peerpull/issues/22) | Handle identity linking for social + email login | Medium | ✅ Code done, issue open |
| [#25](https://github.com/nicholasmartin/peerpull/issues/25) | Cross-browser screen recording | Medium | 🟡 Chrome fix done, Safari/Firefox remaining |
| [#28](https://github.com/nicholasmartin/peerpull/issues/28) | Upload video immediately after recording | Medium | 🟡 Planned |
| [#29](https://github.com/nicholasmartin/peerpull/issues/29) | Header dropdown z-index issues | Medium | ⬜ Not started |

---

## Known Issues / Tech Debt

| Issue | Severity | Notes |
|-------|----------|-------|
| `ignoreBuildErrors: true` in next.config | Medium | TS errors bypassed on build |
| OAuth avatar refresh on login | Low | Smart avatar management (GH #13) |
| No test framework | Medium | No vitest/jest |

---

## Completed Phases

| Phase | Status | Archive |
|-------|--------|---------|
| Phase 1: Foundation & Cleanup | 🟢 Complete | `docs/tracker-archive.md` |
| Phase 2: Quality & Trust Engine | 🟢 Complete | `docs/tracker-archive.md` |
| Phase 3: Waitlist & Onboarding | 🟢 Complete | `docs/tracker-archive.md` |
| Phase 5: OAuth Social Login | 🟢 Complete | `docs/tracker-archive.md` |

---

## Status Legend

| Icon | Meaning |
|------|---------|
| ✅ | Done and verified |
| 🟢 | Phase complete |
| 🟡 | In progress or partially done |
| 🔴 | Blocked |
| ⬜ | Not started |

---

## How This Tracker Works

- **Updated by:** Claude during `/plan-feature`, `/execute`, `/commit`, and `/status` sessions
- **Location:** Project root (`TRACKER.md`) — versioned in git
- **Archive:** Completed work lives in `docs/tracker-archive.md`
- **PRD references:** Core platform features map to `.claude/PRD.md`, extension/growth features map to `.claude/PRD-extension-growth.md`
- **GitHub issues:** Synced from [nicholasmartin/peerpull](https://github.com/nicholasmartin/peerpull/issues)
