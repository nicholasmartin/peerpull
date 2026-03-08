"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ExternalLink, CheckCircle, Mic, MonitorPlay, RotateCcw } from "lucide-react";
import type { AudioDevice } from "@/hooks/useScreenRecorder";

export interface FeedbackRequestData {
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
  isStarting: boolean;
  error: string | null;
}

export function BriefingStep({
  feedbackRequest,
  audioDevices,
  selectedMic,
  onSelectMic,
  onStartRecording,
  isStarting,
  error,
}: BriefingStepProps) {
  const [siteOpened, setSiteOpened] = useState(false);
  const [siteClosed, setSiteClosed] = useState(false);
  const projectWindowRef = useRef<Window | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Poll to detect if the opened project tab was closed
  const startPolling = useCallback(() => {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(() => {
      if (projectWindowRef.current?.closed) {
        setSiteClosed(true);
        setSiteOpened(false);
        projectWindowRef.current = null;
        if (pollRef.current) clearInterval(pollRef.current);
      }
    }, 1000);
  }, []);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  function handleOpenSite() {
    const win = window.open(feedbackRequest.url, "_blank");
    projectWindowRef.current = win;
    setSiteOpened(true);
    setSiteClosed(false);
    startPolling();
  }

  return (
    <div className="mx-auto max-w-xl space-y-6 pt-4">
      {/* Project info card */}
      <div className="rounded-xl border border-dark-border bg-dark-card p-5 space-y-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-lg font-semibold text-dark-text">{feedbackRequest.title}</h2>
            {feedbackRequest.stage && (
              <Badge variant="secondary" className="capitalize text-xs">{feedbackRequest.stage}</Badge>
            )}
          </div>
          <p className="text-xs text-dark-text-muted">by {feedbackRequest.founderName}</p>
        </div>

        {feedbackRequest.description && (
          <p className="text-sm text-dark-text-muted line-clamp-3">{feedbackRequest.description}</p>
        )}

        {(feedbackRequest.focusAreas.length > 0 || feedbackRequest.categories.length > 0) && (
          <div className="flex flex-wrap gap-1.5">
            {feedbackRequest.focusAreas.map((area, i) => (
              <Badge key={`focus-${i}`} variant="outline" className="text-xs">
                {area}
              </Badge>
            ))}
            {feedbackRequest.categories.map((cat, i) => (
              <Badge key={`cat-${i}`} variant="secondary" className="text-xs">
                {cat}
              </Badge>
            ))}
          </div>
        )}

        {feedbackRequest.questions.length > 0 && (
          <div className="space-y-1.5">
            <h3 className="text-xs font-semibold text-dark-text uppercase tracking-wide">Questions to address</h3>
            <ol className="list-decimal list-inside space-y-0.5">
              {feedbackRequest.questions.map((q, i) => (
                <li key={i} className="text-sm text-dark-text-muted">{q}</li>
              ))}
            </ol>
          </div>
        )}
      </div>

      {/* Three-step action cards */}
      <div className="space-y-3">
        {/* Step 1: Open project */}
        <div
          className={cn(
            "rounded-xl border p-4 transition-all",
            siteOpened
              ? "border-green-500/30 bg-green-500/5"
              : siteClosed
                ? "border-amber-500/30 bg-amber-500/5"
                : "border-primary/30 bg-primary/5",
          )}
        >
          <div className="flex items-start gap-4">
            <span
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                siteOpened
                  ? "bg-green-500/20 text-green-400"
                  : siteClosed
                    ? "bg-amber-500/20 text-amber-400"
                    : "bg-primary/20 text-primary",
              )}
            >
              {siteOpened ? <CheckCircle className="h-4 w-4" /> : "1"}
            </span>
            <div className="flex-1 min-w-0 space-y-2">
              <div>
                <h3 className="text-sm font-semibold text-dark-text">
                  {siteOpened ? "Project opened" : siteClosed ? "Tab was closed" : "Open the project"}
                </h3>
                <p className="text-xs text-dark-text-muted">
                  {siteOpened
                    ? "The project is open in another tab."
                    : siteClosed
                      ? "Looks like you closed the project tab. Open it again to continue."
                      : "Opens the project website in a new tab so you can review it."}
                </p>
              </div>
              {!siteOpened ? (
                <button
                  onClick={handleOpenSite}
                  disabled={!feedbackRequest.url}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-40",
                    siteClosed
                      ? "border border-amber-500/40 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
                      : "border border-primary/40 bg-primary/10 text-primary hover:bg-primary/20",
                  )}
                >
                  {siteClosed ? <RotateCcw className="h-4 w-4" /> : <ExternalLink className="h-4 w-4" />}
                  {siteClosed ? "Re-open Project" : "Open Project in New Tab"}
                </button>
              ) : (
                <div className="flex items-center gap-2 rounded-md bg-dark-surface px-3 py-1.5 text-xs text-dark-text-muted max-w-full">
                  <ExternalLink className="h-3 w-3 shrink-0" />
                  <span className="truncate">{feedbackRequest.url}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Step 2: Come back */}
        <div
          className={cn(
            "rounded-xl border p-4 transition-all",
            siteOpened
              ? "border-green-500/30 bg-green-500/5"
              : "border-dark-border bg-dark-card opacity-50",
          )}
        >
          <div className="flex items-start gap-4">
            <span
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                siteOpened
                  ? "bg-green-500/20 text-green-400"
                  : "bg-dark-surface text-dark-text-muted",
              )}
            >
              {siteOpened ? <CheckCircle className="h-4 w-4" /> : "2"}
            </span>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-dark-text">
                {siteOpened ? "You're back" : "Come back to this tab"}
              </h3>
              <p className="text-xs text-dark-text-muted">
                {siteOpened
                  ? "Great, you're on the right tab. Start recording below."
                  : "After viewing the project, switch back to this PeerPull tab."}
              </p>
            </div>
          </div>
        </div>

        {/* Step 3: Start recording */}
        <div
          className={cn(
            "rounded-xl border p-4 transition-all",
            siteOpened
              ? "border-primary/30 bg-primary/5"
              : "border-dark-border bg-dark-card opacity-50",
          )}
        >
          <div className="flex items-start gap-4">
            <span
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                siteOpened
                  ? "bg-primary/20 text-primary"
                  : "bg-dark-surface text-dark-text-muted",
              )}
            >
              3
            </span>
            <div className="flex-1 min-w-0 space-y-2">
              <div>
                <h3 className="text-sm font-semibold text-dark-text">Start recording</h3>
                <p className="text-xs text-dark-text-muted">
                  Select the project&apos;s tab when prompted. You&apos;ll be taken straight there to narrate your feedback.
                </p>
              </div>
              <button
                onClick={onStartRecording}
                disabled={!siteOpened || isStarting}
                className={cn(
                  "inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-all",
                  siteOpened && !isStarting
                    ? "bg-gradient-to-r from-primary to-teal-accent text-dark-bg hover:brightness-110 shadow-md shadow-primary/20 active:scale-[0.98]"
                    : "bg-dark-surface text-dark-text-muted cursor-not-allowed",
                )}
              >
                <MonitorPlay className="h-4 w-4" />
                {isStarting ? "Starting..." : "Start Recording"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mic selector - full width */}
      {audioDevices.length > 1 && (
        <div className="flex items-center gap-3 rounded-xl border border-dark-border bg-dark-card p-4 overflow-hidden">
          <Mic className="h-4 w-4 text-dark-text-muted shrink-0" />
          <label className="text-xs text-dark-text-muted shrink-0">Microphone</label>
          <select
            value={selectedMic}
            onChange={(e) => onSelectMic(e.target.value)}
            className="min-w-0 flex-1 text-sm bg-dark-surface border border-dark-border rounded-md px-3 py-1.5 text-dark-text outline-none focus:border-primary truncate"
          >
            {audioDevices.map((device) => (
              <option key={device.deviceId} value={device.deviceId} className="bg-dark-card text-dark-text">
                {device.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Error display */}
      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-red-400 text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
