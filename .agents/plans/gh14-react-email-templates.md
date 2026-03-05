# Feature: React Email Templates for Notification Emails (GH #14)

The following plan should be complete, but its important that you validate documentation and codebase patterns and task sanity before you start implementing.

Pay special attention to naming of existing utils types and models. Import from the right files etc.

## Feature Description

Replace plain-text notification emails with branded, responsive HTML email templates built with React Email. All 4 transactional notification types get professional templates matching PeerPull's dark/gold aesthetic, rendered server-side and sent via Mailgun.

## User Story

As a PeerPull user
I want to receive professional, branded HTML emails for all notification events
So that I can quickly understand what happened and take action with a clear CTA

## Problem Statement

All notification emails are currently sent as plain text via Mailgun (`utils/mailgun.ts`). There are no HTML templates, no branding, and no visual consistency with the PeerPull UI. The `SendEmailParams` interface only supports a `text` field -- no `html` option. This makes emails look unprofessional and reduces engagement.

## Solution Statement

Adopt React Email to build component-based, type-safe email templates with Tailwind support. Create shared layout components (header, footer, CTA button) and 4 notification-specific templates. Update the notification pipeline to render templates to HTML and pass them through Mailgun.

## Feature Metadata

**Feature Type**: Enhancement
**Estimated Complexity**: Medium
**Primary Systems Affected**: `utils/mailgun.ts`, `utils/notifications.ts`, new `emails/` directory
**Dependencies**: `react-email`, `@react-email/components` (npm packages)

---

## CONTEXT REFERENCES

### Relevant Codebase Files -- IMPORTANT: YOU MUST READ THESE FILES BEFORE IMPLEMENTING!

