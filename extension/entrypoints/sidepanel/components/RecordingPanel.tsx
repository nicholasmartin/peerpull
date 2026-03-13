import { useState } from "react";
import { Pause, Play, Square, X, Mic } from "lucide-react";
import { cn } from "@/lib/utils";

interface RecordingPanelProps {
  duration: number;
  minDuration: number;
  maxDuration: number;
  isMinDurationMet: boolean;
  isWarning: boolean;
  isPaused: boolean;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onAbandon: () => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function RecordingPanel({
  duration,
  minDuration,
  maxDuration,
  isMinDurationMet,
  isWarning,
  isPaused,
  onPause,
  onResume,
  onStop,
  onAbandon,
}: RecordingPanelProps) {
  const [showAbandonConfirm, setShowAbandonConfirm] = useState(false);

  const progress = maxDuration > 0 ? Math.min(duration / maxDuration, 1) : 0;
  const minThreshold = maxDuration > 0 ? minDuration / maxDuration : 0;
  const remaining = Math.max(maxDuration - duration, 0);

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-dark-border bg-dark-card">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "inline-block h-2.5 w-2.5 rounded-full",
              isPaused ? "bg-warning" : "bg-danger animate-pulse"
            )}
          />
          <span className="text-xs font-medium">
            {isPaused ? "Paused" : "Recording"}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-dark-text-muted">
          <Mic className="h-3 w-3" />
          <span className="text-[10px]">Active</span>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6">
        {/* Duration timer */}
        <div className="text-center">
          <div className="text-4xl font-mono font-bold tracking-wider">
            {formatTime(duration)}
          </div>
          <p className="text-xs text-dark-text-muted mt-1">
            {remaining > 0 ? `${formatTime(remaining)} remaining` : "Max duration reached"}
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full">
          <div className="relative w-full h-2 rounded-full bg-dark-surface overflow-hidden">
            {/* Min duration marker */}
            <div
              className="absolute top-0 bottom-0 w-px bg-dark-text-muted/30 z-10"
              style={{ left: `${minThreshold * 100}%` }}
            />

            {/* Progress fill */}
            <div
              className={cn(
                "absolute top-0 left-0 h-full rounded-full transition-all duration-300",
                !isMinDurationMet
                  ? "bg-primary"
                  : isWarning
                    ? "bg-warning animate-pulse"
                    : "bg-success"
              )}
              style={{ width: `${progress * 100}%` }}
            />
          </div>

          {/* Labels */}
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-dark-text-muted">0:00</span>
            <span className="text-[10px] text-dark-text-muted">
              min {formatTime(minDuration)}
            </span>
            <span className="text-[10px] text-dark-text-muted">
              {formatTime(maxDuration)}
            </span>
          </div>
        </div>

        {!isMinDurationMet && (
          <p className="text-xs text-dark-text-muted text-center">
            Record at least {formatTime(minDuration)} to submit
          </p>
        )}
      </div>

      {/* Controls */}
      <div className="px-6 py-4 border-t border-dark-border">
        {showAbandonConfirm ? (
          <div className="space-y-3">
            <p className="text-xs text-center text-dark-text-muted">
              Discard this recording?
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowAbandonConfirm(false)}
                className="flex-1 rounded-md border border-dark-border px-3 py-2 text-xs font-medium hover:bg-dark-surface transition-colors"
              >
                Keep Recording
              </button>
              <button
                onClick={() => {
                  setShowAbandonConfirm(false);
                  onAbandon();
                }}
                className="flex-1 rounded-md bg-danger px-3 py-2 text-xs font-medium text-white hover:bg-danger/80 transition-colors"
              >
                Discard
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {/* Abandon button */}
            <button
              onClick={() => setShowAbandonConfirm(true)}
              className="rounded-md border border-dark-border p-2 text-dark-text-muted hover:text-danger hover:border-danger/30 transition-colors"
              title="Abandon recording"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Pause/Resume button */}
            <button
              onClick={isPaused ? onResume : onPause}
              className="flex-1 rounded-md border border-dark-border px-4 py-2 text-sm font-medium flex items-center justify-center gap-2 hover:bg-dark-surface transition-colors"
            >
              {isPaused ? (
                <>
                  <Play className="h-4 w-4" /> Resume
                </>
              ) : (
                <>
                  <Pause className="h-4 w-4" /> Pause
                </>
              )}
            </button>

            {/* Stop button */}
            <button
              onClick={onStop}
              disabled={!isMinDurationMet}
              className={cn(
                "flex-1 rounded-md px-4 py-2 text-sm font-medium flex items-center justify-center gap-2 transition-colors",
                isMinDurationMet
                  ? "bg-primary text-dark-bg hover:bg-primary-muted"
                  : "bg-dark-surface text-dark-text-muted cursor-not-allowed opacity-50"
              )}
              title={!isMinDurationMet ? `Record at least ${formatTime(minDuration)}` : "Stop recording"}
            >
              <Square className="h-4 w-4" /> Stop
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
