# Feature: Phase 6.2 - Chrome Extension Core

The following plan should be complete, but its important that you validate documentation and codebase patterns and task sanity before you start implementing.

Pay special attention to naming of existing utils types and models. Import from the right files etc.

## Feature Description

Build the PeerPull Companion Chrome extension shell with authentication, side panel UI, tab capture recording, and video upload capability. This is the core extension infrastructure that Phase 6.3 (review flows) and Phase 6.4 (shareable pages) build upon. The extension uses Chrome's Side Panel API for a persistent review companion, `chrome.tabCapture` for zero-friction recording (no screen picker dialog), and communicates with the Phase 6.1 API layer for auth verification, settings, and video uploads.

## User Story

As a PeerPull reviewer,
I want to install a Chrome extension that lets me log in, see my stats, and record a tab with my microphone,
So that I can prepare for giving feedback directly from the product's website without navigating to the PeerPull dashboard.

## Problem Statement

The current recording experience requires users to navigate to the PeerPull dashboard, go through multiple steps, and deal with browser screen-picker dialogs. This creates friction that reduces review completion rates. The extension eliminates the screen picker dialog entirely by using `chrome.tabCapture`, and provides a persistent side panel that stays open across tab navigation.

## Solution Statement

Build a Chrome Manifest V3 extension using **WXT** (Vite-based framework), **React 19**, and **TailwindCSS** in an `extension/` directory within the existing monorepo. The extension provides:
1. A side panel with login form and authenticated home screen (points, quality score, notifications badge)
2. Tab capture recording via `chrome.tabCapture.getMediaStreamId()` with an offscreen document for `MediaRecorder`
3. Recording controls (start, pause/resume, stop, abandon) with a progress bar enforcing min/max duration
4. Post-recording video preview with redo option
5. Video upload to Supabase Storage via signed URLs from the Phase 6.1 API

## Feature Metadata

**Feature Type**: New Capability
**Estimated Complexity**: High
**Primary Systems Affected**: New `extension/` directory (Chrome extension), existing API routes (consumers only)
**Dependencies**: WXT (new), Phase 6.1 API layer (existing), Supabase Auth + Storage (existing), TailwindCSS (new instance for extension)

---

## CONTEXT REFERENCES

### Relevant Codebase Files IMPORTANT: YOU MUST READ THESE FILES BEFORE IMPLEMENTING!

- `hooks/useScreenRecorder.ts` - Why: The existing web app recording logic. The extension mirrors this pattern (codec selection via `getSupportedMimeType()`, `AudioContext` mixing of tab audio + mic, `MediaRecorder` with 1-second timeslice, duration timer, warning threshold). The extension version uses `chrome.tabCapture` instead of `getDisplayMedia`.
- `utils/supabase/api-client.ts` - Why: Shows the API authentication pattern (Bearer token). The extension's API client must send the same `Authorization: Bearer <jwt>` header.
- `types/api.ts` - Why: Zod schemas for API payloads. The extension should use the same type definitions (or a compatible subset) for type safety.
- `app/api/v1/auth/verify/route.ts` - Why: The auth verification endpoint the extension calls on launch to validate the stored JWT and fetch profile data.
- `app/api/v1/upload/signed-url/route.ts` - Why: The endpoint the extension calls to get a signed URL for video upload.
- `app/api/v1/settings/route.ts` - Why: The endpoint the extension calls to fetch `min_video_duration`, `max_video_duration`, `review_reward`, `platform_launched`.
- `tailwind.config.ts` - Why: Contains the main app's color tokens and design system. The extension's Tailwind config should replicate the dark theme tokens for visual consistency.
- `app/globals.css` (lines 1-62) - Why: CSS custom properties for the theme system. The extension side panel needs the dark theme CSS vars.
- `.claude/PRD-extension-growth.md` (sections 7.1, 7.2, 8, 9, 12 Phase 2, 15) - Why: Full specification for side panel states, recording system, tech stack, security, manifest skeleton.

### New Files to Create

```
extension/
├── .gitignore                          # node_modules, dist, .output, .wxt
├── package.json                        # Extension dependencies (wxt, react, tailwindcss, etc.)
├── tsconfig.json                       # TypeScript config
├── wxt.config.ts                       # WXT framework config
├── tailwind.config.ts                  # TailwindCSS config (mirrors main app tokens)
├── assets/
│   └── styles.css                      # Tailwind directives + dark theme CSS vars
├── entrypoints/
│   ├── sidepanel/
│   │   ├── index.html                  # Side panel HTML entry
│   │   ├── main.tsx                    # React root mount
│   │   ├── App.tsx                     # Main app component (router between states)
│   │   ├── components/
│   │   │   ├── AuthGate.tsx            # Login form (email/password)
│   │   │   ├── HomeScreen.tsx          # Authenticated idle state (points, score, actions)
│   │   │   ├── RecordingPanel.tsx      # Recording controls + progress bar
│   │   │   ├── PreviewPanel.tsx        # Post-recording video preview
│   │   │   ├── StatusBar.tsx           # Points, quality score, notification badge
│   │   │   └── UploadProgress.tsx      # Upload progress indicator
│   │   └── hooks/
│   │       ├── useAuth.ts             # Auth state management (login, logout, token refresh)
│   │       └── useRecording.ts        # Recording state machine (coordinates with background)
│   ├── background.ts                   # Service worker (tabCapture, offscreen doc, auth token mgmt)
│   ├── offscreen.html                  # Offscreen document HTML (minimal)
│   ├── offscreen.ts                    # MediaRecorder logic (receives stream ID, records, returns blob)
│   └── content.ts                      # Content script (metadata extraction, used in Phase 6.3)
├── lib/
│   ├── api.ts                          # API client (fetch wrapper with auth headers)
│   ├── storage.ts                      # chrome.storage helpers (tokens, settings cache, preferences)
│   ├── messages.ts                     # Message type definitions for inter-context communication
│   └── constants.ts                    # API base URL, storage keys, default values
└── public/
    └── icons/                          # Extension icons (16, 32, 48, 128px)
        ├── icon-16.png
        ├── icon-32.png
        ├── icon-48.png
        └── icon-128.png
```

### Relevant Documentation YOU SHOULD READ THESE BEFORE IMPLEMENTING!

