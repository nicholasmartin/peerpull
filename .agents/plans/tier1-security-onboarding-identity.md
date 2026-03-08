# Feature: Tier 1 Security & Data Integrity (GH #23 + GH #22)

The following plan should be complete, but validate documentation and codebase patterns before implementing.

Pay special attention to naming of existing utils, types, and models. Import from the right files.

## Feature Description

Two security fixes to close gaps in user access control and data integrity:

1. **GH #23: Enforce onboarding bypass.** Users with `status = 'onboarding'` can skip onboarding by navigating directly to any dashboard sub-route (e.g. `/dashboard/peerpoints`). Only `/dashboard` (the root page) checks onboarding status and redirects to `/onboarding`. All other sub-routes are unprotected.

2. **GH #22: Defensive identity linking guard.** The `handle_new_user()` Postgres trigger uses a plain `INSERT` with no `ON CONFLICT` clause. While Supabase's automatic identity linking prevents duplicate `auth.users` rows in normal cases, any edge case (race condition, Supabase bug, manual admin action) would cause a PRIMARY KEY violation that blocks signup entirely.

## User Stories

**GH #23:**
As a platform administrator,
I want onboarding to be enforced on all dashboard routes,
So that users cannot access the platform without completing their profile setup.

**GH #22:**
As a user who signs in with multiple auth methods,
I want my account to remain intact regardless of how I log in,
So that my PeerPoints, reviews, and referrals are never lost.

## Problem Statement

- **#23:** The onboarding check exists only in `app/(protected)/dashboard/page.tsx` (line 17). All 10+ dashboard sub-routes have no check. A user who knows the URL structure can access any page before completing onboarding.
- **#22:** The `handle_new_user()` trigger (migration `20260311000000`, line 99) does a plain `INSERT INTO public.profiles`. If the trigger fires twice for the same user ID (however unlikely), it throws an unhandled error instead of gracefully skipping.

## Solution Statement

- **#23:** Move the onboarding redirect check from `dashboard/page.tsx` into `dashboard/layout.tsx`. The layout already fetches `profile` (line 26), and all sub-routes inherit this layout. One check protects everything.
- **#22:** Add `ON CONFLICT (id) DO NOTHING` to the `INSERT` in `handle_new_user()`. This makes the trigger idempotent. If a profile already exists, the insert silently skips. No data is overwritten.

## Feature Metadata

**Feature Type**: Bug Fix
**Estimated Complexity**: Low
**Primary Systems Affected**: Dashboard layout, Postgres trigger
**Dependencies**: None (both fixes are independent of each other)

---

## CONTEXT REFERENCES

### Relevant Codebase Files (READ BEFORE IMPLEMENTING)

- `app/(protected)/dashboard/layout.tsx` (lines 1-43) - Dashboard layout. Already fetches profile on line 26, already imports `redirect` on line 5. The onboarding check goes here after line 29.
- `app/(protected)/dashboard/page.tsx` (lines 14-19) - The existing onboarding check to REMOVE (it becomes redundant once the layout handles it).
- `supabase/migrations/20260311000000_defer_activation_bonuses.sql` (lines 30-104) - The latest `handle_new_user()` function. Line 99 is the plain INSERT that needs `ON CONFLICT`.
- `app/(onboarding)/onboarding/page.tsx` - The onboarding page itself. Already redirects non-onboarding users to `/dashboard` (lines 14-16). No changes needed here.
- `utils/supabase/middleware.ts` - Middleware only checks auth, not profile status. No changes needed.

### New Files to Create

- `supabase/migrations/20260312000000_handle_new_user_idempotent.sql` - Migration to add ON CONFLICT guard to handle_new_user()

### Relevant Documentation

