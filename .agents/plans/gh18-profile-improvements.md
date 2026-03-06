# GH #20: Profile Page Improvements

> **Issue:** https://github.com/nicholasmartin/peerpull/issues/20
> **Related:** https://github.com/nicholasmartin/peerpull/issues/19 (public-facing profiles, future)
> **Status:** Planned

## Overview

Four improvements from tester feedback: email privacy toggle, expanded expertise with free-text input, prominent expertise badges, and a tab-free layout with a dedicated edit page.

## Implementation Steps

### Step 1: Database Migration

**Create:** `supabase/migrations/20260310000000_add_email_public_to_profiles.sql`

```sql
ALTER TABLE profiles ADD COLUMN email_public boolean NOT NULL DEFAULT false;
```

No RLS changes needed since profiles are already viewable by everyone.

### Step 2: Update Profile Type

**Modify:** `utils/supabase/profiles.ts`

Add to the `Profile` type:
- `email_public: boolean`
- `quality_score: number | null` (already used in profile page but missing from type)

### Step 3: Update `updateProfile` Server Action

**Modify:** `app/actions.ts` (lines 495-556)

- Extract `email_public` from formData: `const emailPublic = formData.get("email_public") === "true";`
- Add `email_public: emailPublic` to the `updateData` object
- Change error redirects (lines 522, 552) from `/dashboard/profile` to `/dashboard/profile/edit`
- Keep success redirect as `/dashboard/profile`

### Step 4: Expand Expertise Options + Free-Text Input

**Modify:** `components/protected/dashboard/EditProfileForm.tsx`

Updated `EXPERTISE_OPTIONS` (remove "Other", add new options):
```
SaaS, Mobile App, Web App, API/Backend, UI/UX Design, Marketing, DevTools,
E-commerce, AI/ML, Fintech, Growth Hacking, Data Analytics,
Cloud/Infrastructure, Cybersecurity, Blockchain/Web3, SEO/Content,
Community Building, Product Management, Open Source, No-Code/Low-Code,
Hardware/IoT, EdTech, HealthTech, Gaming, Social Media
```

Add state and handler for custom expertise:
- `customExpertise` state for the text input
- `addCustomExpertise()` handler that adds trimmed value to `selectedExpertise` if unique
- Renders an Input + "Add" Button below the predefined tags
- Submit on Enter key press
- Custom tags (not in EXPERTISE_OPTIONS) show with an "x" remove button

Add email privacy toggle:
- New state: `emailPublic` initialized from `profile.email_public`
- Switch component with label "Show email on public profile"
- Placed below the email field in the "Basic Information" card
- Append `email_public` to FormData on save

### Step 5: Make Expertise Badges Prominent on Profile View

**Modify:** `app/(protected)/dashboard/profile/page.tsx` (line 177)

Change from:
```tsx
<Badge key={index} variant="secondary">{skill}</Badge>
```
To:
```tsx
<Badge key={index} className="bg-primary/20 text-primary border-primary/30">{skill}</Badge>
```

### Step 6: Remove Tabs, Restructure Profile Page Layout

**Modify:** `app/(protected)/dashboard/profile/page.tsx`

- Remove: `Tabs`, `TabsContent`, `TabsList`, `TabsTrigger`, `EditProfileForm` imports
- Add: `Link` from `next/link`, `Pencil` and `Globe`, `LockKeyhole` from `lucide-react`
- Header: flex row with "My Profile" title + "Edit Profile" button linking to `/dashboard/profile/edit`
- Left sidebar (md:col-span-1): Keep avatar card + achievements card. Add Recent Activity below achievements.
- Right content (md:col-span-2): Render ProfileStats, Contact Info (with email visibility icon), and Expertise directly (no tabs)
- Email visibility indicator: Globe icon (public) or LockKeyhole icon (private) next to email

### Step 7: Create Dedicated Edit Profile Page

**Create:** `app/(protected)/dashboard/profile/edit/page.tsx`

Server component with:
- Auth guard (redirect to /signin if no user)
- Back arrow link to `/dashboard/profile`
- "Edit Profile" heading
- Renders `<EditProfileForm>`

### Step 8: Update Cancel Button Behavior

**Modify:** `components/protected/dashboard/EditProfileForm.tsx`

Change `handleCancel` to navigate back:
```tsx
const handleCancel = () => {
  router.push("/dashboard/profile");
};
```

## File Summary

| File | Action |
|------|--------|
| `supabase/migrations/20260310000000_add_email_public_to_profiles.sql` | Create |
| `utils/supabase/profiles.ts` | Modify (add fields to type) |
| `app/actions.ts` | Modify (email_public + redirect paths) |
| `components/protected/dashboard/EditProfileForm.tsx` | Modify (expertise expansion, email toggle, cancel nav) |
| `app/(protected)/dashboard/profile/page.tsx` | Modify (remove tabs, restructure, badge styling) |
| `app/(protected)/dashboard/profile/edit/page.tsx` | Create (new edit page) |

## Sequencing

1. Migration (Step 1) - all changes depend on `email_public` column
2. Type update (Step 2)
3. Server action (Step 3)
4. EditProfileForm changes (Steps 4, 8)
5. Profile page restructure + badge styling (Steps 5, 6)
6. New edit page (Step 7)
