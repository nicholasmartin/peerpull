# Feature: Phase 6.1 - API Layer & Database Foundation

The following plan should be complete, but its important that you validate documentation and codebase patterns and task sanity before you start implementing.

Pay special attention to naming of existing utils types and models. Import from the right files etc.

## Feature Description

Build the API infrastructure that the Chrome extension will communicate with, plus the database schema for external reviews. This phase creates all Next.js Route Handler endpoints under `app/api/v1/`, installs Zod for request validation, creates the `external_reviews` database table with RLS, and configures CORS for the extension origin. The endpoints wrap existing RPCs (queue, review submission) and add new functionality (external reviews, signed upload URLs, settings).

## User Story

As a developer building the PeerPull Chrome extension,
I want a well-structured, validated API layer that the extension can communicate with,
So that the extension and web app share a clean contract that can evolve independently.

## Problem Statement

The current PeerPull app uses Server Actions exclusively for mutations. Server Actions are cookie-based and cannot be called from a Chrome extension (which uses JWT bearer tokens). The extension needs JSON API endpoints with proper CORS headers, Zod validation, and consistent error/success response formats.

## Solution Statement

Create Next.js Route Handlers at `/api/v1/` that authenticate via Supabase JWT in the `Authorization` header, validate payloads with Zod, and return JSON responses. These endpoints wrap existing RPCs where possible (`get_next_review`, `submit_review_atomic`) and add new functionality for external reviews. A new `external_reviews` table stores public review data with RLS policies.

## Feature Metadata

**Feature Type**: New Capability
**Estimated Complexity**: Medium-High
**Primary Systems Affected**: API routes (new), database schema, Supabase Storage, CORS config
**Dependencies**: Zod (new npm dependency), existing Supabase RPCs, existing `review-videos` storage bucket

---

## CONTEXT REFERENCES

### Relevant Codebase Files IMPORTANT: YOU MUST READ THESE FILES BEFORE IMPLEMENTING!

- `app/actions.ts` - Why: Contains all existing server actions. The API endpoints mirror these patterns (auth checks, RPC calls, PostHog tracking). Key functions to study: `getNextReview` (line 552), `submitReview` (line 589), `submitFeedbackRequest` (line 246).
- `utils/supabase/server.ts` - Why: Server-side Supabase client creation. API routes CANNOT use this because it relies on `cookies()` from `next/headers`. You need a new utility that creates a Supabase client from a JWT bearer token instead.
- `utils/supabase/settings.ts` - Why: `getSettings()` function and `SystemSettings` type. The `/api/v1/settings` endpoint should reuse this, but note it depends on `server.ts` (cookie-based client). You'll need to either make settings fetchable with a token-based client, or create a parallel helper.
- `utils/supabase/middleware.ts` - Why: Shows how auth is checked currently (cookie-based). API routes use a different auth pattern (Bearer token).
- `app/auth/callback/route.ts` - Why: The only existing Route Handler in the app. Shows the `GET` handler pattern with `NextResponse`.
- `utils/notifications.tsx` - Why: `createNotification()` utility used after review submission. The queue submit endpoint should call this same utility.
- `types/database.types.ts` - Why: Auto-generated Supabase types. You do NOT need to modify this file, but it shows the schema structure.
- `supabase/migrations/20260218000000_create_mvp_tables.sql` - Why: Shows how existing tables, RLS policies, and storage buckets are created. Mirror this pattern for `external_reviews`.
- `supabase/migrations/20260305000000_phase4_notifications.sql` - Why: Most recent table creation migration. Good template for the new migration.
- `supabase/migrations/20260313000000_add_reason_to_transactions.sql` - Why: Latest migration. The new migration timestamp must come after this.
- `next.config.ts` - Why: Contains existing CORS-relevant config (rewrites for PostHog). CORS headers will be handled in the API routes themselves, not here.
- `middleware.ts` + `utils/supabase/middleware.ts` - Why: The middleware intercepts all routes matching the pattern. API routes at `/api/v1/` are matched by the middleware. The middleware calls `supabase.auth.getUser()` which will fail for extension requests (no cookies). This is OK because middleware failure is caught in the try/catch and falls through. But you should verify this doesn't redirect API calls.
- `.claude/PRD-extension-growth.md` (sections 7.6, 10, 12) - Why: Full API specification with request/response formats for all endpoints.

