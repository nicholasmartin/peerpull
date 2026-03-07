<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into PeerPull. Both client-side (`posthog-js`) and server-side (`posthog-node`) tracking are configured, covering the full user journey from sign-up through the core feedback exchange loop. User identification is wired up at sign-up, sign-in, and onboarding completion. A reverse proxy via Next.js rewrites routes PostHog traffic through `/ingest` to improve ad-blocker resilience. Error tracking via `capture_exceptions` is enabled globally through `instrumentation-client.ts`.

## Files created

| File | Purpose |
|------|---------|
| `instrumentation-client.ts` | Client-side PostHog init (Next.js 15.3+ pattern) |
| `lib/posthog-server.ts` | Shared server-side PostHog client (posthog-node) |

## Files modified

| File | Change |
|------|--------|
| `next.config.ts` | Added `/ingest` rewrites + `skipTrailingSlashRedirect` |
| `app/actions.ts` | Server-side events: `sign_up`, `sign_in`, `feedback_request_submitted`, `review_submitted` |
| `components/protected/dashboard/OnboardingFlow.tsx` | Client event: `onboarding_project_submitted`; user identify |
| `app/(protected)/dashboard/submit-feedback/get-next-review-button.tsx` | Client event: `review_started` |
| `app/(protected)/dashboard/request-feedback/[id]/review-actions.tsx` | Client events: `review_approved`, `review_rejected` |
| `app/(protected)/dashboard/invite/page.tsx` | Client events: `referral_link_copied`, `referral_code_changed` |

## Event tracking summary

| Event | Description | File |
|-------|-------------|------|
| `sign_up` | User account successfully created | `app/actions.ts` |
| `sign_in` | User signs in with email/password | `app/actions.ts` |
| `onboarding_project_submitted` | User submits their first project during onboarding (live or draft) | `components/protected/dashboard/OnboardingFlow.tsx` |
| `feedback_request_submitted` | User submits a new feedback request to the queue | `app/actions.ts` |
| `review_started` | User clicks "Get Next Project" and is assigned a review | `app/(protected)/dashboard/submit-feedback/get-next-review-button.tsx` |
| `review_submitted` | User uploads video and submits their review with rating | `app/actions.ts` |
| `review_approved` | Project owner approves a submitted review | `app/(protected)/dashboard/request-feedback/[id]/review-actions.tsx` |
| `review_rejected` | Project owner rejects a submitted review | `app/(protected)/dashboard/request-feedback/[id]/review-actions.tsx` |
| `referral_link_copied` | User copies their referral link or code | `app/(protected)/dashboard/invite/page.tsx` |
| `referral_code_changed` | User successfully changes their referral code | `app/(protected)/dashboard/invite/page.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](https://us.posthog.com/project/334329/dashboard/1339174)
- [User Activation Funnel](https://us.posthog.com/project/334329/insights/OXRNsPjb) — conversion from sign up to review submitted
- [Sign Ups and Sign Ins Over Time](https://us.posthog.com/project/334329/insights/2uRnuGLO) — daily growth trend
- [Review Activity (Submitted vs Requests)](https://us.posthog.com/project/334329/insights/6mLynuy7) — platform supply/demand health
- [Review Approval Rate](https://us.posthog.com/project/334329/insights/rmvFN92q) — review quality signal
- [Referral Link Engagement](https://us.posthog.com/project/334329/insights/97NSX8Zg) — viral growth activity

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
