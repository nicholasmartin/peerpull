# Feature: Audit & Unify Theme System for Dual Light/Dark Support (GH #11)

The following plan should be complete, but validate documentation and codebase patterns and task sanity before implementing.

Pay special attention to naming of existing utils types and models. Import from the right files etc.

## Feature Description

PeerPull was built on a boilerplate with full light/dark theme support. During development, the team enforced dark-only mode and introduced custom `dark-*` Tailwind tokens (`dark-bg`, `dark-card`, `dark-surface`, etc.) as static colors. This created two conflicting theme systems:

1. **Boilerplate pattern:** Standard Tailwind `dark:` prefix classes (supports both themes)
2. **Custom pattern:** Hardcoded `dark-*` color tokens (dark-only, no light equivalent)

This feature converts the custom `dark-*` tokens into **CSS custom properties** that respond to the `dark` class on `<html>`, then re-enables the existing ThemeContext toggle so users can switch between light, dark, and system themes.

## User Story

As a PeerPull user
I want to switch between light and dark themes
So that I can use the app comfortably in any lighting environment

## Problem Statement

- 12+ shadcn/ui components and 30+ custom components use hardcoded `dark-*` tokens that only work in dark mode
- 18 visual bugs exist where light colors bleed through in dark mode (boilerplate components with incomplete `dark:` overrides)
- ThemeContext exists and is functional but suppressed — selecting "light" in settings results in broken UI
- Two incompatible theme systems create maintenance burden

## Solution Statement

**Recommended approach: Option C (Hybrid)** from the GitHub issue.

1. Define CSS custom properties for the semantic token palette (`--color-bg`, `--color-card`, `--color-surface`, etc.) with light AND dark values
2. Update `tailwind.config.ts` to reference CSS variables instead of fixed hex values
3. Preserve boilerplate `dark:` prefix classes where they already work correctly
4. Fix the 18 identified visual bleed bugs
5. Re-enable ThemeContext (already functional, just needs the CSS variable foundation)
6. Update root layout, globals.css, and Toaster to be theme-aware

**Why Option C over A or B:**
- Option A (adopt boilerplate pattern everywhere) would require adding `dark:` overrides to 40+ components — massive diff, error-prone
- Option B (extend dark tokens into dual-token system) requires `light-*` AND `dark-*` classes everywhere — doubles the className complexity
- Option C (CSS variables that swap via `.dark` class) requires changing tokens ONCE in tailwind.config.ts and globals.css, and all 40+ components automatically get light mode support with zero className changes

## Feature Metadata

**Feature Type**: Enhancement / Refactor
**Estimated Complexity**: High (many files touched, but changes are systematic and mechanical)
**Primary Systems Affected**: All UI components, Tailwind config, globals.css, ThemeContext, root layout
**Dependencies**: None — ThemeContext already exists and works

---

## CONTEXT REFERENCES

### Relevant Codebase Files — MUST READ BEFORE IMPLEMENTING

| File | Lines | Why |
|------|-------|-----|
| `tailwind.config.ts` | 44-71 | Current hardcoded `dark-*` token definitions + semantic aliases. These become CSS variable references |
| `app/globals.css` | 1-136 | Base styles, `@layer base` body styling, `@layer components` menu classes — all reference `dark-*` tokens |
| `context/ThemeContext.tsx` | 1-119 | Fully functional theme provider — toggles `dark` class on `<html>`. Already works, just needs CSS vars underneath |
| `app/layout.tsx` | 1-56 | Root layout — hardcoded `bg-dark-bg text-dark-text` on body, Toaster forced to dark theme |
| `app/(protected)/dashboard/settings/page.tsx` | 426-473 | Appearance tab with Light/Dark/System selector — already wired to `applyTheme()` |
| `components.json` | 1-17 | shadcn/ui config — `cssVariables: true` is already set (intended to use CSS vars) |
| `components/ui/card/index.tsx` | 1-78 | Example of `dark-*` token component that auto-converts with this change |
| `components/ui/input/index.tsx` | 1-24 | Another `dark-*` token component |
| `components/ui/tabs/index.tsx` | 1-54 | Another `dark-*` token component |

### New Files to Create