- [WXT Framework Documentation](https://wxt.dev/guide/essentials/entrypoints.html)
  - Entrypoints, side panel setup, background service worker, offscreen documents
  - Why: WXT is the build framework. Understanding file-based entrypoints is critical.
- [WXT React Module](https://wxt.dev/guide/essentials/frontend-frameworks)
  - React integration setup
  - Why: Configuring React 19 with WXT
- [chrome.tabCapture API](https://developer.chrome.com/docs/extensions/reference/api/tabCapture)
  - `getMediaStreamId()` method
  - Why: Core recording mechanism. Must use `getMediaStreamId()` pattern (not `capture()`) for MV3.
- [Chrome Screen Capture Guide (MV3)](https://developer.chrome.com/docs/extensions/how-to/web-platform/screen-capture)
  - Offscreen document pattern for recording
  - Why: Shows the 3-component architecture (service worker + offscreen doc + UI)
- [chrome.sidePanel API](https://developer.chrome.com/docs/extensions/reference/api/sidePanel)
  - Side panel configuration and behavior
  - Why: Side panel setup and programmatic opening
- [chrome.offscreen API](https://developer.chrome.com/docs/extensions/reference/api/offscreen)
  - Creating and managing offscreen documents
  - Why: The offscreen document hosts MediaRecorder since service workers suspend
- [Supabase JS Client Auth](https://supabase.com/docs/reference/javascript/auth-signinwithpassword)
  - `signInWithPassword()`, token management
  - Why: Extension auth flow uses Supabase client directly

### Patterns to Follow

**API Response Format (from Phase 6.1):**
```typescript
// Success: { data: { ... }, meta: { timestamp: "..." } }
// Error: { error: { code: "...", message: "..." } }
```

**Codec Selection (from useScreenRecorder.ts):**
```typescript
function getSupportedMimeType(): string {
  const types = [
    "video/webm;codecs=vp9,opus",
    "video/webm;codecs=vp8,opus",
    "video/webm;codecs=vp9",
    "video/webm;codecs=vp8",
    "video/webm",
  ];
  for (const type of types) {
    if (MediaRecorder.isTypeSupported(type)) return type;
  }
  return "";
}
```

**Audio Mixing Pattern (from useScreenRecorder.ts lines 148-166):**
```typescript
const audioContext = new AudioContext();
const destination = audioContext.createMediaStreamDestination();
// Mix tab audio
audioContext.createMediaStreamSource(tabAudioStream).connect(destination);
// Mix microphone audio
audioContext.createMediaStreamSource(micStream).connect(destination);
// Combine video + merged audio
const combinedStream = new MediaStream([
  ...tabStream.getVideoTracks(),
  ...destination.stream.getAudioTracks(),
]);
```

**Dark Theme CSS Variables (from globals.css):**
```css
:root {
  --color-bg: 10 10 11;
  --color-card: 20 20 22;
  --color-surface: 28 28 31;
  --color-border: 39 39 42;
  --color-text: 250 250 250;
  --color-text-muted: 113 113 122;
}
```

**Naming Conventions:**
- Files: kebab-case for utilities (`api.ts`, `storage.ts`), PascalCase for React components (`AuthGate.tsx`)
- TypeScript: camelCase for variables/functions, PascalCase for types/interfaces
- Message types: UPPER_SNAKE_CASE for action constants (`START_RECORDING`, `STOP_RECORDING`)
- Storage keys: camelCase strings (`authTokens`, `settingsCache`, `userPreferences`)

**Inter-Context Messaging Pattern:**
```typescript
// messages.ts - Shared message type definitions
type MessageAction =
  | { type: "START_RECORDING"; tabId: number; micDeviceId?: string }
  | { type: "STOP_RECORDING" }
  | { type: "PAUSE_RECORDING" }
  | { type: "RESUME_RECORDING" }
  | { type: "RECORDING_STARTED" }
  | { type: "RECORDING_STOPPED"; blobUrl: string; duration: number }
  | { type: "RECORDING_ERROR"; error: string }
  | { type: "GET_METADATA" }
  | { type: "METADATA_RESULT"; data: PageMetadata };
```

---

## IMPLEMENTATION PLAN

### Phase 1: Project Scaffolding

Set up the WXT project with React, TailwindCSS, and the extension manifest. Establish the directory structure, build pipeline, and verify the extension loads in Chrome.

**Tasks:**
- Initialize WXT project in `extension/` directory
- Configure React 19 module
- Set up TailwindCSS with PeerPull's dark theme tokens
- Create manifest with required permissions (tabCapture, sidePanel, storage, activeTab, offscreen)
- Generate placeholder extension icons from the existing PeerPull icon
- Verify extension loads in Chrome as unpacked

### Phase 2: Shared Infrastructure

Create the API client, chrome.storage helpers, message type definitions, and constants that all extension contexts (side panel, background, offscreen, content) will use.

**Tasks:**
- Create API client with auth header injection
- Create chrome.storage helpers for token persistence and settings cache
- Define inter-context message types
- Create constants file (API URL, storage keys)

### Phase 3: Authentication

Build the side panel login form and auth state management. The extension uses Supabase's `signInWithPassword()` directly and stores tokens in `chrome.storage.local`. On launch, it verifies the stored token via the `/api/v1/auth/verify` endpoint.

**Tasks:**
- Create `useAuth` hook for login/logout/token management
- Build `AuthGate` component (email/password form)
- Build `StatusBar` component (points, quality score, notification badge)
- Build `HomeScreen` component (authenticated idle state)
- Wire up `App.tsx` as state router (logged out vs logged in)

### Phase 4: Recording Infrastructure

Implement the 3-component recording architecture: side panel UI sends messages to the background service worker, which coordinates `chrome.tabCapture.getMediaStreamId()` and the offscreen document where `MediaRecorder` runs.

**Tasks:**
- Create background service worker with tabCapture coordination
- Create offscreen document with MediaRecorder logic
- Create `useRecording` hook in side panel for recording state machine
- Build `RecordingPanel` component (controls, timer, progress bar)
- Build `PreviewPanel` component (video preview, redo/continue)

### Phase 5: Video Upload

Implement video upload from the extension to Supabase Storage via signed URLs. The offscreen document generates a Blob, passes it to the side panel, which requests a signed URL from the API and uploads.

**Tasks:**
- Implement signed URL request and direct upload logic
- Build `UploadProgress` component
- Handle upload errors with retry and blob preservation

### Phase 6: Polish & Distribution

Final integration, error handling, and self-hosted distribution setup.

**Tasks:**
- Wire all components together in the App state machine
- Add notification badge polling (every 60 seconds)
- Settings cache with 24-hour TTL
- Create loading/error states for all async operations
- Build the extension for distribution (unpacked or .crx)
- Write installation instructions

---

## STEP-BY-STEP TASKS

IMPORTANT: Execute every task in order, top to bottom. Each task is atomic and independently testable.

### Task 1: CREATE extension project scaffolding

- **IMPLEMENT**: Initialize the WXT project in the `extension/` directory:
  ```bash
  cd extension
  npm create wxt@latest . -- --template react
  ```
  If the interactive template doesn't work, manually create the project:
  1. Create `extension/package.json` with dependencies
  2. Create `extension/wxt.config.ts`
  3. Create `extension/tsconfig.json`
- **DEPENDENCIES** to install:
  ```json
  {
    "dependencies": {
      "@supabase/supabase-js": "latest",
      "react": "19.0.0",
      "react-dom": "19.0.0",
      "lucide-react": "^0.468.0",
      "clsx": "^2.1.1",
      "tailwind-merge": "^2.5.2"
    },
    "devDependencies": {
      "wxt": "latest",
      "@wxt-dev/module-react": "latest",
      "typescript": "5.7.2",
      "@types/react": "^19.0.2",
      "@types/react-dom": "19.0.2",
      "@types/chrome": "latest",
      "tailwindcss": "3.4.17",
      "autoprefixer": "10.4.20",
      "postcss": "8.4.49"
    }
  }
  ```
- **IMPLEMENT** `extension/wxt.config.ts`:
  ```typescript
  import { defineConfig } from "wxt";

  export default defineConfig({
    modules: ["@wxt-dev/module-react"],
    manifest: {
      name: "PeerPull Companion",
      version: "0.1.0",
      description: "Record and share product feedback in seconds.",
      permissions: [
        "tabCapture",
        "activeTab",
        "sidePanel",
        "storage",
        "offscreen",
      ],
      side_panel: {
        default_path: "sidepanel/index.html",
      },
      action: {
        default_title: "PeerPull Companion",
      },
    },
    runner: {
      startUrls: ["https://peerpull.com"],
    },
  });
  ```
- **IMPLEMENT** `extension/tsconfig.json`:
  ```json
  {
    "extends": "./.wxt/tsconfig.json",
    "compilerOptions": {
      "jsx": "react-jsx",
      "strict": true,
      "skipLibCheck": true,
      "baseUrl": ".",
      "paths": {
        "@/*": ["./*"]
      }
    }
  }
  ```
- **GOTCHA**: WXT generates its own tsconfig base in `.wxt/`. Your tsconfig must extend it. Do NOT copy the main app's tsconfig; the extension has its own module resolution.
- **GOTCHA**: Add `extension/node_modules/`, `extension/.output/`, `extension/.wxt/`, and `extension/dist/` to the root `.gitignore`.
- **VALIDATE**: `cd extension && npm install && npm run dev` launches Chrome with the extension loaded. The side panel should open (even if blank).

### Task 2: CREATE TailwindCSS configuration for extension

- **IMPLEMENT** `extension/tailwind.config.ts` with a subset of the main app's design tokens:
  ```typescript
  import type { Config } from "tailwindcss";

  const config: Config = {
    darkMode: "class",
    content: [
      "./entrypoints/**/*.{ts,tsx,html}",
      "./lib/**/*.{ts,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          "dark-bg": "rgb(var(--color-bg) / <alpha-value>)",
          "dark-card": "rgb(var(--color-card) / <alpha-value>)",
          "dark-surface": "rgb(var(--color-surface) / <alpha-value>)",
          "dark-border": "rgb(var(--color-border) / <alpha-value>)",
          "dark-text": "rgb(var(--color-text) / <alpha-value>)",
          "dark-text-muted": "rgb(var(--color-text-muted) / <alpha-value>)",
          primary: {
            DEFAULT: "#d4a853",
            muted: "#b8912e",
            subtle: "rgba(212,168,83,0.08)",
          },
          success: "#219653",
          danger: "#D34053",
          warning: "#FFA70B",
        },
      },
    },
    plugins: [],
  };

  export default config;
  ```
- **IMPLEMENT** `extension/postcss.config.js`:
  ```javascript
  module.exports = {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  };
  ```
- **IMPLEMENT** `extension/assets/styles.css`:
  ```css
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  @layer base {
    :root {
      --color-bg: 10 10 11;
      --color-card: 20 20 22;
      --color-surface: 28 28 31;
      --color-border: 39 39 42;
      --color-text: 250 250 250;
      --color-text-muted: 113 113 122;
    }

    body {
      @apply bg-dark-bg text-dark-text text-sm;
      margin: 0;
      padding: 0;
      min-width: 320px;
    }
  }
  ```
- **GOTCHA**: The side panel uses the dark theme exclusively (no light mode toggle). Hardcode the dark CSS vars in `:root` rather than using a `.dark` class toggle.
- **GOTCHA**: Set `text-sm` as the base font size for the side panel since it's a narrow UI.
- **VALIDATE**: Side panel renders with dark background and correct text color.

### Task 3: CREATE extension icons

- **IMPLEMENT**: Generate 4 icon sizes (16, 32, 48, 128px) from the existing PeerPull icon at `peerpull-icon-transparent.png` in the project root.
- **APPROACH**: Use a simple script or manual resize. Place the icons in `extension/public/icons/`:
  - `icon-16.png` (16x16)
  - `icon-32.png` (32x32)
  - `icon-48.png` (48x48)
  - `icon-128.png` (128x128)
- **IMPLEMENT**: Reference icons in `wxt.config.ts` manifest:
  ```typescript
  icons: {
    16: "icons/icon-16.png",
    32: "icons/icon-32.png",
    48: "icons/icon-48.png",
    128: "icons/icon-128.png",
  },
  ```
- **GOTCHA**: WXT serves files from `public/` at the extension root. So `public/icons/icon-16.png` becomes `icons/icon-16.png` in the manifest.
- **ALTERNATIVE**: If image resizing tools are not available, use the `peerpull-icon-256.png` as the source and create CSS-based placeholder icons temporarily. The icons can be properly generated later.
- **VALIDATE**: Extension shows the PeerPull icon in Chrome's toolbar.

### Task 4: CREATE shared infrastructure files

- **IMPLEMENT** `extension/lib/constants.ts`:
  ```typescript
  // API base URL — reads from environment or defaults to localhost
  export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  // Supabase public keys (safe to bundle in extension)
  export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";
  export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

  // chrome.storage keys
  export const STORAGE_KEYS = {
    authTokens: "peerpull_auth_tokens",
    userProfile: "peerpull_user_profile",
    settingsCache: "peerpull_settings_cache",
    settingsCacheTime: "peerpull_settings_cache_time",
    preferences: "peerpull_preferences",
  } as const;

  // Settings cache TTL (24 hours in milliseconds)
  export const SETTINGS_CACHE_TTL = 24 * 60 * 60 * 1000;

  // Notification polling interval (60 seconds)
  export const NOTIFICATION_POLL_INTERVAL = 60 * 1000;
  ```
- **IMPLEMENT** `extension/lib/messages.ts`:
  ```typescript
  // Message types for communication between extension contexts
  // (side panel <-> background service worker <-> offscreen document)

  export type ExtensionMessage =
    | { type: "START_RECORDING"; tabId: number; micDeviceId?: string }
    | { type: "STOP_RECORDING" }
    | { type: "PAUSE_RECORDING" }
    | { type: "RESUME_RECORDING" }
    | { type: "ABANDON_RECORDING" }
    | { type: "RECORDING_STARTED" }
    | { type: "RECORDING_PAUSED" }
    | { type: "RECORDING_RESUMED" }
    | { type: "RECORDING_STOPPED"; blobUrl: string; duration: number }
    | { type: "RECORDING_ERROR"; error: string }
    | { type: "RECORDING_TICK"; duration: number }
    | { type: "GET_METADATA" }
    | { type: "METADATA_RESULT"; data: PageMetadata }
    | { type: "OFFSCREEN_READY" }
    | { type: "START_OFFSCREEN_RECORDING"; streamId: string; micDeviceId?: string }
    | { type: "STOP_OFFSCREEN_RECORDING" }
    | { type: "PAUSE_OFFSCREEN_RECORDING" }
    | { type: "RESUME_OFFSCREEN_RECORDING" }
    | { type: "OFFSCREEN_RECORDING_DATA"; blobUrl: string; duration: number };

  export interface PageMetadata {
    title: string;
    url: string;
    faviconUrl: string | null;
    ogImageUrl: string | null;
    ogDescription: string | null;
  }

  export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
    expiresAt: number; // Unix timestamp in milliseconds
  }

  export interface UserProfile {
    id: string;
    fullName: string;
    avatarUrl: string | null;
    referralCode: string;
    peerPointsBalance: number;
    qualityScore: number | null;
    status: string;
    unreadNotificationCount: number;
  }

  export interface CachedSettings {
    minVideoDuration: number;
    maxVideoDuration: number;
    reviewReward: number;
    platformLaunched: boolean;
  }
  ```
- **IMPLEMENT** `extension/lib/storage.ts`:
  ```typescript
  import { STORAGE_KEYS, SETTINGS_CACHE_TTL } from "./constants";
  import type { AuthTokens, UserProfile, CachedSettings } from "./messages";

  // Generic chrome.storage.local helpers
  async function get<T>(key: string): Promise<T | null> {
    const result = await chrome.storage.local.get(key);
    return (result[key] as T) ?? null;
  }

  async function set(key: string, value: unknown): Promise<void> {
    await chrome.storage.local.set({ [key]: value });
  }

  async function remove(key: string): Promise<void> {
    await chrome.storage.local.remove(key);
  }

  // Auth tokens
  export async function getAuthTokens(): Promise<AuthTokens | null> {
    return get<AuthTokens>(STORAGE_KEYS.authTokens);
  }

  export async function setAuthTokens(tokens: AuthTokens): Promise<void> {
    return set(STORAGE_KEYS.authTokens, tokens);
  }

  export async function clearAuthTokens(): Promise<void> {
    return remove(STORAGE_KEYS.authTokens);
  }

  // User profile
  export async function getUserProfile(): Promise<UserProfile | null> {
    return get<UserProfile>(STORAGE_KEYS.userProfile);
  }

  export async function setUserProfile(profile: UserProfile): Promise<void> {
    return set(STORAGE_KEYS.userProfile, profile);
  }

  export async function clearUserProfile(): Promise<void> {
    return remove(STORAGE_KEYS.userProfile);
  }

  // Settings cache
  export async function getCachedSettings(): Promise<CachedSettings | null> {
    const cacheTime = await get<number>(STORAGE_KEYS.settingsCacheTime);
    if (!cacheTime || Date.now() - cacheTime > SETTINGS_CACHE_TTL) {
      return null; // Cache expired or missing
    }
    return get<CachedSettings>(STORAGE_KEYS.settingsCache);
  }

  export async function setCachedSettings(settings: CachedSettings): Promise<void> {
    await set(STORAGE_KEYS.settingsCache, settings);
    await set(STORAGE_KEYS.settingsCacheTime, Date.now());
  }

  // Preferences (e.g., "don't show navigation confirmation")
  export async function getPreference<T>(key: string, defaultValue: T): Promise<T> {
    const prefs = await get<Record<string, unknown>>(STORAGE_KEYS.preferences);
    if (!prefs || !(key in prefs)) return defaultValue;
    return prefs[key] as T;
  }

  export async function setPreference(key: string, value: unknown): Promise<void> {
    const prefs = await get<Record<string, unknown>>(STORAGE_KEYS.preferences) || {};
    prefs[key] = value;
    await set(STORAGE_KEYS.preferences, prefs);
  }

  // Clear all PeerPull data (logout)
  export async function clearAll(): Promise<void> {
    await chrome.storage.local.remove(Object.values(STORAGE_KEYS));
  }
  ```
- **IMPLEMENT** `extension/lib/api.ts`:
  ```typescript
  import { API_BASE_URL } from "./constants";
  import { getAuthTokens } from "./storage";

  interface ApiSuccessResponse<T> {
    data: T;
    meta: { timestamp: string };
  }

  interface ApiErrorResponse {
    error: { code: string; message: string };
  }

  type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

  function isErrorResponse<T>(response: ApiResponse<T>): response is ApiErrorResponse {
    return "error" in response;
  }

  export class ApiError extends Error {
    constructor(public code: string, message: string, public status: number) {
      super(message);
      this.name = "ApiError";
    }
  }

  async function request<T>(
    path: string,
    options: RequestInit = {}
  ): Promise<T> {
    const tokens = await getAuthTokens();
    if (!tokens) {
      throw new ApiError("UNAUTHORIZED", "Not logged in", 401);
    }

    const url = `${API_BASE_URL}/api/v1${path}`;
    const headers: Record<string, string> = {
      Authorization: `Bearer ${tokens.accessToken}`,
      ...((options.headers as Record<string, string>) || {}),
    };

    if (options.body && typeof options.body === "string") {
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(url, { ...options, headers });
    const json: ApiResponse<T> = await response.json();

    if (isErrorResponse(json)) {
      throw new ApiError(json.error.code, json.error.message, response.status);
    }

    return json.data;
  }

  // API methods
  export const api = {
    verifyAuth: () =>
      request<{
        id: string;
        full_name: string;
        avatar_url: string | null;
        referral_code: string;
        peer_points_balance: number;
        quality_score: number | null;
        status: string;
        unread_notification_count: number;
      }>("/auth/verify"),

    getSettings: () =>
      request<{
        min_video_duration: number;
        max_video_duration: number;
        review_reward: number;
        platform_launched: boolean;
      }>("/settings"),

    getSignedUploadUrl: (filename: string, contentType: string) =>
      request<{ signed_url: string; path: string }>("/upload/signed-url", {
        method: "POST",
        body: JSON.stringify({ filename, content_type: contentType }),
      }),

    getNextReview: () =>
      request<{
        review_id: string;
        feedback_request: {
          id: string;
          title: string;
          url: string;
          description: string;
          questions: string[] | null;
          focus_areas: string[] | null;
        };
      } | null>("/queue/next"),

    submitReview: (payload: {
      review_id: string;
      video_url: string;
      duration: number;
      rating: number;
      strengths?: string | null;
      improvements?: string | null;
      signal_follow?: boolean;
      signal_engage?: boolean;
      signal_invest?: boolean;
    }) =>
      request<{ points_earned: number; new_balance: number }>("/queue/submit", {
        method: "POST",
        body: JSON.stringify(payload),
      }),

    createExternalReview: (payload: {
      video_url: string;
      video_duration: number;
      target_url: string;
      target_title?: string | null;
      target_favicon_url?: string | null;
      target_og_image_url?: string | null;
      target_og_description?: string | null;
    }) =>
      request<{
        id: string;
        slug: string;
        shareable_url: string;
        created_at: string;
      }>("/external-reviews", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
  };
  ```
- **IMPLEMENT**: Create a `extension/lib/utils.ts` file with the `cn()` utility (same as main app):
  ```typescript
  import { clsx, type ClassValue } from "clsx";
  import { twMerge } from "tailwind-merge";

  export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
  }
  ```
- **GOTCHA**: The API client intentionally does NOT handle token refresh in this phase. Token refresh will be added when we wire up the Supabase client for auth in Task 5. If the token is expired, the user will need to re-login.
- **GOTCHA**: WXT uses `import.meta.env.VITE_*` for environment variables (Vite convention). Create a `.env` file in the extension directory with `VITE_API_BASE_URL`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
- **VALIDATE**: TypeScript compiles without errors: `cd extension && npx tsc --noEmit`

### Task 5: CREATE authentication system

- **IMPLEMENT** `extension/entrypoints/sidepanel/hooks/useAuth.ts`:
  - Initialize Supabase client using constants from `lib/constants.ts`
  - `login(email, password)`: Call `supabase.auth.signInWithPassword()`, store tokens via `setAuthTokens()`, fetch profile via `api.verifyAuth()`, store profile via `setUserProfile()`
  - `logout()`: Call `clearAll()` from storage, reset state
  - `initialize()`: On mount, check `getAuthTokens()`. If tokens exist and not expired, load cached profile and verify via API in background. If expired, attempt refresh via `supabase.auth.refreshSession()`. If refresh fails, clear tokens and show login.
  - Return `{ user, isLoading, isAuthenticated, login, logout, error }`
- **IMPLEMENT**: The Supabase client should be created once and reused:
  ```typescript
  import { createClient } from "@supabase/supabase-js";
  import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/constants";

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: false, // We manage persistence ourselves via chrome.storage
      autoRefreshToken: false,
    },
  });
  ```
- **GOTCHA**: Supabase's default session persistence uses `localStorage`, which is available in the side panel but NOT shared across extension contexts. Use `chrome.storage.local` instead for cross-context persistence. Disable Supabase's built-in persistence.
- **GOTCHA**: When storing auth tokens, compute `expiresAt` from the JWT's `exp` claim or from `session.expires_at`. The token refresh check should happen ~5 minutes before expiry.
- **GOTCHA**: The `.env` file must have `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` set. Copy these from the main project's `.env.local` (they are public keys, safe to embed in the extension).
- **VALIDATE**: User can log in via the side panel. Tokens are stored in `chrome.storage.local`. Refreshing the side panel retains the login state.

### Task 6: CREATE AuthGate component

- **IMPLEMENT** `extension/entrypoints/sidepanel/components/AuthGate.tsx`:
  - Email input, password input, "Sign In" button
  - Loading state during login
  - Error display for invalid credentials
  - Link text: "Don't have an account? Sign up at peerpull.com" (opens in new tab)
  - PeerPull logo at top
  - Dark theme styling using Tailwind tokens
- **PATTERN**: Simple form with `onSubmit` handler calling `login()` from `useAuth`. No Zod validation needed here (server validates).
- **GOTCHA**: Use `<a href="..." target="_blank" rel="noopener noreferrer">` for the signup link. Chrome extensions can open URLs in new tabs.
- **VALIDATE**: Login form renders, user can type email/password, submit triggers auth flow.

### Task 7: CREATE StatusBar component

- **IMPLEMENT** `extension/entrypoints/sidepanel/components/StatusBar.tsx`:
  - Horizontal bar at the top of the authenticated view
  - Shows: PeerPoints balance (coin icon + number), quality score (star icon + number, hidden if null), notification badge (bell icon + count, red dot if > 0)
  - Clicking the notification badge opens `{API_BASE_URL}/dashboard` in a new tab
  - Use Lucide React icons: `Coins`, `Star`, `Bell`
- **IMPLEMENT**: The status bar should accept `profile` as a prop (from `useAuth`).
- **VALIDATE**: Status bar renders with mock data, icons display correctly.

### Task 8: CREATE HomeScreen component

- **IMPLEMENT** `extension/entrypoints/sidepanel/components/HomeScreen.tsx`:
  - Displayed when user is authenticated and not recording
  - Shows: StatusBar at top, two primary action buttons
  - **"Next Review"** button: gold/primary colored, starts the internal review flow (Phase 6.3, for now shows "Coming soon" toast or is disabled with tooltip)
  - **"Record This Page"** button: outlined/secondary, starts the external review flow (Phase 6.3, same treatment)
  - Extension version in footer: "PeerPull Companion v0.1.0"
  - Link to dashboard: "Open Dashboard" text link
- **GOTCHA**: Both action buttons will be fully wired in Phase 6.3. For Phase 6.2, they should be visually present but can trigger a simple alert or state change to test recording (Task 12 will wire "Record This Page" to actually start recording for testing purposes).
- **VALIDATE**: HomeScreen renders with status bar, two buttons, and footer.

### Task 9: CREATE background service worker

- **IMPLEMENT** `extension/entrypoints/background.ts`:
  ```typescript
  export default defineBackground(() => {
    // Open side panel on extension icon click
    chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });

    // Listen for messages from side panel and offscreen document
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      handleMessage(message, sender, sendResponse);
      return true; // Keep message channel open for async responses
    });
  });
  ```
- **IMPLEMENT** the message handler:
  - `START_RECORDING`:
    1. Get the active tab ID from `chrome.tabs.query({ active: true, currentWindow: true })`
    2. Call `chrome.tabCapture.getMediaStreamId({ targetTabId: tabId })`
    3. Create offscreen document if not already created: `chrome.offscreen.createDocument({ url: "offscreen.html", reasons: ["USER_MEDIA"], justification: "Recording tab audio/video" })`
    4. Send `START_OFFSCREEN_RECORDING` message to offscreen document with the stream ID and mic device ID
  - `STOP_RECORDING`: Forward `STOP_OFFSCREEN_RECORDING` to offscreen document
  - `PAUSE_RECORDING`: Forward `PAUSE_OFFSCREEN_RECORDING` to offscreen document
  - `RESUME_RECORDING`: Forward `RESUME_OFFSCREEN_RECORDING` to offscreen document
  - `ABANDON_RECORDING`: Forward `STOP_OFFSCREEN_RECORDING` to offscreen document, then close the offscreen document
  - `OFFSCREEN_RECORDING_DATA`: Forward to side panel (relayed from offscreen doc when recording stops)
- **IMPLEMENT**: Helper to manage offscreen document lifecycle:
  ```typescript
  let offscreenDocumentCreated = false;

  async function ensureOffscreenDocument(): Promise<void> {
    if (offscreenDocumentCreated) return;

    // Check if already exists
    const existingContexts = await chrome.runtime.getContexts({
      contextTypes: [chrome.runtime.ContextType.OFFSCREEN_DOCUMENT],
    });
    if (existingContexts.length > 0) {
      offscreenDocumentCreated = true;
      return;
    }

    await chrome.offscreen.createDocument({
      url: "offscreen.html",
      reasons: [chrome.offscreen.Reason.USER_MEDIA],
      justification: "Recording tab audio and video for PeerPull review",
    });
    offscreenDocumentCreated = true;
  }

  async function closeOffscreenDocument(): Promise<void> {
    if (!offscreenDocumentCreated) return;
    await chrome.offscreen.closeDocument();
    offscreenDocumentCreated = false;
  }
  ```
- **GOTCHA**: `chrome.tabCapture.getMediaStreamId()` requires the `tabCapture` permission AND the call must originate from a user gesture context. The side panel click triggers the message to the service worker, which counts as a valid user gesture chain.
- **GOTCHA**: Only ONE offscreen document can exist at a time per extension. Always check before creating.
- **GOTCHA**: The stream ID from `getMediaStreamId()` expires within seconds. Pass it to the offscreen document immediately after obtaining it.
- **VALIDATE**: Background service worker loads without errors. Side panel opens on extension icon click.

### Task 10: CREATE offscreen document

- **IMPLEMENT** `extension/entrypoints/offscreen.html`:
  ```html
  <!DOCTYPE html>
  <html>
    <head><title>PeerPull Offscreen</title></head>
    <body>
      <script src="./offscreen.ts" type="module"></script>
    </body>
  </html>
  ```
  NOTE: WXT may require this to be registered differently. Check WXT docs for unlisted pages / offscreen document entrypoints. If WXT has an `unlisted-` prefix convention for offscreen pages, use that pattern instead:
  - `entrypoints/unlisted-offscreen/index.html`
  - `entrypoints/unlisted-offscreen/main.ts`

  Alternatively, WXT may support offscreen documents as a dedicated entrypoint type. Research WXT's specific pattern.

- **IMPLEMENT** `extension/entrypoints/offscreen.ts` (or the appropriate file based on WXT's conventions):
  ```typescript
  // This runs in the offscreen document context
  // It receives a tab capture stream ID, creates a MediaRecorder, and records

  let mediaRecorder: MediaRecorder | null = null;
  let chunks: Blob[] = [];
  let duration = 0;
  let timerInterval: ReturnType<typeof setInterval> | null = null;
  let audioContext: AudioContext | null = null;

  function getSupportedMimeType(): string {
    const types = [
      "video/webm;codecs=vp9,opus",
      "video/webm;codecs=vp8,opus",
      "video/webm;codecs=vp9",
      "video/webm;codecs=vp8",
      "video/webm",
    ];
    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) return type;
    }
    return "";
  }

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.type) {
      case "START_OFFSCREEN_RECORDING":
        startRecording(message.streamId, message.micDeviceId);
        break;
      case "STOP_OFFSCREEN_RECORDING":
        stopRecording();
        break;
      case "PAUSE_OFFSCREEN_RECORDING":
        pauseRecording();
        break;
      case "RESUME_OFFSCREEN_RECORDING":
        resumeRecording();
        break;
    }
  });

  async function startRecording(streamId: string, micDeviceId?: string) {
    try {
      chunks = [];
      duration = 0;

      // Get tab media stream using the stream ID
      const tabStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          mandatory: {
            chromeMediaSource: "tab",
            chromeMediaSourceId: streamId,
          },
        } as any,
        video: {
          mandatory: {
            chromeMediaSource: "tab",
            chromeMediaSourceId: streamId,
          },
        } as any,
      });

      // Get microphone stream
      let micStream: MediaStream | null = null;
      try {
        const audioConstraints = micDeviceId
          ? { deviceId: { exact: micDeviceId } }
          : true;
        micStream = await navigator.mediaDevices.getUserMedia({
          audio: audioConstraints,
        });
      } catch (micErr) {
        // Mic access failed, send error
        chrome.runtime.sendMessage({
          type: "RECORDING_ERROR",
          error: "Microphone access is required. Please allow microphone access and try again.",
        });
        tabStream.getTracks().forEach((t) => t.stop());
        return;
      }

      // Mix audio streams
      audioContext = new AudioContext();
      const destination = audioContext.createMediaStreamDestination();

      const tabAudioTracks = tabStream.getAudioTracks();
      if (tabAudioTracks.length > 0) {
        const tabAudioStream = new MediaStream(tabAudioTracks);
        audioContext.createMediaStreamSource(tabAudioStream).connect(destination);
      }

      if (micStream) {
        audioContext.createMediaStreamSource(micStream).connect(destination);
      }

      // Combine video from tab + mixed audio
      const combinedStream = new MediaStream([
        ...tabStream.getVideoTracks(),
        ...destination.stream.getAudioTracks(),
      ]);

      // Create MediaRecorder
      const mimeType = getSupportedMimeType();
      mediaRecorder = new MediaRecorder(
        combinedStream,
        mimeType ? { mimeType } : undefined
      );

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        if (timerInterval) clearInterval(timerInterval);
        const blob = new Blob(chunks, { type: mimeType || "video/webm" });
        const blobUrl = URL.createObjectURL(blob);

        chrome.runtime.sendMessage({
          type: "OFFSCREEN_RECORDING_DATA",
          blobUrl,
          duration,
        });

        // Cleanup streams
        tabStream.getTracks().forEach((t) => t.stop());
        micStream?.getTracks().forEach((t) => t.stop());
        audioContext?.close();
        audioContext = null;
      };

      // Handle tab close during recording
      tabStream.getVideoTracks()[0].onended = () => {
        if (mediaRecorder?.state === "recording") {
          mediaRecorder.stop();
        }
      };

      mediaRecorder.start(1000); // 1-second timeslice

      // Duration timer
      timerInterval = setInterval(() => {
        if (mediaRecorder?.state === "recording") {
          duration++;
          chrome.runtime.sendMessage({ type: "RECORDING_TICK", duration });
        }
      }, 1000);

      chrome.runtime.sendMessage({ type: "RECORDING_STARTED" });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to start recording";
      chrome.runtime.sendMessage({ type: "RECORDING_ERROR", error: message });
    }
  }

  function stopRecording() {
    if (mediaRecorder?.state === "recording" || mediaRecorder?.state === "paused") {
      mediaRecorder.stop();
    }
  }

  function pauseRecording() {
    if (mediaRecorder?.state === "recording") {
      mediaRecorder.pause();
      chrome.runtime.sendMessage({ type: "RECORDING_PAUSED" });
    }
  }

  function resumeRecording() {
    if (mediaRecorder?.state === "paused") {
      mediaRecorder.resume();
      chrome.runtime.sendMessage({ type: "RECORDING_RESUMED" });
    }
  }
  ```
- **GOTCHA**: The `chromeMediaSource` and `chromeMediaSourceId` constraints are non-standard. TypeScript will complain. Use `as any` for the constraint object or declare custom types.
- **GOTCHA**: The offscreen document's `getUserMedia` with `chromeMediaSource: "tab"` requires the stream ID to be fresh (obtained within seconds). The background service worker must pass it immediately.
- **GOTCHA**: Blob URLs created in the offscreen document are NOT directly accessible from the side panel (different document context). You need to either: (a) convert the blob to an ArrayBuffer, send it via message, and reconstruct in the side panel, or (b) use `chrome.runtime.getURL` with a blob. The recommended approach for large video files is to pass the blob data back as chunks via messages or use a temporary `URL.createObjectURL` that the offscreen document serves. Research the best approach for your WXT version. A simpler alternative: keep the blob in the offscreen document and upload it directly from there.
- **IMPORTANT ARCHITECTURAL NOTE**: Since blob URLs don't transfer between contexts, modify the architecture:
  1. Offscreen document records and holds the blob
  2. When recording stops, offscreen sends a `RECORDING_STOPPED` message with just the `duration`
  3. Side panel shows preview (duration info only, no video preview for MVP, or show a "Recording complete" placeholder)
  4. When user confirms upload, side panel sends `UPLOAD_RECORDING` message to offscreen document
  5. Offscreen document handles the upload (requests signed URL, PUTs the blob)
  6. Offscreen document sends `UPLOAD_COMPLETE` or `UPLOAD_ERROR` back

  This avoids blob transfer between contexts entirely. Update the message types accordingly.
- **VALIDATE**: Offscreen document loads without errors. Recording start/stop messages are handled.

### Task 11: CREATE useRecording hook

- **IMPLEMENT** `extension/entrypoints/sidepanel/hooks/useRecording.ts`:
  - State machine with states: `idle`, `recording`, `paused`, `stopped`, `uploading`, `uploaded`, `error`
  - `startRecording()`: Gets active tab ID, sends `START_RECORDING` message to background
  - `stopRecording()`: Sends `STOP_RECORDING` message
  - `pauseRecording()`: Sends `PAUSE_RECORDING` message
  - `resumeRecording()`: Sends `RESUME_RECORDING` message
  - `abandonRecording()`: Sends `ABANDON_RECORDING` message, resets to idle
  - `uploadRecording()`: Sends `UPLOAD_RECORDING` message to offscreen document
  - Listens for incoming messages: `RECORDING_STARTED`, `RECORDING_PAUSED`, `RECORDING_RESUMED`, `RECORDING_TICK`, `RECORDING_STOPPED`, `RECORDING_ERROR`, `UPLOAD_COMPLETE`, `UPLOAD_ERROR`
  - Tracks: `duration`, `status`, `error`, `uploadProgress`, `videoUrl` (from Supabase after upload)
  - Uses `CachedSettings` for `minVideoDuration` and `maxVideoDuration`
  - Computes: `isMinDurationMet`, `isWarning` (last 30 seconds), `progress` (0-1 fraction)
- **IMPLEMENT**: Register message listener in `useEffect`:
  ```typescript
  useEffect(() => {
    const listener = (message: ExtensionMessage) => {
      switch (message.type) {
        case "RECORDING_STARTED":
          setStatus("recording");
          break;
        case "RECORDING_TICK":
          setDuration(message.duration);
          if (message.duration >= maxDuration) {
            chrome.runtime.sendMessage({ type: "STOP_RECORDING" });
          }
          break;
        // ... etc
      }
    };
    chrome.runtime.onMessage.addListener(listener);
    return () => chrome.runtime.onMessage.removeListener(listener);
  }, [maxDuration]);
  ```
- **GOTCHA**: The max duration auto-stop should be triggered from the side panel (which knows the settings) by sending a stop message when the tick reaches max duration. The offscreen document just records, it doesn't enforce limits.
- **VALIDATE**: Hook compiles, state transitions work correctly when messages are received.

### Task 12: CREATE RecordingPanel component

- **IMPLEMENT** `extension/entrypoints/sidepanel/components/RecordingPanel.tsx`:
  - **Duration Timer**: Shows elapsed time as `MM:SS` format
  - **Progress Bar**:
    - Full width bar spanning 0 to `maxVideoDuration`
    - 0 to `minVideoDuration` segment: amber/gold color
    - `minVideoDuration` to `maxVideoDuration`: green color
    - Current position indicator
    - When duration < minVideoDuration: "Stop" button disabled
    - Last 30 seconds: amber warning pulse
  - **Recording Controls**:
    - "Pause" button (when recording): pauses MediaRecorder and timer
    - "Resume" button (when paused): resumes
    - "Stop" button: ends recording (disabled until min duration met)
    - "Abandon" button: confirmation prompt ("Discard this recording?"), then resets to idle
  - **Mic Indicator**: Small icon showing mic is active
  - **Remaining Time**: Shows "X:XX remaining" text
- **STYLING**: Use PeerPull's primary (gold) color for the progress bar segments. Dark theme tokens for backgrounds and borders.
- **VALIDATE**: Component renders with correct layout, progress bar fills, buttons enable/disable based on duration.

### Task 13: CREATE PreviewPanel component

- **IMPLEMENT** `extension/entrypoints/sidepanel/components/PreviewPanel.tsx`:
  - Shown after recording stops (status === "stopped")
  - For MVP (since blob doesn't transfer between contexts): Show a "Recording complete" confirmation with duration display
  - **"Redo" button**: Discards recording, sends `ABANDON_RECORDING` to offscreen, returns to idle state
  - **"Upload & Continue" button**: Triggers upload flow
  - Future enhancement: actual video preview (requires blob transfer solution)
- **IMPLEMENT**: When "Upload & Continue" is clicked:
  1. Set status to "uploading"
  2. Send message to offscreen document to start upload
  3. Show UploadProgress component
- **VALIDATE**: Preview panel renders after recording stops, redo returns to idle.

### Task 14: CREATE UploadProgress component

- **IMPLEMENT** `extension/entrypoints/sidepanel/components/UploadProgress.tsx`:
  - Progress bar showing upload status
  - For MVP: indeterminate progress bar (since `fetch` doesn't easily report upload progress)
  - "Uploading..." text with spinner
  - On success: shows "Upload complete!" with checkmark
  - On error: shows error message with "Retry" button
- **VALIDATE**: Component renders loading state and transitions to success/error.

### Task 15: IMPLEMENT upload logic in offscreen document

- **UPDATE** the offscreen document to handle upload:
  - Listen for `UPLOAD_RECORDING` message
  - When received:
    1. Use the stored blob from the recording
    2. Send a request to the background service worker to get auth tokens (or have them passed in the message)
    3. Request a signed upload URL from the API: `POST /api/v1/upload/signed-url` with `{ filename: "review-{timestamp}.webm", content_type: "video/webm" }`
    4. Upload the blob to the signed URL via `PUT` with `Content-Type: video/webm`
    5. On success: construct the public video URL from the upload path and send `UPLOAD_COMPLETE` with `{ videoUrl, duration }` to the side panel
    6. On error: send `UPLOAD_ERROR` with error message
- **GOTCHA**: The signed URL upload is a raw `PUT` request to Supabase Storage. No Authorization header needed on the upload itself (the signed URL contains the auth token).
- **GOTCHA**: The public video URL after upload is: `{SUPABASE_URL}/storage/v1/object/public/review-videos/{path}` where `path` is returned from the signed URL endpoint.
- **GOTCHA**: The offscreen document needs access to auth tokens for the signed URL API call. Either pass them via message or import the storage helper. Since the offscreen document runs in the extension context, it can access `chrome.storage.local` directly.
- **VALIDATE**: Video blob uploads to Supabase Storage successfully. Public URL is accessible.

### Task 16: WIRE App.tsx state machine

- **IMPLEMENT** `extension/entrypoints/sidepanel/App.tsx`:
  ```typescript
  type AppView = "loading" | "login" | "home" | "recording" | "preview" | "uploading" | "uploaded";
  ```
  - `loading`: Show spinner while checking auth state on mount
  - `login`: Show `AuthGate` component
  - `home`: Show `HomeScreen` component (with StatusBar)
  - `recording`: Show `RecordingPanel` component
  - `preview`: Show `PreviewPanel` component
  - `uploading`: Show `UploadProgress` component
  - `uploaded`: Show success state with "Done" button returning to home
- **IMPLEMENT**: Wire the "Record This Page" button on HomeScreen to transition to `recording` state and trigger `startRecording()` from `useRecording`.
- **IMPLEMENT**: Wire notification polling using `setInterval` to call `api.verifyAuth()` every 60 seconds and update the notification count in the profile state.
- **IMPLEMENT**: Settings fetch on auth: after successful login or token verification, fetch settings via `api.getSettings()` and cache them.
- **VALIDATE**: Full flow works: login, see home screen, click "Record This Page", recording starts, stop recording, see preview, upload, see success.

### Task 17: CREATE .env file and update .gitignore

- **IMPLEMENT** `extension/.env.example`:
  ```
  VITE_API_BASE_URL=http://localhost:3000
  VITE_SUPABASE_URL=your_supabase_url_here
  VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
  ```
- **IMPLEMENT** `extension/.env` (local, gitignored):
  Copy values from the main project's `.env.local` for `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- **UPDATE** root `.gitignore` to add:
  ```
  # Chrome Extension
  extension/node_modules/
  extension/.output/
  extension/.wxt/
  extension/dist/
  extension/.env
  ```
- **VALIDATE**: `.env` values are accessible via `import.meta.env.VITE_*` in the extension code.

### Task 18: ADD npm scripts to extension package.json

- **IMPLEMENT**: Ensure `extension/package.json` has these scripts:
  ```json
  {
    "scripts": {
      "dev": "wxt",
      "build": "wxt build",
      "zip": "wxt zip",
      "postinstall": "wxt prepare"
    }
  }
  ```
- **VALIDATE**: `cd extension && npm run dev` opens Chrome with the extension. `npm run build` produces output in `.output/`.

### Task 19: INTEGRATION TEST the full recording flow

- **IMPLEMENT**: Manual test checklist:
  1. Load the extension in Chrome via `npm run dev` in the `extension/` directory
  2. Click the PeerPull icon in the toolbar. Side panel opens.
  3. Log in with a valid PeerPull account. Status bar shows points and quality score.
  4. Click "Record This Page" on any website.
  5. Recording starts (tab capture + mic). Timer counts up. Progress bar fills.
  6. After reaching minimum duration, "Stop" button enables.
  7. Click "Stop". Preview panel appears with duration.
  8. Click "Upload & Continue". Upload progress shows.
  9. Upload completes. Success state shown.
  10. Click "Done" to return to home screen.
  11. Close and reopen the side panel. Login state persists.
  12. Verify the video exists in Supabase Storage (`review-videos` bucket).
- **VALIDATE**: All 12 steps pass.

---

## TESTING STRATEGY

### No Automated Test Framework

This project has no test framework configured. The Chrome extension adds additional complexity (multiple execution contexts, Chrome APIs) that make automated testing more challenging. Testing is manual.

### Manual Testing Plan

**Authentication:**
1. Login with valid credentials: profile data loads, status bar shows correct values
2. Login with invalid credentials: error message displays
3. Close side panel, reopen: login state persists
4. Wait for token expiry: user is prompted to re-login (or token refreshes silently)
5. Logout: all stored data cleared, login form shown

**Recording:**
1. Start recording on a regular webpage: tab capture starts, timer counts
2. Start recording on a page with audio (YouTube): tab audio is captured along with mic
3. Pause recording: timer pauses, resume continues from where it paused
4. Abandon recording: confirmation prompt, then returns to home
5. Stop before min duration: "Stop" button is disabled
6. Stop after min duration: recording stops, preview shown
7. Record until max duration: recording auto-stops
8. Switch tabs during recording: recording continues (tab capture follows the captured tab, not the active tab)

**Upload:**
1. Upload a recording: signed URL obtained, video uploaded to Supabase Storage
2. Upload with network error: error message shown, retry button works
3. Verify uploaded video plays from the Supabase Storage URL

**Edge Cases:**
- Extension installed but Supabase env vars missing: graceful error on login
- API server not running: connection error messages
- User's account is inactive: error from auth/verify displayed
- Very long recording (5+ minutes): blob size manageable, upload completes

---

## VALIDATION COMMANDS

### Level 1: Build Check

```bash
cd extension && npm run build
```

Should complete without errors and produce output in `.output/chrome-mv3/`.

### Level 2: TypeScript Check

```bash
cd extension && npx tsc --noEmit
```

Should report zero errors.

### Level 3: Dev Server Launch

```bash
cd extension && npm run dev
```

Should open Chrome with the extension loaded. Side panel should be accessible.

### Level 4: Extension Load Test

1. Navigate to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked" and select `extension/.output/chrome-mv3/`
4. Extension should load without errors
5. Click the PeerPull icon, side panel should open

### Level 5: Full Flow Manual Test

Follow the 12-step integration test in Task 19.

---

## ACCEPTANCE CRITERIA

- [ ] Extension project scaffolded in `extension/` with WXT, React 19, TailwindCSS
- [ ] Extension loads in Chrome without errors
- [ ] Side panel opens on extension icon click
- [ ] Login form authenticates via Supabase, tokens stored in `chrome.storage.local`
- [ ] Auth state persists across side panel close/reopen and browser restart
- [ ] Status bar displays PeerPoints balance, quality score, and notification count
- [ ] Tab capture recording works via `chrome.tabCapture.getMediaStreamId()` + offscreen document
- [ ] Microphone audio is captured and mixed with tab audio
- [ ] Recording controls work: start, pause/resume, stop, abandon
- [ ] Progress bar shows min/max duration thresholds with correct color segments
- [ ] "Stop" button disabled until minimum duration is met
- [ ] Recording auto-stops at maximum duration
- [ ] Post-recording confirmation shown with duration
- [ ] "Redo" discards recording and returns to idle
- [ ] Video uploads to Supabase Storage via signed URL from API
- [ ] Upload progress/error states display correctly
- [ ] Extension icons display in Chrome toolbar
- [ ] Dark theme consistent with PeerPull branding
- [ ] `npm run build` in `extension/` succeeds
- [ ] Main app (`npm run build` in project root) is unaffected
- [ ] No regressions in existing Phase 6.1 API endpoints

---

## COMPLETION CHECKLIST

- [ ] All tasks completed in order (1-19)
- [ ] Each task validation passed
- [ ] Extension builds successfully
- [ ] Full recording flow tested manually (login, record, upload)
- [ ] Auth persistence verified
- [ ] Recording controls all work (start, pause, resume, stop, abandon)
- [ ] Duration constraints enforced (min/max)
- [ ] Video upload to Supabase Storage confirmed
- [ ] No regressions in main web app

---

## NOTES

### Design Decisions

1. **WXT over CRXJS/Plasmo**: WXT is the most actively maintained Chrome extension framework as of 2025-2026. CRXJS had a near-archival crisis in March 2025. WXT provides file-based entrypoints, first-class React support, and Vite-powered HMR. It has 7.9k+ GitHub stars and strong community support.

2. **React 19 over Preact**: The main app uses React 19. Keeping the extension on React eliminates compat-layer risks and allows sharing code patterns. The ~37KB bundle size difference is negligible for a locally-loaded extension.

3. **Offscreen document for recording**: MV3 service workers can suspend during long-running operations, killing MediaRecorder. The offscreen document stays alive while the extension is in use and hosts the actual recording logic. The side panel provides the UI, the service worker coordinates `chrome.tabCapture`, and the offscreen document does the heavy lifting.

4. **Upload from offscreen document**: Since Blob URLs don't transfer between extension contexts (side panel, offscreen, service worker), the upload is performed directly from the offscreen document where the blob lives. This avoids serializing large video files across message channels.

5. **Dark theme only**: The extension side panel uses the dark theme exclusively (same as the main app's default). No theme toggle in the extension. This simplifies the CSS and matches the PeerPull brand.

6. **Token refresh deferred**: For MVP, if the Supabase JWT expires, the user re-logs in. Automatic token refresh via `supabase.auth.refreshSession()` should be added but is not critical for initial testing.

7. **"Next Review" and "Record This Page" partially wired**: Phase 6.2 wires "Record This Page" to test the recording flow end-to-end. "Next Review" (which requires queue integration) and the full external review flow (which requires metadata extraction + API calls) are deferred to Phase 6.3.

### Key Technical Constraints

- **chrome.tabCapture.getMediaStreamId()** returns a stream ID that expires within seconds. The background service worker must pass it to the offscreen document immediately.
- **Only one offscreen document** can exist per extension at any time.
- **Service workers suspend** after ~30 seconds of inactivity in MV3. Never rely on them for long-running operations. Use `chrome.alarms` for periodic tasks.
- **Mic access** requires a user gesture from a visible context. The side panel satisfies this requirement.

### Risks

1. **WXT offscreen document support**: WXT may or may not have first-class support for offscreen documents. If not, use the `unlisted-` prefix convention for WXT pages or manually add the offscreen.html to the build output. Check WXT docs at build time.

2. **Blob transfer between contexts**: The plan assumes upload happens from the offscreen document. If there are issues with the offscreen document making fetch requests (CORS, missing extension permissions), fall back to: (a) converting the blob to base64, sending via message to the side panel, and uploading from there; or (b) using a Blob backed by an IndexedDB store accessible from both contexts.

3. **Tab capture permissions**: `chrome.tabCapture` may behave differently across Chrome versions. Test on Chrome stable (latest). If `getMediaStreamId()` fails, fall back to `chrome.desktopCapture` or `getDisplayMedia` with reduced UX.

4. **Extension review for Chrome Web Store**: Self-hosted distribution works for initial development. `tabCapture` permission may require justification during Chrome Web Store review. This is a Phase 6.2+ concern.
