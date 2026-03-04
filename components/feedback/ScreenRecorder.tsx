"use client";

import { useScreenRecorder } from "@/hooks/useScreenRecorder";
import { RecorderControls } from "@/components/feedback/RecorderControls";
import { useEffect } from "react";

export function ScreenRecorder() {
  const recorder = useScreenRecorder();
  const { refreshMicList, previewUrl, status } = recorder;

  useEffect(() => {
    refreshMicList();
  }, [refreshMicList]);

  return (
    <div className="flex flex-col h-full">
      {/* Preview replaces iframe area when stopped */}
      {previewUrl && status === "stopped" && (
        <div className="flex-1 min-h-0 flex items-center justify-center bg-black/90 p-4">
          <video
            src={previewUrl}
            controls
            autoPlay
            className="max-w-full max-h-full rounded-lg"
          />
        </div>
      )}

      {/* Bottom bar */}
      <div className="shrink-0">
        <RecorderControls recorder={recorder} />
      </div>
    </div>
  );
}
