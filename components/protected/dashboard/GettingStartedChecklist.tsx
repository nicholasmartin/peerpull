"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircle2, Circle, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { submitPullRequest } from "@/app/actions";

const DISMISS_KEY = "peerpull_onboarding_dismissed";

interface Props {
  hasSubmittedProject: boolean;
  hasReviewedProject: boolean;
  hasReceivedReview: boolean;
}

export function GettingStartedChecklist({
  hasSubmittedProject,
  hasReviewedProject,
  hasReceivedReview,
}: Props) {
  const [dismissed, setDismissed] = useState(true); // default hidden to avoid flash
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setDismissed(localStorage.getItem(DISMISS_KEY) === "true");
  }, []);

  const allComplete = hasSubmittedProject && hasReviewedProject && hasReceivedReview;
  if (dismissed || allComplete) return null;

  const completedCount = [hasSubmittedProject, hasReviewedProject, hasReceivedReview].filter(Boolean).length;
  const progressPercent = Math.round((completedCount / 3) * 100);

  function handleDismiss() {
    localStorage.setItem(DISMISS_KEY, "true");
    setDismissed(true);
  }

  const steps = [
    {
      key: "submit",
      label: "Submit your project",
      description: "Get your project in the review queue",
      complete: hasSubmittedProject,
    },
    {
      key: "review",
      label: "Review another founder's project",
      description: "Earn PeerPoints by giving feedback",
      complete: hasReviewedProject,
    },
    {
      key: "received",
      label: "Get your first review",
      description: "A peer will record video feedback on your project",
      complete: hasReceivedReview,
    },
  ];

  const firstIncompleteIndex = steps.findIndex((s) => !s.complete);

  return (
    <div className="rounded-lg border border-white/10 bg-gray-900 p-6 shadow-md relative">
      {/* Dismiss button */}
      <button
        onClick={handleDismiss}
        className="absolute top-4 right-4 text-white/40 hover:text-white/70 transition"
        aria-label="Dismiss"
      >
        <X className="h-5 w-5" />
      </button>

      <h2 className="text-xl font-bold text-white mb-1">Getting Started</h2>
      <p className="text-sm text-white/50 mb-4">Complete these steps to get the most out of PeerPull</p>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-white/50 mb-1">
          <span>{completedCount} of 3 complete</span>
          <span>{progressPercent}%</span>
        </div>
        <div className="h-2 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#3366FF] to-[#2EC4B6] transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-4">
        {steps.map((step, i) => {
          const isHighlighted = i === firstIncompleteIndex;
          return (
            <div
              key={step.key}
              className={`rounded-lg border p-4 transition ${
                step.complete
                  ? "border-white/10 bg-white/5"
                  : isHighlighted
                    ? "border-transparent bg-gradient-to-r from-[#3366FF]/10 to-[#2EC4B6]/10 ring-1 ring-[#3366FF]/40"
                    : "border-white/10 bg-white/5 opacity-60"
              }`}
            >
              <div className="flex items-start gap-3">
                {step.complete ? (
                  <CheckCircle2 className="h-5 w-5 text-[#2EC4B6] shrink-0 mt-0.5" />
                ) : (
                  <Circle className="h-5 w-5 text-white/30 shrink-0 mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className={`text-sm font-semibold ${step.complete ? "text-white/60 line-through" : "text-white"}`}>
                    {step.label}
                  </h3>
                  <p className="text-xs text-white/40 mt-0.5">{step.description}</p>

                  {/* Inline quick-submit form for step 1 */}
                  {step.key === "submit" && !step.complete && isHighlighted && (
                    <form
                      action={async (formData) => {
                        setSubmitting(true);
                        await submitPullRequest(formData);
                      }}
                      className="mt-3 space-y-2"
                    >
                      <input type="hidden" name="redirectTo" value="/dashboard" />
                      <input
                        name="title"
                        type="text"
                        required
                        placeholder="Project name"
                        className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-[#3366FF]"
                      />
                      <input
                        name="url"
                        type="url"
                        placeholder="https://yourproject.com"
                        className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-[#3366FF]"
                      />
                      <div className="flex items-center gap-2">
                        <Button
                          type="submit"
                          disabled={submitting}
                          size="sm"
                          className="bg-[#3366FF] hover:bg-blue-600"
                        >
                          {submitting ? "Submitting..." : "Submit Project"}
                        </Button>
                        <Link
                          href="/dashboard/request-feedback/new"
                          className="text-xs text-white/40 hover:text-white/70 transition"
                        >
                          Add more details <ArrowRight className="inline h-3 w-3" />
                        </Link>
                      </div>
                    </form>
                  )}

                  {/* CTA for step 2 */}
                  {step.key === "review" && !step.complete && isHighlighted && (
                    <Link
                      href="/dashboard/submit-feedback"
                      className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-[#3366FF] hover:text-blue-400 transition"
                    >
                      Start Reviewing <ArrowRight className="h-4 w-4" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
