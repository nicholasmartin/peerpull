# Feature: User-Configurable Text Size Preference (GH #16)

The following plan should be complete, but its important that you validate documentation and codebase patterns and task sanity before you start implementing.

Pay special attention to naming of existing utils, types, and models. Import from the right files etc.

## Feature Description

The `/dashboard/settings/appearance` page already displays a Font Size selector UI (Small / Medium / Large) but it is purely visual with no functionality. This feature makes it a real, persisted user preference that scales text across the entire dashboard by adjusting the root `font-size` on `<html>`, letting all `rem`-based Tailwind utilities scale automatically.

## User Story

As a PeerPull user
I want to choose my preferred text size (small, medium, or large)
So that the dashboard is comfortable to read on my device and eyesight

## Problem Statement

The appearance settings page has a non-functional font size selector. Users cannot customize text size, which is an accessibility concern and a quality-of-life feature for users with different screen sizes or visual preferences.

## Solution Statement

Mirror the existing `ThemeContext` pattern to create a `TextSizeContext` that:
1. Stores the user's text size preference in `localStorage` (key: `textSize`)
2. Applies a `data-text-size` attribute to `<html>` on page load via an inline script (avoiding FOUC)
3. Uses CSS rules in `globals.css` to set root `font-size` based on the attribute value
4. Wires up the existing appearance page UI to read/write the preference in real-time

Since all Tailwind font-size utilities (`text-xs` = `0.75rem`, `text-sm` = `0.875rem`, `text-base` = `1rem`, etc.) and the custom `text-title-*`/`text-theme-*` scales in `tailwind.config.ts` are `rem`-based, changing the root `font-size` scales everything proportionally without per-component changes.

## Feature Metadata

**Feature Type**: Enhancement
**Estimated Complexity**: Low
**Primary Systems Affected**: Appearance settings page, ThemeContext/layout, globals.css
**Dependencies**: None (localStorage-only, no new packages)

---

## CONTEXT REFERENCES

### Relevant Codebase Files (MUST READ BEFORE IMPLEMENTING)

- `context/ThemeContext.tsx` (all, especially lines 23-58 and 60-109) - Why: **Primary reference pattern.** The inline script approach, localStorage persistence, context provider structure, and `useTheme` hook are all patterns to mirror exactly.
- `app/(protected)/dashboard/settings/appearance/page.tsx` (all) - Why: **Target file to modify.** Contains the dummy font size selector (lines 79-104) and the working theme toggle (lines 26-38, 52-74). The font size selector needs to be wired up with state, click handlers, and active styling.
- `app/globals.css` (lines 5-28) - Why: CSS custom properties and base body styles. The `data-text-size` CSS rules will be added here alongside the existing theme color variables.
- `app/layout.tsx` (lines 29-57) - Why: Root layout where `ThemeProvider` wraps the app (line 35). The new `TextSizeProvider` must be added here in the same nesting pattern.
- `components/protected/dashboard/layout/DashboardShell.tsx` (all) - Why: Dashboard wrapper that adds a second `ThemeProvider` with `isProtected={true}` (line 23). **Do NOT add TextSizeProvider here** since the root layout already covers it.
- `tailwind.config.ts` (lines 89-105) - Why: Custom `fontSize` extensions are all `rem`-based, confirming the root font-size scaling approach works for all text utilities.
- `context/SidebarContext.tsx` - Why: Secondary reference for context pattern (simpler than ThemeContext, shows the `useContext` + hook export pattern).

### New Files to Create

- `context/TextSizeContext.tsx` - Context provider, inline script, and `useTextSize` hook

### Files to Modify

- `app/globals.css` - Add `data-text-size` CSS rules for root font-size scaling
- `app/layout.tsx` - Wrap children with `TextSizeProvider`
- `app/(protected)/dashboard/settings/appearance/page.tsx` - Wire up font size selector with real state and persistence

### Patterns to Follow

**Context Pattern (from ThemeContext.tsx):**
```tsx
// 1. Type definition
type TextSizeType = "sm" | "md" | "lg";

// 2. Context with hook
const TextSizeContext = createContext<...>(undefined);
export const useTextSize = () => { ... };

// 3. Inline script for FOUC prevention (runs before React hydration)
const textSizeScript = `
  (function() {
    try {
      const stored = localStorage.getItem('textSize');
      const size = (stored === 'sm' || stored === 'lg') ? stored : 'md';
      document.documentElement.setAttribute('data-text-size', size);
    } catch (e) {}
  })();
