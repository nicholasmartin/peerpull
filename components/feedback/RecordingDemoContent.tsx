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
      {/* Controls bar */}
      <div className="shrink-0 border-b border-white/10 bg-[#0a0a1a]/95 backdrop-blur-sm px-4 py-3">
        <RecorderControls recorder={recorder} />
      </div>

      {/* Content area */}
      <div className="flex-1 min-h-0 relative">
        {!showPreview ? (
          <div className="w-full h-full flex items-center justify-center p-6">
            <div className="text-center space-y-4">
              <button
                onClick={() => window.open(projectUrl, "_blank")}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary hover:bg-primary-muted text-white font-medium transition-colors"
              >
                <span>🔗</span> Open Site in New Tab
              </button>
              <p className="text-xs text-white/40">{projectUrl}</p>
              <p className="text-xs text-white/30">
                Click above to open the site, then start recording. Select the site&apos;s tab when prompted.
              </p>
            </div>
          </div>
        ) : (
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
