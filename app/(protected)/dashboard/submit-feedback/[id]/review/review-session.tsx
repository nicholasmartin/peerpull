"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useScreenRecorder } from "@/hooks/useScreenRecorder";
import { RecorderControls } from "@/components/feedback/RecorderControls";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/utils/supabase/client";
import { submitReview } from "@/app/actions";

interface PullRequestData {
  id: string;
  title: string;
  url: string;
  description: string;
  stage: string;
  categories: string[];
  focusAreas: string[];
  questions: string[];
  founderName: string;
}

export function ReviewSession({
  pullRequest,
  reviewId,
}: {
  pullRequest: PullRequestData;
  reviewId: string;
}) {
  const recorder = useScreenRecorder();
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [strengths, setStrengths] = useState("");
  const [improvements, setImprovements] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    recorder.refreshMicList();
  }, [recorder.refreshMicList]);

  const showPreview = recorder.status === "stopped" && !!recorder.previewUrl;
  const canSubmit = showPreview && recorder.duration >= 5 && rating >= 1;

  async function handleSubmit() {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);

    try {
      // Upload video to Supabase Storage
      const blob = recorder.getBlob();
      if (!blob) {
        setError("No recording found");
        setSubmitting(false);
        return;
      }

      const supabase = createClient();
      const fileName = `${reviewId}-${Date.now()}.webm`;
      const filePath = `reviews/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("review-videos")
        .upload(filePath, blob, { contentType: "video/webm" });

      if (uploadError) {
        setError("Failed to upload video: " + uploadError.message);
        setSubmitting(false);
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from("review-videos")
        .getPublicUrl(filePath);

      // Submit via server action
      const formData = new FormData();
      formData.set("review_id", reviewId);
      formData.set("rating", String(rating));
      formData.set("strengths", strengths);
      formData.set("improvements", improvements);
      formData.set("video_url", publicUrl);
      formData.set("video_duration", String(recorder.duration));

      const result = await submitReview(formData);
      if (result && "error" in result) {
        setError(result.error);
        setSubmitting(false);
      }
    } catch {
      // redirect throws, which is expected on success
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Project info bar */}
      <div className="shrink-0 border-b border-white/10 bg-white/5 px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          {pullRequest.stage && (
            <Badge variant="secondary" className="capitalize shrink-0">{pullRequest.stage}</Badge>
          )}
          <h1 className="text-sm font-semibold truncate">{pullRequest.title}</h1>
          <span className="text-xs text-white/40 hidden sm:inline">—</span>
          <p className="text-xs text-white/50 truncate hidden sm:block">{pullRequest.description}</p>
        </div>
        <span className="text-xs text-white/40 shrink-0">by {pullRequest.founderName}</span>
      </div>

      {/* Recorder controls */}
      <div className="shrink-0 border-b border-white/10 bg-[#0a0a1a]/95 backdrop-blur-sm px-4 py-3">
        <RecorderControls recorder={recorder} />
      </div>

      {/* Main content */}
      <div className="flex-1 min-h-0 flex flex-col overflow-auto">
        {!showPreview ? (
          /* Review briefing panel */
          <div className="flex-1 min-h-0 overflow-auto p-6">
            <div className="max-w-2xl mx-auto space-y-6">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <span>📋</span> Review Briefing
              </h2>

              {/* Description */}
              {pullRequest.description && (
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-white/70">Description</h3>
                  <p className="text-sm text-white/50">{pullRequest.description}</p>
                </div>
              )}

              {/* Focus Areas & Categories */}
              <div className="grid grid-cols-2 gap-4">
                {pullRequest.focusAreas.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-white/70">Focus Areas</h3>
                    <ul className="space-y-1">
                      {pullRequest.focusAreas.map((area, i) => (
                        <li key={i} className="text-sm text-white/50 flex items-center gap-1.5">
                          <span className="text-white/30">•</span> {area}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {pullRequest.categories.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-white/70">Categories</h3>
                    <ul className="space-y-1">
                      {pullRequest.categories.map((cat, i) => (
                        <li key={i} className="text-sm text-white/50 flex items-center gap-1.5">
                          <span className="text-white/30">•</span> {cat}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Questions */}
              {pullRequest.questions.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-white/70">Questions to Address</h3>
                  <ol className="list-decimal list-inside space-y-1">
                    {pullRequest.questions.map((q, i) => (
                      <li key={i} className="text-sm text-white/50">{q}</li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Open Site button */}
              {pullRequest.url ? (
                <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-center space-y-2">
                  <Button
                    onClick={() => window.open(pullRequest.url, "_blank")}
                    className="bg-[#3366FF] hover:bg-blue-600 gap-2"
                  >
                    <span>🔗</span> Open Site in New Tab
                  </Button>
                  <p className="text-xs text-white/40">{pullRequest.url}</p>
                </div>
              ) : (
                <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-center">
                  <p className="text-sm text-white/40">No project URL provided</p>
                </div>
              )}

              {/* Step-by-step instructions */}
              <div className="rounded-lg border border-white/10 bg-white/5 p-4 space-y-2">
                <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wide">How to record your review</h3>
                <ol className="space-y-1.5">
                  {[
                    { title: "Open the project", desc: "click the button above to open it in a new tab" },
                    { title: "Start recording", desc: "click \"Start Recording\", then select the project's browser tab when prompted" },
                    { title: "Narrate your review", desc: "explore the project and think out loud (minimum 60 seconds, max 5 minutes)" },
                    { title: "Stop & submit", desc: "click \"Stop Recording\", then rate and submit your feedback" },
                  ].map((step, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs">
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#3366FF]/20 text-[10px] font-bold text-[#3366FF] mt-0.5">
                        {i + 1}
                      </span>
                      <span className="text-white/50">
                        <strong className="text-white/70">{step.title}</strong> &mdash; {step.desc}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        ) : (
          /* Post-recording: video preview + review form */
          <div className="flex-1 p-6 space-y-6 overflow-auto">
            {/* Video preview */}
            <div className="flex justify-center bg-black rounded-lg p-4">
              <video
                src={recorder.previewUrl!}
                controls
                autoPlay
                className="max-w-full max-h-[400px] rounded-lg"
              />
            </div>

            {recorder.duration < 5 && (
              <div className="rounded-lg border border-yellow-300 bg-yellow-50 p-3 text-yellow-800 dark:border-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-200 text-sm">
                Your recording is {recorder.duration}s — minimum 5 seconds required. Please re-record.
              </div>
            )}

            {/* Questions to address */}
            {pullRequest.questions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Questions to Address</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    {pullRequest.questions.map((q, i) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Review form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Your Review</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Rating */}
                <div className="space-y-2">
                  <Label>Rating <span className="text-red-500">*</span></Label>
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
                          className={`h-8 w-8 ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Strengths */}
                <div className="space-y-2">
                  <Label htmlFor="strengths">
                    Strengths <span className="text-xs text-gray-400">({strengths.length}/50 min)</span>
                  </Label>
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
                  <Label htmlFor="improvements">
                    Areas for Improvement <span className="text-xs text-gray-400">({improvements.length}/50 min)</span>
                  </Label>
                  <Textarea
                    id="improvements"
                    value={improvements}
                    onChange={(e) => setImprovements(e.target.value)}
                    placeholder="What could be improved? What specific changes would you suggest?"
                    className="min-h-[100px]"
                  />
                </div>

                {error && (
                  <div className="text-sm text-red-500">{error}</div>
                )}

                <Button
                  onClick={handleSubmit}
                  disabled={!canSubmit || submitting}
                  className="w-full bg-[#3366FF] hover:bg-blue-600"
                >
                  {submitting ? "Submitting Review..." : "Submit Review"}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
