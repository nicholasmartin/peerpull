"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { MicWarningBanner } from "@/components/feedback/RecorderControls";
import { Mic, MicOff, CheckCircle, X, Info } from "lucide-react";
import type { MicStatus, AudioDevice } from "@/hooks/useScreenRecorder";

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

const INTRO_DISMISSED_KEY = "peerpull_feedback_intro_dismissed";

export function ReadinessStep({
  micStatus,
  audioDevices,
  selectedMic,
  onSelectMic,
  onRefreshMic,
  isSupported,
  onGetNextProject,
  isClaiming,
}: ReadinessStepProps) {
  const [introDismissed, setIntroDismissed] = useState(true);

  useEffect(() => {
    const dismissed = localStorage.getItem(INTRO_DISMISSED_KEY);
    setIntroDismissed(dismissed === "true");
  }, []);

  function dismissIntro() {
    localStorage.setItem(INTRO_DISMISSED_KEY, "true");
    setIntroDismissed(true);
  }

  if (!isSupported) {
    return (
      <div className="mx-auto max-w-md mt-16 text-center">
        <div className="rounded-xl border border-dark-border bg-dark-card p-8">
          <MicOff className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-dark-text mb-3">Browser Not Supported</h2>
          <p className="text-dark-text-muted">
            Screen recording is not supported in this browser. Please use Chrome, Edge, or Firefox.
          </p>
        </div>
      </div>
    );
  }

  const micReady = micStatus === "granted";
  const micBlocked = micStatus === "denied" || micStatus === "unavailable";

  return (
    <div className="mx-auto max-w-lg space-y-6 pt-4">
      <h1 className="text-xl font-semibold text-dark-text">Give Feedback</h1>

      {/* First-time intro card */}
      {!introDismissed && (
        <div className="rounded-xl border border-dark-border bg-dark-card p-5 relative">
          <button
            onClick={dismissIntro}
            className="absolute top-3 right-3 text-dark-text-muted hover:text-dark-text transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="flex items-start gap-3 mb-3">
            <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <h2 className="text-sm font-semibold text-dark-text">How it works</h2>
          </div>
          <ul className="space-y-2 text-sm text-dark-text-muted ml-8">
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">1.</span>
              Record your screen while exploring a project and thinking out loud
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">2.</span>
              Takes 1-5 minutes, earn PeerPoints for each feedback you give
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">3.</span>
              Your microphone and screen will be recorded
            </li>
          </ul>
          <div className="mt-3 ml-8 rounded-md bg-dark-surface px-3 py-2 text-xs text-dark-text-muted">
            <strong>Tip:</strong> Think out loud. Founders get the most value from hearing your raw reactions.
          </div>
        </div>
      )}

      {/* Mic status section */}
      <div className="rounded-xl border border-dark-border bg-dark-card p-5 space-y-4">
        <h2 className="text-sm font-semibold text-dark-text">Readiness Check</h2>

        {micStatus === "unknown" && (
          <div className="flex items-center gap-2 text-sm text-dark-text-muted">
            <Spinner size="sm" />
            Checking microphone...
          </div>
        )}

        {micReady && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-green-400">
              <CheckCircle className="h-4 w-4" />
              Microphone ready
            </div>
            {audioDevices.length > 0 && (
              <div className="flex items-center gap-2">
                <Mic className="h-4 w-4 text-teal-400 shrink-0" />
                <select
                  value={selectedMic}
                  onChange={(e) => onSelectMic(e.target.value)}
                  className="text-sm bg-white/10 border border-white/20 rounded-md px-2 py-1.5 text-white outline-none focus:border-teal-400 max-w-[300px] truncate"
                >
                  {audioDevices.map((device) => (
                    <option key={device.deviceId} value={device.deviceId} className="bg-[#1a1a2e] text-white">
                      {device.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}

        {micBlocked && (
          <MicWarningBanner micStatus={micStatus} onRetry={onRefreshMic} />
        )}
      </div>

      {/* Get Next Project */}
      <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
        <p className="text-sm text-dark-text-muted max-w-md">
          Click below to get assigned the next project in the queue.
          You&apos;ll earn <span className="font-semibold text-green-400">+1 PeerPoint</span> for each feedback you give.
        </p>
        <Button
          className="bg-primary hover:bg-primary-muted px-8 py-3 text-base"
          onClick={onGetNextProject}
          disabled={!micReady || isClaiming}
        >
          {isClaiming && <Spinner size="sm" />}
          {isClaiming ? "Finding a project..." : "Get Next Project"}
        </Button>
      </div>
    </div>
  );
}
