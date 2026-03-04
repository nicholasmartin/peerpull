# Feature: Clean Up Sidebar Navigation for Waitlisted Users

The following plan should be complete, but its important that you validate documentation and codebase patterns and task sanity before you start implementing.

Pay special attention to naming of existing utils types and models. Import from the right files etc.

## Feature Description

Hide non-functional or irrelevant sidebar menu items (Community, Settings, Help & Support) from waitlisted and onboarding users. Active users and platform-launched states continue to see the full menu. This reduces dashboard clutter during the pre-launch/waitlist phase and focuses users on actions that matter.

## User Story

As a **waitlisted user**
I want to **see only the sidebar items that are relevant to me**
So that **the dashboard feels focused and I'm not confused by non-functional pages**

## Problem Statement

All users — regardless of their account status — see the same full sidebar menu. Waitlisted users see Community (not built out), Settings (nothing to configure), and Help & Support (contains mock data per GH #8). This creates confusion and clutter.

## Solution Statement

Thread the user's profile `status` from the dashboard layout through `DashboardShell` to `AppSidebar`. In `AppSidebar`, filter `navItems` and `secondaryNavItems` based on whether the user is active, using a simple `hiddenWhenNotActive` path set. The `isActive` determination mirrors the existing pattern: `status === 'active' || platform_launched`.

## Feature Metadata

**Feature Type**: Enhancement
**Estimated Complexity**: Low
**Primary Systems Affected**: `AppSidebar`, `DashboardShell`
**Dependencies**: None — all data already available in the component tree
**GitHub Issue**: [#9](https://github.com/nicholasmartin/peerpull/issues/9)

---

## CONTEXT REFERENCES

### Relevant Codebase Files — MUST READ BEFORE IMPLEMENTING

- `components/protected/dashboard/layout/AppSidebar.tsx` (full file, 367 lines) — **Primary file to modify.** Contains `navItems` (lines 31-66), `secondaryNavItems` (lines 69-80), `dynamicSecondaryNavItems` construction (lines 89-96), and the component props interface (lines 83-85). The `isAdmin` conditional pattern at lines 89-96 is the exact pattern to extend.

- `components/protected/dashboard/layout/DashboardShell.tsx` (full file, 33 lines) — **Secondary file to modify.** Passes `isAdmin={profile?.is_admin}` to AppSidebar at line 24. This is where we add the `status` and `platformLaunched` props.

- `utils/supabase/profiles.ts` (full file, 36 lines) — Defines the `Profile` type with `status: 'onboarding' | 'waitlisted' | 'active'` at line 16. Do NOT modify this file.

- `app/(protected)/dashboard/layout.tsx` — Server component that fetches the profile via `getUserProfile(user)` and passes it to `DashboardShell`. The profile object already contains `status`. **No changes needed here** unless we also need `platform_launched` from system settings.

- `app/(protected)/dashboard/page.tsx` (lines 17-25) — Shows the existing pattern for determining active status: `const isActive = profile?.status === 'active' || settings.platform_launched;`. This is the pattern we should mirror.

- `utils/supabase/settings.ts` — Contains `getSettings()` and `getSetting()` helpers for reading `system_settings` from the database. If we need `platform_launched` in the sidebar, this is how to fetch it server-side.

### New Files to Create

None. This feature only modifies two existing files.

### Patterns to Follow

**Conditional prop pattern (existing in DashboardShell → AppSidebar):**
```tsx
// DashboardShell.tsx line 24
<AppSidebar isAdmin={profile?.is_admin} />
```
Extend this same pattern to pass `isActive`.

**Active status determination (existing in dashboard/page.tsx):**
```tsx
const isActive = profile?.status === 'active' || settings.platform_launched;
```

**Conditional nav item filtering (existing isAdmin pattern in AppSidebar lines 89-96):**
```tsx
const dynamicSecondaryNavItems: NavItem[] = [
  ...(isAdmin ? [{...}] : []),
  ...secondaryNavItems,
];
```

---

## IMPLEMENTATION PLAN

### Phase 1: Thread `isActive` to AppSidebar

Pass a computed `isActive` boolean from `DashboardShell` to `AppSidebar`, following the existing `isAdmin` prop pattern. The `isActive` value needs `platform_launched` from system settings, so fetch it server-side in the dashboard layout and pass it down.

### Phase 2: Filter Nav Items in AppSidebar

Add a `hiddenWhenNotActive` set of paths and filter both `navItems` and `secondaryNavItems` when `isActive` is false.

### Phase 3: Validate

Verify the sidebar renders correctly for all 3 user states and the platform-launched override.

---

## STEP-BY-STEP TASKS

### Task 1: UPDATE `app/(protected)/dashboard/layout.tsx` — fetch `platform_launched` setting

- **IMPLEMENT**: Import `getSetting` from `@/utils/supabase/settings`. Fetch `platform_launched` value server-side. Compute `isActive = profile?.status === 'active' || platformLaunched`. Pass `isActive` as a new prop to `DashboardShell`.
- **PATTERN**: Mirror `app/(protected)/dashboard/page.tsx` lines 17-25 for the `isActive` computation pattern
- **IMPORTS**: `import { getSetting } from "@/utils/supabase/settings";`
- **GOTCHA**: `getSetting` returns `string | null`. Compare with `=== 'true'` (not truthy check). The key is `"platform_launched"`.
- **GOTCHA**: `DashboardShell` is a client component. `isActive` must be passed as a serializable prop (boolean) — no functions or complex objects.
- **VALIDATE**: `npm run build` — no type errors

### Task 2: UPDATE `components/protected/dashboard/layout/DashboardShell.tsx` — accept and forward `isActive`

- **IMPLEMENT**: Add `isActive: boolean` to the props type. Pass `isActive={isActive}` to `<AppSidebar>` alongside the existing `isAdmin` prop.
- **PATTERN**: Mirror the existing `profile` prop threading pattern (lines 11-18)
- **GOTCHA**: Keep the `isAdmin` prop — it's independent and controls the Admin menu item
- **VALIDATE**: `npm run build` — no type errors

### Task 3: UPDATE `components/protected/dashboard/layout/AppSidebar.tsx` — filter nav items by active status

- **IMPLEMENT**:
  1. Add `isActive?: boolean` to the component props alongside `isAdmin` (line 83-85)
  2. Define a `hiddenWhenNotActive` set of paths above the component:
     ```tsx
     const hiddenWhenNotActive = new Set([
       "/dashboard/community",
       "/dashboard/settings",
       "/dashboard/help",
     ]);
     ```
  3. Inside the component, compute filtered nav arrays:
     ```tsx
     const filteredNavItems = isActive
       ? navItems
       : navItems.filter(item => !hiddenWhenNotActive.has(item.path ?? ''));

     const filteredSecondaryNavItems = isActive
       ? dynamicSecondaryNavItems
       : dynamicSecondaryNavItems.filter(item => !hiddenWhenNotActive.has(item.path ?? ''));
     ```
  4. Replace `{renderMenuItems(navItems)}` (line 340) with `{renderMenuItems(filteredNavItems)}`
  5. Replace `{renderMenuItems(dynamicSecondaryNavItems)}` (line 358) with `{renderMenuItems(filteredSecondaryNavItems)}`
- **PATTERN**: Mirror `isAdmin` conditional pattern at lines 89-96
- **GOTCHA**: The `navItems` array uses `path` as optional (`path?: string`), so use `item.path ?? ''` when checking against the set. Items without paths (none currently, but defensive) won't be hidden.
- **GOTCHA**: The `useEffect` at lines 231-251 iterates over `navItems` directly for submenu matching. This is fine — it only opens submenus, and hidden items won't appear in the rendered list anyway. No change needed here.
- **GOTCHA**: `isActive` defaults to `undefined` which is falsy — but we should default it to `true` in the prop destructuring (`{ isAdmin, isActive = true }`) so the sidebar shows everything if the prop is somehow missing. This is a safe default.
- **VALIDATE**: `npm run build` — no type errors

---

## TESTING STRATEGY

### No Automated Tests

This project has no test framework configured (hackathon project). Validation is manual only.

### Manual Testing Matrix

| User Status | platform_launched | Expected Visible Items |
|-------------|------------------|----------------------|
| `active` | `false` | All items (Dashboard, Feedback, PeerPoints, Community, Profile, Settings, Help, Invite, Admin if admin) |
| `active` | `true` | All items |
| `waitlisted` | `false` | Dashboard, Feedback, PeerPoints, Profile, Invite Founders, Admin (if admin) |
| `waitlisted` | `true` | All items (platform_launched overrides status) |
| `onboarding` | `false` | Dashboard, Feedback, PeerPoints, Profile, Invite Founders, Admin (if admin) |
| `onboarding` | `true` | All items |

---

## VALIDATION COMMANDS

### Level 1: Build Check

```bash
npm run build
```
Must complete without errors (note: `ignoreBuildErrors: true` is set, but we should still verify no runtime issues).

### Level 2: Dev Server Smoke Test

```bash
npm run dev
```
Navigate to `/dashboard` while logged in and visually verify:
1. As a waitlisted user: Community, Settings, Help & Support are **hidden**
2. As an active user: all menu items are **visible**
3. Sidebar collapsed/expanded/hover states all work correctly
4. Mobile sidebar works correctly

### Level 3: Direct URL Access (Security)

Verify that a waitlisted user navigating directly to `/dashboard/community`, `/dashboard/settings`, or `/dashboard/help` is **not blocked** — the issue specifies not to add middleware guards; existing `requireActiveUser` guards handle protection at the action level. The pages themselves may still render (this is acceptable per the issue).

---

## ACCEPTANCE CRITERIA

- [ ] Waitlisted users do NOT see Community, Settings, or Help & Support in the sidebar
- [ ] Active users see all sidebar items as before (no regression)
- [ ] `platform_launched = 'true'` overrides waitlisted status (shows all items)
- [ ] Onboarding users (edge case — they shouldn't reach sidebar but if they do) get same filtering as waitlisted
- [ ] `isAdmin` prop still works independently — Admin item shows/hides based on admin status regardless of active status
- [ ] Sidebar collapsed, expanded, hovered, and mobile states all render correctly
- [ ] No direct-URL blocking — hidden items are cosmetic only
- [ ] Build succeeds with no new errors

---

## COMPLETION CHECKLIST

- [ ] All 3 tasks completed in order
- [ ] `npm run build` passes
- [ ] Manual testing confirms filtering works for waitlisted users
- [ ] Manual testing confirms no regression for active users
- [ ] Sidebar responsive states (collapsed/expanded/hover/mobile) unaffected
- [ ] Code follows existing patterns (prop threading, conditional filtering)

---

## NOTES

- **Scope is intentionally small.** Only 2 files modified (DashboardShell and AppSidebar), plus 1 minor update to the dashboard layout for `platform_launched` fetching.
- **No middleware changes.** The issue explicitly states: "Don't block navigation via middleware for these routes — just hide the menu items."
- **Default `isActive = true`** in AppSidebar ensures backward compatibility if the prop is ever missing.
- **The `platform_launched` fetch** is the only new data requirement. It's a single `getSetting("platform_launched")` call in the server-side layout, which is cheap and already cached by Supabase.
- **Future extensibility:** The `hiddenWhenNotActive` set can easily be extended to hide more items for waitlisted users without changing the filtering logic.