`;

// 4. Provider with Script component
export const TextSizeProvider = ({ children }) => (
  <>
    <Script id="text-size-script" strategy="beforeInteractive" ... />
    <TextSizeContext.Provider value={...}>
      {children}
    </TextSizeContext.Provider>
  </>
);
```

**Naming Conventions:**
- Context file: `context/TextSizeContext.tsx` (PascalCase, matches ThemeContext.tsx)
- Hook: `useTextSize` (matches `useTheme`, `useSidebar`)
- localStorage key: `textSize` (camelCase, matches `theme`)
- HTML attribute: `data-text-size` (kebab-case data attribute)
- CSS values: `sm`, `md`, `lg` (short, matches Tailwind sizing convention)

**State Management Pattern (from appearance page):**
```tsx
// Mirror the theme toggle pattern:
const [selectedSize, setSelectedSize] = useState<TextSizeType>("md");
const { setTextSize } = useTextSize();

// Apply immediately on click (no separate "Save" needed for text size)
const applyTextSize = (size: TextSizeType) => {
  setSelectedSize(size);
  setTextSize(size);
};
```

---

## IMPLEMENTATION PLAN

### Phase 1: CSS Foundation

Add CSS rules to `globals.css` that respond to the `data-text-size` attribute on `<html>`. These rules adjust the root `font-size`, which scales all `rem`-based values.

**Size scale:**
- `sm` = `14px` (87.5% of default)
- `md` = `16px` (browser default, no override needed)
- `lg` = `18px` (112.5% of default)

### Phase 2: Context + Inline Script

Create `TextSizeContext.tsx` mirroring `ThemeContext.tsx`:
- Inline script sets `data-text-size` attribute before paint
- Context provides `textSize` state and `setTextSize` function
- `setTextSize` updates localStorage, DOM attribute, and React state

### Phase 3: Provider Integration

Add `TextSizeProvider` to the root layout, wrapping alongside `ThemeProvider`.

### Phase 4: Wire Up Appearance Page

Update the appearance page to:
- Import and use `useTextSize`
- Make font size cards clickable with active state
- Apply selection immediately on click
- Read stored preference on mount

---

## STEP-BY-STEP TASKS

### Task 1: UPDATE `app/globals.css` - Add text size CSS rules

- **IMPLEMENT**: Add `data-text-size` attribute selectors inside the existing `@layer base` block, after the `.dark` color definitions (after line 24). Only override for `sm` and `lg` since `md` is the browser default (16px).
- **PATTERN**: Mirror how `.dark` class overrides CSS variables (lines 17-24)
- **ADD** the following CSS after line 24 (before the `body` rule):

```css
  /* Text size preference — adjusts root font-size so all rem values scale */
  html[data-text-size="sm"] { font-size: 14px; }
  /* md = 16px (browser default, no override needed) */
  html[data-text-size="lg"] { font-size: 18px; }
```

- **GOTCHA**: Place these inside `@layer base` so they have the correct specificity. Do NOT use `!important`.
- **VALIDATE**: `npm run build` should succeed. Manually inspect that adding `data-text-size="lg"` to `<html>` in browser DevTools makes all text larger.

### Task 2: CREATE `context/TextSizeContext.tsx` - Text size context provider

- **IMPLEMENT**: Create a new context file mirroring `context/ThemeContext.tsx` structure.
- **PATTERN**: `context/ThemeContext.tsx` (lines 1-118), specifically:
  - Inline script pattern (lines 23-58)
  - Provider pattern (lines 60-109)
  - Hook export pattern (lines 111-117)
- **IMPORTS**: `React`, `createContext`, `useContext`, `useState`, `useEffect` from "react"; `Script` from "next/script"

The context should expose:
```typescript
type TextSizeType = "sm" | "md" | "lg";

type TextSizeContextType = {
  textSize: TextSizeType;
  setTextSize: (size: TextSizeType) => void;
};
```

