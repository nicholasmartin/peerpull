# PeerPull Companion Extension - Manual Test Checklist

## Prerequisites

- Chrome browser (version 116+ for Side Panel API)
- A PeerPull account with active status
- The main PeerPull app running locally (`npm run dev` from project root)
- The extension built (`cd extension && npm run build`)

## Loading the Extension

1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top right)
3. Click **Load unpacked**
4. Select the folder: `extension/.output/chrome-mv3/`
5. The PeerPull icon should appear in your toolbar

If you don't see it, click the puzzle piece icon in the toolbar and pin PeerPull Companion.

---

## Test 1: Side Panel Opens

- [ ] Click the PeerPull icon in the toolbar
- [ ] The side panel opens on the right side of the browser
- [ ] You see the login form with PeerPull branding
- [ ] The dark theme looks correct (dark background, light text)

## Test 2: Login with Invalid Credentials

- [ ] Enter a fake email and password
- [ ] Click "Sign In"
- [ ] An error message appears (e.g., "Invalid login credentials")
- [ ] The form is still usable after the error

## Test 3: Login with Valid Credentials

- [ ] Enter your real PeerPull email and password
- [ ] Click "Sign In"
- [ ] Loading spinner appears during login
- [ ] After login, you see the Home Screen with your name
- [ ] Status bar at top shows your PeerPoints balance
- [ ] Quality score shows if you have one (hidden if null)
- [ ] Notification bell shows unread count (if any)

## Test 4: Auth Persistence

- [ ] Close the side panel (click away or close it)
- [ ] Click the PeerPull icon again to reopen
- [ ] You are still logged in (no login form, goes straight to Home Screen)

## Test 5: Start Recording

- [ ] Navigate to any website (e.g., https://example.com)
- [ ] Click **"Record This Page"** in the side panel
- [ ] Recording starts. You should see:
  - A red pulsing dot with "Recording" label
  - A timer counting up from 0:00
  - A progress bar filling from left to right
  - Mic indicator showing "Active"
  - "Remaining" time counting down

**Note:** Chrome may ask for microphone permission the first time. Allow it.

## Test 6: Recording Controls

- [ ] Click **Pause**. Timer stops, dot turns amber, label says "Paused"
- [ ] Click **Resume**. Timer resumes, dot goes back to red
- [ ] The **Stop** button is disabled (grayed out) before minimum duration
- [ ] Wait until you pass the minimum duration marker on the progress bar
- [ ] The **Stop** button becomes enabled (gold color)

## Test 7: Abandon Recording

- [ ] While recording, click the **X** button (abandon)
- [ ] A confirmation prompt appears: "Discard this recording?"
- [ ] Click **"Keep Recording"**. Recording continues
- [ ] Click **X** again, then click **"Discard"**
- [ ] You return to the Home Screen

## Test 8: Stop Recording

- [ ] Start a new recording and wait past the minimum duration
- [ ] Click **Stop**
- [ ] You see the Preview Panel with:
  - A green clock icon
  - "Recording saved" message
  - Duration displayed
  - "Upload & Continue" button
  - "Redo Recording" button

## Test 9: Redo Recording

- [ ] On the Preview Panel, click **"Redo Recording"**
- [ ] You return to the Home Screen (recording discarded)

## Test 10: Upload Recording

- [ ] Start a new recording, wait past minimum duration, click Stop
- [ ] On the Preview Panel, click **"Upload & Continue"**
- [ ] You see the Upload Progress screen with a spinning loader
- [ ] After a few seconds, it transitions to "Upload complete!" with a green checkmark
- [ ] Click **"Done"** to return to the Home Screen

## Test 11: Verify Upload in Supabase

- [ ] Go to your Supabase dashboard
- [ ] Navigate to Storage > review-videos bucket
- [ ] You should see a new file named `ext-review-{timestamp}.webm`
- [ ] Click it to verify the video plays correctly

## Test 12: Max Duration Auto-Stop

- [ ] Start a recording and let it run until the maximum duration (check your system_settings, default is 300 seconds / 5 minutes)
- [ ] The recording should auto-stop when max duration is reached
- [ ] The Preview Panel appears automatically

---

## Edge Case Tests (Optional)

### Tab with Audio
- [ ] Open a YouTube video and play it
- [ ] Record with the extension
- [ ] Upload and verify the video has both your mic audio AND the tab's audio

### Logout
- [ ] Click the logout icon (bottom right of Home Screen)
- [ ] You return to the login form
- [ ] Close and reopen the side panel, login form still shows (state cleared)

### Network Error
- [ ] Stop the local dev server
- [ ] Try to login. You should see a connection error
- [ ] Restart the server, login should work again

### Notification Badge
- [ ] If you have unread notifications, the bell should show a red count badge
- [ ] Clicking the bell opens your PeerPull dashboard in a new tab

---

## Results

| Test | Pass/Fail | Notes |
|------|-----------|-------|
| 1. Side Panel Opens | | |
| 2. Invalid Login | | |
| 3. Valid Login | | |
| 4. Auth Persistence | | |
| 5. Start Recording | | |
| 6. Recording Controls | | |
| 7. Abandon Recording | | |
| 8. Stop Recording | | |
| 9. Redo Recording | | |
| 10. Upload Recording | | |
| 11. Verify in Supabase | | |
| 12. Max Duration Auto-Stop | | |

**Tested by:** _______________
**Date:** _______________
**Chrome version:** _______________
**Extension version:** 0.1.0
