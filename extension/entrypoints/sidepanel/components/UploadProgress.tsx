import { Loader2, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadProgressProps {
  status: "uploading" | "uploaded" | "error";
  error: string | null;
  onRetry: () => void;
  onDone: () => void;
}

export default function UploadProgress({ status, error, onRetry, onDone }: UploadProgressProps) {
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="px-4 py-3 border-b border-dark-border bg-dark-card">
        <span className="text-xs font-medium">
          {status === "uploading" ? "Uploading..." : status === "uploaded" ? "Complete" : "Upload Failed"}
        </span>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6">
        {status === "uploading" && (
          <>
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-1">Uploading video...</h3>
              <p className="text-xs text-dark-text-muted">This may take a moment</p>
            </div>
            {/* Indeterminate progress bar */}
            <div className="w-full h-1.5 rounded-full bg-dark-surface overflow-hidden">
              <div className="h-full w-1/3 rounded-full bg-primary animate-[indeterminate_1.5s_ease-in-out_infinite]" />
            </div>
          </>
        )}

        {status === "uploaded" && (
          <>
            <div className="w-20 h-20 rounded-full bg-success/10 border border-success/20 flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-success" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-1">Upload complete!</h3>
              <p className="text-xs text-dark-text-muted">Your recording has been saved</p>
            </div>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-20 h-20 rounded-full bg-danger/10 border border-danger/20 flex items-center justify-center">
              <AlertCircle className="h-10 w-10 text-danger" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-1">Upload failed</h3>
              <p className="text-xs text-danger">{error || "Something went wrong"}</p>
            </div>
          </>
        )}
      </div>

      {/* Actions */}
      <div className="px-6 py-4 border-t border-dark-border">
        {status === "uploaded" && (
          <button
            onClick={onDone}
            className={cn(
              "w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-dark-bg",
              "hover:bg-primary-muted transition-colors"
            )}
          >
            Done
          </button>
        )}
        {status === "error" && (
          <button
            onClick={onRetry}
            className={cn(
              "w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-dark-bg",
              "hover:bg-primary-muted flex items-center justify-center gap-2 transition-colors"
            )}
          >
            <RefreshCw className="h-4 w-4" />
            Retry Upload
          </button>
        )}
      </div>
    </div>
  );
}
