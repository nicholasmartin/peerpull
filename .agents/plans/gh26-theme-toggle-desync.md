# Feature: Fix theme toggle state desync (GH #26)

The following plan should be complete, but validate documentation and codebase patterns before implementing.

Pay special attention to naming of existing utils, types, and models. Import from the right files.

## Feature Description

The theme toggle button in the header requires an extra click to switch between light and dark mode. The root cause is a three-part state desync between the ThemeContext React state, localStorage, and the DOM `classList`. This fix makes all three sources of truth consistent at all times.

## User Story

As a PeerPull user,
I want the theme toggle to switch immediately on a single click,
So that I can seamlessly switch between light and dark mode.

## Problem Statement

Three separate desync issues combine to create the bug:

1. **ThemeProvider initializes state to `"dark"` without reading localStorage.** The inline `<Script>` correctly applies the stored theme to the DOM on page load, but React state always starts as `"dark"`. There is no `useEffect` to sync state from localStorage after mount.

2. **`toggleTheme()` toggles based on stale React state.** If the DOM is in light mode but React state is `"dark"`, the first click computes `"dark" -> "light"` (no visible change). The second click catches up.

3. **The appearance settings page bypasses ThemeContext.** It calls `document.documentElement.classList` and `localStorage.setItem` directly (lines 44-50) instead of calling `toggleTheme()`. After changing theme on that page, the header toggle is completely desynced.

Additionally, `ThemeType` includes `"system"` but no UI exposes it. The toggle button cycles between `"light"` and `"dark"` only, while `toggleTheme()` handles all three. The `"system"` path is dead code that adds unnecessary complexity.

## Solution Statement

1. Add a `useEffect` in ThemeProvider to read localStorage on mount and sync React state.
2. Remove the `"system"` theme option (unused, no UI, complicates toggle logic).
3. Simplify `ThemeType` to `"light" | "dark"` only.
4. Refactor the appearance settings page to use `toggleTheme()` from context instead of direct DOM manipulation.

## Feature Metadata

**Feature Type**: Bug Fix
**Estimated Complexity**: Low
**Primary Systems Affected**: ThemeContext, ThemeToggleButton, Appearance settings page
**Dependencies**: None

---

## CONTEXT REFERENCES

### Relevant Codebase Files (READ BEFORE IMPLEMENTING)

- `context/ThemeContext.tsx` (all 117 lines) - The ThemeProvider, ThemeType, toggleTheme, and inline script. This is the core file to modify.
- `components/header/ThemeToggleButton.tsx` (all 21 lines) - Consumes `useTheme()`. No changes needed here since it already uses `theme` and `toggleTheme()` correctly.
- `app/(protected)/dashboard/settings/appearance/page.tsx` (all 134 lines) - The appearance settings page. Lines 39-51 (`applyTheme`) bypass ThemeContext. Must be refactored to use context.
- `components/shared/ThemeDebug.tsx` - Debug component that reads localStorage theme. No changes needed but good to know it exists.

### ThemeProvider instantiation points (4 locations, all pass-through, no changes needed):
- `app/layout.tsx` line 36 - Root layout
- `app/(auth-pages)/layout.tsx` line 11 - Auth pages
- `app/(public)/layout.tsx` line 16 - Public pages
- `components/protected/dashboard/layout/DashboardShell.tsx` line 23 - Dashboard

### New Files to Create

None.

### Patterns to Follow

**Context hook pattern (from TextSizeContext.tsx for reference):**
The TextSizeContext follows a similar pattern and correctly reads from localStorage on mount. Use it as a reference.

---

## IMPLEMENTATION PLAN

### Phase 1: Fix ThemeContext (core fix)

Simplify ThemeType, add localStorage sync on mount, remove dead "system" code path.

### Phase 2: Fix appearance settings page

Remove duplicate DOM manipulation, use context's toggleTheme() instead.

### Phase 3: Validate

