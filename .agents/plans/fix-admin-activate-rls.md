# Feature: Fix Admin Activate User — RLS Bypass via SECURITY DEFINER RPCs (GH #10)

The following plan should be complete, but validate documentation and codebase patterns before implementing.

Pay special attention to naming of existing utils, types, and models. Import from the right files.

## Feature Description

The admin "Activate" button on `/dashboard/admin/users` silently fails. Clicking it shows a success toast but does not change the user's status. The root cause is that the `profiles` table RLS policy only allows users to update **their own** row (`auth.uid() = id`). When an admin updates another user's profile, Supabase returns `{ error: null }` with zero rows affected — so the action reports success despite doing nothing.

The fix: create SECURITY DEFINER RPC functions (matching the existing `admin_inject_points` pattern) that bypass RLS with inline admin verification, then update the server actions to call these RPCs.

## User Story

As an admin
I want to activate waitlisted/onboarding users from the admin panel
So that they can access the full platform features

## Problem Statement

RLS policy `"Users can update their own profile."` on `profiles` blocks cross-user updates. Supabase doesn't error on zero-row updates, so `activateUser()` and `activateAllWaitlisted()` report false success.

## Solution Statement

Create two SECURITY DEFINER PostgreSQL functions (`admin_activate_user` and `admin_activate_all_waitlisted`) that verify the caller is an admin, then perform the status update bypassing RLS. Update the TypeScript server actions to call these RPCs and check the result.

## Feature Metadata

**Feature Type**: Bug Fix
**Estimated Complexity**: Low
**Primary Systems Affected**: Admin dashboard, profiles table, server actions
**Dependencies**: None — uses existing patterns

---

## CONTEXT REFERENCES

### Relevant Codebase Files — MUST READ BEFORE IMPLEMENTING

- `app/(protected)/dashboard/admin/actions.ts` (full file, 111 lines) — **Primary file to modify.** Contains `activateUser()` (line 59) and `activateAllWaitlisted()` (line 73) that need to switch from direct `.update()` to `.rpc()` calls. Also contains `injectPoints()` (line 41) which is the **exact pattern to follow** — it calls `supabase.rpc("admin_inject_points", { p_admin_id: user.id, ... })`.

- `supabase/migrations/20260222000000_beta_launch_economy.sql` — Contains the `admin_inject_points` function definition. This is the **canonical pattern** for admin SECURITY DEFINER RPCs:
  ```sql
  CREATE OR REPLACE FUNCTION public.admin_inject_points(
    p_admin_id uuid,
    p_target_user_id uuid,
    ...
  ) RETURNS void AS $$
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = p_admin_id AND is_admin = true) THEN
      RAISE EXCEPTION 'Not authorized: admin only';
    END IF;
    -- operation here
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
  ```

- `app/(protected)/dashboard/admin/users/page.tsx` (full file, 260 lines) — The UI that calls these actions. **No changes needed** — it already handles `result.error` and `result.success` correctly and calls `loadUsers()` to refresh.

### New Files to Create

- `supabase/migrations/20260307000000_admin_activate_functions.sql` — Two SECURITY DEFINER RPCs

### Patterns to Follow

**SECURITY DEFINER RPC pattern** (from `admin_inject_points`):
1. Accept `p_admin_id uuid` as first parameter
2. Inline admin check: `IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = p_admin_id AND is_admin = true)`
3. `RAISE EXCEPTION` on auth failure
4. `RETURNS void` for single-user, `RETURNS integer` for bulk (return count)
5. End with `LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;`

**Server action RPC call pattern** (from `injectPoints`):
1. Call `requireAdmin()` to get `{ supabase, user }`
2. Call `supabase.rpc("function_name", { p_admin_id: user.id, ... })`
3. Check `if (error)` and return `{ error: error.message }`
4. `revalidatePath("/dashboard/admin/users")`
5. Return `{ success: true }`

---

## IMPLEMENTATION PLAN

### Phase 1: Database Migration

Create two SECURITY DEFINER functions:

1. **`admin_activate_user(p_admin_id uuid, p_user_id uuid)`** → `RETURNS void`
   - Verify admin
   - `UPDATE profiles SET status = 'active' WHERE id = p_user_id`

2. **`admin_activate_all_waitlisted(p_admin_id uuid)`** → `RETURNS integer`
   - Verify admin
   - `UPDATE profiles SET status = 'active' WHERE status IN ('waitlisted', 'onboarding')`
   - `GET DIAGNOSTICS v_count = ROW_COUNT; RETURN v_count;`

### Phase 2: Update Server Actions

Update `activateUser()` and `activateAllWaitlisted()` in `actions.ts` to use `.rpc()` instead of `.update()`.