### New Files to Create

- `types/api.ts` - Zod schemas and TypeScript types for the API contract
- `utils/supabase/api-client.ts` - Supabase client creation from JWT bearer token (for API routes)
- `app/api/v1/auth/verify/route.ts` - Verify JWT, return profile summary
- `app/api/v1/queue/next/route.ts` - Claim next queued review
- `app/api/v1/queue/submit/route.ts` - Submit completed internal review
- `app/api/v1/external-reviews/route.ts` - Create external review (POST)
- `app/api/v1/external-reviews/[id]/route.ts` - Update/delete external review (PATCH/DELETE)
- `app/api/v1/upload/signed-url/route.ts` - Generate signed Supabase Storage upload URL
- `app/api/v1/settings/route.ts` - Fetch system settings
- `supabase/migrations/20260314000000_create_external_reviews.sql` - Database migration

### Patterns to Follow

**Response Format (from PRD section 7.6):**

Success:
```json
{
  "data": { ... },
  "meta": { "timestamp": "2026-03-13T..." }
}
```

Error:
```json
{
  "error": {
    "code": "INSUFFICIENT_POINTS",
    "message": "Human-readable error message"
  }
}
```

**Naming Conventions:**
- Files: kebab-case for utilities (`api-client.ts`), route files follow Next.js conventions (`route.ts`)
- Database: snake_case for tables and columns (`external_reviews`, `target_url`)
- TypeScript: camelCase for variables/functions, PascalCase for types/interfaces
- Zod schemas: PascalCase with `Schema` suffix (e.g., `SubmitReviewSchema`)

**Auth Pattern for API Routes:**
```typescript
import { createApiClient } from "@/utils/supabase/api-client";

export async function GET(request: Request) {
  const { supabase, user, errorResponse } = await createApiClient(request);
  if (errorResponse) return errorResponse;
  // ... user is authenticated, supabase client is scoped to their JWT
}
```

**CORS Pattern:**
```typescript
// Add CORS headers to all responses
function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",  // In production, restrict to chrome-extension://<id>
    "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

// Every route file needs an OPTIONS handler for preflight
export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}
```

**Existing RPC Functions Available:**
- `get_next_review(p_reviewer_id)` - Returns `{pr_id, review_id}[]` from FIFO queue
- `submit_review_atomic(p_review_id, p_reviewer_id, p_video_url, p_video_duration, p_rating, p_strengths, p_improvements, p_signal_follow, p_signal_engage, p_signal_invest)` - Atomically submits review + awards points
- `create_notification(p_user_id, p_type, p_title, p_message, p_reference_id, p_link_url)` - Creates notification record

---

## IMPLEMENTATION PLAN

### Phase 1: Foundation

Install Zod, create the API client utility for JWT-based auth, define shared Zod schemas and response helpers.

**Tasks:**
- Install Zod as a dependency
- Create `utils/supabase/api-client.ts` for JWT-based Supabase client
- Create `types/api.ts` with Zod schemas for all endpoints
- Create shared response helpers (success/error/CORS)

### Phase 2: Database

Create the `external_reviews` table migration with RLS policies.

**Tasks:**
- Write and push the migration for `external_reviews`

### Phase 3: API Endpoints

Implement all 8 route handlers.

**Tasks:**
- `GET /api/v1/auth/verify`
- `GET /api/v1/queue/next`
- `POST /api/v1/queue/submit`
- `POST /api/v1/external-reviews`
- `PATCH /api/v1/external-reviews/:id`
- `DELETE /api/v1/external-reviews/:id`
- `POST /api/v1/upload/signed-url`
- `GET /api/v1/settings`

### Phase 4: CORS & Middleware

Ensure CORS works for extension requests and the existing middleware doesn't block API routes.

**Tasks:**
- Add CORS handling to all routes (via shared helper)
- Verify middleware doesn't redirect/block API routes

---

## STEP-BY-STEP TASKS

### Task 1: INSTALL Zod dependency

- **IMPLEMENT**: Run `npm install zod` to add Zod as a production dependency
- **VALIDATE**: `node -e "require('zod')"` exits without error, and `zod` appears in `package.json` dependencies

### Task 2: CREATE `utils/supabase/api-client.ts`

