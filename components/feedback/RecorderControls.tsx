"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { useScreenRecorder } from "@/hooks/useScreenRecorder";

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
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
    audioDevices,
    selectedMic,
    setSelectedMic,
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

  return (
    <div className={cn("flex items-center gap-4 flex-wrap", className)}>
      {status === "idle" && (
        <>
          {audioDevices.length > 0 ? (
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
          ) : (
            <span className="text-xs text-white/40">No mic detected</span>
          )}

          <Button
            onClick={startRecording}
            className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white font-medium px-6"
            size="sm"
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
  );
}