For `activateAllWaitlisted`, also return the count of activated users from the RPC so the UI could use it (the current UI doesn't display count, but the data is available).

---

## STEP-BY-STEP TASKS

### Task 1: CREATE `supabase/migrations/20260307000000_admin_activate_functions.sql`

Create migration with both functions:

```sql
-- ============================================================
-- admin_activate_user() — activate a single user (admin only)
-- ============================================================
CREATE OR REPLACE FUNCTION public.admin_activate_user(
  p_admin_id uuid,
  p_user_id uuid
)
RETURNS void AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = p_admin_id AND is_admin = true) THEN
    RAISE EXCEPTION 'Not authorized: admin only';
  END IF;

  UPDATE public.profiles SET status = 'active' WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ============================================================
-- admin_activate_all_waitlisted() — activate all non-active users (admin only)
-- ============================================================
CREATE OR REPLACE FUNCTION public.admin_activate_all_waitlisted(
  p_admin_id uuid
)
RETURNS integer AS $$
DECLARE
  v_count integer;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = p_admin_id AND is_admin = true) THEN
    RAISE EXCEPTION 'Not authorized: admin only';
  END IF;

  UPDATE public.profiles SET status = 'active' WHERE status IN ('waitlisted', 'onboarding');
  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
```

- **PATTERN**: Mirror `admin_inject_points` from `20260222000000_beta_launch_economy.sql`
- **VALIDATE**: `npx supabase db push --dry-run` (if local Supabase is linked)

### Task 2: UPDATE `app/(protected)/dashboard/admin/actions.ts` — `activateUser()`

Replace lines 59-71:

**From:**
```ts
export async function activateUser(userId: string) {
  const { supabase } = await requireAdmin();

  const { error } = await supabase
    .from("profiles")
    .update({ status: 'active' })
    .eq("id", userId);

  if (error) return { error: "Failed to activate user" };

  revalidatePath("/dashboard/admin/users");
  return { success: true };
}
```

**To:**
```ts
export async function activateUser(userId: string) {
  const { supabase, user } = await requireAdmin();

  const { error } = await supabase.rpc("admin_activate_user", {
    p_admin_id: user.id,
    p_user_id: userId,
  });

  if (error) return { error: error.message };

  revalidatePath("/dashboard/admin/users");
  return { success: true };
}
```

Key changes:
- Destructure `user` from `requireAdmin()` (was only destructuring `supabase`)
- Switch from `.from("profiles").update()` to `.rpc("admin_activate_user")`
- Return `error.message` instead of hardcoded string (more informative)

- **PATTERN**: Mirror `injectPoints()` at line 41 of the same file
- **VALIDATE**: `npm run build`

### Task 3: UPDATE `app/(protected)/dashboard/admin/actions.ts` — `activateAllWaitlisted()`

Replace lines 73-85:

**From:**
```ts
export async function activateAllWaitlisted() {
  const { supabase } = await requireAdmin();

  const { data, error } = await supabase
    .from("profiles")
    .update({ status: 'active' })
    .in("status", ["waitlisted", "onboarding"]);

  if (error) return { error: "Failed to activate users" };

  revalidatePath("/dashboard/admin/users");
  return { success: true };
}
```

**To:**
```ts
export async function activateAllWaitlisted() {
  const { supabase, user } = await requireAdmin();

  const { data, error } = await supabase.rpc("admin_activate_all_waitlisted", {
    p_admin_id: user.id,
  });

  if (error) return { error: error.message };

  revalidatePath("/dashboard/admin/users");
  return { success: true, count: data };
}
```

Key changes:
- Destructure `user` from `requireAdmin()`
- Switch to `.rpc("admin_activate_all_waitlisted")`
- `data` now contains the integer count returned by the function
- Return `count: data` for potential UI use

- **PATTERN**: Mirror `injectPoints()` at line 41
- **VALIDATE**: `npm run build`

---

## TESTING STRATEGY

### No Automated Tests

Project has no test framework configured (hackathon trade-off per CLAUDE.md).

### Manual Validation

1. **Build check**: `npm run build` passes
2. **Migration check**: SQL syntax is valid (dry-run or push)
3. **Functional test** (requires running app + Supabase):
   - Log in as admin
   - Go to `/dashboard/admin/users`
   - Click "Activate" on a waitlisted user → status changes to "active"
   - Create another waitlisted user → click "Activate All Waitlisted" → all activate
   - Non-admin cannot call the RPCs (RAISE EXCEPTION)

---

## VALIDATION COMMANDS

### Level 1: Build

```bash
npm run build
```

### Level 2: Migration Syntax

```bash
npx supabase db push --dry-run
```
(If Supabase CLI is linked. Otherwise, review SQL manually.)

### Level 4: Manual Validation

1. Sign in as admin → `/dashboard/admin/users`
2. Find a user with status ≠ "active" → click "Activate" → verify status changes
3. Click "Activate All Waitlisted" → verify all non-active users become active
4. Verify toast messages show correctly on success/failure

---

## ACCEPTANCE CRITERIA

- [ ] Migration creates `admin_activate_user` and `admin_activate_all_waitlisted` RPCs
- [ ] Both RPCs verify admin status before executing
- [ ] `activateUser()` server action uses `.rpc()` instead of `.update()`
- [ ] `activateAllWaitlisted()` server action uses `.rpc()` instead of `.update()`
- [ ] Error messages propagate from RPC to UI (not hardcoded strings)
- [ ] `npm run build` passes with zero errors
- [ ] No changes to the admin users UI page (it already handles errors correctly)
- [ ] Existing `injectPoints` / `injectPointsToAll` functionality unaffected

---

## COMPLETION CHECKLIST

- [ ] Migration file created with correct timestamp
- [ ] Both server actions updated to use RPC pattern
- [ ] Build passes
- [ ] Migration pushed to Supabase (or queued for push)
- [ ] Manual test confirms activation works

---

## NOTES

- **Why not an RLS policy?** GH #10 suggests Option B (add admin UPDATE policy). We chose Option A (SECURITY DEFINER RPC) because it's consistent with how `admin_inject_points` already works. Mixing approaches would make the codebase harder to reason about.
- **Why `RETURNS integer` for bulk?** So the caller knows how many users were activated. The current UI doesn't display this, but it's cheap to provide and useful for logging/toasts.
- **No UI changes needed.** The admin users page already handles `result.error` / `result.success` and refreshes the user list after each action.

**Confidence Score: 9/10** — Straightforward pattern replication with zero ambiguity. Only risk is a typo in the migration SQL.
