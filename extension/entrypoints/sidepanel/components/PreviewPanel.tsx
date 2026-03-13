import { RotateCcw, Upload, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface PreviewPanelProps {
  duration: number;
  onRedo: () => void;
  onUpload: () => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function PreviewPanel({ duration, onRedo, onUpload }: PreviewPanelProps) {
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="px-4 py-3 border-b border-dark-border bg-dark-card">
        <span className="text-xs font-medium">Recording Complete</span>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6">
        <div className="w-20 h-20 rounded-full bg-success/10 border border-success/20 flex items-center justify-center">
          <Clock className="h-8 w-8 text-success" />
        </div>

        <div className="text-center">
          <h3 className="text-lg font-semibold mb-1">Recording saved</h3>
          <p className="text-sm text-dark-text-muted">
            Duration: {formatTime(duration)}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 py-4 border-t border-dark-border space-y-2">
        <button
          onClick={onUpload}
          className={cn(
            "w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-dark-bg",
            "hover:bg-primary-muted flex items-center justify-center gap-2 transition-colors"
          )}
        >
          <Upload className="h-4 w-4" />
          Upload & Continue
        </button>
        <button
          onClick={onRedo}
          className={cn(
            "w-full rounded-md border border-dark-border px-4 py-2.5 text-sm font-medium",
            "hover:bg-dark-surface flex items-center justify-center gap-2 transition-colors"
          )}
        >
          <RotateCcw className="h-4 w-4" />
          Redo Recording
        </button>
      </div>
    </div>
  );
}
