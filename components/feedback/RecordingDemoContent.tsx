"use client";

import { useScreenRecorder } from "@/hooks/useScreenRecorder";
import { RecorderControls } from "@/components/feedback/RecorderControls";
import { useEffect } from "react";

interface Project {
  name: string;
  description: string;
  url: string;
  submittedBy: string;
  category: string;
}

export function RecordingDemoContent({ project }: { project: Project }) {
  return (
    <div className="flex flex-col h-screen">
      {/* Project info bar */}
      <div className="shrink-0 border-b border-white/10 bg-white/5 px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-xs font-medium text-teal-400 uppercase tracking-wider shrink-0">
            {project.category}
          </span>
          <h1 className="text-sm font-semibold text-white truncate">
            {project.name}
          </h1>
          <span className="text-xs text-white/40 hidden sm:inline">—</span>
          <p className="text-xs text-white/50 truncate hidden sm:block">
            {project.description}
          </p>
        </div>
        <span className="text-xs text-white/40 shrink-0">
          by {project.submittedBy}
        </span>
      </div>

      {/* Main area + controls */}
      <RecordingArea projectUrl={project.url} projectName={project.name} />
    </div>
  );
}

function RecordingArea({ projectUrl, projectName }: { projectUrl: string; projectName: string }) {
  const recorder = useScreenRecorder();
  const { refreshMicList } = recorder;

  useEffect(() => {
    refreshMicList();
  }, [refreshMicList]);

  const showPreview = recorder.status === "stopped" && !!recorder.previewUrl;

  return (
    <>
      {/* Controls bar — always visible above iframe */}
      <div className="shrink-0 border-b border-white/10 bg-[#0a0a1a]/95 backdrop-blur-sm px-4 py-3">
        <RecorderControls recorder={recorder} />
      </div>

      {/* Content area */}
      <div className="flex-1 min-h-0 relative">
        {/* Iframe — hidden when previewing */}
        <iframe
          src={projectUrl}
          className={showPreview ? "hidden" : "w-full h-full border-0"}
          title={projectName}
          sandbox="allow-scripts allow-same-origin allow-popups"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
        />

        {/* Video preview — replaces iframe */}
        {showPreview && (
          <div className="w-full h-full flex items-center justify-center bg-black p-6">
            <video
              src={recorder.previewUrl!}
              controls
              autoPlay
              className="max-w-full max-h-full rounded-lg"
            />
          </div>
        )}
      </div>
    </>
  );
}
