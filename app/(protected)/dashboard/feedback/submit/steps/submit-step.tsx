"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ReviewerSignals } from "@/components/protected/dashboard/ReviewerSignals";
import { createClient } from "@/utils/supabase/client";
import { submitReview } from "@/app/actions";
import { toast } from "sonner";
import { RotateCcw } from "lucide-react";
import type { FeedbackRequestData } from "./briefing-step";

interface SubmitStepProps {
  feedbackRequest: FeedbackRequestData;
  reviewId: string;
  previewUrl: string;
  duration: number;
  minDuration: number;
  getBlob: () => Blob | null;
  onReRecord: () => void;
}

export function SubmitStep({
  feedbackRequest,
  reviewId,
  previewUrl,
  duration,
  minDuration,
  getBlob,
  onReRecord,
}: SubmitStepProps) {
  const [rating, setRating] = useState(0);
  const [strengths, setStrengths] = useState("");
  const [improvements, setImprovements] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitPhase, setSubmitPhase] = useState<"idle" | "uploading" | "saving">("idle");
  const [error, setError] = useState<string | null>(null);
  const [signalFollow, setSignalFollow] = useState(false);
  const [signalEngage, setSignalEngage] = useState(false);
  const [signalInvest, setSignalInvest] = useState(false);

  const tooShort = duration < minDuration;
  const canSubmit = !tooShort && rating >= 1;

  async function handleSubmit() {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);

    try {
      const blob = getBlob();
      if (!blob) {
        setError("No recording found");
        setSubmitting(false);
        return;
      }

      setSubmitPhase("uploading");

      const supabase = createClient();
      const fileName = `${reviewId}-${Date.now()}.webm`;
      const filePath = `reviews/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("review-videos")
        .upload(filePath, blob, { contentType: "video/webm" });

      if (uploadError) {
        const msg = "Failed to upload video: " + uploadError.message;
        setError(msg);
        toast.error(msg);
        setSubmitting(false);
        setSubmitPhase("idle");
        return;
      }

      setSubmitPhase("saving");

      const { data: { publicUrl } } = supabase.storage
        .from("review-videos")
        .getPublicUrl(filePath);

      const formData = new FormData();
      formData.set("review_id", reviewId);
      formData.set("rating", String(rating));
      formData.set("strengths", strengths);
      formData.set("improvements", improvements);
      formData.set("video_url", publicUrl);
      formData.set("video_duration", String(duration));
      formData.set("signal_follow", signalFollow ? "true" : "false");
      formData.set("signal_engage", signalEngage ? "true" : "false");
      formData.set("signal_invest", signalInvest ? "true" : "false");

      const result = await submitReview(formData);
      if (result && "error" in result) {
        setError(result.error);
        toast.error(result.error);
        setSubmitting(false);
        setSubmitPhase("idle");
      }
    } catch {
      // redirect throws, which is expected on success
    }
  }

  function formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }

  const submitButtonLabel =
    submitPhase === "uploading"
      ? "Uploading video..."
      : submitPhase === "saving"
        ? "Saving feedback..."
        : "Submit Feedback";

  return (
    <div className="mx-auto max-w-2xl space-y-6 pt-4 pb-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-dark-text">Review Your Feedback</h1>
        <Button
          onClick={onReRecord}
          variant="outline"
          size="sm"
          className="gap-1.5"
          disabled={submitting}
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Re-record
        </Button>
      </div>

      {/* Video preview */}
      <div className="flex justify-center bg-black rounded-xl p-4">
        <video
          src={previewUrl}
          controls
          preload="metadata"
          className="max-w-full max-h-[400px] rounded-md"
        />
      </div>

      <p className="text-sm text-dark-text-muted text-center">
        Recorded {formatTime(duration)}
      </p>

      {tooShort && (
        <div className="rounded-md border border-yellow-500/20 bg-yellow-500/10 p-3 text-yellow-400 text-sm">
          Your recording is {duration}s. Minimum {minDuration} seconds required. Please re-record.
        </div>
      )}

      {/* Questions reminder */}
      {feedbackRequest.questions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Questions to Address</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-1 text-sm text-dark-text-muted">
              {feedbackRequest.questions.map((q, i) => (
                <li key={i}>{q}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Review form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Your Feedback</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Rating */}
          <div className="space-y-2">
            <Label>Project Rating <span className="text-red-500">*</span></Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-8 w-8 ${star <= rating ? "text-yellow-400" : "text-dark-text-muted/50"}`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
              ))}
            </div>
          </div>

          {/* Optional section divider */}
          <div className="relative pt-2">
            <div className="absolute inset-x-0 top-1/2 h-px bg-dark-border" />
            <div className="relative flex justify-center">
              <span className="bg-dark-card px-3 text-xs text-dark-text-muted">
                Optional, but really valuable for the builder
              </span>
            </div>
          </div>

          {/* Strengths */}
          <div className="space-y-2">
            <Label htmlFor="strengths">Strengths</Label>
            <Textarea
              id="strengths"
              value={strengths}
              onChange={(e) => setStrengths(e.target.value)}
              placeholder="What does this project do well? What stood out positively?"
              className="min-h-[100px]"
            />
          </div>

          {/* Improvements */}
          <div className="space-y-2">
            <Label htmlFor="improvements">Areas for Improvement</Label>
            <Textarea
              id="improvements"
              value={improvements}
              onChange={(e) => setImprovements(e.target.value)}
              placeholder="What could be improved? What specific changes would you suggest?"
              className="min-h-[100px]"
            />
          </div>

          <ReviewerSignals
            signalFollow={signalFollow}
            signalEngage={signalEngage}
            signalInvest={signalInvest}
            onSignalFollowChange={setSignalFollow}
            onSignalEngageChange={setSignalEngage}
            onSignalInvestChange={setSignalInvest}
          />

          {error && (
            <div className="text-sm text-red-500">{error}</div>
          )}

          <Button
            onClick={handleSubmit}
            disabled={!canSubmit || submitting}
            className="w-full bg-primary hover:bg-primary-muted"
          >
            {submitting && <Spinner size="sm" />}
            {submitButtonLabel}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
