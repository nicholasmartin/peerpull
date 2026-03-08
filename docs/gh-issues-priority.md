# GitHub Issues Priority Analysis

> Last updated: 2026-03-08

---

## Tier 1: Security / Data Integrity (do first)

| # | Issue | Why |
|---|-------|-----|
| **#23** | Enforce onboarding bypass | **Bug.** Users can skip onboarding by navigating directly to `/dashboard/settings`, `/dashboard/peerpoints`, etc. Breaks the intended flow and could let incomplete profiles interact with the platform. Fix is trivial (add redirect check in dashboard layout). |
| **#22** | Identity linking (social + email same email) | **Data integrity risk.** If a user signs up with email, then later signs in with Google (same email), they could get a duplicate profile, losing PeerPoints and review history. Needs investigation + a defensive guard in `handle_new_user()`. |

---

## Tier 2: Core UX Gaps (high impact for users)

| # | Issue | Why |
|---|-------|-----|
| **#18** | Edit feedback requests after creation | **Missing core feature.** Onboarding users only submit title+URL. They have no way to add description, stage, focus areas, or questions afterward. Draft projects show a "not supported" message. Directly hurts feedback quality. |
| **#25** | Cross-browser screen recording (Firefox/Safari) | **Bug.** Firefox users literally cannot record feedback (tab picker is skipped, then validation rejects non-tab capture). This blocks a segment of users from the core loop. |
| **#24** | Persist referral code across public pages | **Growth blocker.** Referrers can only share `/signup?ref=CODE`. Sharing the homepage loses the code. Cookie-based fix is small and high-leverage for referral conversion. |

---

## Tier 3: Polish / UX Enhancement

| # | Issue | Why |
|---|-------|-----|
| **#21** | Inline field-level validation on auth forms | **UX polish.** Current single flash message works but is suboptimal. Not blocking anything. |
| **#19** | Public-facing user profiles | **New feature.** Useful for community discovery but not essential pre-launch. Depends on #18's profile maturity. |

---

## Tier 4: Long-term / Low Priority

| # | Issue | Why |
|---|-------|-----|
| **#5** | Harden `submit_review_atomic` RPC | **Tech debt tracking.** The function works correctly today. Important for long-term maintainability but no immediate risk. |
| **#13** | Smart OAuth avatar management | **Cosmetic.** Current behavior is fine, just doesn't auto-refresh provider avatars. |

---

## Parallel Execution Plan

These issues are independent and can be worked on simultaneously in separate worktrees:

| Stream A | Stream B | Stream C |
|----------|----------|----------|
| **#23** Onboarding bypass fix (quick) | **#24** Referral cookie persistence (1-2 files) | **#25** Cross-browser recording fix (hooks + UI) |
| then **#18** Edit feedback requests | then **#21** Inline validation | |

### Dependencies

- **#19** (public profiles) should wait until **#18** (edit feedback requests) is done, since users need the ability to enrich their profiles/projects first
- **#22** (identity linking) needs investigation/testing before coding. Could run as a research task in parallel with everything else
- **#5** and **#13** can be deferred indefinitely without risk

---

## Recommended Sequential Order

If tackling one at a time: **#23 → #24 → #25 → #18 → #21 → #22 → #19 → #13 → #5**