Key implementation details:
1. **Inline script** (runs before paint):
   - Read `localStorage.getItem('textSize')`
   - Validate it is `sm`, `md`, or `lg` (default to `md` if invalid/missing)
   - Set `document.documentElement.setAttribute('data-text-size', size)`
   - For `md`, either set the attribute or remove it (setting it is simpler for consistency)

2. **`setTextSize` function:**
   - Update React state
   - Set `document.documentElement.setAttribute('data-text-size', newSize)`
   - `localStorage.setItem('textSize', newSize)`

3. **Initial state:** Read from localStorage in a `useEffect` after mount (like ThemeContext lines 69-71), default to `"md"`.

4. **`useTextSize` hook:** Throw error if used outside provider (like `useTheme` pattern).

- **GOTCHA**: Use `strategy="beforeInteractive"` on the Script component so the attribute is set before first paint, preventing a flash of default-sized text.
- **VALIDATE**: `npm run build` should succeed with no TypeScript errors.

### Task 3: UPDATE `app/layout.tsx` - Add TextSizeProvider

- **IMPLEMENT**: Import `TextSizeProvider` from `@/context/TextSizeContext` and wrap it around the existing provider tree.
- **PATTERN**: `app/layout.tsx` lines 35-38 (how ThemeProvider wraps SidebarProvider)
- **IMPORTS**: `import { TextSizeProvider } from "@/context/TextSizeContext";`

Place `TextSizeProvider` either inside or outside `ThemeProvider` (order does not matter since they are independent). Recommended: inside ThemeProvider, wrapping SidebarProvider:

```tsx
<ThemeProvider>
  <TextSizeProvider>
    <SidebarProvider>
      {children}
    </SidebarProvider>
  </TextSizeProvider>
  <Toaster ... />
</ThemeProvider>
```

- **GOTCHA**: Do NOT add `TextSizeProvider` to `DashboardShell.tsx`. The root layout already covers all routes. DashboardShell adds a second ThemeProvider for `isProtected` logic, but text size has no equivalent need.
- **VALIDATE**: `npm run build` should succeed. Dev server should show no hydration warnings.

### Task 4: UPDATE `app/(protected)/dashboard/settings/appearance/page.tsx` - Wire up font size selector

- **IMPLEMENT**: Make the font size cards interactive using the `useTextSize` hook.
- **PATTERN**: Mirror the theme toggle implementation already in the same file (lines 13-38, 52-74)
- **IMPORTS**: Add `import { useTextSize } from "@/context/TextSizeContext";`

Changes needed:

1. **Add state and hook** (near existing state declarations, ~line 13):
```tsx
const { textSize, setTextSize } = useTextSize();
const [selectedSize, setSelectedSize] = useState<"sm" | "md" | "lg">("md");
```

2. **Initialize from stored preference** (in existing useEffect, ~line 16-24):
```tsx
// Add to existing useEffect after theme initialization:
const storedSize = localStorage.getItem("textSize");
if (storedSize === "sm" || storedSize === "md" || storedSize === "lg") {
  setSelectedSize(storedSize);
}
```

3. **Add apply function** (after `applyTheme`, ~line 38):
```tsx
const applyTextSize = (size: "sm" | "md" | "lg") => {
  if (!mounted) return;
  setSelectedSize(size);
  setTextSize(size);
};
```

4. **Make font size cards clickable** (lines 82-103): Add `onClick` handlers and dynamic `border-primary`/`border-dark-border` based on `selectedSize` (same pattern as theme cards at lines 57-73).

Replace the three static card divs with dynamic versions:
- Small card: `onClick={() => applyTextSize("sm")}`, border: `selectedSize === "sm" ? "border-primary" : "border-dark-border"`
- Medium card: `onClick={() => applyTextSize("md")}`, border: `selectedSize === "md" ? "border-primary" : "border-dark-border"`
- Large card: `onClick={() => applyTextSize("lg")}`, border: `selectedSize === "lg" ? "border-primary" : "border-dark-border"`

5. **Add cursor-pointer** to each font size card wrapper div (like the theme cards have at line 56).

- **GOTCHA**: The "Save Preferences" button (line 106-108) currently does nothing. For this feature, text size applies immediately on click (same as theme). The button can remain as-is for now; it is out of scope to wire it for other future settings.
- **GOTCHA**: The Medium card currently has a hardcoded `border-primary` (line 91). This must become dynamic based on `selectedSize`.
- **VALIDATE**: `npm run build` should succeed. Manual testing: click each size option and verify text scales across the dashboard. Refresh the page and verify the selection persists.

