# Feature: Streamlined Single-Page Feedback Submission Flow

The following plan should be complete, but its important that you validate documentation and codebase patterns and task sanity before you start implementing.

Pay special attention to naming of existing utils types and models. Import from the right files etc.

## Feature Description

Replace the current multi-page, multi-click feedback submission flow with a streamlined single-page experience. Currently, giving feedback requires navigating between 2 pages (submit page and review session page) with ~10 interactions before recording actually starts. The new flow reduces this to 2 clicks on a single page: "Get Next Project" then "Open & Start Recording".

Key improvements:
1. **Silent mic readiness check** on page load (blocks proceeding if mic unavailable)
2. **Dismissable first-time intro** stored in localStorage (returning users skip it)
3. **Inline project briefing** after queue claim (no page redirect)
4. **Combined "Open & Start Recording" button** that opens the project URL and triggers screen share in a single user gesture
5. **Full-page recording dashboard** visible on the PeerPull tab while recording happens on the project tab, with countdown timer and progress bar
6. **Dynamic browser tab title** showing recording countdown (visible in tab bar)
7. **Inline submit form** after recording stops (rating, strengths, improvements, signals)

## User Story

As a reviewer giving feedback on PeerPull,
I want a simple, guided flow that gets me recording quickly,
So that I spend my time giving valuable feedback instead of navigating UI steps.

## Problem Statement

The current feedback submission flow has too many steps and context switches:
- 7-step instruction card on submit page, then 4-step instructions on review page (redundant)
- Page redirect after queue claim (disrupts flow, reloads state)
- Separate "Open Site" button and "Start Recording" button (2 clicks + tab switch)
- Mic permission check happens at recording time (surprise failure after committing to a review)
- No recording status visible when on the project tab (user has no awareness of time remaining)

## Solution Statement

Consolidate the entire give-feedback journey onto `/dashboard/feedback/submit` as a client-side state machine with 5 states: `readiness` > `claiming` > `briefing` > `recording` > `submitting`. The server page provides initial data (auth, profile, settings, in-progress reviews), then a single client component manages all transitions without page navigation.

## Feature Metadata

**Feature Type**: Enhancement
**Estimated Complexity**: High
**Primary Systems Affected**: Feedback submission UI, `useScreenRecorder` hook, `getNextReview` server action
**Dependencies**: No new external libraries needed. No database migrations required.

---

## CONTEXT REFERENCES

### Relevant Codebase Files IMPORTANT: YOU MUST READ THESE FILES BEFORE IMPLEMENTING!

- `app/(protected)/dashboard/feedback/submit/page.tsx` (full file) - Why: Current server page, will be rewritten to pass data to new client component
- `app/(protected)/dashboard/feedback/submit/get-next-review-button.tsx` (full file) - Why: Current client-side queue claim logic, will be absorbed into new component
- `app/(protected)/dashboard/feedback/[id]/review/review-session.tsx` (full file) - Why: Current review session with briefing, recorder, and submit form. This is the main source of logic to consolidate into the new single-page component
- `app/(protected)/dashboard/feedback/[id]/review/page.tsx` (full file) - Why: Server page that fetches feedback request data. This data-fetching pattern needs to move client-side
- `hooks/useScreenRecorder.ts` (full file) - Why: Core recording hook, needs minor enhancement for tab title updates
- `components/feedback/RecorderControls.tsx` (full file) - Why: Existing recorder UI with mic warning banner. The mic warning banner will be reused. The recording controls will be redesigned for the recording dashboard
- `components/feedback/ScreenRecorder.tsx` (full file) - Why: Standalone recorder wrapper, may become unused after this change
- `components/protected/dashboard/ReviewerSignals.tsx` (full file) - Why: Signal checkboxes used in submit form, will be reused as-is
- `app/actions.ts` (lines 536-571) - Why: `getNextReview` server action. Needs to return `review_id` in addition to `pr_id`
- `utils/supabase/settings.ts` (full file) - Why: SystemSettings type and getSettings helper. Settings will be passed from server page
- `utils/supabase/profiles.ts` (full file) - Why: Profile type. Profile will be passed from server page
- `utils/supabase/client.ts` (full file) - Why: Browser Supabase client for client-side data fetching
- `components/ui/spinner.tsx` (full file) - Why: Loading spinner component used throughout
- `types/database.types.ts` (lines 368-374) - Why: `get_next_review` RPC return type shows it already returns `{ pr_id, review_id }`

### New Files to Create