None — this is purely a modification of existing files.

### Files That Need Updates

**Tier 1: Foundation (changes everything downstream)**
- `app/globals.css` — Add CSS custom property definitions for light/dark
- `tailwind.config.ts` — Replace hardcoded hex values with `var(--color-*)` references

**Tier 2: Root layout + theme wiring**
- `app/layout.tsx` — Remove hardcoded dark classes, use semantic tokens, make Toaster theme-aware

**Tier 3: Visual bug fixes (boilerplate components with light bleed)**
- `components/ui/dropdown/DropdownItem.tsx` — Missing dark overrides
- `components/ui/modal/index.tsx` — Light gray backdrop
- `components/protected/dashboard/layout/AppHeader.tsx` — Mixed light/dark colors
- `components/form/switch/Switch.tsx` — Light gray backgrounds
- `components/form/input/TextArea.tsx` — Disabled state light colors
- `components/form/input/InputField.tsx` — Disabled state
- `components/form/input/Radio.tsx` — Disabled border
- `components/form/input/FileInput.tsx` — File button styling
- `components/form/date-picker.tsx` — Light text/borders
- `components/form/group-input/PhoneInput.tsx` — Light text/borders
- `components/form/MultiSelect.tsx` — Tag background/text
- `components/form/Select.tsx` — Option text
- `components/ui/badge/Badge.tsx` — Light variant colors
- `components/ui/button/Button.tsx` — Outline variant

**Tier 4: Theme toggle UI polish**
- `app/(protected)/dashboard/settings/page.tsx` — Theme preview cards should show actual light/dark previews

### Relevant Documentation

