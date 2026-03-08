"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";
import type { useScreenRecorder } from "@/hooks/useScreenRecorder";

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function MicWarningBanner({ micStatus, onRetry }: { micStatus: "denied" | "unavailable"; onRetry: () => void }) {
  const isDenied = micStatus === "denied";
  return (
    <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 mb-3">
      <div className="flex items-start gap-3">
        <div className="shrink-0 mt-0.5">
          <MicOff className="h-5 w-5 text-amber-400" />
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium text-amber-200">
            {isDenied ? "Microphone access is blocked" : "No microphone detected"}
          </p>
          <p className="text-xs text-white/60 leading-relaxed">
            PeerPull feedback is built around voice-narrated screen recordings. Without your microphone,
            your feedback cannot include the verbal commentary that makes it valuable to other builders.
          </p>
          {isDenied ? (
            <div className="space-y-2">
              <p className="text-xs text-white/50 leading-relaxed">
                To enable your microphone:
              </p>
              <ol className="text-xs text-white/50 leading-relaxed list-decimal list-inside space-y-1">
                <li>Click the <strong className="text-white/70">lock/settings icon</strong> in your browser&apos;s address bar</li>
                <li>Find <strong className="text-white/70">Microphone</strong> and set it to <strong className="text-white/70">Allow</strong></li>
                <li>Refresh the page, or click the button below</li>
              </ol>
            </div>
          ) : (
            <p className="text-xs text-white/50 leading-relaxed">
              Please connect a microphone or headset and try again.
            </p>
          )}
          <Button
            onClick={onRetry}
            variant="outline"
            size="sm"
            className="mt-1 border-amber-500/30 text-amber-200 hover:bg-amber-500/20 hover:text-amber-100"
          >
            <Mic className="h-3.5 w-3.5 mr-1.5" />
            Retry microphone access
          </Button>
        </div>
      </div>
    </div>
  );
}

export function RecorderControls({
  recorder,
  className,
}: {
  recorder: ReturnType<typeof useScreenRecorder>;
  className?: string;
}) {
  const {
    status,
    duration,
    error,
    warning,
    isSupported,
    micStatus,
    audioDevices,
    selectedMic,
    setSelectedMic,
    refreshMicList,
    startRecording,
    stopRecording,
    resetRecording,
    downloadRecording,
    maxDuration,
  } = recorder;

  if (!isSupported) {
    return (
      <p className="text-yellow-300 text-sm text-center">
        Screen recording is not supported in this browser. Use Chrome, Edge, or Firefox.
      </p>
    );
  }

  const showMicWarning = (micStatus === "denied" || micStatus === "unavailable") && status === "idle";

  return (
    <div className={cn("flex flex-col", className)}>
      {showMicWarning && (
        <MicWarningBanner micStatus={micStatus} onRetry={refreshMicList} />
      )}
      <div className="flex items-center gap-4 flex-wrap">
      {status === "idle" && (
        <>
          {audioDevices.length > 0 ? (
            <div className="flex items-center gap-2">
              <Mic className="h-4 w-4 text-teal-400 shrink-0" />
              <select
                value={selectedMic}
                onChange={(e) => setSelectedMic(e.target.value)}
                className="text-sm bg-white/10 border border-white/20 rounded-md px-2 py-1.5 text-white outline-none focus:border-teal-400 max-w-[250px] truncate"
              >
                {audioDevices.map((device) => (
                  <option key={device.deviceId} value={device.deviceId} className="bg-[#1a1a2e] text-white">
                    {device.label}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <span className="text-xs text-white/40 flex items-center gap-1.5">
              <MicOff className="h-3.5 w-3.5" />
              No mic detected
            </span>
          )}

          <Button
            onClick={startRecording}
            className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white font-medium px-6"
            size="sm"
            disabled={micStatus === "denied" || micStatus === "unavailable"}
          >
            Start Recording
          </Button>
        </>
      )}

      {status === "recording" && (
        <>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
            </span>
            <span
              className={cn(
                "font-mono text-sm tabular-nums",
                warning ? "text-red-400 font-bold" : "text-white",
              )}
            >
              {formatTime(duration)}
            </span>
            <span className="text-xs text-white/40">
              / {formatTime(maxDuration)}
            </span>
          </div>

          <Button
            onClick={stopRecording}
            variant="destructive"
            size="sm"
            className="font-medium px-4"
          >
            Stop
          </Button>

          {warning && (
            <span className="text-xs text-red-300">Auto-stops at 5:00</span>
          )}
        </>
      )}

      {status === "stopped" && (
        <>
          <span className="text-sm text-white/60">
            Recorded {formatTime(duration)}
          </span>
          <Button onClick={resetRecording} variant="outline" size="sm">
            Re-record
          </Button>
          <Button
            onClick={downloadRecording}
            className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white"
            size="sm"
          >
            Download .webm
          </Button>
        </>
      )}

      {error && (
        <span className="text-xs text-red-300 ml-2">{error}</span>
      )}
      </div>
    </div>
  );
}
