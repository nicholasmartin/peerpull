"use client";

import { cn } from "@/lib/utils";
import { Square } from "lucide-react";
import type { FeedbackRequestData } from "./briefing-step";

interface RecordingStepProps {
  feedbackRequest: FeedbackRequestData;
  duration: number;
  maxDuration: number;
  minDuration: number;
  warning: boolean;
  error: string | null;
  onStopRecording: () => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function RecordingStep({
  feedbackRequest,
  duration,
  maxDuration,
  minDuration,
  warning,
  error,
  onStopRecording,
}: RecordingStepProps) {
  const remaining = Math.max(0, maxDuration - duration);
  const progressPct = Math.max(0, Math.min(100, (remaining / maxDuration) * 100));
  const minMet = duration >= minDuration;
  const minProgressPct = Math.min(100, (duration / minDuration) * 100);

  // Color based on remaining time
  const barColor =
    progressPct > 60
      ? "bg-green-500"
      : progressPct > 30
        ? "bg-yellow-500"
        : "bg-red-500";

  const timerColor =
    remaining <= 30
      ? "text-red-400 font-bold"
      : "text-dark-text";

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 px-4">
      {/* Pulsing recording indicator */}
      <div className="flex items-center gap-3">
        <span className="relative flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500" />
        </span>
        <span className="text-sm font-medium text-red-400 uppercase tracking-wider">Recording</span>
      </div>

      {/* Countdown timer */}
      <div className="text-center space-y-1">
        <div className={cn("text-5xl font-mono tabular-nums", timerColor)}>
          {formatTime(remaining)}
        </div>
        <p className="text-sm text-dark-text-muted">remaining</p>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-md space-y-2">
        <div className="h-2 w-full rounded-full bg-dark-surface overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all duration-1000", barColor)}
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-dark-text-muted">
          <span>{formatTime(duration)} elapsed</span>
          <span>{formatTime(maxDuration)} max</span>
        </div>
      </div>

      {/* Minimum duration indicator */}
      {!minMet && (
        <div className="w-full max-w-md space-y-1">
          <p className="text-xs text-amber-400 text-center">
            Record at least {minDuration}s ({formatTime(minDuration)})
          </p>
          <div className="h-1.5 w-full rounded-full bg-dark-surface overflow-hidden">
            <div
              className="h-full rounded-full bg-amber-500 transition-all duration-1000"
              style={{ width: `${minProgressPct}%` }}
            />
          </div>
        </div>
      )}

      {/* Context message */}
      <div className="text-center space-y-1">
        <p className="text-sm text-dark-text-muted">
          Switch to the project tab to explore and narrate your feedback.
        </p>
        <p className="text-xs text-dark-text-muted/60">
          Come back here to stop recording when you&apos;re done.
        </p>
      </div>

      {/* Stop button - large and prominent */}
      <button
        onClick={onStopRecording}
        disabled={!minMet}
        className={cn(
          "px-12 py-4 rounded-xl text-lg font-semibold transition-all",
          "flex items-center gap-3",
          minMet
            ? "bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/30 hover:shadow-red-500/40 active:scale-95"
            : "bg-dark-surface text-dark-text-muted cursor-not-allowed",
        )}
      >
        <Square className="h-5 w-5" fill={minMet ? "currentColor" : "none"} />
        Stop Recording
      </button>
      {!minMet && (
        <p className="text-xs text-dark-text-muted">
          You can stop after the minimum duration is reached.
        </p>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-md border border-red-500/20 bg-red-500/10 p-3 text-red-400 text-sm max-w-md">
          {error}
        </div>
      )}

      {/* Project reminder */}
      <div className="w-full max-w-md rounded-xl border border-dark-border bg-dark-card p-4 space-y-2">
        <h3 className="text-xs font-semibold text-dark-text-muted uppercase tracking-wide">
          Reviewing: {feedbackRequest.title}
        </h3>
        {feedbackRequest.questions.length > 0 && (
          <ol className="list-decimal list-inside space-y-0.5">
            {feedbackRequest.questions.map((q, i) => (
              <li key={i} className="text-xs text-dark-text-muted">{q}</li>
            ))}
          </ol>
        )}
      </div>

      {warning && (
        <p className="text-xs text-red-300 animate-pulse">
          Recording will auto-stop at {formatTime(maxDuration)}
        </p>
      )}
    </div>
  );
}