- `utils/mailgun.ts` (all lines) -- Current email sending. `SendEmailParams` has `to`, `subject`, `text` only. Uses URLSearchParams + fetch to Mailgun REST API. Must add `html` field.
- `utils/notifications.ts` (all lines) -- Orchestrates notification creation + email sending. Calls `sendNotificationEmail()` at line 53-57 with `{to, subject, text}`. Must render React Email template here per notification type.
- `app/actions.ts` (lines 345-353) -- `review_received` call site: has `fr.title` (product title), `fr.user_id` (owner), `reviewId`
- `app/actions.ts` (lines 418-424) -- `review_approved` call site: has `review.reviewer_id`, `pr.title` (product title), `reviewId`
- `app/actions.ts` (lines 586-592) -- `review_rated` call site: has `reviewForNotif.reviewer_id`, product `title`, `rating` (1-5), `reviewId`
- `app/actions.ts` (lines 630-636) -- `review_rejected` call site: has `review.reviewer_id`, `pr.title`, `reviewId`
- `docs/confirm_email.html` -- Existing Supabase auth email template. Shows the brand design: dark bg (#050505), gold accent (#d4a853), Inter font, gold CTA button, "How it works" section. Mirror this visual language.
- `app/globals.css` (lines 1-25) -- CSS custom properties for theme colors
- `tailwind.config.ts` (lines 52-57) -- Gold palette: `blue-primary: #d4a853`, `teal-accent: #e8c778`
- `app/layout.tsx` -- Root layout with Inter + Montserrat fonts

### New Files to Create

- `emails/_components/email-layout.tsx` -- Shared wrapper: Html, Head, Preview, Tailwind config, Body, Container, Header, Footer
- `emails/_components/email-header.tsx` -- PeerPull brand bar (logo text + gold divider)
- `emails/_components/email-footer.tsx` -- "Sent to" line, unsubscribe placeholder, tagline
- `emails/_components/email-button.tsx` -- Gold CTA button component
- `emails/review-received.tsx` -- "Someone reviewed your product!" template
- `emails/review-approved.tsx` -- "Your feedback was approved -- points earned!" template
- `emails/review-rejected.tsx` -- "Your feedback needs revision" template
- `emails/review-rated.tsx` -- "The creator rated your feedback" template

### Relevant Documentation -- YOU SHOULD READ THESE BEFORE IMPLEMENTING!

- [React Email Docs - Introduction](https://react.email/docs/introduction)
  - Getting started, concepts overview
  - Why: Understand component model and rendering pipeline
- [React Email Docs - Render Utility](https://react.email/docs/utilities/render)
  - `render()` is async-only in v5.x, returns HTML string
  - Why: Core API for converting templates to sendable HTML
- [React Email Docs - Tailwind Component](https://react.email/docs/components/tailwind)
  - `<Tailwind>` wraps content, converts classes to inline styles
  - Why: Needed for email-client-compatible styling
- [React Email Docs - CLI](https://react.email/docs/cli)
  - `email dev` command for local preview server
  - Why: Needed for `email:dev` script setup

### Patterns to Follow

**Import Pattern (React Email):**
```tsx
import {
  Html, Head, Body, Container, Text, Button, Section, Img, Hr, Preview, Tailwind,
} from "@react-email/components";
import { render } from "@react-email/render";
```

**Design Tokens (from confirm_email.html -- mirror these exactly):**
```
Background:    #050505 (body), #0a0a0b (container area)
Gold accent:   #d4a853 (CTA buttons, highlights, dividers)
Text primary:  #ffffff (headings)
Text body:     #999999 (paragraph text)
Text muted:    #777777, #555555 (secondary, footer)
Divider:       #1a1a1a (subtle lines)
Gold divider:  linear-gradient transparent -> #d4a853 -> transparent (header)
Font stack:    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif
CTA button:    bg #d4a853, text #0a0a0a, 14px uppercase, 600 weight, 6px radius
```

**Naming Conventions:**
- Email template files: kebab-case (e.g., `review-received.tsx`)
- Shared components: kebab-case with underscore prefix directory (`_components/`)
- Component names: PascalCase (e.g., `ReviewReceivedEmail`)
- Props interfaces: `{TemplateName}Props` (e.g., `ReviewReceivedEmailProps`)

**Error Handling Pattern (from mailgun.ts):**
- Non-blocking: wrap in try/catch, log errors, never throw
- Graceful skip if env vars missing

---

## IMPLEMENTATION PLAN

### Phase 1: Dependencies & Shared Components

Install React Email packages and create the shared email layout components (header, footer, button, layout wrapper) that all templates will use. These mirror the visual language of `docs/confirm_email.html`.

### Phase 2: Email Templates

Create the 4 notification email templates, each with typed props and a consistent structure using the shared components.

### Phase 3: Integration

Update `utils/mailgun.ts` to support HTML emails and update `utils/notifications.ts` to render the appropriate template per notification type.

### Phase 4: Developer Experience

Add the preview dev server script and verify the full pipeline works.

---

## STEP-BY-STEP TASKS

### Task 1: INSTALL dependencies

- **IMPLEMENT**: Install React Email packages
  ```bash
  npm install react-email @react-email/components
  ```
- **GOTCHA**: `@react-email/components` is a meta-package that includes `@react-email/render` and `@react-email/tailwind` -- do NOT install them separately
- **GOTCHA**: `render()` is async-only in v5.x -- always `await render(...)`
- **VALIDATE**: `npm ls react-email @react-email/components` shows both installed

### Task 2: CREATE `emails/_components/email-header.tsx`

- **IMPLEMENT**: PeerPull brand header with text logo and gold gradient divider
- **PATTERN**: Mirror the header from `docs/confirm_email.html` (lines 14-27) -- "PeerPull" text, gold gradient divider
- **IMPORTS**: `Text`, `Hr`, `Section` from `@react-email/components`
- **DETAILS**:
  - "PeerPull" text: 20px, font-weight 700, white, letter-spacing -0.5px
  - Gold gradient divider below (use `Hr` with gold color since gradients don't work in all clients -- fallback to solid `#d4a853`)
  - Export as named export `EmailHeader`
- **VALIDATE**: File exists, no TS errors: `npx tsc --noEmit emails/_components/email-header.tsx` (or check with IDE)

### Task 3: CREATE `emails/_components/email-footer.tsx`

- **IMPLEMENT**: Email footer with tagline and "sent to" line
- **PATTERN**: Mirror footer from `docs/confirm_email.html` (lines 136-146)
- **IMPORTS**: `Text`, `Section` from `@react-email/components`
- **DETAILS**:
  - Props: `{ email: string }`
  - "PeerPull -- Feedback exchange for founders" in #555555, 12px
  - "Sent to {email}" in #333333, 11px
  - Horizontal rule above footer
- **VALIDATE**: File exists with correct props interface

### Task 4: CREATE `emails/_components/email-button.tsx`

- **IMPLEMENT**: Gold CTA button matching PeerPull brand
- **PATTERN**: Mirror CTA from `docs/confirm_email.html` (lines 50-57)
- **IMPORTS**: `Button` from `@react-email/components`
- **DETAILS**:
  - Props: `{ href: string; children: React.ReactNode }`
  - Styling: bg `#d4a853`, text `#0a0a0a`, 14px, uppercase, font-weight 600, border-radius 6px, padding 14px 40px
  - Use Tailwind classes (they'll be inlined by `<Tailwind>` wrapper)
- **VALIDATE**: File exists with correct props interface

### Task 5: CREATE `emails/_components/email-layout.tsx`

- **IMPLEMENT**: Shared layout wrapper that all templates use
- **IMPORTS**: `Html`, `Head`, `Body`, `Container`, `Preview`, `Tailwind` from `@react-email/components`; `EmailHeader`, `EmailFooter`
- **DETAILS**:
  - Props: `{ preview: string; email: string; children: React.ReactNode }`
  - Structure: `<Html>` > `<Head />` > `<Preview>{preview}</Preview>` > `<Tailwind config={...}>` > `<Body>` > `<Container>` > `<EmailHeader />` > `{children}` > `<EmailFooter email={email} />`
  - Tailwind config: define brand colors (`brand: "#d4a853"`, `brand-bg: "#050505"`, `brand-card: "#0a0a0b"`, etc.) + use `pixelBasedPreset` if available from `@react-email/components`
  - Body: bg `#050505`, font-family system stack
  - Container: max-width 560px, centered, padding 48px 20px
- **GOTCHA**: Import `pixelBasedPreset` from `@react-email/components` -- converts rem to px for email client compatibility. If not available in installed version, omit and use px values directly in classes.
- **VALIDATE**: File exists, exports `EmailLayout` component

### Task 6: CREATE `emails/review-received.tsx`

- **IMPLEMENT**: "New feedback received" email template
- **PROPS INTERFACE**:
  ```typescript
  interface ReviewReceivedEmailProps {
    productTitle: string;
    recipientEmail: string;
    dashboardUrl: string;
  }
  ```
- **CONTENT**:
  - Preview text: `New feedback received for "${productTitle}"`
  - Heading: "New Feedback Received" (white, 20px, bold)
  - Body: `Someone submitted video feedback for "${productTitle}". Head to your dashboard to watch it and leave a rating.` (#999999)
  - CTA: "View Feedback" -> `{dashboardUrl}`
- **PATTERN**: Use `<EmailLayout>` wrapper, `<EmailButton>` for CTA
- **EXPORTS**: Default export `ReviewReceivedEmail`
- **VALIDATE**: `npm run email:dev` shows template in preview (after Task 11)

### Task 7: CREATE `emails/review-approved.tsx`

- **IMPLEMENT**: "Your feedback was approved" email template
- **PROPS INTERFACE**:
  ```typescript
  interface ReviewApprovedEmailProps {
    productTitle: string;
    recipientEmail: string;
    dashboardUrl: string;
  }
  ```
- **CONTENT**:
  - Preview text: `Your feedback for "${productTitle}" was approved!`
  - Heading: "Feedback Approved!" (white, 20px, bold)
  - Body: `Great news! Your video feedback for "${productTitle}" was approved by the project owner. PeerPoints have been credited to your account.` (#999999)
  - CTA: "View Your PeerPoints" -> `{dashboardUrl}`
- **VALIDATE**: Template renders without errors

### Task 8: CREATE `emails/review-rejected.tsx`

- **IMPLEMENT**: "Your feedback was not accepted" email template
- **PROPS INTERFACE**:
  ```typescript
  interface ReviewRejectedEmailProps {
    productTitle: string;
    recipientEmail: string;
    dashboardUrl: string;
  }
  ```
- **CONTENT**:
  - Preview text: `Update on your feedback for "${productTitle}"`
  - Heading: "Feedback Not Accepted" (white, 20px, bold)
  - Body: `Your video feedback for "${productTitle}" was not accepted by the project owner. Don't be discouraged -- you can continue providing feedback on other projects to earn PeerPoints.` (#999999)
  - CTA: "Browse Projects" -> `{dashboardUrl}`
- **VALIDATE**: Template renders without errors

### Task 9: CREATE `emails/review-rated.tsx`

- **IMPLEMENT**: "Your feedback was rated" email template
- **PROPS INTERFACE**:
  ```typescript
  interface ReviewRatedEmailProps {
    productTitle: string;
    rating: number;
    recipientEmail: string;
    dashboardUrl: string;
  }
  ```
- **CONTENT**:
  - Preview text: `Your feedback for "${productTitle}" received a ${rating}/5 rating`
  - Heading: "Your Feedback Was Rated" (white, 20px, bold)
  - Rating display: Show `{rating}/5` in large gold text (#d4a853, 28px bold) -- similar to the "3 free credits" pattern in confirm_email.html (lines 117-126)
  - Body: `The owner of "${productTitle}" rated your video feedback ${rating} out of 5 stars.` (#999999)
  - CTA: "View Details" -> `{dashboardUrl}`
- **VALIDATE**: Template renders without errors

### Task 10: UPDATE `utils/mailgun.ts`

- **IMPLEMENT**: Add optional `html` field to `SendEmailParams` and pass it to Mailgun
- **CHANGES**:
  1. Add `html?: string` to `SendEmailParams` interface (line 4)
  2. After `formData.append("text", params.text)` (line 22), add:
     ```typescript
     if (params.html) {
       formData.append("html", params.html);
     }
     ```
- **GOTCHA**: Keep `text` as required -- it serves as the plain-text fallback for email clients that don't render HTML
- **VALIDATE**: `npx tsc --noEmit utils/mailgun.ts` passes (or no new TS errors in IDE)

### Task 11: UPDATE `utils/notifications.ts`

- **IMPLEMENT**: Render the appropriate React Email template per notification type before sending
- **IMPORTS**: Add at top of file:
  ```typescript
  import { render } from "@react-email/render";
  import ReviewReceivedEmail from "@/emails/review-received";
  import ReviewApprovedEmail from "@/emails/review-approved";
  import ReviewRejectedEmail from "@/emails/review-rejected";
  import ReviewRatedEmail from "@/emails/review-rated";
  ```
- **CHANGES TO `CreateNotificationParams`**: Add optional fields for template data:
  ```typescript
  interface CreateNotificationParams {
    userId: string;
    type: NotificationType;
    title: string;
    message?: string;
    referenceId?: string;
    // Template data (optional -- for HTML email rendering)
    productTitle?: string;
    rating?: number;
  }
  ```
- **CHANGES TO `createNotification` function**: Replace the email sending block (lines 52-57) with template rendering logic:
  ```typescript
  if (email) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://peerpull.com";
    const dashboardUrl = `${appUrl}/dashboard`;
    const recipientEmail = email as string;

    let html: string | undefined;
    try {
      switch (params.type) {
        case "review_received":
          html = await render(ReviewReceivedEmail({
            productTitle: params.productTitle || "your project",
            recipientEmail,
            dashboardUrl,
          }));
          break;
        case "review_approved":
          html = await render(ReviewApprovedEmail({
            productTitle: params.productTitle || "your project",
            recipientEmail,
            dashboardUrl: `${appUrl}/dashboard/peerpoints`,
          }));
          break;
        case "review_rejected":
          html = await render(ReviewRejectedEmail({
            productTitle: params.productTitle || "your project",
            recipientEmail,
            dashboardUrl: `${appUrl}/dashboard/submit-feedback`,
          }));
          break;
        case "review_rated":
          html = await render(ReviewRatedEmail({
            productTitle: params.productTitle || "your project",
            rating: params.rating || 0,
            recipientEmail,
            dashboardUrl,
          }));
          break;
      }
    } catch (renderErr) {
      console.error("Email template render error (non-blocking):", renderErr);
    }

    await sendNotificationEmail({
      to: recipientEmail,
      subject: params.title,
      text: params.message || params.title,
      html,
    });
  }
  ```
- **GOTCHA**: `render()` is async -- must `await`. Wrap in try/catch so template render failures don't block notification creation. Falls back to text-only if render fails.
- **VALIDATE**: `npx tsc --noEmit utils/notifications.ts` passes

### Task 12: UPDATE `app/actions.ts` -- Pass template data to createNotification

- **IMPLEMENT**: Add `productTitle` and `rating` fields to each `createNotification` call
- **CHANGES** (4 call sites):

  1. **Line 347** (`review_received`): Add `productTitle: fr.title`
     ```typescript
     await createNotification({
       userId: fr.user_id,
       type: "review_received",
       title: "New feedback received",
       message: `Someone submitted video feedback for "${fr.title}"`,
       referenceId: reviewId,
       productTitle: fr.title,
     });
     ```

  2. **Line 418** (`review_approved`): Add `productTitle: pr.title`
     ```typescript
     await createNotification({
       userId: review.reviewer_id,
       type: "review_approved",
       title: "Your feedback was approved!",
       message: `Your feedback for "${pr.title}" was approved by the project owner`,
       referenceId: reviewId,
       productTitle: pr.title,
     });
     ```

  3. **Line 586** (`review_rated`): Add `productTitle: title, rating`
     ```typescript
     await createNotification({
       userId: reviewForNotif.reviewer_id,
       type: "review_rated",
       title: "Your feedback was rated",
       message: `The owner of "${title}" rated your feedback ${rating}/5`,
       referenceId: reviewId,
       productTitle: title,
       rating,
     });
     ```

  4. **Line 630** (`review_rejected`): Add `productTitle: pr.title`
     ```typescript
     await createNotification({
       userId: review.reviewer_id,
       type: "review_rejected",
       title: "Your feedback was not accepted",
       message: `Your feedback for "${pr.title}" was not accepted by the project owner`,
       referenceId: reviewId,
       productTitle: pr.title,
     });
     ```

- **VALIDATE**: `npm run build` passes (with `ignoreBuildErrors: true` this should always pass, but check for runtime-breaking changes)

### Task 13: UPDATE `package.json` -- Add email preview script

- **IMPLEMENT**: Add `email:dev` script
- **CHANGES**: Add to `"scripts"`:
  ```json
  "email:dev": "email dev --dir emails --port 3001"
  ```
- **GOTCHA**: Use port 3001 to avoid conflict with Next.js dev server on 3000
- **VALIDATE**: `npm run email:dev` launches preview server (may fail in CI but should work locally)

### Task 14: UPDATE `tsconfig.json` -- Ensure emails directory is included

- **IMPLEMENT**: Verify `emails/` is covered by TypeScript compilation. The existing `include` array likely covers it, but verify.
- **CHECK**: Read `tsconfig.json` -- if it has explicit `include` paths that don't cover `emails/**/*.tsx`, add it.
- **GOTCHA**: If `tsconfig.json` uses default inclusion (no explicit `include`), no changes needed. Only update if `emails/` would be excluded.
- **VALIDATE**: `npx tsc --noEmit` includes email files

---

## TESTING STRATEGY

### Unit Tests

No test framework is configured (hackathon project). Skip automated tests.

### Manual Validation

1. **Preview server**: Run `npm run email:dev`, verify all 4 templates render in the browser preview at localhost:3001
2. **Template rendering**: In a temporary script or REPL, call `render()` on each template and verify HTML output is valid
3. **End-to-end**: Trigger each notification type through the app flow and verify HTML emails arrive in Mailgun logs / recipient inbox

### Edge Cases

- Template render failure should fall back to plain text (non-blocking)
- Missing `productTitle` should default to "your project"
- Missing `rating` should default to 0
- Mailgun not configured should still skip gracefully (existing behavior)

---

## VALIDATION COMMANDS

### Level 1: Syntax & Build

```bash
npm run build
```

### Level 2: Template Preview

```bash
npm run email:dev
# Open http://localhost:3001 -- verify all 4 templates render
```

### Level 3: File Structure Verification

```bash
ls -la emails/_components/ emails/
# Should show: email-layout.tsx, email-header.tsx, email-footer.tsx, email-button.tsx
# And: review-received.tsx, review-approved.tsx, review-rejected.tsx, review-rated.tsx
```

### Level 4: Manual Validation

1. Start dev server: `npm run dev`
2. Trigger a review submission -> check Mailgun logs for HTML email
3. Approve a review -> check Mailgun logs
4. Rate a review -> check Mailgun logs
5. Reject a review -> check Mailgun logs

---

## ACCEPTANCE CRITERIA

- [ ] `react-email` and `@react-email/components` installed
- [ ] 4 shared components in `emails/_components/` (header, footer, button, layout)
- [ ] 4 notification templates in `emails/` (review-received, review-approved, review-rejected, review-rated)
- [ ] All templates match PeerPull dark/gold brand (bg #050505, accent #d4a853, system font stack)
- [ ] Each template has typed props interface
- [ ] `utils/mailgun.ts` supports optional `html` field
- [ ] `utils/notifications.ts` renders appropriate template per notification type
- [ ] `app/actions.ts` passes `productTitle` (and `rating` where applicable) to `createNotification`
- [ ] Template render failures are non-blocking (fall back to text)
- [ ] `email:dev` script works and shows all templates in preview
- [ ] `npm run build` passes
- [ ] No regressions in existing notification flow

---

## COMPLETION CHECKLIST

- [ ] All 14 tasks completed in order
- [ ] Each task validation passed
- [ ] `npm run build` succeeds
- [ ] `npm run email:dev` shows all 4 templates
- [ ] Templates visually match PeerPull brand (dark bg, gold accents)
- [ ] Plain text fallback works when HTML render fails
- [ ] Code follows project conventions (kebab-case files, PascalCase components)

---

## NOTES

### Design Decisions

1. **Shared layout vs per-template duplication**: Using a shared `EmailLayout` wrapper to ensure all templates have consistent header/footer/styling. This mirrors the DRY pattern used in the app's `DashboardShell`.

2. **`_components/` underscore prefix**: React Email convention -- files in underscore-prefixed directories are excluded from the preview server listing but still importable.

3. **Template data on `CreateNotificationParams`**: Adding `productTitle` and `rating` as optional fields rather than a generic `data: Record<string, unknown>` keeps the interface type-safe and explicit.

4. **No reviewer name in templates**: The current notification call sites don't fetch reviewer names. Adding that would require extra DB queries. Keeping scope minimal -- can be enhanced later.

5. **`NEXT_PUBLIC_APP_URL` for links**: Using an env var for the app URL in email CTAs. This allows correct links in both dev and production.

6. **Calling template functions vs JSX**: In `notifications.ts`, use `ReviewReceivedEmail({...props})` (function call syntax) instead of `<ReviewReceivedEmail .../>` (JSX) since the file is `.ts` not `.tsx`. Alternatively, rename to `.tsx` -- either approach works. Recommend renaming `notifications.ts` to `notifications.tsx` to use JSX syntax which is more readable, OR use function call syntax to avoid the rename.

### Risks

- **React Email + React 19 compatibility**: Research confirms v5.x supports React 19. If any issues arise, check for package updates.
- **Email client rendering**: Tailwind classes are inlined by `<Tailwind>`, but some clients (Outlook) may still have quirks. The preview server helps catch these.
- **Bundle size**: `@react-email/tailwind` is ~900KB server-side. This only affects server rendering, not client bundles.