- [Supabase Identity Linking](https://supabase.com/docs/guides/auth/auth-identity-linking)
  - Automatic linking is enabled by default
  - Linking adds to `auth.identities`, does NOT insert into `auth.users`
  - `handle_new_user()` trigger does NOT fire on identity linking
  - Unverified email identities are removed when OAuth identity with same email is linked
- [PostgreSQL ON CONFLICT](https://www.postgresql.org/docs/current/sql-insert.html#SQL-ON-CONFLICT)
  - `DO NOTHING` silently skips the insert if a conflict is detected

### Patterns to Follow

**Server Component Redirect (from dashboard/page.tsx line 17-18):**
```typescript
if (profile?.status === 'onboarding') {
  return redirect("/onboarding");
}
```

**SQL Migration Convention (from existing migrations):**
- Filename format: `YYYYMMDDHHMMSS_descriptive_name.sql`
- Comment header explaining the change
- Use `CREATE OR REPLACE FUNCTION` for function updates

---

## IMPLEMENTATION PLAN

### Phase 1: Onboarding Bypass Fix (GH #23)

Add the onboarding redirect to the dashboard layout so all sub-routes are protected.

### Phase 2: Identity Linking Guard (GH #22)

Create a migration that updates `handle_new_user()` to use an idempotent INSERT.

### Phase 3: Cleanup

Remove the now-redundant onboarding check from `dashboard/page.tsx`.

---

## STEP-BY-STEP TASKS

### Task 1: UPDATE `app/(protected)/dashboard/layout.tsx` - Add onboarding redirect

- **IMPLEMENT**: After line 29 (`const isActive = ...`), add the onboarding redirect check before the return statement:
  ```typescript
  // Redirect onboarding users to complete onboarding
  if (profile?.status === 'onboarding') {
    return redirect("/onboarding");
  }
  ```
- **PATTERN**: Mirror exact pattern from `dashboard/page.tsx:17-18`
- **IMPORTS**: `redirect` is already imported on line 5
- **GOTCHA**: The check MUST come before the `return` JSX block (line 31). Place it between line 29 and line 31.
- **GOTCHA**: Do NOT check `isActive` here. Users with `status = 'waitlisted'` should still access the dashboard (they see the WaitlistBanner). Only `status = 'onboarding'` triggers the redirect.
- **VALIDATE**: `npm run build` should succeed

### Task 2: UPDATE `app/(protected)/dashboard/page.tsx` - Remove redundant onboarding check

- **IMPLEMENT**: Remove lines 16-19 (the onboarding redirect block):
  ```typescript
  // Redirect onboarding users to the onboarding flow
  if (profile?.status === 'onboarding') {
    return redirect("/onboarding");
  }
  ```
  This is now handled by the layout and is unreachable (layout redirects first).
- **GOTCHA**: Keep everything else in the file unchanged. The waitlist check (lines 21-27) and the rest of the page must remain.
- **VALIDATE**: `npm run build` should succeed

### Task 3: CREATE `supabase/migrations/20260312000000_handle_new_user_idempotent.sql` - Add ON CONFLICT guard

- **IMPLEMENT**: Create a new migration that replaces `handle_new_user()` with an identical copy, except the INSERT on line 99 gets `ON CONFLICT (id) DO NOTHING`:
  ```sql
  -- ============================================================
  -- Make handle_new_user() idempotent with ON CONFLICT guard
  --
  -- Prevents PRIMARY KEY violation if the trigger fires for a
  -- user who already has a profile (edge case defense for
  -- identity linking scenarios or race conditions).
  -- ============================================================

  CREATE OR REPLACE FUNCTION public.handle_new_user()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = public
  AS $$
  DECLARE
    _first_name TEXT;
    _last_name TEXT;
    _full_name TEXT;
    _avatar TEXT;
    v_referral_code text;
    v_attempts integer := 0;
  BEGIN
    -- ==============================
    -- Name extraction (OAuth-aware)
    -- ==============================

    -- 1. Try explicit first/last name (email/password signup)
    _first_name := COALESCE(NULLIF(NEW.raw_user_meta_data->>'firstname', ''), '');
    _last_name := COALESCE(NULLIF(NEW.raw_user_meta_data->>'lastname', ''), '');

    -- 2. Try OIDC standard claims (LinkedIn OIDC)
    IF _first_name = '' THEN
      _first_name := COALESCE(NULLIF(NEW.raw_user_meta_data->>'given_name', ''), '');
    END IF;
    IF _last_name = '' THEN
      _last_name := COALESCE(NULLIF(NEW.raw_user_meta_data->>'family_name', ''), '');
    END IF;

    -- 3. Fall back to splitting full_name / name (Google, GitHub, Twitch)
    IF _first_name = '' AND _last_name = '' THEN
      _full_name := COALESCE(
        NULLIF(NEW.raw_user_meta_data->>'full_name', ''),
        NULLIF(NEW.raw_user_meta_data->>'name', ''),
        ''
      );
      IF _full_name != '' THEN
        _first_name := split_part(_full_name, ' ', 1);
        IF position(' ' in _full_name) > 0 THEN
          _last_name := substring(_full_name from position(' ' in _full_name) + 1);
        END IF;
      END IF;
    END IF;

    -- 4. Avatar: try avatar_url first, then picture
    _avatar := COALESCE(
      NULLIF(NEW.raw_user_meta_data->>'avatar_url', ''),
      NULLIF(NEW.raw_user_meta_data->>'picture', ''),
      ''
    );

    -- ==============================
    -- Referral code generation
    -- ==============================

    -- Generate a unique referral code (6 chars alphanumeric, fallback to 8 on collision)
    LOOP
      v_referral_code := lower(substr(md5(random()::text || clock_timestamp()::text), 1, 6));
      EXIT WHEN NOT EXISTS (SELECT 1 FROM public.profiles WHERE referral_code = v_referral_code);
      v_attempts := v_attempts + 1;
      IF v_attempts > 10 THEN
        v_referral_code := lower(substr(md5(random()::text || clock_timestamp()::text), 1, 8));
        EXIT;
      END IF;
    END LOOP;

    -- Insert profile with ZERO balance. Signup bonus is deferred
    -- until the user completes onboarding (award_activation_bonuses).
    -- ON CONFLICT guard: if a profile already exists (e.g. from identity
    -- linking edge cases), silently skip to preserve existing data.
    INSERT INTO public.profiles (id, first_name, last_name, avatar_url, peer_points_balance, referral_code, status)
    VALUES (NEW.id, _first_name, _last_name, _avatar, 0, v_referral_code, 'onboarding')
    ON CONFLICT (id) DO NOTHING;

    RETURN NEW;
  END;
  $$;
  ```
- **PATTERN**: Follow existing migration file naming from `supabase/migrations/` (timestamp prefix + descriptive name)
- **GOTCHA**: The function body MUST be identical to the version in `20260311000000` except for the `ON CONFLICT` clause. Do not change variable names, logic, or ordering. Review the full function in that migration before writing.
- **GOTCHA**: `ON CONFLICT (id)` works because `profiles.id` is the PRIMARY KEY
- **VALIDATE**: `supabase db push` (or `npx supabase db push`) to apply the migration

---

## TESTING STRATEGY

### Manual Testing (No test framework configured)

**GH #23 - Onboarding bypass:**
1. Create a new user account (or set an existing user's status to `'onboarding'` via Supabase SQL Editor)
2. Log in and confirm you're redirected to `/onboarding`
3. Try navigating directly to each of these URLs:
   - `/dashboard/peerpoints` - should redirect to `/onboarding`
   - `/dashboard/profile` - should redirect to `/onboarding`
   - `/dashboard/settings` - should redirect to `/onboarding`
   - `/dashboard/request-feedback` - should redirect to `/onboarding`
   - `/dashboard/submit-feedback` - should redirect to `/onboarding`
   - `/dashboard/invite` - should redirect to `/onboarding`
   - `/dashboard/community` - should redirect to `/onboarding`
4. Complete onboarding, confirm you can now access all dashboard routes normally
5. Confirm users with `status = 'waitlisted'` can still access the dashboard (they see WaitlistBanner)
6. Confirm users with `status = 'active'` can access everything normally

**GH #22 - Identity linking guard:**
1. Push the migration: `supabase db push`
2. Verify the function was updated: run in Supabase SQL Editor:
   ```sql
   SELECT prosrc FROM pg_proc WHERE proname = 'handle_new_user';
   ```
   Confirm the `ON CONFLICT (id) DO NOTHING` clause is present.
3. (Optional) Test the idempotency by manually calling the trigger logic for an existing user - it should silently skip.

### Edge Cases

- User with `status = 'onboarding'` tries to access `/dashboard/admin/*` routes
- User completes onboarding (status becomes `'waitlisted'`), then tries to access dashboard - should work
- User bookmarks a dashboard sub-route, logs out, logs back in while still in onboarding status - should redirect

---

## VALIDATION COMMANDS

### Level 1: Build Check
```bash
npm run build
```

### Level 2: Migration Syntax
```bash
supabase db push --dry-run
```
(Or review the SQL manually if Supabase CLI is not linked)

### Level 4: Manual Validation
1. Set a test user to `status = 'onboarding'` in Supabase SQL Editor
2. Log in as that user
3. Navigate to `/dashboard/peerpoints` directly
4. Confirm redirect to `/onboarding`

---

## ACCEPTANCE CRITERIA

- [ ] Users with `status = 'onboarding'` are redirected to `/onboarding` from ALL dashboard routes (not just `/dashboard`)
- [ ] Users with `status = 'waitlisted'` can still access the dashboard normally
- [ ] Users with `status = 'active'` are unaffected
- [ ] The redundant onboarding check is removed from `dashboard/page.tsx`
- [ ] `handle_new_user()` uses `ON CONFLICT (id) DO NOTHING` for idempotent profile creation
- [ ] The migration file follows the project's naming convention
- [ ] `npm run build` passes with no new errors
- [ ] No existing functionality is broken

---

## COMPLETION CHECKLIST

- [ ] Task 1: Dashboard layout onboarding redirect added
- [ ] Task 2: Redundant check removed from dashboard page
- [ ] Task 3: Migration created with ON CONFLICT guard
- [ ] Build passes (`npm run build`)
- [ ] Manual testing confirms onboarding enforcement on all sub-routes
- [ ] Migration applied to database (`supabase db push`)

---

## NOTES

**Why layout-level enforcement over middleware:**
Adding a DB query to middleware for every request would add latency to all routes. The dashboard layout already fetches the profile, making the check essentially free. It covers all `/dashboard/*` routes without per-page boilerplate.

**Why `DO NOTHING` over `DO UPDATE`:**
If a profile already exists, we want to preserve ALL existing data (PeerPoints, referral code, expertise, avatar, etc.). Using `DO UPDATE` could overwrite fields with fresh OAuth metadata. `DO NOTHING` is the safest choice for a defensive guard.

**Supabase automatic identity linking behavior (confirmed via research):**
- Email signup then OAuth (same email, verified): identities linked, no new `auth.users` row, trigger does NOT fire again
- Unverified email then OAuth (same email): unverified identity is removed, OAuth identity takes over the same user
- OAuth first then email signup: signup is silently blocked (obfuscated response)
- The `ON CONFLICT` guard is defense-in-depth, not a fix for a known active bug

**These two issues are completely independent** and can be implemented in any order or in parallel.
