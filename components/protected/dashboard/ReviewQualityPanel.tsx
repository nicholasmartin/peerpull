"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { rateReviewAction } from "@/app/actions";
import { toast } from "sonner";

const FLAG_OPTIONS = [
  { value: "low_effort", label: "Low effort review" },
  { value: "spam", label: "Spam or fake" },
  { value: "irrelevant", label: "Irrelevant to my project" },
  { value: "off_topic", label: "Off-topic / didn't address questions" },
] as const;

interface ReviewQualityPanelProps {
  reviewId: string;
  existingRating?: number | null;
  existingFlags?: string[];
  existingFeedback?: string | null;
}

export function ReviewQualityPanel({
  reviewId,
  existingRating,
  existingFlags,
  existingFeedback,
}: ReviewQualityPanelProps) {
  const router = useRouter();
  const hasExisting = existingRating != null;

  const [rating, setRating] = useState(existingRating ?? 0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [selectedFlags, setSelectedFlags] = useState<string[]>(existingFlags ?? []);
  const [feedback, setFeedback] = useState(existingFeedback ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(hasExisting);

  function toggleFlag(flag: string) {
    setSelectedFlags((prev) =>
      prev.includes(flag) ? prev.filter((f) => f !== flag) : [...prev, flag]
    );
  }

  async function handleSubmit() {
    if (rating < 1 || rating > 5) {
      toast.error("Please select a star rating");
      return;
    }

    setIsSubmitting(true);
    const result = await rateReviewAction(reviewId, rating, selectedFlags, feedback.trim() || null);

    if (result && "error" in result) {
      toast.error(result.error);
    } else {
      toast.success("Review rated!");
      setIsReadOnly(true);
      router.refresh();
    }
    setIsSubmitting(false);
  }

  const displayStar = hoveredStar || rating;

  return (
    <div className="rounded-xl border border-dark-border bg-dark-surface p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-white">Rate this Review</h4>
        {isReadOnly && (
          <button
            onClick={() => setIsReadOnly(false)}
            className="text-xs text-primary hover:underline"
          >
            Update
          </button>
        )}
      </div>

      {/* Star rating */}
      <div className="space-y-1">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              disabled={isReadOnly}
              onClick={() => setRating(star)}
              onMouseEnter={() => !isReadOnly && setHoveredStar(star)}
              onMouseLeave={() => setHoveredStar(0)}
              className="focus:outline-none disabled:cursor-default"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-7 w-7 transition-colors ${
                  star <= displayStar ? "text-yellow-400" : "text-dark-text-muted/30"
                }`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
          ))}
        </div>
      </div>

      {/* Flags */}
      {!isReadOnly && (
        <div className="space-y-2">
          <p className="text-xs text-gray-400">Report issues (optional)</p>
          <div className="space-y-1.5">
            {FLAG_OPTIONS.map((flag) => (
              <label key={flag.value} className="flex items-center gap-2.5 cursor-pointer">
                <Checkbox
                  checked={selectedFlags.includes(flag.value)}
                  onCheckedChange={() => toggleFlag(flag.value)}
                />
                <span className="text-sm text-gray-300">{flag.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Text feedback */}
      {!isReadOnly && (
        <div className="space-y-1">
          <p className="text-xs text-gray-400">Feedback to reviewer (optional)</p>
          <Textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Any specific feedback for the reviewer..."
            className="min-h-[60px] text-sm"
          />
        </div>
      )}

      {/* Read-only display */}
      {isReadOnly && (existingFlags?.length ?? 0) > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {existingFlags?.map((flag) => (
            <span key={flag} className="text-xs bg-red-500/10 text-red-400 rounded-full px-2 py-0.5">
              {FLAG_OPTIONS.find((f) => f.value === flag)?.label ?? flag}
            </span>
          ))}
        </div>
      )}
      {isReadOnly && existingFeedback && (
        <p className="text-sm text-gray-400 italic">&ldquo;{existingFeedback}&rdquo;</p>
      )}

      {/* Submit button */}
      {!isReadOnly && (
        <Button
          onClick={handleSubmit}
          disabled={rating < 1 || isSubmitting}
          size="sm"
          className="bg-primary hover:bg-primary-muted"
        >
          {isSubmitting ? "Rating..." : hasExisting ? "Update Rating" : "Rate Review"}
        </Button>
      )}
    </div>
  );
}