Build check and manual testing.

---

## STEP-BY-STEP TASKS

### Task 1: UPDATE `context/ThemeContext.tsx` - Fix state desync and simplify

- **IMPLEMENT**: Make these changes:

  1. Change `ThemeType` from `"light" | "dark" | "system"` to `"light" | "dark"` (line 7)

  2. Update the `toggleTheme` function signature to accept `ThemeType` (not optional):
     ```typescript
     const toggleTheme = (newTheme?: ThemeType) => {
     ```
     Keep the signature the same (optional param) so callers still work.

  3. In the mount `useEffect` (lines 69-71), add localStorage sync:
     ```typescript
     useEffect(() => {
       setMounted(true);
       const stored = localStorage.getItem("theme");
       if (stored === "light" || stored === "dark") {
         setTheme(stored);
       }
     }, []);
     ```

  4. Remove the `"system"` branch from `toggleTheme()` (lines 89-98). The function should only handle `"light"` and `"dark"`.

  5. Remove the `"system"` branch from the inline `themeScript` function (lines 38-45). Keep the `else` default-to-dark fallback.

  6. The final `toggleTheme` function should be:
     ```typescript
     const toggleTheme = (newTheme?: ThemeType) => {
       if (!mounted) return;
       if (!newTheme) {
         newTheme = theme === "dark" ? "light" : "dark";
       }
       setTheme(newTheme);
       if (newTheme === "dark") {
         document.documentElement.classList.add("dark");
         localStorage.setItem("theme", "dark");
       } else {
         document.documentElement.classList.remove("dark");
         localStorage.setItem("theme", "light");
       }
     };
     ```

  7. The final inline `themeScript` should be:
     ```typescript
     const themeScript = (isProtected: boolean) => {
       const scriptContent = `
         (function() {
           try {
             var storedTheme = localStorage.getItem('theme');
             if (storedTheme === 'light') {
               document.documentElement.classList.remove('dark');
             } else {
               document.documentElement.classList.add('dark');
               if (!storedTheme) localStorage.setItem('theme', 'dark');
             }
           } catch (e) {
             console.error('Error in theme script:', e);
           }
         })();
       `;
       return scriptContent;
     };
     ```
     Note: The `isProtected` parameter is no longer used in the script body. Keep the parameter in the function signature to avoid changing the 4 call sites, but simplify the script logic. Alternatively, remove the parameter and update call sites if preferred.

- **GOTCHA**: The inline script runs before React hydration. It must NOT reference any React state. It only reads localStorage and sets the `dark` class. React state sync happens in the `useEffect`.
- **GOTCHA**: Do NOT remove the `isProtected` prop from `ThemeProviderProps` unless you also update all 4 instantiation points. Safest to keep the prop and just not use it in the simplified script.
- **VALIDATE**: `npm run build`

### Task 2: UPDATE `app/(protected)/dashboard/settings/appearance/page.tsx` - Use ThemeContext

- **IMPLEMENT**: Refactor to use context instead of direct DOM/localStorage manipulation:

  1. Change the destructured import from `{ toggleTheme }` to `{ theme, toggleTheme }` (line 13):
     ```typescript
     const { theme, toggleTheme } = useTheme();
     ```

  2. Remove the local `selectedTheme` state and its `useEffect` sync (lines 15, 19-26). Use `theme` from context directly instead:
     - Replace all references to `selectedTheme` with `theme`
     - Remove: `const [selectedTheme, setSelectedTheme] = useState<"light" | "dark">("dark");`
     - Remove the `useEffect` lines that read localStorage for theme (keep the ones for textSize and mounted)

  3. Replace the `applyTheme` function (lines 39-51) with a simple call to context:
     ```typescript
     const applyTheme = (newTheme: "light" | "dark") => {
       if (!mounted) return;
       toggleTheme(newTheme);
     };
     ```

  4. In the JSX, replace `selectedTheme` references with `theme` for the border highlighting:
     - Line 71: `selectedTheme === "light"` becomes `theme === "light"`
     - Line 82: `selectedTheme === "dark"` becomes `theme === "dark"`

