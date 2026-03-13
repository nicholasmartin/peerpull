# PeerPull — Tracker Archive

> **Completed phases and resolved issues from the core platform build.**
> Moved from `TRACKER.md` on 2026-03-13 to keep the active tracker lean.

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

## Phase 3: Waitlist & Onboarding — 🟢 Complete

| # | Feature | PRD Ref | Status | Commit / Evidence |
|---|---------|---------|--------|-------------------|
| 3.1 | Profile status field (onboarding/waitlisted/active) | 7.7 | ✅ Done | Migration `20260302200000` |
| 3.2 | platform_launched system setting | 7.7 | ✅ Done | Migration `20260302200000` |
| 3.3 | Onboarding flow (welcome → project submit → confirm) | 7.7 | ✅ Done | `ad92f6e`, refactored `0da38f5` — now creates feedback_request on onboarding |
| 3.4 | Waitlisted dashboard state | 7.7 | ✅ Done | WaitlistBanner.tsx, nav gating |
| 3.5 | Admin launch switch | 7.7 | ✅ Done | Admin settings page |

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

## Closed GitHub Issues

| # | Title | Severity | Notes |
|---|-------|----------|-------|
| [#2](https://github.com/nicholasmartin/peerpull/issues/2) | Signup with existing email shows success message instead of error | Medium | `identities` length check + verify-email page — `a2fb4ff` |
| [#3](https://github.com/nicholasmartin/peerpull/issues/3) | Sidebar: allow expanding Feedback menu when user is not active | Low | Resolved by removing lock gating entirely — `5a413a0` |
| [#4](https://github.com/nicholasmartin/peerpull/issues/4) | Redesign auth pages to match dark gold theme | Medium | Verified and closed — commit `f885321` applied dark/gold theme to all auth pages |
| [#6](https://github.com/nicholasmartin/peerpull/issues/6) | Redirect to email verification page after signup | Medium | Dedicated verify-email page — `a2fb4ff` |
| [#7](https://github.com/nicholasmartin/peerpull/issues/7) | Redesign onboarding page — update logos, copy, and visual polish | Medium | ✅ Done — `d6e0fcd`, standalone `/onboarding` route, 2-step branded flow |
| [#8](https://github.com/nicholasmartin/peerpull/issues/8) | Clean up all placeholder, dummy, and non-functional content | Medium | ✅ Done — `15eb1e5` |
| [#9](https://github.com/nicholasmartin/peerpull/issues/9) | Clean up sidebar navigation for waitlisted users | Low | ✅ Done — `f6431de` |
| [#10](https://github.com/nicholasmartin/peerpull/issues/10) | Admin activate user silently fails — RLS blocks update | High | Fixed — SECURITY DEFINER RPCs |
| [#11](https://github.com/nicholasmartin/peerpull/issues/11) | Audit light/dark theme system and plan for dual-theme support | Medium | ✅ Done — `3e2dbcd`, CSS var foundation, 14 visual bug fixes, ThemeProvider wired |
| [#12](https://github.com/nicholasmartin/peerpull/issues/12) | Standardize terminology: feedback vs review vs rating | Medium | ✅ Done — `551820a`, 31 files, UI-only, no DB changes |
| [#14](https://github.com/nicholasmartin/peerpull/issues/14) | Use React Email for templated notification emails | Medium | ✅ Done — `a1c23b1`, needs manual testing with Mailgun |
| [#15](https://github.com/nicholasmartin/peerpull/issues/15) | Add consistent loading indicators across all interactions | Medium | ✅ Done — `93e7b53` |
| [#16](https://github.com/nicholasmartin/peerpull/issues/16) | Add user-configurable text size preference | Low | ✅ Done — `8b9ff1e`, TextSizeContext + appearance page wired |
| [#17](https://github.com/nicholasmartin/peerpull/issues/17) | Notification deep links to detail pages | Medium | ✅ Done — `8b9ff1e`, `link_url` column + 4 call sites |
| [#18](https://github.com/nicholasmartin/peerpull/issues/18) | Allow users to edit feedback requests after creation | Medium | ✅ Done — `7b382fd`, edit/close/publish actions, shared form, confirmation modal |
| [#20](https://github.com/nicholasmartin/peerpull/issues/20) | Profile page improvements (email privacy, expertise, layout) | Medium | ✅ Done — `33cb400` |
| [#23](https://github.com/nicholasmartin/peerpull/issues/23) | Enforce onboarding bypass on dashboard sub-routes | High | ✅ Done — onboarding redirect moved to dashboard layout |
| [#24](https://github.com/nicholasmartin/peerpull/issues/24) | Persist referral code across all public pages | Medium | ✅ Done — `db2ecf8`, middleware cookie (90-day TTL) |
| [#26](https://github.com/nicholasmartin/peerpull/issues/26) | Theme toggle requires extra click (state desync) | Medium | ✅ Done — synced ThemeContext from localStorage |
| [#27](https://github.com/nicholasmartin/peerpull/issues/27) | Completed feedback rows not clickable, no detail view for reviewers | Medium | ✅ Done — `345aa29`, clickable rows + detail page |

---

## Completed Infrastructure Work

| Feature | Commit / Evidence |
|---------|-------------------|
| Homepage redesign (gold theme) | `36a87b6` |
| Hero animations + countdown | `63f611d`, `0f2b58c` |
| Auth pages dark/gold theme | `f885321` |
| Dashboard UI redesign (dark theme) | `ed8cf75` |
| FIFO review queue | `3db77d4` |
| Referral system + editable codes | `7b802d9`, `d809375` |
| Beta economy + admin dashboard | `d809375` |
| Cascade delete on auth.users | `ac6870d` |
| Referral code lowercase fix | `bd5927b` |
| Star rating required for reviews | `de2eea9` |
| Windows dev .next lock workaround | `16a56c2` |
| Next.js CVE patch | `33044c6` |
| Trigger function search_path fix | `1eda108` |
| Fix auto_queue_position trigger (stale sequence ref) | `0da38f5`, migration `20260303200000` |
| Remove sidebar lock gating + platform_launched prop threading | `5a413a0` |
| Defer signup/referral bonuses until account activation | `e92098a`, migration `20260311000000` |
| Fix double-claim bug: reviewers could claim multiple projects | `76d5507`, migration `20260312000000` |
| Sidebar nav restructure: Projects + Feedback top-level menus | `c348750`, old routes converted to redirects for backward compat |
| Streamlined feedback submission: single-page flow | `c2ac2af` — 5 new components, state machine, tab title countdown, mic readiness gate, celebration page |
| Admin user detail page (`/dashboard/admin/users/[id]`) | `670c7fb`, plan: `.agents/plans/admin-user-detail-page.md` |

---

## Resolved Tech Debt

| Issue | Resolution |
|-------|-----------|
| Duplicate email signup shows success | Fixed — `a2fb4ff` |
| Sidebar Feedback menu hidden for non-active users | Fixed — lock gating removed `5a413a0` |
| OAuth: GitHub/LinkedIn/Twitch untested | Fixed — all 4 providers working |
| Signup/referral bonus before email verification | Fixed — bonuses deferred to activation `e92098a` |
