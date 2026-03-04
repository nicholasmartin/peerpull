# Feature: Active Project Limit UX (PRD 7.9B)

## Status: ✅ FULLY IMPLEMENTED — Verification Complete

All PRD 7.9B requirements have been implemented. This plan documents the verification results.

---

## Feature Description

Proactive UX guardrails preventing users from hitting server-side errors when they've reached the active project limit. Instead of letting users fill out the entire new-request form only to get a redirect error, the UI communicates the limit upfront at multiple checkpoints.

## User Story

As a builder with active projects in the queue,
I want to clearly see my current limit status before trying to create a new request,
So that I don't waste time filling out a form that will be rejected.

---

## VERIFICATION RESULTS

### PRD 7.9B Requirements vs Implementation

| Requirement | Status | Evidence |
|-------------|--------|----------|
| Fetch `active_project_limit` from settings server-side on listing page | ✅ | `request-feedback/page.tsx:17` — `getSettings()` |
| Count active queued projects (`open` + `queue_position IS NOT NULL`) | ✅ | `request-feedback/page.tsx:52-54` — filters fetched data |
| If at limit: disable "New Request" button | ✅ | `request-feedback/page.tsx:114-118` — disabled `<Button>` with title tooltip |
| Show info text: "{n}/{limit} active projects in queue" | ✅ | `request-feedback/page.tsx:109-112` — `<Info>` icon + count text |
| If under limit: show current count as subtle info text | ✅ | Same line — always visible regardless of limit status |
| New request page: async server component | ✅ | `request-feedback/new/page.tsx:40` — `async function NewRequestPage()` |
| Server-side check: fetch user, settings, active count | ✅ | `request-feedback/new/page.tsx:42-72` — full server-side gate |
| If at limit: render "limit reached" card instead of form | ✅ | `request-feedback/new/page.tsx:75-93` — AlertCircle card with back link |
| Server action fallback (double-check on submit) | ✅ | `actions.ts:226-236` — `submitFeedbackRequest` checks limit |
| Error messages display via toast system | ✅ | `dashboard/layout.tsx:30-32` — `<ToastFromParams />` in dashboard layout |

### Implementation Quality

**Three layers of protection:**
1. **Listing page** — disabled button + count indicator prevents navigation to form
2. **New request page** — server-side gate blocks form rendering if at limit
3. **Server action** — `submitFeedbackRequest` checks limit as final safeguard (handles direct URL access or race conditions)

**Consistent "active in queue" definition across all three layers:**
- `status === "open"` AND `queue_position !== null`
- This correctly excludes claimed projects (where `queue_position` is temporarily nulled)

**Settings integration:**
- Uses `getSettings()` from `utils/supabase/settings.ts` (typed, with defaults)
- `active_project_limit` default: 1, admin-configurable via Queue Settings page
- Pluralization handled correctly (`project` vs `projects`)

### Files Involved

| File | Role |
|------|------|
| `app/(protected)/dashboard/request-feedback/page.tsx` | Listing page: count badge, disabled button |
| `app/(protected)/dashboard/request-feedback/new/page.tsx` | New request page: server-side limit gate |
| `app/actions.ts` (lines 226-236) | Server action: final limit check on submit |
| `utils/supabase/settings.ts` | Settings helper: `active_project_limit` type + default |
| `components/toast-from-params.tsx` | Toast bridge for `encodedRedirect` error messages |
| `app/(protected)/dashboard/layout.tsx` | Dashboard layout: mounts `<ToastFromParams />` |

---

## NO FURTHER IMPLEMENTATION NEEDED

This feature is complete. The TRACKER should be updated from 🟡 Partial to ✅ Done.