- [Tailwind CSS Dark Mode docs](https://tailwindcss.com/docs/dark-mode) — `darkMode: 'class'` strategy (already configured)
- [shadcn/ui Theming](https://ui.shadcn.com/docs/theming) — CSS variable-based theme system (our target pattern)
- [Next.js Theme Flicker Prevention](https://nextjs.org/docs/app/building-your-application/styling/css#preventing-flash-of-unstyled-content) — ThemeContext already handles this with `beforeInteractive` script

### Patterns to Follow

**CSS Variable Definition Pattern (from shadcn/ui standard):**
```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 240 10% 3.9%;
    --card: 0 0% 100%;
    --card-foreground: 240 10% 3.9%;
    /* etc. */
  }
  .dark {
    --background: 240 10% 3.9%;
    --foreground: 0 0% 98%;
    --card: 240 10% 5.5%;
    --card-foreground: 0 0% 98%;
    /* etc. */
  }
}
```

**Our adapted version (using hex for simplicity with existing codebase):**
```css
@layer base {
  :root {
    --color-bg: #ffffff;
    --color-card: #f9fafb;
    --color-surface: #f3f4f6;
    --color-border: #e5e7eb;
    --color-text: #0a0a0b;
    --color-text-muted: #6b7280;
  }
  .dark {
    --color-bg: #0a0a0b;
    --color-card: #141416;
    --color-surface: #1c1c1f;
    --color-border: #27272a;
    --color-text: #fafafa;
    --color-text-muted: #71717a;
  }
}
```

**Tailwind Config Pattern:**
```ts
colors: {
  "dark-bg": "var(--color-bg)",       // Name kept for zero-diff in components
  "dark-card": "var(--color-card)",
  "dark-surface": "var(--color-surface)",
  // etc.
}
```

> **Key insight:** By keeping the Tailwind token NAMES (`dark-bg`, `dark-card`, etc.) but changing their VALUES from hardcoded hex to CSS variables, every component that uses `bg-dark-bg` or `text-dark-text` automatically becomes theme-aware with ZERO className changes.

---

## IMPLEMENTATION PLAN

### Phase 1: CSS Variable Foundation

Define CSS custom properties in `globals.css` with light (`:root`) and dark (`.dark`) values. Update `tailwind.config.ts` to reference these variables instead of hardcoded hex.

**Why this unlocks everything:** All 40+ components using `dark-*` Tailwind tokens automatically become theme-responsive because the underlying colors now change based on the `dark` class.

### Phase 2: Root Layout & Global Fixes

Update `app/layout.tsx` body classes and Toaster to use semantic tokens. Fix `globals.css` base layer.

### Phase 3: Visual Bug Fixes

Fix the 18 identified cases where light colors bleed through in dark mode (boilerplate components with incomplete `dark:` overrides). These are bugs regardless of light theme support.

### Phase 4: Theme Toggle Polish

Ensure the settings page theme selector works correctly. Update preview cards to show actual light/dark previews. Verify ThemeContext properly syncs with CSS variables.

### Phase 5: Verification

Test all pages in both light and dark mode. Verify no regressions.

---

## STEP-BY-STEP TASKS

### Task 1: UPDATE `app/globals.css` — Add CSS Custom Property Definitions

**IMPLEMENT**: Add CSS custom properties in `@layer base` with `:root` (light) and `.dark` (dark) values.

**Light palette** should be clean, neutral whites/grays that complement the gold accent:
```css
@layer base {
  :root {
    --color-bg: #ffffff;
    --color-card: #f9fafb;
    --color-surface: #f3f4f6;
    --color-border: #e5e7eb;
    --color-text: #111827;
    --color-text-muted: #6b7280;
  }
  .dark {
    --color-bg: #0a0a0b;
    --color-card: #141416;
    --color-surface: #1c1c1f;
    --color-border: #27272a;
    --color-text: #fafafa;
    --color-text-muted: #71717a;
  }
}
```

**Also add semantic variables for the accent/primary colors and semantic aliases:**
```css
:root {
  --color-primary: #d4a853;
  --color-primary-muted: #b8912e;
  --color-primary-subtle: rgba(212,168,83,0.08);
  --color-background: var(--color-bg);
  --color-foreground: var(--color-text);
  --color-muted: var(--color-surface);
  --color-muted-foreground: var(--color-text-muted);
}
```

**Update the body rule** in `@layer base`:
```css
body {
  @apply bg-[var(--color-bg)] font-normal text-base text-[var(--color-text)];
}
```
Wait — actually, once tailwind.config.ts references the CSS vars, we keep using `bg-dark-bg text-dark-text` and they'll just work. So body stays the same.

**Update scrollbar styles** to use variables:
```css
::-webkit-scrollbar-track {
  background: var(--color-bg);
}
::-webkit-scrollbar-thumb {
  background: var(--color-border);
}
::-webkit-scrollbar-thumb:hover {
  background: var(--color-text-muted);
}
```

**Update `@layer components` menu classes** — these already use `dark-*` tokens via Tailwind classes so they auto-convert. No changes needed.

**GOTCHA**: The body `@apply` in `@layer base` uses Tailwind utility classes (`bg-dark-bg`, `text-dark-text`). Once tailwind.config changes these to CSS vars, the `@apply` still works — Tailwind resolves it at build time. But the scrollbar styles use `@apply` too and should be converted to raw CSS since they're pseudo-elements.

**VALIDATE**: `npm run build` should succeed.

---

### Task 2: UPDATE `tailwind.config.ts` — Reference CSS Variables

**IMPLEMENT**: Replace hardcoded hex values with `var(--color-*)` references for the 6 core dark tokens AND the semantic aliases.

**Current** (lines 44-71):
```ts
"dark-bg": "#0a0a0b",
"dark-card": "#141416",
"dark-surface": "#1c1c1f",
"dark-border": "#27272a",
"dark-text": "#fafafa",
"dark-text-muted": "#71717a",
```

**New**:
```ts
"dark-bg": "var(--color-bg)",
"dark-card": "var(--color-card)",
"dark-surface": "var(--color-surface)",
"dark-border": "var(--color-border)",
"dark-text": "var(--color-text)",
"dark-text-muted": "var(--color-text-muted)",
```

**Also update the semantic aliases** (lines 60-71):
```ts
background: "var(--color-bg)",
foreground: "var(--color-text)",
muted: {
  DEFAULT: "var(--color-surface)",
  foreground: "var(--color-text-muted)",
},
border: "var(--color-border)",
```

**KEEP UNCHANGED**: The gold/accent colors (`blue-primary`, `teal-accent`, `gradient-start`, `gradient-end`, `glass-highlight`, `glass-border`, `primary`) — these are brand colors that stay the same in both themes. Also keep all legacy boilerplate tokens (`stroke`, `dark`, `black`, `body-color`, etc.) — they're used by boilerplate components with `dark:` overrides.

**GOTCHA**: Tailwind opacity modifiers (`bg-dark-bg/50`) don't work with raw hex CSS vars. Since our CSS vars use hex format, we need to ensure we're not using opacity modifiers on these tokens anywhere. Search for patterns like `dark-bg/`, `dark-card/`, `dark-surface/` etc. If found, either:
- Use `bg-[var(--color-bg)]/50` syntax (Tailwind v3.4+ supports this), OR
- Define the CSS var as RGB components: `--color-bg: 10 10 11` and reference as `rgb(var(--color-bg) / 0.5)` in Tailwind

**PATTERN**: Check for opacity modifier usage first:
```bash
grep -rn "dark-bg/" --include="*.tsx" components/ app/
grep -rn "dark-card/" --include="*.tsx" components/ app/
grep -rn "dark-surface/" --include="*.tsx" components/ app/
grep -rn "dark-border/" --include="*.tsx" components/ app/
grep -rn "dark-text/" --include="*.tsx" components/ app/
grep -rn "dark-text-muted/" --include="*.tsx" components/ app/
```

If opacity modifiers ARE used, the CSS vars must be defined as space-separated RGB channels instead of hex. This changes the approach slightly:
```css
:root {
  --color-bg: 255 255 255;  /* white */
}
.dark {
  --color-bg: 10 10 11;     /* #0a0a0b */
}
```
And Tailwind config:
```ts
"dark-bg": "rgb(var(--color-bg) / <alpha-value>)",
```

**VALIDATE**: `npm run build` should succeed. Spot-check that `bg-dark-bg` resolves to a CSS variable in the output.

---

### Task 3: UPDATE `app/layout.tsx` — Theme-Aware Root Layout

**IMPLEMENT**:
1. Import and wrap children with `ThemeProvider` from `@/context/ThemeContext`
2. Remove hardcoded `bg-dark-bg text-dark-text` from body (the `@layer base` body rule in globals.css handles this via the now-variable tokens — but actually, keeping it is fine too since `dark-bg` now resolves to a CSS var)
3. Make Toaster theme-responsive:

**Current Toaster** (line 37-53):
```tsx
<Toaster
  theme="dark"
  ...
  toastOptions={{
    classNames: {
      toast: "!bg-[#1a1f2e] !border-[#2d3348]",
      title: "!text-gray-100",
      description: "!text-gray-400",
      closeButton: "!bg-[#2d3348] !border-[#3d4458] !text-gray-400",
    },
  }}
/>
```

**New Toaster** — remove hardcoded dark colors, let Sonner inherit theme:
```tsx
<Toaster
  theme="system"
  position="bottom-right"
  richColors
  closeButton
  visibleToasts={3}
  duration={5000}
  toastOptions={{
    classNames: {
      toast: "!bg-dark-card !border-dark-border",
      title: "!text-dark-text",
      description: "!text-dark-text-muted",
      closeButton: "!bg-dark-surface !border-dark-border !text-dark-text-muted",
    },
  }}
/>
```

Wait — Sonner's `theme` prop controls its own internal theming. Since we want our CSS vars to control it, we should use `theme="system"` OR create a client wrapper that reads our ThemeContext. The simpler approach: use Sonner's class-based theming since our toast classNames override everything anyway.

**Actually simplest**: Keep `theme="dark"` but replace the hardcoded hex with our token classes (as shown above). When the CSS vars swap, the classes auto-update. This avoids needing a client-side Toaster wrapper.

**ALSO**: Add `ThemeProvider` wrapping. Currently layout doesn't use it — ThemeContext exists but isn't in the render tree except in settings page via `useTheme`. We need it wrapping the app for the settings theme toggle to work globally.

**Current body:**
```tsx
<body className="font-inter bg-dark-bg text-dark-text antialiased" suppressHydrationWarning>
  <SidebarProvider>
    {children}
  </SidebarProvider>
  <Toaster ... />
</body>
```

**New body:**
```tsx
<body className="font-inter bg-dark-bg text-dark-text antialiased" suppressHydrationWarning>
  <ThemeProvider>
    <SidebarProvider>
      {children}
    </SidebarProvider>
    <Toaster ... />
  </ThemeProvider>
</body>
```

**GOTCHA**: ThemeProvider is a client component (`"use client"`). RootLayout is a server component. We need to ensure ThemeProvider can wrap server component children — this works in Next.js 15 because client components can accept `children` as a prop (they're serialized as React Server Component payloads).

**IMPORTS**: Add `import { ThemeProvider } from "@/context/ThemeContext";`

**VALIDATE**: `npm run dev` — toggle theme in settings, verify body background changes.

---

### Task 4: FIX Visual Bugs — Boilerplate Components with Light Bleed

These are bugs visible NOW in dark mode, regardless of light theme support. Fix each by adding proper `dark:` overrides OR replacing light-only colors with semantic tokens.

**4a. UPDATE `components/ui/dropdown/DropdownItem.tsx`**
- **Current**: `text-gray-700 hover:bg-gray-100 hover:text-gray-900` — no dark overrides
- **Fix**: Add `dark:text-dark-text-muted dark:hover:bg-dark-surface dark:hover:text-dark-text`
- OR replace entirely with: `text-dark-text-muted hover:bg-dark-surface hover:text-dark-text` (since the CSS vars now handle both themes)

**4b. UPDATE `components/ui/dropdown/Dropdown.tsx`**
- **Current**: `border-gray-200 bg-white` with `dark:border-gray-800 dark:bg-gray-dark`
- **Fix**: Replace with `border-dark-border bg-dark-card` (CSS vars handle both)

**4c. UPDATE `components/ui/modal/index.tsx`**
- **Current backdrop**: `bg-gray-400/50`
- **Fix**: Replace with `bg-black/50 dark:bg-black/60` or `bg-dark-bg/50`

**4d. UPDATE `components/protected/dashboard/layout/AppHeader.tsx`**
- Line 111: `text-gray-700 hover:bg-gray-100` → add `dark:text-dark-text-muted dark:hover:bg-dark-surface`
- Line 156: `border-gray-200 bg-gray-50 text-gray-500` → add dark overrides or use tokens

**4e. UPDATE `components/form/switch/Switch.tsx`**
- Lines 35, 43: `bg-gray-200` → add `dark:bg-white/10` (some already have this — verify)
- Line 60: disabled state `bg-gray-100` → add `dark:bg-dark-surface`

**4f. UPDATE `components/form/input/TextArea.tsx`**
- Line 33: disabled state `bg-gray-100 text-gray-500 border-gray-300` → add `dark:bg-dark-surface dark:text-dark-text-muted dark:border-dark-border`

**4g. UPDATE `components/form/input/InputField.tsx`**
- Line 41: disabled state `text-gray-500 border-gray-300` → add dark overrides

**4h. UPDATE `components/form/input/Radio.tsx`**
- Line 50: `border-gray-200` without dark override → add `dark:border-dark-border`

**4i. UPDATE `components/form/input/FileInput.tsx`**
- Line 12: `file:border-gray-200 file:bg-gray-50 file:text-gray-700` — verify dark overrides exist for all

**4j. UPDATE `components/form/date-picker.tsx`**
- Line 51: `text-gray-800 border-gray-300` → add `dark:text-dark-text dark:border-dark-border`

**4k. UPDATE `components/form/group-input/PhoneInput.tsx`**
- Multiple lines: `text-gray-700 border-gray-200` → add dark overrides throughout

**4l. UPDATE `components/form/MultiSelect.tsx`**
- Line 67: tag styling `bg-gray-100 text-gray-800` → ensure dark overrides are complete

**4m. UPDATE `components/form/Select.tsx`**
- Line 46, 55: option `text-gray-700` → verify dark overrides

**4n. UPDATE `components/ui/badge/Badge.tsx`**
- Line 52: light variant `bg-gray-100 text-gray-700` → verify dark overrides exist

**PATTERN FOR FIXES**: Where a component uses `bg-gray-200 dark:bg-something`, keep that — it's the boilerplate's working dual-theme pattern. Where a component is MISSING the `dark:` override, add one using `dark-*` tokens. Where a component has ONLY light colors with no `dark:` prefix, consider replacing entirely with semantic token classes.

**VALIDATE**: `npm run dev` — visually inspect each component in dark mode. No light backgrounds, text, or borders should appear.

---

### Task 5: UPDATE Settings Page Theme Selector — Polish

**FILE**: `app/(protected)/dashboard/settings/page.tsx`

**IMPLEMENT**: The theme selector already works (it calls `applyTheme()` which sets `localStorage` and toggles the `dark` class). But the preview cards use hardcoded dark colors:

```tsx
// Light preview card — should show light colors
<div className={`... bg-dark-card`}> // This shows dark even for light preview
```

**Fix**: Update the 3 preview cards to show actual theme previews:
- Light card: `bg-white border-gray-200` (hardcoded to always show light)
- Dark card: `bg-[#0a0a0b] border-[#27272a]` (hardcoded to always show dark)
- System card: gradient from light to dark (keep current)

The selection border (`border-primary` when active) is already correct.

**VALIDATE**: Navigate to Settings → Appearance. Preview cards should look like actual light/dark previews.

---

### Task 6: UPDATE `app/globals.css` — Scrollbar & Menu Classes

**IMPLEMENT**: Update scrollbar pseudo-element styles to use CSS variables directly (not Tailwind `@apply` with token classes, since pseudo-elements handle CSS vars better):

```css
::-webkit-scrollbar-track {
  background: var(--color-bg);
}
::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 0.25rem;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--color-text-muted);
}
```

The `@layer components` menu classes use Tailwind token classes (`bg-dark-surface`, `text-dark-text`, etc.) via `@apply` — these auto-convert since the Tailwind tokens now reference CSS vars. **No changes needed** for menu classes.

**VALIDATE**: Scroll in dark mode and light mode — scrollbar should match theme.

---

### Task 7: VERIFY Public Pages in Light Mode

**No code changes expected** — public pages (Hero, HowItWorks, FAQ, etc.) use the gold/dark brand palette intentionally. They should stay dark regardless of theme preference (they're brand pages, not app chrome).

**However**, check if public pages are wrapped in ThemeProvider. If the public layout forces dark theme, this is correct behavior. If not, consider adding `className="dark"` to the public layout wrapper to lock it to dark.

**FILE**: `app/(public)/layout.tsx`

**IMPLEMENT**: If public pages should always be dark (recommended — the gold-on-dark brand look is intentional), ensure the public layout forces dark:

```tsx
// In the public layout, force dark class
<div className="dark">
  {children}
</div>
```

Or alternatively, the public pages can use hardcoded brand colors directly (they already do via `dark-bg`, `blue-primary`, etc.).

**VALIDATE**: Toggle theme to light in settings, navigate to homepage — it should remain dark-themed.

---

### Task 8: VERIFY Auth Pages in Light Mode

**FILES**: `app/(auth-pages)/layout.tsx`, `signin/page.tsx`, `signup/page.tsx`

Auth pages use `dark-*` tokens throughout. With the CSS variable conversion, they'll automatically respond to theme. Decide:
- Should auth pages follow user theme preference? → No changes needed (CSS vars handle it)
- Should auth pages always be dark (brand consistency)? → Force dark class on auth layout

**RECOMMENDED**: Auth pages should follow user theme preference — they're functional pages, not brand showcases.

**VALIDATE**: Toggle theme, visit signin/signup — verify colors look correct in both modes.

---

## TESTING STRATEGY

### No Automated Tests

This project has no test framework configured (hackathon project). All testing is manual.

### Manual Visual Testing Matrix

Test the following pages in BOTH light and dark mode:

| Page | Route | Priority |
|------|-------|----------|
| Dashboard home | `/dashboard` | Critical |
| Settings → Appearance | `/dashboard/settings` | Critical |
| Request Feedback list | `/dashboard/request-feedback` | High |
| Submit Feedback | `/dashboard/submit-feedback` | High |
| Profile | `/dashboard/profile` | High |
| PeerPoints | `/dashboard/peerpoints` | High |
| Admin pages | `/dashboard/admin/*` | Medium |
| Onboarding | `/dashboard/onboarding` | Medium |
| Sign In | `/signin` | Medium |
| Sign Up | `/signup` | Medium |
| Homepage | `/` | Low (stays dark) |

### Edge Cases

- System theme preference: Set OS to light, select "System" in settings → app should go light
- Theme persistence: Select light theme, refresh page → should stay light (localStorage)
- Theme flicker: On page load with light theme, there should be NO flash of dark then light (ThemeContext's `beforeInteractive` script handles this)
- Toaster notifications: Trigger a toast in both themes — colors should match
- Modals/dropdowns: Open in both themes — no light bleed-through
- Disabled form inputs: Check in both themes — should be visible but dimmed

---

## VALIDATION COMMANDS

### Level 1: Build

```bash
npm run build
```

Must succeed with no errors (TS errors are already ignored via `ignoreBuildErrors: true`).

### Level 2: Dev Server

```bash
npm run dev
```

Start dev server, manually verify pages.

### Level 3: CSS Variable Verification

In browser DevTools:
1. Inspect `<html>` element — should have `class="dark"` when dark theme active
2. Inspect computed styles on body — `background-color` should be `#0a0a0b` (dark) or `#ffffff` (light)
3. Inspect a Card component — `background-color` should change when toggling theme
4. Check `document.documentElement.classList.contains('dark')` in console

### Level 4: Theme Toggle Verification

1. Navigate to `/dashboard/settings` → Appearance tab
2. Click "Light" — entire dashboard should switch to light theme immediately
3. Click "Dark" — should switch back
4. Click "System" — should follow OS preference
5. Refresh page — theme should persist (check localStorage for `theme` key)

### Level 5: Visual Regression Check

For each page in the testing matrix:
1. Open in dark mode — screenshot or visual check
2. Switch to light mode — verify all text is readable, all backgrounds are appropriate
3. Check dropdowns, modals, badges, buttons, form inputs
4. Verify no element is invisible (same color as background)

---

## ACCEPTANCE CRITERIA

- [ ] CSS custom properties defined for all 6 core tokens (bg, card, surface, border, text, text-muted) in both `:root` and `.dark`
- [ ] `tailwind.config.ts` references CSS variables instead of hardcoded hex for core tokens
- [ ] ThemeProvider wraps the app in root layout
- [ ] Theme toggle in Settings → Appearance works (light/dark/system)
- [ ] Theme persists across page refreshes
- [ ] No flash of wrong theme on page load
- [ ] All 18 identified visual bleed bugs fixed
- [ ] All dashboard pages render correctly in dark mode (no regressions)
- [ ] All dashboard pages render correctly in light mode (new)
- [ ] Public pages (homepage) remain dark-themed regardless of setting
- [ ] Toaster notifications match current theme
- [ ] Modals and dropdowns have correct backgrounds in both themes
- [ ] Form inputs (including disabled states) are visible in both themes
- [ ] `npm run build` succeeds

---

## COMPLETION CHECKLIST

- [ ] Task 1: CSS custom properties in globals.css
- [ ] Task 2: Tailwind config updated to reference CSS vars
- [ ] Task 3: Root layout with ThemeProvider + theme-aware Toaster
- [ ] Task 4: All 18 visual bleed bugs fixed (4a through 4n)
- [ ] Task 5: Settings theme selector preview cards polished
- [ ] Task 6: Scrollbar styles use CSS vars
- [ ] Task 7: Public pages verified (stay dark)
- [ ] Task 8: Auth pages verified (follow theme)
- [ ] All validation commands pass
- [ ] Manual visual testing complete for both themes

---

## AUDIT SUMMARY (Reference Data for Implementation)

### Components by Theme Pattern

**Category A: Boilerplate Dual-Theme (`dark:` prefix) — 23 files**
These already support light/dark. Fix the ones with incomplete dark overrides (Task 4).
- Form inputs: Checkbox, FileInput, InputField, Radio, RadioSm, TextArea, Label, MultiSelect, Select, Switch, DatePicker, PhoneInput
- UI: Alert, Avatar, Badge (Badge.tsx), Button (Button.tsx), Dropdown
- Images: ResponsiveImage, ThreeColumnImageGrid, TwoColumnImageGrid
- Layout: AppHeader, AppSidebar (logo switching)

**Category C: Custom Dark-Only Tokens (`dark-*`) — 42+ files**
These auto-convert to dual-theme once Tasks 1-2 are done. Zero className changes needed.
- shadcn/ui (12): Card, Badge (.tsx), Input (index), Checkbox (index), Modal, Progress, Select (index), Separator, Switch (index), Tabs, Textarea (index), Avatar (index)
- Dashboard (13): OnboardingFlow, WaitlistBanner, GettingStartedChecklist, EditProfileForm, ReviewQualityPanel, ProfileStats, QualityScoreBadge, ReviewerSignals, SignalBadges, dashboard/page, profile/page, settings/page, plus layout components
- Public (10): Hero, HowItWorks, FAQ, Problem, Comparison, CTASection, Navbar, Footer, OAuthButtons, UserDropdown
- Auth (3): signin, signup, NotificationDropdown
- CSS (1): globals.css menu classes

**Category D: Hardcoded Colors — 7 files**
These need manual attention if they should be theme-aware:
- AppSidebar: `bg-[#182B49]` — intentional brand color for sidebar, keep as-is
- ScreenRecorder: `bg-black/90` — video recording overlay, keep dark
- RecorderControls: `bg-[#1a1a2e]` — recording UI, keep dark
- RecordingDemoContent: `bg-[#0a0a1a]/95` — demo area, keep dark
- SignalBadges: inline styles — keep as accent colors
- Solution/WhyNow/UseCases/JoinWaitlist: custom palette (prussian-blue, papaya-whip) — public page brand sections, keep as-is

### Light Theme Color Palette

Recommended light palette (neutral grays that complement gold accent):

| Token | Dark Value | Light Value | Rationale |
|-------|-----------|-------------|-----------|
| `--color-bg` | `#0a0a0b` | `#ffffff` | Pure white background |
| `--color-card` | `#141416` | `#f9fafb` | Very light gray (gray-50) |
| `--color-surface` | `#1c1c1f` | `#f3f4f6` | Light gray (gray-100) |
| `--color-border` | `#27272a` | `#e5e7eb` | Gray-200 border |
| `--color-text` | `#fafafa` | `#111827` | Gray-900 text |
| `--color-text-muted` | `#71717a` | `#6b7280` | Gray-500 muted text |

---

## NOTES

### Design Decision: Keep Token Names as `dark-*`

The token names `dark-bg`, `dark-card`, etc. are now technically misleading since they represent BOTH light and dark values. However, renaming them (e.g., to `theme-bg`, `theme-card`) would require touching every component's className — a massive, risky diff with zero functional benefit. We keep the names and document that they're semantic tokens, not literal "dark" colors.

A future rename could be done as a separate cleanup PR if desired.

### Risk: Tailwind Opacity Modifiers

If any component uses `bg-dark-bg/50` (opacity modifier on a CSS variable), it won't work with hex CSS vars. This MUST be checked in Task 2 before choosing hex vs RGB format for CSS vars. If opacity modifiers are found, use the RGB channel format instead.

### Risk: Third-Party Components

Sonner (toaster), Radix UI primitives, and ApexCharts may have their own theme handling. Sonner is addressed in Task 3. Radix primitives are styled via our className props so they auto-convert. ApexCharts may need its own theme prop — check if any chart components exist and whether they need updating.

### Future Work (Out of Scope)

- Rename `dark-*` tokens to `theme-*` (separate PR)
- Add more granular tokens (e.g., `--color-hover`, `--color-focus-ring`)
- Add theme transition animations
- Per-section theme forcing (e.g., sidebar always dark)
- System preference change listener (ThemeContext already handles this)

### Confidence Score: 8/10

High confidence because:
- The CSS variable swap approach is proven (shadcn/ui standard)
- ThemeContext already works — we're just giving it a proper CSS foundation
- Most changes are in 2 files (globals.css, tailwind.config.ts) with automatic cascade
- Visual bug fixes are straightforward `dark:` override additions

Risk areas:
- Opacity modifier compatibility (must check early)
- Public pages may need explicit dark forcing
- Some hardcoded colors in boilerplate form components may be missed
