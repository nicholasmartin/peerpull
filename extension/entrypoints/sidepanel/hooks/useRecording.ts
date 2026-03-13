import { useState, useEffect, useCallback } from "react";
import { getAuthTokens } from "@/lib/storage";
import type { ExtensionMessage, CachedSettings } from "@/lib/messages";

export type RecordingStatus =
  | "idle"
  | "recording"
  | "paused"
  | "stopped"
  | "uploading"
  | "uploaded"
  | "error";

interface UseRecordingOptions {
  settings: CachedSettings | null;
}

export function useRecording({ settings }: UseRecordingOptions) {
  const [status, setStatus] = useState<RecordingStatus>("idle");
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const minDuration = settings?.minVideoDuration ?? 60;
  const maxDuration = settings?.maxVideoDuration ?? 300;
  const warningThreshold = maxDuration - 30;

  const isMinDurationMet = duration >= minDuration;
  const isWarning = duration >= warningThreshold;
  const progress = maxDuration > 0 ? Math.min(duration / maxDuration, 1) : 0;

  // Listen for messages from background/offscreen
  useEffect(() => {
    const listener = (message: ExtensionMessage) => {
      console.log("[PeerPull Recording] Message received:", message.type, message);
      switch (message.type) {
        case "RECORDING_STARTED":
          setStatus("recording");
          setError(null);
          break;
        case "RECORDING_PAUSED":
          setStatus("paused");
          break;
        case "RECORDING_RESUMED":
          setStatus("recording");
          break;
        case "RECORDING_TICK":
          setDuration(message.duration);
          // Auto-stop at max duration
          if (message.duration >= maxDuration) {
            chrome.runtime.sendMessage({ type: "STOP_RECORDING" } satisfies ExtensionMessage);
          }
          break;
        case "RECORDING_STOPPED":
          setDuration(message.duration);
          setStatus("stopped");
          break;
        case "RECORDING_ERROR":
          setError(message.error);
          setStatus("error");
          break;
        case "UPLOAD_COMPLETE":
          setVideoUrl(message.videoUrl);
          setStatus("uploaded");
          break;
        case "UPLOAD_ERROR":
          setError(message.error);
          setStatus("error");
          break;
      }
    };

    chrome.runtime.onMessage.addListener(listener);
    return () => chrome.runtime.onMessage.removeListener(listener);
  }, [maxDuration]);

  const startRecording = useCallback(async (micDeviceId?: string) => {
    setError(null);
    setDuration(0);
    setVideoUrl(null);

    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const tab = tabs[0];
    const tabId = tab?.id;
    console.log("[PeerPull Recording] Starting recording, tab:", tabId);
    if (!tabId) {
      setError("No active tab found.");
      setStatus("error");
      return;
    }

    // Ensure mic permission is granted via content script iframe injection.
    // Routed through the background script so it can inject the content script
    // on-demand if it's not already present on the tab.
    try {
      const response = await chrome.runtime.sendMessage({
        type: "REQUEST_MIC_PERMISSION",
        tabId,
      } satisfies ExtensionMessage);
      console.log("[PeerPull Recording] Mic permission result:", response);
      if (!response?.granted) {
        setError("Microphone access is required for recording. Please allow it when prompted and try again.");
        setStatus("error");
        return;
      }
    } catch (err) {
      console.error("[PeerPull Recording] Failed to request mic permission:", err);
      // Proceed anyway; the offscreen doc will report the error if mic truly isn't available
    }

    // Get the tab capture stream ID from the side panel (foreground page).
    // In MV3, getMediaStreamId must be called from a foreground extension page
    // (side panel, popup), not from the background service worker.
    const tabUrl = tab.url || "";
    if (tabUrl.startsWith("chrome://") || tabUrl.startsWith("chrome-extension://") || tabUrl.startsWith("about:")) {
      setError("Cannot record Chrome internal pages. Please navigate to a website first.");
      setStatus("error");
      return;
    }

    let streamId: string;
    try {
      streamId = await chrome.tabCapture.getMediaStreamId({ targetTabId: tabId });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Tab capture failed";
      console.error("[PeerPull Recording] tabCapture error:", msg);
      setError(`Tab capture failed: ${msg}`);
      setStatus("error");
      return;
    }

    chrome.runtime.sendMessage(
      { type: "START_RECORDING", tabId, streamId, micDeviceId } satisfies ExtensionMessage,
      (bgResponse) => {
        console.log("[PeerPull Recording] START_RECORDING response:", bgResponse);
        if (chrome.runtime.lastError) {
          console.error("[PeerPull Recording] sendMessage error:", chrome.runtime.lastError.message);
          setError(chrome.runtime.lastError.message || "Failed to start recording");
          setStatus("error");
        }
      }
    );
  }, []);

  const stopRecording = useCallback(() => {
    chrome.runtime.sendMessage({ type: "STOP_RECORDING" } satisfies ExtensionMessage);
  }, []);

  const pauseRecording = useCallback(() => {
    chrome.runtime.sendMessage({ type: "PAUSE_RECORDING" } satisfies ExtensionMessage);
  }, []);

  const resumeRecording = useCallback(() => {
    chrome.runtime.sendMessage({ type: "RESUME_RECORDING" } satisfies ExtensionMessage);
  }, []);

  const abandonRecording = useCallback(() => {
    chrome.runtime.sendMessage({ type: "ABANDON_RECORDING" } satisfies ExtensionMessage);
    setStatus("idle");
    setDuration(0);
    setError(null);
    setVideoUrl(null);
  }, []);

  const uploadRecording = useCallback(async () => {
    setStatus("uploading");
    setError(null);

    const tokens = await getAuthTokens();
    if (!tokens) {
      setError("Not logged in. Please sign in again.");
      setStatus("error");
      return;
    }

    chrome.runtime.sendMessage({
      type: "UPLOAD_RECORDING",
      accessToken: tokens.accessToken,
    } satisfies ExtensionMessage);
  }, []);

  const reset = useCallback(() => {
    setStatus("idle");
    setDuration(0);
    setError(null);
    setVideoUrl(null);
  }, []);

  return {
    status,
    duration,
    error,
    videoUrl,
    minDuration,
    maxDuration,
    isMinDurationMet,
    isWarning,
    progress,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    abandonRecording,
    uploadRecording,
    reset,
  };
}
