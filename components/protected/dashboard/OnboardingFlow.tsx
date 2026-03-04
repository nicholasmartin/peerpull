"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Profile } from "@/utils/supabase/profiles";
import { submitOnboardingProject } from "@/app/actions";
import { CheckCircle2, ArrowRight, Sparkles, Users, Coins, Send } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

interface OnboardingFlowProps {
  profile: Profile;
}

export default function OnboardingFlow({ profile }: OnboardingFlowProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [isPending, startTransition] = useTransition();

  const steps = [
    { label: "Welcome", icon: Sparkles },
    { label: "Your Project", icon: Send },
    { label: "Ready", icon: CheckCircle2 },
  ];

  const handleSubmitProject = () => {
    if (!title.trim() || !url.trim()) {
      toast.error("Please fill in both fields");
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("url", url.trim());

      const result = await submitOnboardingProject(formData);
      if (result?.error) {
        toast.error(result.error);
        return;
      }

      setCurrentStep(2);
    });
  };

  const handleGoToDashboard = () => {
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {steps.map((step, i) => (
          <div key={step.label} className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                i < currentStep
                  ? "bg-green-500/20 text-green-400"
                  : i === currentStep
                  ? "bg-primary text-white"
                  : "bg-dark-surface text-dark-text-muted"
              }`}
            >
              {i < currentStep ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                i + 1
              )}
            </div>
            {i < steps.length - 1 && (
              <div
                className={`h-0.5 w-12 transition-colors ${
                  i < currentStep ? "bg-green-500/40" : "bg-dark-border"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="rounded-xl border border-dark-border bg-dark-card p-8">
        {/* Step 1: Welcome */}
        {currentStep === 0 && (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
            </div>

            <div>
              <h1 className="text-2xl font-semibold text-dark-text">
                Welcome to PeerPull{profile.first_name ? `, ${profile.first_name}` : ""}!
              </h1>
              <p className="mt-3 text-dark-text-muted max-w-md mx-auto">
                You&apos;re joining a community of builders who give each other honest,
                high-quality product feedback.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
              <div className="rounded-md border border-dark-border bg-dark-surface p-4">
                <Send className="h-5 w-5 text-primary mb-2" />
                <h3 className="text-sm font-medium text-dark-text">Submit your project</h3>
                <p className="text-xs text-dark-text-muted mt-1">
                  Share what you&apos;re building and get video feedback
                </p>
              </div>
              <div className="rounded-md border border-dark-border bg-dark-surface p-4">
                <Users className="h-5 w-5 text-primary mb-2" />
                <h3 className="text-sm font-medium text-dark-text">Give feedback</h3>
                <p className="text-xs text-dark-text-muted mt-1">
                  Give honest video feedback to earn PeerPoints
                </p>
              </div>
              <div className="rounded-md border border-dark-border bg-dark-surface p-4">
                <Coins className="h-5 w-5 text-primary mb-2" />
                <h3 className="text-sm font-medium text-dark-text">Earn &amp; spend</h3>
                <p className="text-xs text-dark-text-muted mt-1">
                  Use PeerPoints to request more feedback
                </p>
              </div>
            </div>

            <button
              onClick={() => setCurrentStep(1)}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-muted transition"
            >
              Let&apos;s Get Started
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Step 2: Submit Your Project */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-dark-text">Submit Your Project</h2>
              <p className="mt-1 text-sm text-dark-text-muted">
                Share what you&apos;re building to get video feedback from other founders
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-dark-text-muted mb-1">
                  Project Name
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="My Awesome Project"
                  className="w-full rounded-md border border-dark-border bg-dark-surface px-3 py-2 text-sm text-dark-text placeholder-dark-text-muted/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label htmlFor="url" className="block text-sm font-medium text-dark-text-muted mb-1">
                  Project URL
                </label>
                <input
                  id="url"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://yourproject.com"
                  className="w-full rounded-md border border-dark-border bg-dark-surface px-3 py-2 text-sm text-dark-text placeholder-dark-text-muted/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setCurrentStep(0)}
                className="rounded-md border border-dark-border px-4 py-2 text-sm font-medium text-dark-text-muted hover:bg-dark-surface transition"
              >
                Back
              </button>
              <button
                onClick={handleSubmitProject}
                disabled={isPending}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-primary-muted disabled:opacity-50 transition"
              >
                {isPending && <Spinner size="sm" />}
                {isPending ? "Submitting..." : "Submit Project"}
                {!isPending && <ArrowRight className="h-4 w-4" />}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: All Set */}
        {currentStep === 2 && (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
                <CheckCircle2 className="h-8 w-8 text-green-400" />
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-dark-text">
                You&apos;re on the Waitlist!
              </h2>
              <p className="mt-3 text-dark-text-muted max-w-md mx-auto">
                We&apos;re preparing PeerPull for launch. You&apos;ll be one of the first to know when
                the feedback exchange goes live.
              </p>
            </div>

            <div className="rounded-md border border-dark-border bg-dark-surface p-4 text-left space-y-3">
              <h3 className="text-sm font-medium text-dark-text">While you wait, you can:</h3>
              <ul className="space-y-2 text-sm text-dark-text-muted">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0" />
                  Edit your profile and add more details
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0" />
                  Invite other founders to join
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0" />
                  Check your PeerPoints balance
                </li>
              </ul>
            </div>

            <button
              onClick={handleGoToDashboard}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-muted transition"
            >
              Go to Dashboard
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