- **IMPLEMENT**: A utility that extracts the JWT from the `Authorization: Bearer <token>` header, creates a Supabase client using `createClient` from `@supabase/supabase-js` (NOT `@supabase/ssr`), and verifies the user via `supabase.auth.getUser()`.
- **PATTERN**: The server.ts utility uses `@supabase/ssr` with cookie-based auth. The API client must use `@supabase/supabase-js` directly with the JWT set via `supabase.auth.setSession()` or by passing the token in the `global.headers` option.
- **IMPORTS**: `import { createClient } from "@supabase/supabase-js"` (NOT from `@supabase/ssr`)
- **GOTCHA**: `@supabase/supabase-js` is already installed (it's a dependency). Use `createClient` from it directly with the access token. The recommended pattern is:
  ```typescript
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  );
  ```
  Then call `supabase.auth.getUser()` which will use the provided token.
- **IMPLEMENT**: Also create shared response helper functions in this file or a separate `utils/api-helpers.ts`:
  ```typescript
  function apiSuccess(data: unknown, status = 200)
  function apiError(code: string, message: string, status = 400)
  function corsHeaders(): Record<string, string>
  ```
- **VALIDATE**: TypeScript compiles without errors: `npx tsc --noEmit utils/supabase/api-client.ts` (or check via IDE)

### Task 3: CREATE `types/api.ts` with Zod schemas

- **IMPLEMENT**: Define Zod schemas for all API request/response payloads:
  - `SubmitReviewSchema` - for `POST /api/v1/queue/submit` request body
  - `CreateExternalReviewSchema` - for `POST /api/v1/external-reviews` request body
  - `UpdateExternalReviewSchema` - for `PATCH /api/v1/external-reviews/:id` request body
  - `SignedUrlSchema` - for `POST /api/v1/upload/signed-url` request body
- **PATTERN**: Export both the Zod schema and the inferred TypeScript type:
  ```typescript
  import { z } from "zod";

  export const SubmitReviewSchema = z.object({
    review_id: z.string().uuid(),
    video_url: z.string().url(),
    duration: z.number().int().positive(),
    feedback_text: z.string().optional(),
    signal_follow: z.boolean().default(false),
    signal_engage: z.boolean().default(false),
    signal_invest: z.boolean().default(false),
  });
  export type SubmitReviewPayload = z.infer<typeof SubmitReviewSchema>;
  ```
- **GOTCHA**: The PRD spec (section 10) uses `feedback_text` but the existing `submit_review_atomic` RPC uses `p_strengths` and `p_improvements`. The API layer should accept the extension's format and map it to the RPC's format. For MVP, map `feedback_text` to `p_strengths` (the primary text field) and leave `p_improvements` as null, OR split the schema to match the RPC's fields. Recommend: keep the schema fields matching the RPC for simplicity (`strengths`, `improvements` as optional strings).
- **VALIDATE**: `npx tsc --noEmit types/api.ts`

### Task 4: CREATE migration `supabase/migrations/20260314000000_create_external_reviews.sql`

- **IMPLEMENT**: Create the `external_reviews` table:
  ```sql
  CREATE TABLE public.external_reviews (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    reviewer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    video_url text NOT NULL,
    video_duration integer NOT NULL CHECK (video_duration > 0),
    target_url text NOT NULL,
    target_title text,
    target_favicon_url text,
    target_og_image_url text,
    target_og_description text,
    slug text NOT NULL UNIQUE,
    status text NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'deleted')),
    view_count integer NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
  );
  ```
- **IMPLEMENT**: RLS policies:
  - Authenticated users can SELECT their own external reviews (all statuses)
  - Anonymous/public can SELECT published external reviews (for shareable pages)
  - Authenticated users can INSERT their own external reviews
  - Authenticated users can UPDATE their own external reviews
  - Authenticated users can DELETE their own external reviews
- **IMPLEMENT**: Indexes:
  - `CREATE INDEX idx_external_reviews_reviewer ON public.external_reviews (reviewer_id);`
  - `CREATE INDEX idx_external_reviews_slug ON public.external_reviews (slug);`
  - Composite index for the public page lookup: `CREATE INDEX idx_external_reviews_public_lookup ON public.external_reviews (slug, status) WHERE status = 'published';`
- **IMPLEMENT**: Updated_at trigger (reuse existing `update_updated_at_column()` function from profiles table):
  ```sql
  CREATE TRIGGER update_external_reviews_updated_at
    BEFORE UPDATE ON public.external_reviews
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  ```
- **IMPLEMENT**: Tighten the `review-videos` storage bucket to only accept video MIME types and cap file size:
  ```sql
  UPDATE storage.buckets
  SET file_size_limit = 524288000,  -- 500MB
      allowed_mime_types = ARRAY['video/webm', 'video/mp4', 'video/quicktime']
  WHERE id = 'review-videos';
  ```
- **GOTCHA**: The shareable page URL is `/r/{referral_code}/{slug}`. The `referral_code` comes from the reviewer's `profiles.referral_code`, not stored on `external_reviews`. The page will join `external_reviews` with `profiles` to verify the referral code matches the reviewer.
- **VALIDATE**: `npx supabase db diff` shows the expected changes. Push with `npx supabase db push`.

### Task 5: CREATE `app/api/v1/auth/verify/route.ts`

- **IMPLEMENT**: `GET` handler that verifies the JWT and returns the user's profile summary.
- **PATTERN**: Reference `app/actions.ts` line 552 for how profile data is fetched.
- **RESPONSE**: Return `{ data: { id, full_name, avatar_url, referral_code, peer_points_balance, quality_score, status, unread_notification_count } }`
- **IMPLEMENT**: Fetch profile from `profiles` table, count unread notifications from `notifications` table.
- **IMPORTS**: `createApiClient` from `@/utils/supabase/api-client`, response helpers
- **GOTCHA**: The `full_name` is a generated column in the `profiles` table. It will be returned automatically from SELECT.
- **VALIDATE**: `curl -H "Authorization: Bearer <jwt>" http://localhost:3000/api/v1/auth/verify` returns 200 with profile data

### Task 6: CREATE `app/api/v1/queue/next/route.ts`

- **IMPLEMENT**: `GET` handler that claims the next queued review assignment.
- **PATTERN**: Mirror `getNextReview()` from `app/actions.ts` (line 552-587). Check for existing in-progress review first, then call `get_next_review` RPC.
- **RESPONSE**: If review available: `{ data: { review_id, feedback_request: { id, title, url, description, questions, focus_areas } } }`. If queue empty: `{ data: null, meta: { message: "No projects in the queue right now." } }`
- **IMPLEMENT**: After getting the review assignment, fetch the feedback request details to return in the response.
- **GOTCHA**: The existing `getNextReview` also checks `requireActiveUser`. The API endpoint should do the same check.
- **VALIDATE**: `curl -H "Authorization: Bearer <jwt>" http://localhost:3000/api/v1/queue/next` returns review or empty queue

### Task 7: CREATE `app/api/v1/queue/submit/route.ts`

- **IMPLEMENT**: `POST` handler that submits a completed internal review.
- **PATTERN**: Mirror `submitReview()` from `app/actions.ts` (line 589-668). Validate with `SubmitReviewSchema`, call `submit_review_atomic` RPC, create notification.
- **IMPORTS**: `SubmitReviewSchema` from `@/types/api`, `createNotification` from `@/utils/notifications`
- **RESPONSE**: `{ data: { points_earned, new_balance } }`
- **IMPLEMENT**: After successful RPC call, fetch the reviewer's updated `peer_points_balance` from `profiles` to include in response. Also call `createNotification` for the feedback request owner.
- **GOTCHA**: `createNotification` uses `createClient` from `utils/supabase/server.ts` internally (cookie-based). This will NOT work in API route context because there are no cookies. You have two options:
  1. Create a version of `createNotification` that accepts a Supabase client as a parameter
  2. Call the `create_notification` RPC directly from the API route's JWT-scoped client
  Option 2 is simpler for Phase 1. The notification RPC is `SECURITY DEFINER` so it will work regardless of the calling user. However, the email sending part of `createNotification` also uses the cookie-based client internally. For MVP, skip email notifications from the API routes and just create the in-app notification via RPC. Email can be added later.
- **GOTCHA**: The `submit_review_atomic` RPC uses `p_rating` which is a star rating (1-5) from the reviewer about the product. This is different from `builder_rating` (which the builder gives to the review later). The API should accept a `rating` field (required, 1-5).
- **VALIDATE**: `curl -X POST -H "Authorization: Bearer <jwt>" -H "Content-Type: application/json" -d '{"review_id":"...","video_url":"...","duration":120,"rating":4}' http://localhost:3000/api/v1/queue/submit`

### Task 8: CREATE `app/api/v1/external-reviews/route.ts`

- **IMPLEMENT**: `POST` handler that creates an external review record and generates the shareable page slug.
- **VALIDATE with**: `CreateExternalReviewSchema`
- **IMPLEMENT**: Generate a 6-character alphanumeric slug. Use a simple approach:
  ```typescript
  function generateSlug(): string {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let slug = "";
    for (let i = 0; i < 6; i++) {
      slug += chars[Math.floor(Math.random() * chars.length)];
    }
    return slug;
  }
  ```
  Handle slug collision by retrying (extremely unlikely with 36^6 = 2.1 billion possibilities).
- **IMPLEMENT**: Fetch the reviewer's `referral_code` from `profiles` to construct the full shareable URL.
- **RESPONSE**: `{ data: { id, slug, shareable_url, created_at } }`
- **GOTCHA**: The `shareable_url` is constructed server-side: `${process.env.NEXT_PUBLIC_APP_URL || "https://peerpull.com"}/r/${referral_code}/${slug}`
- **VALIDATE**: `curl -X POST -H "Authorization: Bearer <jwt>" -H "Content-Type: application/json" -d '{"video_url":"...","duration":120,"target_url":"https://example.com","target_title":"Example"}' http://localhost:3000/api/v1/external-reviews`

### Task 9: CREATE `app/api/v1/external-reviews/[id]/route.ts`

- **IMPLEMENT**: `PATCH` handler for updating an external review's metadata, and `DELETE` handler for soft-deleting (setting status to 'deleted').
- **VALIDATE with**: `UpdateExternalReviewSchema` for PATCH
- **IMPLEMENT PATCH**: Allow updating `target_title`, `target_og_description` only. Verify ownership (reviewer_id matches authenticated user).
- **IMPLEMENT DELETE**: Set `status = 'deleted'` instead of hard delete (preserves data for analytics). Verify ownership.
- **RESPONSE PATCH**: `{ data: { id, updated_at } }`
- **RESPONSE DELETE**: `{ data: { id, deleted: true } }`
- **GOTCHA**: Use `params` from the Next.js dynamic route. In Next.js 15, params are accessed via the second argument to the handler: `export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> })`. Note: in Next.js 15, `params` is a Promise and must be awaited.
- **VALIDATE**: `curl -X DELETE -H "Authorization: Bearer <jwt>" http://localhost:3000/api/v1/external-reviews/<id>`

### Task 10: CREATE `app/api/v1/upload/signed-url/route.ts`

- **IMPLEMENT**: `POST` handler that generates a signed URL for uploading a video to Supabase Storage.
- **VALIDATE with**: `SignedUrlSchema`
- **IMPLEMENT**: Use `supabase.storage.from("review-videos").createSignedUploadUrl(path)` to generate a time-limited upload URL. The path should be structured as `reviews/{user_id}/{filename}` to organize uploads by user.
- **RESPONSE**: `{ data: { signed_url, token, path } }` (include `token` separately for flexibility)
- **STORAGE RESEARCH FINDINGS**:
  - `createSignedUploadUrl` returns `{ data: { signedUrl, token, path }, error }`. The signed URL expires after **2 hours** (fixed, not configurable).
  - Each signed URL can only be used **once**. After a successful upload, the token is consumed.
  - The extension uploads via **raw `PUT`** to the signed URL with just a `content-type` header. No Authorization header, no API key needed on the upload itself.
  - The bucket's `allowed_mime_types` (set in Task 4 migration) enforces content type server-side, so even if the extension sends a wrong type, Storage will reject it.
  - If upsert behavior is needed, pass `{ upsert: true }` to `createSignedUploadUrl`, NOT to the upload request.
  - CORS is not an issue: Supabase Storage has permissive CORS by default, and the extension manifest can also grant cross-origin permissions.
- **GOTCHA**: Map `signedUrl` to `signed_url` in the response for consistency with the API's snake_case convention.
- **GOTCHA**: Validate that `content_type` starts with `video/`. Reject non-video uploads at the API level (defense in depth, bucket MIME restriction is the primary guard).
- **VALIDATE**: `curl -X POST -H "Authorization: Bearer <jwt>" -H "Content-Type: application/json" -d '{"filename":"test.webm","content_type":"video/webm"}' http://localhost:3000/api/v1/upload/signed-url`

### Task 11: CREATE `app/api/v1/settings/route.ts`

- **IMPLEMENT**: `GET` handler that fetches system settings relevant to the extension.
- **IMPLEMENT**: Fetch settings from `system_settings` table. Return only the subset the extension needs: `min_video_duration`, `max_video_duration`, `review_reward` (the `review_reward_amount`), `platform_launched`.
- **PATTERN**: Similar to `getSettings()` in `utils/supabase/settings.ts`, but using the JWT-based client. Since system_settings has anon read access (migration `20260302000000`), you can read it with the authenticated client.
- **RESPONSE**: `{ data: { min_video_duration, max_video_duration, review_reward, platform_launched } }`
- **VALIDATE**: `curl -H "Authorization: Bearer <jwt>" http://localhost:3000/api/v1/settings`

### Task 12: VERIFY middleware compatibility with API routes

- **IMPLEMENT**: Test that the existing middleware at `middleware.ts` / `utils/supabase/middleware.ts` doesn't interfere with API routes. The middleware:
  1. Creates a cookie-based Supabase client
  2. Calls `supabase.auth.getUser()` (which will fail for extension requests with no cookies)
  3. Checks if route starts with `/dashboard` or `/reset-password` (API routes don't match these)
  4. The try/catch block means failure falls through to `NextResponse.next()`
- **ANALYSIS**: API routes at `/api/v1/` should pass through the middleware without issues because:
  - They don't match the protected route checks (`/dashboard`, `/reset-password`, `/onboarding`)
  - The `getUser()` call may fail but it's in a try/catch and the response passes through
  - However, the middleware DOES set cookies on the response, which is harmless for API routes
- **OPTION**: If issues arise, update the middleware matcher to exclude `/api/` routes:
  ```typescript
  export const config = {
    matcher: [
      "/((?!_next/static|_next/image|favicon.ico|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
  };
  ```
  This is the safer approach. Add `api/` to the exclusion pattern.
- **VALIDATE**: Start dev server, hit an API endpoint from a non-browser client (curl). Verify no redirects.

### Task 13: ADD OPTIONS handlers for CORS preflight

- **IMPLEMENT**: Every route file needs an `OPTIONS` export for CORS preflight requests. This is already included in the CORS pattern above, but ensure every route file has it.
- **IMPLEMENT**: All response helpers (`apiSuccess`, `apiError`) should include CORS headers.
- **VALIDATE**: `curl -X OPTIONS http://localhost:3000/api/v1/auth/verify -v` returns 204 with CORS headers

---

## TESTING STRATEGY

### No Test Framework

This project has no test framework configured (no vitest/jest). Testing is manual via curl/Postman.

### Manual Testing Plan

For each endpoint:
1. Test with valid JWT and valid payload: expect success response
2. Test with no Authorization header: expect 401
3. Test with invalid JWT: expect 401
4. Test with valid JWT but invalid payload (bad types, missing fields): expect 400 with Zod error
5. Test CORS preflight (OPTIONS request): expect 204 with correct headers

### Edge Cases

- `GET /api/v1/queue/next` with empty queue: returns `{ data: null }`
- `GET /api/v1/queue/next` when user already has an in-progress review: returns existing review
- `POST /api/v1/queue/submit` with review not owned by caller: returns 403
- `POST /api/v1/external-reviews` with duplicate slug (extremely unlikely): retry slug generation
- `DELETE /api/v1/external-reviews/:id` with non-existent ID: returns 404
- `DELETE /api/v1/external-reviews/:id` with ID owned by another user: returns 403 (RLS blocks it)
- `POST /api/v1/upload/signed-url` with non-video content type: returns 400

---

## VALIDATION COMMANDS

### Level 1: Build Check

```bash
npm run build
```

### Level 2: Dev Server Smoke Test

```bash
npm run dev
# In another terminal:
curl -s http://localhost:3000/api/v1/settings -H "Authorization: Bearer <jwt>" | jq .
curl -s http://localhost:3000/api/v1/auth/verify -H "Authorization: Bearer <jwt>" | jq .
```

### Level 3: CORS Check

```bash
curl -s -X OPTIONS http://localhost:3000/api/v1/auth/verify \
  -H "Origin: chrome-extension://test" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: Authorization" \
  -v 2>&1 | grep -i "access-control"
```

### Level 4: Database Migration

```bash
npx supabase db push
# Or via MCP: run_sql to verify table exists
```

### Level 5: Full Endpoint Test

Test each endpoint with curl using a valid Supabase JWT (obtain from browser dev tools or Supabase dashboard).

---

## ACCEPTANCE CRITERIA

- [ ] Zod is installed and listed in `package.json` dependencies
- [ ] `types/api.ts` contains Zod schemas for all API payloads
- [ ] `utils/supabase/api-client.ts` creates a JWT-authenticated Supabase client
- [ ] `external_reviews` table exists with correct schema, RLS, and indexes
- [ ] All 8 endpoints return correct JSON responses with CORS headers
- [ ] All endpoints return 401 for missing/invalid JWT
- [ ] All POST/PATCH endpoints validate payloads with Zod (400 for invalid)
- [ ] `GET /api/v1/queue/next` correctly wraps the existing `get_next_review` RPC
- [ ] `POST /api/v1/queue/submit` correctly wraps the existing `submit_review_atomic` RPC
- [ ] `POST /api/v1/external-reviews` generates unique slugs and returns shareable URLs
- [ ] `POST /api/v1/upload/signed-url` returns valid signed URLs for Supabase Storage
- [ ] OPTIONS preflight requests return 204 with CORS headers
- [ ] Existing app functionality is unaffected (middleware, server actions, pages)
- [ ] `npm run build` succeeds

---

## COMPLETION CHECKLIST

- [ ] All tasks completed in order (1-13)
- [ ] Each task validation passed
- [ ] Database migration pushed successfully
- [ ] All endpoints tested via curl with valid JWT
- [ ] CORS preflight working
- [ ] Build passes
- [ ] No regressions in existing functionality

---

## NOTES

### Design Decisions

1. **JWT-based auth instead of cookies**: The Chrome extension cannot use cookie-based auth because it runs in a different origin. The API uses Bearer token auth with Supabase JWTs, which the extension obtains via `supabase.auth.signInWithPassword()` and stores in `chrome.storage.local`.

2. **Separate Supabase client utility**: `utils/supabase/api-client.ts` is distinct from `utils/supabase/server.ts` because the auth mechanisms are fundamentally different (JWT header vs cookies). Do not try to merge them.

3. **Soft delete for external reviews**: Using a `status` column ('published'/'deleted') instead of hard deletes. This preserves data for analytics and allows future "undo" functionality.

4. **Slug generation**: Simple random 6-character alphanumeric. No need for a library. 36^6 = 2.1B possible slugs, collision is extremely unlikely. Retry once on collision.

5. **CORS wildcard for MVP**: Using `Access-Control-Allow-Origin: *` initially. In production, this should be restricted to the specific `chrome-extension://<extension-id>` origin. This can be tightened later since the endpoints all require JWT auth anyway.

6. **Notification simplification**: The `createNotification` utility depends on the cookie-based Supabase client internally. For MVP, API routes call the `create_notification` RPC directly for in-app notifications, skipping email. Email notifications from extension-initiated actions can be added in a follow-up.

7. **Middleware exclusion**: Adding `api/` to the middleware matcher exclusion pattern is the cleanest approach. The middleware's auth refresh and redirect logic is irrelevant for API routes and would add unnecessary overhead.

### Risks

- **Supabase Storage signed URLs**: RESOLVED. Research confirms `createSignedUploadUrl` works with our existing bucket config (public bucket with authenticated INSERT policy). The method is available in our installed Supabase client version. Signed URLs expire after 2 hours and are single-use. The extension uploads via raw PUT with just content-type header. The migration adds `allowed_mime_types` and `file_size_limit` for defense in depth.
- **RLS with JWT client**: The JWT-based Supabase client should respect RLS policies the same way the cookie-based client does, since both use the same JWT under the hood. But this should be verified during testing.
- **Middleware interference**: While analysis suggests API routes will pass through safely, empirical testing is needed. The middleware exclusion approach (Task 12) is the safest.