- **GOTCHA**: Keep the `mounted` guard to prevent hydration issues.
- **GOTCHA**: The `useEffect` for `textSize` must remain unchanged. Only remove theme-related state and effects.
- **VALIDATE**: `npm run build`

---

## TESTING STRATEGY

### Manual Testing (No test framework configured)

**Test 1: Fresh load default**
1. Clear localStorage (DevTools > Application > Storage > Clear)
2. Reload the page
3. Confirm dark mode is applied (default)
4. Confirm header shows Moon icon

**Test 2: Header toggle (single click)**
1. Click the theme toggle in the header
2. Confirm it switches to light mode immediately (single click)
3. Click again, confirm it switches back to dark mode (single click)
4. Repeat 5 times rapidly to ensure no desync

**Test 3: Appearance settings page**
1. Go to Settings > Appearance
2. Click the Light theme card
3. Confirm the page switches to light mode and the Light card has a primary border
4. Navigate to the dashboard
5. Confirm the header toggle shows Sun icon (light mode)
6. Click the header toggle once
7. Confirm it switches to dark mode immediately (no extra click)

**Test 4: Cross-page persistence**
1. Set theme to light via header toggle
2. Navigate to different pages (dashboard, profile, peerpoints)
3. Confirm light theme persists across all pages
4. Reload the page
5. Confirm light theme is restored from localStorage

**Test 5: Settings page then header toggle (the original bug)**
1. Start in dark mode
2. Go to Settings > Appearance, click Light
3. Go back to dashboard
4. Click the header Moon/Sun toggle
5. Confirm dark mode applies on the FIRST click (this was the original bug)

### Edge Cases

- Clear localStorage while on a page, then click toggle (should default to toggling from dark)
- Switch theme rapidly between settings page and header toggle
- Open app in two tabs, change theme in one, reload the other

---

## VALIDATION COMMANDS

### Level 1: Build Check
```bash
npm run build
```

### Level 4: Manual Validation
Follow the 5 test scenarios above.

---

## ACCEPTANCE CRITERIA

- [ ] Theme toggle switches on a single click every time (no extra clicks needed)
- [ ] ThemeContext React state is synced from localStorage on mount
- [ ] `"system"` theme option is removed (no UI exposes it)
- [ ] Appearance settings page uses `toggleTheme()` from context (no direct DOM manipulation)
- [ ] Theme persists across page navigation and reload
- [ ] Switching theme on the settings page keeps the header toggle in sync
- [ ] `npm run build` passes
- [ ] No regressions in existing theme behavior

---

## COMPLETION CHECKLIST

- [ ] Task 1: ThemeContext fixed (localStorage sync, simplified type, removed "system")
- [ ] Task 2: Appearance page refactored to use context
- [ ] Build passes
- [ ] All 5 manual test scenarios pass

---

## NOTES

**Why remove "system" instead of fixing it:**
No UI in PeerPull exposes a "system" theme option. The toggle button cycles between light/dark only. The appearance settings page only shows light/dark cards. The "system" code path is dead code that adds a third state to what should be a binary toggle, making desync bugs more likely. If system theme support is wanted in the future, it can be re-added with proper UI.

**Why keep `isProtected` parameter:**
The `isProtected` prop is passed by all 4 ThemeProvider instantiation points. Removing it would require updating 4 files for no functional benefit. The simplified inline script no longer uses it, but keeping the parameter avoids unnecessary churn. It can be cleaned up in a future refactor pass.

**The inline script is intentionally simple:**
The `<Script strategy="beforeInteractive">` runs before React hydrates. It cannot access React state. Its only job is to prevent a flash of wrong theme on page load. React state is synced afterward via `useEffect`. These two mechanisms must not conflict.
