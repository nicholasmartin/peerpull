import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "./hooks/useAuth";
import { useRecording } from "./hooks/useRecording";
import { api } from "@/lib/api";
import { getCachedSettings, setCachedSettings } from "@/lib/storage";
import { NOTIFICATION_POLL_INTERVAL } from "@/lib/constants";
import type { CachedSettings } from "@/lib/messages";
import AuthGate from "./components/AuthGate";
import HomeScreen from "./components/HomeScreen";
import RecordingPanel from "./components/RecordingPanel";
import PreviewPanel from "./components/PreviewPanel";
import UploadProgress from "./components/UploadProgress";

export default function App() {
  const { user, isLoading: authLoading, isAuthenticated, error: authError, login, logout, refreshProfile } = useAuth();
  const [settings, setSettings] = useState<CachedSettings | null>(null);

  const recording = useRecording({ settings });

  // Fetch settings on auth
  useEffect(() => {
    if (!isAuthenticated) return;

    async function loadSettings() {
      // Try cache first
      const cached = await getCachedSettings();
      if (cached) {
        setSettings(cached);
        return;
      }

      // Fetch from API
      try {
        const data = await api.getSettings();
        const s: CachedSettings = {
          minVideoDuration: data.min_video_duration,
          maxVideoDuration: data.max_video_duration,
          reviewReward: data.review_reward,
          platformLaunched: data.platform_launched,
        };
        setSettings(s);
        await setCachedSettings(s);
      } catch {
        // Use defaults if fetch fails
        setSettings({
          minVideoDuration: 60,
          maxVideoDuration: 300,
          reviewReward: 1,
          platformLaunched: false,
        });
      }
    }

    loadSettings();
  }, [isAuthenticated]);

  // Notification polling
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (!isAuthenticated) {
      if (pollRef.current) clearInterval(pollRef.current);
      return;
    }

    pollRef.current = setInterval(() => {
      refreshProfile();
    }, NOTIFICATION_POLL_INTERVAL);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [isAuthenticated, refreshProfile]);

  // Loading state
  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 text-primary animate-spin mx-auto mb-3" />
          <p className="text-xs text-dark-text-muted">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated || !user) {
    return <AuthGate onLogin={login} isLoading={authLoading} error={authError} />;
  }

  // Upload states
  if (recording.status === "uploading" || recording.status === "uploaded") {
    return (
      <UploadProgress
        status={recording.status}
        error={recording.error}
        onRetry={recording.uploadRecording}
        onDone={recording.reset}
      />
    );
  }

  // Upload error (separate from recording error)
  if (recording.status === "error" && recording.videoUrl === null && recording.duration > 0) {
    return (
      <UploadProgress
        status="error"
        error={recording.error}
        onRetry={recording.uploadRecording}
        onDone={recording.reset}
      />
    );
  }

  // Preview (recording stopped, not yet uploaded)
  if (recording.status === "stopped") {
    return (
      <PreviewPanel
        duration={recording.duration}
        onRedo={recording.abandonRecording}
        onUpload={recording.uploadRecording}
      />
    );
  }

  // Recording in progress
  if (recording.status === "recording" || recording.status === "paused") {
    return (
      <RecordingPanel
        duration={recording.duration}
        minDuration={recording.minDuration}
        maxDuration={recording.maxDuration}
        isMinDurationMet={recording.isMinDurationMet}
        isWarning={recording.isWarning}
        isPaused={recording.status === "paused"}
        onPause={recording.pauseRecording}
        onResume={recording.resumeRecording}
        onStop={recording.stopRecording}
        onAbandon={recording.abandonRecording}
      />
    );
  }

  // Recording error
  if (recording.status === "error") {
    return (
      <div className="flex flex-col h-screen">
        <div className="flex-1 flex flex-col items-center justify-center px-6 gap-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Recording Error</h3>
            <p className="text-xs text-danger">{recording.error}</p>
          </div>
          <button
            onClick={recording.reset}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-dark-bg hover:bg-primary-muted transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Home screen (idle)
  return (
    <HomeScreen
      profile={user}
      onRecordThisPage={() => recording.startRecording()}
      onLogout={logout}
    />
  );
}
