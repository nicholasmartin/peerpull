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
    <div className="rounded-md border border-dark-border bg-dark-card p-6 relative">
      {/* Dismiss button */}
      <button
        onClick={handleDismiss}
        className="absolute top-4 right-4 text-dark-text-muted hover:text-dark-text transition"
        aria-label="Dismiss"
      >
        <X className="h-5 w-5" />
      </button>

      <h2 className="text-lg font-semibold text-dark-text mb-1">Getting Started</h2>
      <p className="text-sm text-dark-text-muted mb-4">Complete these steps to get the most out of PeerPull</p>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-dark-text-muted mb-1">
          <span>{completedCount} of 3 complete</span>
          <span>{progressPercent}%</span>
        </div>
        <div className="h-1 rounded bg-dark-surface overflow-hidden">
          <div
            className="h-full rounded bg-primary transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-3">
        {steps.map((step, i) => {
          const isHighlighted = i === firstIncompleteIndex;
          return (
            <div
              key={step.key}
              className={`rounded-md border p-4 transition ${
                step.complete
                  ? "border-dark-border bg-dark-surface/50"
                  : isHighlighted
                    ? "border-primary/20 bg-primary-subtle"
                    : "border-dark-border bg-dark-surface/50 opacity-60"
              }`}
            >
              <div className="flex items-start gap-3">
                {step.complete ? (
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                ) : (
                  <Circle className="h-5 w-5 text-dark-text-muted/30 shrink-0 mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className={`text-sm font-semibold ${step.complete ? "text-dark-text-muted line-through" : "text-dark-text"}`}>
                    {step.label}
                  </h3>
                  <p className="text-xs text-dark-text-muted mt-0.5">{step.description}</p>

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
                        className="w-full rounded-md border border-dark-border bg-dark-surface px-3 py-2 text-sm text-dark-text placeholder-dark-text-muted focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary/50"
                      />
                      <input
                        name="url"
                        type="url"
                        placeholder="https://yourproject.com"
                        className="w-full rounded-md border border-dark-border bg-dark-surface px-3 py-2 text-sm text-dark-text placeholder-dark-text-muted focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary/50"
                      />
                      <div className="flex items-center gap-2">
                        <Button
                          type="submit"
                          disabled={submitting}
                          size="sm"
                        >
                          {submitting ? "Submitting..." : "Submit Project"}
                        </Button>
                        <Link
                          href="/dashboard/request-feedback/new"
                          className="text-xs text-dark-text-muted hover:text-dark-text transition"
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
                      className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition"
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