- `app/(protected)/dashboard/feedback/submit/feedback-flow.tsx` - Main client component managing the entire single-page flow state machine
- `app/(protected)/dashboard/feedback/submit/steps/readiness-step.tsx` - Mic check + first-time intro UI
- `app/(protected)/dashboard/feedback/submit/steps/briefing-step.tsx` - Project briefing after claim + "Open & Start Recording" button
- `app/(protected)/dashboard/feedback/submit/steps/recording-step.tsx` - Full-page recording dashboard with countdown
- `app/(protected)/dashboard/feedback/submit/steps/submit-step.tsx` - Post-recording submit form (video preview, rating, feedback, signals)

### Files to Modify

- `app/(protected)/dashboard/feedback/submit/page.tsx` - Rewrite to pass server data to new FeedbackFlow client component
- `app/actions.ts` - Modify `getNextReview` to also return `review_id`
- `hooks/useScreenRecorder.ts` - Add tab title update during recording countdown

### Files That Will Become Partially Unused

- `app/(protected)/dashboard/feedback/[id]/review/page.tsx` - Keep as-is for backward compat (handles in-progress reviews from direct URL)
- `app/(protected)/dashboard/feedback/[id]/review/review-session.tsx` - Keep as-is, the review page still uses it
- `app/(protected)/dashboard/feedback/submit/get-next-review-button.tsx` - Will no longer be imported by page.tsx but keep the file for now
- `components/feedback/ScreenRecorder.tsx` - Standalone wrapper, not used in new flow

### Relevant Documentation YOU SHOULD READ THESE BEFORE IMPLEMENTING!