---

## TESTING STRATEGY

No test framework is configured (hackathon project). Validation is manual.

### Manual Test Cases

1. **Default state:** Fresh browser (clear localStorage) loads with medium text (16px root). The Medium card should show `border-primary`.
2. **Switch to Small:** Click Small card. All dashboard text should visibly shrink. Root `font-size` should be `14px` in DevTools.
3. **Switch to Large:** Click Large card. All dashboard text should visibly grow. Root `font-size` should be `18px` in DevTools.
4. **Persistence:** After selecting Large, refresh the page. Large should still be selected and text should be large immediately (no flash).
5. **Theme independence:** Switching theme (light/dark) should not reset text size. Switching text size should not reset theme.
6. **Navigation:** After setting a size, navigate to other dashboard pages. Text size should persist across all pages.
7. **Public pages:** Visit the landing page. Text size should apply there too (since the provider is in root layout). Verify it looks acceptable.

### Edge Cases

- **Invalid localStorage value:** Manually set `localStorage.setItem('textSize', 'invalid')` in console. Page should default to medium.
- **No localStorage:** In private/incognito mode, should default to medium and work fine (just won't persist after closing).

---

## VALIDATION COMMANDS

### Level 1: Build Check

```bash
npm run build
```

Must complete with zero errors (note: `ignoreBuildErrors: true` is set, but we should still verify no new warnings).

### Level 2: Dev Server Smoke Test

```bash
npm run dev
```

1. Navigate to `/dashboard/settings/appearance`
2. Click each font size option
3. Verify text scales in real-time
4. Refresh and verify persistence

### Level 3: Cross-Page Verification

After setting a text size:
1. Navigate to `/dashboard` (main dashboard)
2. Navigate to `/dashboard/profile`
3. Navigate to `/dashboard/peerpoints`
4. Verify consistent text scaling on all pages

### Level 4: DevTools Verification

1. Open browser DevTools > Elements
2. Inspect `<html>` element
3. Verify `data-text-size` attribute is present and correct
4. Verify computed `font-size` on `<html>` matches expected value (14/16/18px)

---

## ACCEPTANCE CRITERIA

- [ ] Clicking Small/Medium/Large on appearance page changes text size immediately
- [ ] Active selection shows `border-primary` highlight (matches theme toggle pattern)
- [ ] Text size persists across page refreshes via localStorage
- [ ] No flash of wrong text size on page load (inline script prevents FOUC)
- [ ] All dashboard pages reflect the chosen text size
- [ ] Theme toggle and text size toggle work independently
- [ ] Default is Medium (16px) when no preference is stored
- [ ] Invalid localStorage values gracefully fall back to Medium
- [ ] `npm run build` passes
- [ ] No hydration warnings in dev console

---

## COMPLETION CHECKLIST

- [ ] Task 1: CSS rules added to globals.css
- [ ] Task 2: TextSizeContext.tsx created with provider, script, and hook
- [ ] Task 3: TextSizeProvider added to root layout
- [ ] Task 4: Appearance page font size selector wired up
- [ ] All manual test cases pass
- [ ] Build succeeds
- [ ] No console errors or hydration warnings

---

## NOTES

- **No database migration needed for v1.** The issue mentions an optional `text_size_preference` column on the `profiles` table for cross-device sync. This is explicitly deferred. localStorage is sufficient for the initial implementation and matches how theme preference works today.
- **Public pages are affected.** Since `TextSizeProvider` is in the root layout, the text size preference applies to landing pages and auth pages too. This is acceptable because the sizing is subtle (14-18px range) and the landing page already uses larger heading sizes that scale well.
- **Fixed `px` values do not scale.** Icon sizes (e.g., `h-6 w-6`), specific pixel dimensions, and padding/margin in `px` will not change. This is intentional and desirable; only text content should scale.
- **The custom `text-title-*` and `text-theme-*` scales** defined in `tailwind.config.ts` (lines 89-105) are all `rem`-based, so they scale correctly with this approach.
- **The "Save Preferences" button** on the appearance page is not wired to anything currently. Text size (like theme) applies immediately on click. Wiring the save button for a "save all settings" flow is a separate concern.