- MDN `getDisplayMedia()` API: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getDisplayMedia
  - Why: Understand browser constraints on screen sharing (must be user gesture, can't pre-select tab)
- MDN `getUserMedia()` API: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
  - Why: Mic permission flow and error handling
- MDN `document.title`: https://developer.mozilla.org/en-US/docs/Web/API/Document/title
  - Why: Dynamic tab title updates during recording

### Patterns to Follow

**Server Page Data Passing Pattern:**
The server page fetches data and passes it to a client component via props. See how `review-session.tsx` receives `feedbackRequest`, `reviewId`, `minDuration`, `maxDuration` from `[id]/review/page.tsx`.

**Server Action Return Pattern:**
`getNextReview()` returns `Promise<{ error: string } | { pr_id: string } | undefined>`. We'll expand this to `Promise<{ error: string } | { pr_id: string; review_id: string } | undefined>`.

**Client-Side Supabase Fetch Pattern:**
```typescript
import { createClient } from "@/utils/supabase/client";
const supabase = createClient();
const { data } = await supabase.from("feedback_requests").select("*").eq("id", prId).single();
```

**Error Handling Pattern:**
Use `toast` from Sonner for user-facing errors. Use `setError` state for inline errors.

**Styling Pattern:**
- Dark theme tokens: `dark-bg`, `dark-card`, `dark-surface`, `dark-text`, `dark-border`, `dark-text-muted`
- Gold accent: `bg-primary`, `hover:bg-primary-muted`
- Use `cn()` from `@/lib/utils` for conditional classes
- NEVER use em dashes in copy or comments

**State Machine Pattern (new for this component):**
```typescript
type FlowStep = "readiness" | "claiming" | "briefing" | "recording" | "submitting";
const [step, setStep] = useState<FlowStep>("readiness");
```

---

## IMPLEMENTATION PLAN

### Phase 1: Server Action Enhancement

Modify the `getNextReview` server action to return `review_id` alongside `pr_id`. The RPC already returns both values, but the action currently only passes `pr_id` through.

### Phase 2: Core Client Component (State Machine)

Create the main `FeedbackFlow` client component that manages the entire journey. This is the orchestrator that renders each step and manages transitions.

### Phase 3: Step Components

Build each step as a focused component:
1. **ReadinessStep** - Mic check, first-time intro, "Get Next Project" button
2. **BriefingStep** - Project details, "Open & Start Recording" button
3. **RecordingStep** - Full-page recording dashboard with countdown
4. **SubmitStep** - Video preview, rating, feedback form, signals

### Phase 4: Recording Dashboard Enhancement

Add tab title updates to the `useScreenRecorder` hook and build the full-page recording UI.

### Phase 5: Server Page Rewrite

Rewrite the server page to fetch all necessary data and pass it to the client component.

### Phase 6: Integration & Cleanup

Wire everything together, handle edge cases (in-progress reviews, empty queue, etc.).

---

## STEP-BY-STEP TASKS

IMPORTANT: Execute every task in order, top to bottom. Each task is atomic and independently testable.

### Task 1: UPDATE `app/actions.ts` - Return `review_id` from `getNextReview`

- **IMPLEMENT**: Modify `getNextReview` to return `{ pr_id: string; review_id: string }` instead of just `{ pr_id: string }`. The RPC `get_next_review` already returns both fields (see `types/database.types.ts:368-374`). Simply include `review_id` in the return.
- **PATTERN**: Follow existing return pattern at `app/actions.ts:570`
- **CURRENT CODE** (line 570):
  ```typescript
  return { pr_id: data[0].pr_id };
  ```
- **NEW CODE**:
  ```typescript
  return { pr_id: data[0].pr_id, review_id: data[0].review_id };
  ```
- **ALSO UPDATE**: The return type signature on line 536:
  ```typescript
  // FROM:
  export async function getNextReview(): Promise<{ error: string } | { pr_id: string } | undefined>
  // TO:
  export async function getNextReview(): Promise<{ error: string } | { pr_id: string; review_id: string } | undefined>
  ```
- **ALSO UPDATE**: The check on line 553-554 for existing in-progress review. Fetch `id` alongside `feedback_request_id`:
  ```typescript
  const { data: existingReview } = await supabase
    .from("reviews")
    .select("id, feedback_request_id")
    .eq("reviewer_id", user.id)
    .eq("status", "in_progress")
    .limit(1)
    .single();

  if (existingReview) {
    return { pr_id: existingReview.feedback_request_id, review_id: existingReview.id };
  }
  ```
- **GOTCHA**: The `get-next-review-button.tsx` component checks for `"pr_id" in result` which will still work. But it doesn't use `review_id`, so no breakage. The `[id]/review/page.tsx` route still works independently.
- **VALIDATE**: `npm run build` should pass (ignoreBuildErrors is true, but check for obvious issues)

### Task 2: CREATE `app/(protected)/dashboard/feedback/submit/steps/readiness-step.tsx`

- **IMPLEMENT**: Client component for the readiness check step. Responsibilities:
  1. Display mic status indicator (green check if granted, amber warning if denied/unavailable)
  2. Show first-time intro card (dismissable, stored in `localStorage` key `peerpull_feedback_intro_dismissed`)
  3. Show mic device selector dropdown (reuse pattern from `RecorderControls.tsx:104-118`)
  4. Show the MicWarningBanner if mic is denied/unavailable (import from RecorderControls or extract it)
  5. Show "Get Next Project" button, disabled until mic is granted
  6. Handle the claiming transition

- **PROPS INTERFACE**:
  ```typescript
  interface ReadinessStepProps {
    micStatus: MicStatus;
    audioDevices: AudioDevice[];
    selectedMic: string;
    onSelectMic: (deviceId: string) => void;
    onRefreshMic: () => void;
    isSupported: boolean;
    onGetNextProject: () => void;
    isClaiming: boolean;
  }
  ```

- **FIRST-TIME INTRO**: A compact, dismissable card with 3 key points:
  - "Record your screen while exploring a project and thinking out loud"
  - "Takes 1-5 minutes, earn PeerPoints for each feedback"
  - "Your microphone and screen will be recorded"
  - Dismiss button that sets `localStorage.setItem("peerpull_feedback_intro_dismissed", "true")`
  - Check `localStorage.getItem("peerpull_feedback_intro_dismissed")` on mount

- **MIC STATUS DISPLAY**: Small inline indicator:
  - Granted: green dot + "Microphone ready" + device selector dropdown
  - Denied: amber MicWarningBanner (reuse the component from RecorderControls.tsx, extract it if needed)
  - Unavailable: amber banner for no device
  - Unknown: subtle "Checking microphone..." text

- **GET NEXT PROJECT BUTTON**: Same styling as current (`bg-primary hover:bg-primary-muted px-8 py-3 text-base`), disabled when mic not granted or when claiming is in progress.

- **PATTERN**: Follow dark theme styling from `RecorderControls.tsx`. Cards use `rounded-xl border border-dark-border bg-dark-card p-6`.
- **IMPORTS**: `MicStatus`, `AudioDevice` from `@/hooks/useScreenRecorder`, `Button` from `@/components/ui/button`, `Spinner` from `@/components/ui/spinner`, `Mic`, `MicOff`, `CheckCircle`, `X` from `lucide-react`
- **GOTCHA**: `localStorage` is not available during SSR. Guard with `typeof window !== "undefined"` check, or use a `useEffect` to read the intro dismissed state.
- **VALIDATE**: Component renders without errors when given mock props

### Task 3: CREATE `app/(protected)/dashboard/feedback/submit/steps/briefing-step.tsx`

- **IMPLEMENT**: Client component showing the project briefing after queue claim. Responsibilities:
  1. Display project info: title, description, stage badge, categories, focus areas, questions
  2. Show the project URL prominently
  3. Single "Open Project & Start Recording" button
  4. Mic device selector (in case user wants to change before recording)

- **PROPS INTERFACE**:
  ```typescript
  interface FeedbackRequestData {
    id: string;
    title: string;
    url: string;
    description: string;
    stage: string;
    categories: string[];
    focusAreas: string[];
    questions: string[];
    founderName: string;
  }

  interface BriefingStepProps {
    feedbackRequest: FeedbackRequestData;
    audioDevices: AudioDevice[];
    selectedMic: string;
    onSelectMic: (deviceId: string) => void;
    onStartRecording: () => void;
  }
  ```

- **LAYOUT**: Compact briefing card, not a full page of text. Structure:
  1. Project header: title + stage badge + "by {founderName}"
  2. Description (if present), max 3 lines with truncation
  3. Focus areas and categories as badges/chips (horizontal layout)
  4. Questions to address as a numbered list (if any)
  5. URL shown as a subtle link preview
  6. Mic selector dropdown (small, bottom of card)
  7. Big "Open Project & Start Recording" button (full-width, gradient style like the current "Start Recording" button)

- **PATTERN**: Mirror the briefing layout from `review-session.tsx:140-233` but more compact. Use `Badge` component from `@/components/ui/badge` for stage/categories.
- **IMPORTS**: `Badge` from `@/components/ui/badge`, `Button` from `@/components/ui/button`, `Card/CardContent/CardHeader/CardTitle` from `@/components/ui/card`, `Mic`, `ExternalLink`, `Play` from `lucide-react`, `AudioDevice` from `@/hooks/useScreenRecorder`
- **VALIDATE**: Component renders with mock feedbackRequest data

### Task 4: CREATE `app/(protected)/dashboard/feedback/submit/steps/recording-step.tsx`

- **IMPLEMENT**: Full-page recording dashboard visible on the PeerPull tab while user records on the project tab. This is the most visually distinctive step.

- **PROPS INTERFACE**:
  ```typescript
  interface RecordingStepProps {
    feedbackRequest: FeedbackRequestData;
    duration: number;
    maxDuration: number;
    minDuration: number;
    warning: boolean;
    error: string | null;
    onStopRecording: () => void;
  }
  ```

- **LAYOUT**: Full-height centered dashboard with:
  1. **Large pulsing recording indicator** - red dot with ping animation (reuse from `RecorderControls.tsx:140-143`)
  2. **Countdown timer** - large font, shows time REMAINING (not elapsed). Format: `3:42 remaining`. Calculate as `maxDuration - duration`. When remaining <= 30s, turn red and bold.
  3. **Progress bar** - full-width bar that drains from left to right. Color transitions: green (>60% remaining) > yellow (30-60%) > red (<30%). Use a simple div with width percentage.
  4. **Minimum duration indicator** - if `duration < minDuration`, show "Record at least {minDuration}s" with a secondary progress bar showing progress toward minimum.
  5. **Project reminder card** - compact card showing project title and questions to address (so user can glance at it when switching back)
  6. **Stop Recording button** - large, red, center-positioned. Disabled if `duration < minDuration`.
  7. **Error display** - if screen share or recording errors out

- **IMPORTANT UX DETAIL**: The text should acknowledge that the user is probably on another tab: "Recording in progress. Switch to the project tab to continue." Small text below: "Come back here to stop recording when you're done."

- **PATTERN**: Use the pulsing animation from `RecorderControls.tsx`. Use `formatTime` helper (copy from RecorderControls).
- **IMPORTS**: `Button` from `@/components/ui/button`, `cn` from `@/lib/utils`, `Square` (stop icon) from `lucide-react`
- **GOTCHA**: The progress bar width should be calculated as a percentage: `((maxDuration - duration) / maxDuration) * 100`. Clamp to 0-100.
- **VALIDATE**: Component renders with mock duration/maxDuration values

### Task 5: CREATE `app/(protected)/dashboard/feedback/submit/steps/submit-step.tsx`

- **IMPLEMENT**: Post-recording submit form. This consolidates the form from `review-session.tsx:236-351`.

- **PROPS INTERFACE**:
  ```typescript
  interface SubmitStepProps {
    feedbackRequest: FeedbackRequestData;
    reviewId: string;
    previewUrl: string;
    duration: number;
    minDuration: number;
    getBlob: () => Blob | null;
  }
  ```

- **LAYOUT** (mirrors current review-session submit form):
  1. Video preview player
  2. Duration warning if below minimum (with re-record suggestion)
  3. Questions to address reminder (if any)
  4. Rating stars (required)
  5. Strengths textarea (min 50 chars)
  6. Improvements textarea (min 50 chars)
  7. ReviewerSignals component (reuse as-is)
  8. Submit button
  9. Re-record button (triggers callback to go back to recording step)

- **SUBMIT LOGIC**: Port the `handleSubmit` function from `review-session.tsx:59-113`:
  1. Upload video blob to Supabase Storage (`review-videos` bucket)
  2. Get public URL
  3. Call `submitReview` server action with FormData
  4. Handle success (redirect) and error (toast)

- **ALSO ADD**: A "Re-record" button/link that calls an `onReRecord` callback prop to transition back to the briefing step (which resets the recorder).

- **PATTERN**: Copy the form structure from `review-session.tsx:270-349`. Reuse `ReviewerSignals` component as-is.
- **IMPORTS**: `Card/CardContent/CardHeader/CardTitle` from `@/components/ui/card`, `Label` from `@/components/ui/label`, `Textarea` from `@/components/ui/textarea`, `Button` from `@/components/ui/button`, `Spinner` from `@/components/ui/spinner`, `ReviewerSignals` from `@/components/protected/dashboard/ReviewerSignals`, `createClient` from `@/utils/supabase/client`, `submitReview` from `@/app/actions`, `toast` from `sonner`
- **VALIDATE**: Component renders with mock props

### Task 6: CREATE `app/(protected)/dashboard/feedback/submit/feedback-flow.tsx`

- **IMPLEMENT**: The main orchestrator client component. Manages the state machine and renders the appropriate step.

- **PROPS INTERFACE**:
  ```typescript
  interface FeedbackFlowProps {
    initialReview?: {
      reviewId: string;
      feedbackRequestId: string;
    };
    minDuration: number;
    maxDuration: number;
  }
  ```

- **STATE MACHINE**:
  ```typescript
  type FlowStep = "readiness" | "briefing" | "recording" | "submitting";
  ```
  - `readiness`: Shows ReadinessStep. Transitions to `briefing` after successful queue claim.
  - `briefing`: Shows BriefingStep. Transitions to `recording` when user clicks "Open & Start Recording".
  - `recording`: Shows RecordingStep. Transitions to `submitting` when recording stops.
  - `submitting`: Shows SubmitStep. Redirects on success.

- **KEY STATE**:
  ```typescript
  const [step, setStep] = useState<FlowStep>("readiness");
  const [feedbackRequest, setFeedbackRequest] = useState<FeedbackRequestData | null>(null);
  const [reviewId, setReviewId] = useState<string | null>(null);
  const recorder = useScreenRecorder({ maxDuration });
  ```

- **INITIALIZATION LOGIC**:
  - Call `recorder.refreshMicList()` on mount
  - If `initialReview` is provided (user has in-progress review), fetch the feedback request data client-side and jump to the appropriate step:
    - If recorder status is idle, go to `briefing` step
    - This handles the case where user refreshes the page mid-review

- **CLAIM HANDLER** (`handleGetNextProject`):
  ```typescript
  async function handleGetNextProject() {
    const result = await getNextReview();
    if (result && "error" in result) {
      toast.error(result.error); // or toast.info for "no projects"
      return;
    }
    if (result && "pr_id" in result) {
      posthog.capture("review_started", { feedback_request_id: result.pr_id });
      // Fetch feedback request data client-side
      const supabase = createClient();
      const { data: pr } = await supabase.from("feedback_requests").select("*").eq("id", result.pr_id).single();
      const { data: founderProfile } = await supabase.from("profiles").select("full_name").eq("id", pr.user_id).single();
      setFeedbackRequest({
        id: pr.id,
        title: pr.title,
        url: pr.url || "",
        description: pr.description || "",
        stage: pr.stage || "",
        categories: pr.categories || [],
        focusAreas: pr.focus_areas || [],
        questions: pr.questions || [],
        founderName: founderProfile?.full_name || "Anonymous",
      });
      setReviewId(result.review_id);
      setStep("briefing");
    }
  }
  ```

- **OPEN & START RECORDING HANDLER** (`handleOpenAndRecord`):
  ```typescript
  async function handleOpenAndRecord() {
    if (!feedbackRequest?.url) {
      toast.error("No project URL available");
      return;
    }
    // Open project in background tab (user gesture allows this)
    window.open(feedbackRequest.url, "_blank");
    // Small delay to let the tab open, then trigger screen share
    // The getDisplayMedia picker will show the newly opened tab
    await recorder.startRecording();
    // If recording started successfully, transition to recording step
    // The recorder.status will change to "recording" via the hook
  }
  ```
  Note: We need to watch `recorder.status` changes to determine step transitions.

- **STATUS-DRIVEN TRANSITIONS**:
  Use a `useEffect` to watch recorder status:
  ```typescript
  useEffect(() => {
    if (recorder.status === "recording" && step === "briefing") {
      setStep("recording");
    }
    if (recorder.status === "stopped" && step === "recording") {
      setStep("submitting");
    }
  }, [recorder.status, step]);
  ```

- **TAB TITLE UPDATE**:
  ```typescript
  useEffect(() => {
    if (step === "recording") {
      const remaining = maxDuration - recorder.duration;
      const mins = Math.floor(remaining / 60);
      const secs = remaining % 60;
      document.title = `🔴 ${mins}:${secs.toString().padStart(2, "0")} - Recording | PeerPull`;
    } else {
      document.title = "Give Feedback | PeerPull";
    }
    // Restore on unmount
    return () => { document.title = "PeerPull"; };
  }, [step, recorder.duration, maxDuration]);
  ```

- **RE-RECORD HANDLER**: Reset recorder and go back to briefing step:
  ```typescript
  function handleReRecord() {
    recorder.resetRecording();
    setStep("briefing");
  }
  ```

- **RENDER**:
  ```tsx
  switch (step) {
    case "readiness":
      return <ReadinessStep ... />;
    case "briefing":
      return <BriefingStep ... />;
    case "recording":
      return <RecordingStep ... />;
    case "submitting":
      return <SubmitStep ... onReRecord={handleReRecord} />;
  }
  ```

- **IMPORTS**: `useScreenRecorder` from `@/hooks/useScreenRecorder`, `getNextReview` from `@/app/actions`, `createClient` from `@/utils/supabase/client`, `toast` from `sonner`, `posthog` from `posthog-js`, all step components
- **GOTCHA**: The `startRecording` function in useScreenRecorder is async and may fail (user cancels screen share dialog). If it fails, stay on `briefing` step. The recorder will set `error` state which the BriefingStep should display.
- **GOTCHA**: When `initialReview` is provided, the user already has an in-progress review. Fetch feedback request data immediately and start at `briefing` step.
- **GOTCHA**: RLS will be in effect for client-side fetches. The user can read feedback_requests that are in the queue (status open) and profiles (public fields). This should work with existing RLS policies since the review assignment gives the reviewer access.
- **VALIDATE**: Component compiles and renders initial readiness step

### Task 7: UPDATE `app/(protected)/dashboard/feedback/submit/page.tsx`

- **IMPLEMENT**: Rewrite the server page to be a thin data-fetching wrapper that passes props to the new `FeedbackFlow` client component.

- **KEEP**: The "not active" gate (waitlisted users see "Coming Soon")
- **KEEP**: The check for in-progress reviews
- **CHANGE**: Instead of rendering the instruction card + GetNextReviewButton, render `<FeedbackFlow>` with server-fetched data

- **NEW SERVER PAGE**:
  ```tsx
  import { redirect } from "next/navigation";
  import { createClient } from "@/utils/supabase/server";
  import { getSettings } from "@/utils/supabase/settings";
  import { getUserProfile } from "@/utils/supabase/profiles";
  import { FeedbackFlow } from "./feedback-flow";
  import { Lock } from "lucide-react";
  import Link from "next/link";
  import { Button } from "@/components/ui/button";

  export default async function FeedbackSubmitPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return redirect("/signin");

    const profile = await getUserProfile(user);
    const settings = await getSettings();
    const isActive = profile?.status === 'active' || settings.platform_launched;

    if (!isActive) {
      return (
        // ... same "Coming Soon" UI as current ...
      );
    }

    // Check for in-progress reviews
    const { data: myReviews } = await supabase
      .from("reviews")
      .select("id, feedback_request_id")
      .eq("reviewer_id", user.id)
      .in("status", ["in_progress"])
      .order("created_at", { ascending: false })
      .limit(1);

    const initialReview = myReviews && myReviews.length > 0
      ? { reviewId: myReviews[0].id, feedbackRequestId: myReviews[0].feedback_request_id }
      : undefined;

    return (
      <FeedbackFlow
        initialReview={initialReview}
        minDuration={settings.min_video_duration_seconds}
        maxDuration={settings.max_video_duration_seconds}
      />
    );
  }
  ```

- **PATTERN**: Mirror the server data-fetching from `[id]/review/page.tsx`
- **GOTCHA**: The old page imported `GetNextReviewButton`. Remove that import. The `get-next-review-button.tsx` file stays in place for now (not deleted, just unused by this page).
- **VALIDATE**: `npm run build` passes. Page renders at `/dashboard/feedback/submit`.

### Task 8: UPDATE `app/(protected)/dashboard/feedback/submit/get-next-review-button.tsx` - Handle new return type

- **IMPLEMENT**: Update the component to handle the new `review_id` in the return type from `getNextReview`. Even though this component is no longer used by the main page, it's referenced in the `[id]/review` redirect flow and should stay compatible.
- **CURRENT CODE** (line 24):
  ```typescript
  } else if (result && "pr_id" in result) {
  ```
  This check still works since the return object will have `pr_id`. No actual change needed here, but verify it compiles.
- **VALIDATE**: No compile errors

### Task 9: Ensure backward compatibility for `/feedback/[id]/review` route

- **IMPLEMENT**: The existing `[id]/review/page.tsx` should continue to work as-is. It's used when:
  1. User navigates directly to an in-progress review URL
  2. User clicks "Continue Review" from the in-progress page
  3. Links from notifications point here

- **NO CHANGES NEEDED** to this file. It already redirects to `/dashboard/feedback/submit` if no valid in-progress review exists. The server-side data fetching works independently.

- **VALIDATE**: Navigating to `/dashboard/feedback/[valid-id]/review` still loads the old ReviewSession component.

### Task 10: Extract MicWarningBanner for reuse

- **IMPLEMENT**: The `MicWarningBanner` function in `RecorderControls.tsx` (lines 14-58) is currently a private function inside that file. For the new ReadinessStep, we need to either:
  - Option A: Export it from `RecorderControls.tsx`
  - Option B: Create a shared `components/feedback/MicWarningBanner.tsx`

  Go with **Option A** (simpler): just add `export` before the function declaration.

- **CURRENT CODE** (RecorderControls.tsx line 14):
  ```typescript
  function MicWarningBanner(...)
  ```
- **NEW CODE**:
  ```typescript
  export function MicWarningBanner(...)
  ```

- **VALIDATE**: Import works in readiness-step.tsx

---

## TESTING STRATEGY

### No Automated Tests

This project has no test framework configured (hackathon trade-off noted in CLAUDE.md). Validation is manual.

### Manual Testing Plan

**Test 1: First-Time User Flow**
1. Clear localStorage (delete `peerpull_feedback_intro_dismissed`)
2. Navigate to `/dashboard/feedback/submit`
3. Verify intro card appears
4. Verify mic check runs automatically
5. Dismiss intro card, verify it doesn't reappear on refresh
6. Click "Get Next Project" (must have a project in queue)
7. Verify briefing appears inline (no page redirect)
8. Click "Open Project & Start Recording"
9. Verify project opens in new tab and screen share picker appears
10. Select the project tab, verify recording starts
11. Verify PeerPull tab shows recording dashboard with countdown
12. Verify browser tab title shows recording indicator
13. Stop recording, verify submit form appears
14. Fill in rating + feedback, submit
15. Verify redirect to submit page with success state

**Test 2: Returning User Flow**
1. With intro already dismissed, verify page goes straight to mic check + button
2. Complete a full review cycle

**Test 3: Mic Denied Flow**
1. Block microphone in browser settings
2. Navigate to submit page
3. Verify warning banner appears
4. Verify "Get Next Project" button is disabled
5. Grant mic permission, click retry
6. Verify button becomes enabled

**Test 4: In-Progress Review Resume**
1. Start a review but don't finish (close tab)
2. Navigate back to `/dashboard/feedback/submit`
3. Verify it detects the in-progress review and shows briefing step

**Test 5: Empty Queue**
1. Ensure no projects in queue
2. Click "Get Next Project"
3. Verify toast: "No projects available in the queue right now"

**Test 6: Backward Compatibility**
1. Navigate directly to `/dashboard/feedback/[id]/review` with a valid in-progress review
2. Verify old ReviewSession still works

**Test 7: Screen Share Cancellation**
1. Click "Open Project & Start Recording"
2. Cancel the screen share picker
3. Verify stays on briefing step with error message
4. Can retry by clicking the button again

**Test 8: Recording Too Short**
1. Record for less than minimum duration
2. Stop recording
3. Verify warning about minimum duration
4. Verify submit button is disabled
5. Click re-record, verify returns to briefing step

---

## VALIDATION COMMANDS

### Level 1: Build Check

```bash
npm run build
```
Build should pass. Note: `ignoreBuildErrors: true` is set, but we should still aim for zero TS errors in our new files.

### Level 2: Dev Server

```bash
npm run dev
```
Navigate to `http://localhost:3000/dashboard/feedback/submit` and verify the page renders.

### Level 4: Manual Validation

Follow the 8 test scenarios above.

---

## ACCEPTANCE CRITERIA

- [ ] Page loads without errors at `/dashboard/feedback/submit`
- [ ] Mic check runs silently on page load
- [ ] First-time intro shows and is dismissable (persists across page loads)
- [ ] "Get Next Project" button disabled when mic not granted
- [ ] Queue claim happens without page redirect (briefing loads inline)
- [ ] "Open Project & Start Recording" opens URL AND triggers screen share in one click
- [ ] Recording dashboard shows countdown timer, progress bar, and project reminder
- [ ] Browser tab title updates with recording countdown
- [ ] Stop recording transitions to submit form
- [ ] Submit form works (upload video, submit review, redirect)
- [ ] Re-record button resets to briefing step
- [ ] In-progress reviews detected and resumed
- [ ] `/feedback/[id]/review` route still works as fallback
- [ ] No regressions in existing review functionality
- [ ] Empty queue handled gracefully with toast message
- [ ] Screen share cancellation handled gracefully

---

## COMPLETION CHECKLIST

- [ ] All tasks completed in order
- [ ] Each task validation passed immediately
- [ ] All validation commands executed successfully
- [ ] Manual testing confirms feature works
- [ ] Acceptance criteria all met
- [ ] Code follows project dark-theme styling conventions
- [ ] No em dashes used in any copy or comments

---

## NOTES

### Design Decisions

1. **Single client component orchestrator**: Rather than complex routing, a single FeedbackFlow component manages all states. This avoids page transitions and keeps state (recorder, form data) alive across steps.

2. **Client-side fetch after claim**: After `getNextReview` returns the `pr_id`, we fetch the feedback request data client-side using the browser Supabase client. This avoids needing a new server action that returns the full feedback request data. RLS allows reading feedback_requests that are in the queue.

3. **Tab title for recording awareness**: Since we can't overlay UI on the recorded tab, the browser tab title is the best passive indicator. Users naturally glance at their tab bar.

4. **Keep [id]/review route**: Backward compatibility for direct links, notification deep links, and in-progress page links. No disruption to existing flows.

5. **No database changes**: The RPC already returns `review_id`. We just need to pass it through the server action. No migrations needed.

### Risks

1. **`window.open` + `getDisplayMedia` timing**: Both triggered from the same click. Browsers generally allow both from a user gesture, but there's a small risk one blocks the other. If `window.open` gets blocked, the screen share dialog still works (user can manually open the URL). If `getDisplayMedia` blocks the popup, we may need to open the tab first with a tiny delay. Test in Chrome, Edge, Firefox.

2. **RLS on client-side fetch**: After claiming, the reviewer needs to read the feedback_request. The existing RLS policy allows reading feedback_requests with `status = 'open'` or where the user is the owner. After claiming, the status is still 'open' (queue_position is set to NULL but status stays 'open'). Need to verify this works. If not, we can add a new server action `getReviewDetails(prId)` that fetches server-side.

3. **State loss on page refresh**: If the user refreshes during recording, the recording is lost. The `initialReview` prop handles resuming from the briefing step, but the actual recording data is gone. This is the same as the current behavior (refreshing the review page also loses recording state). We mitigate by showing a clear "recording in progress" state that discourages leaving.

### Future Improvements (Out of Scope)

- Picture-in-Picture timer overlay (Chrome-only, requires additional permission)
- Browser Notifications API for time warnings (another permission prompt)
- Automatic project tab focus after screen share selection
- Progress auto-save for review form fields
