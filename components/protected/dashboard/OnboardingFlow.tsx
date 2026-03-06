"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Profile } from "@/utils/supabase/profiles";
import { submitOnboardingProject } from "@/app/actions";
import { Check, Zap, FileText } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import Image from "next/image";

interface OnboardingFlowProps {
  profile: Profile;
  signupBonus: number;
  referralBonus: number;
}

export default function OnboardingFlow({ profile, signupBonus, referralBonus }: OnboardingFlowProps) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [mode, setMode] = useState<"live" | "draft">("live");
  const [isPending, startTransition] = useTransition();

  const isLive = mode === "live";

  const handleSubmitProject = () => {
    if (!title.trim() || !url.trim()) {
      toast.error("Please fill in both fields");
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("url", url.trim());
      formData.append("mode", mode);

      const result = await submitOnboardingProject(formData);
      if (result?.error) {
        toast.error(result.error);
        return;
      }

      setStep(1);
    });
  };

  const handleGoToDashboard = () => {
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="w-full">
      {/* Step 0: Welcome + Project Form */}
      {step === 0 && (
        <div className="rounded-2xl border border-dark-border bg-dark-card p-6 sm:p-10">
          <div className="flex justify-center mb-6">
            <Image
              src="/images/logo/peerpull-icon.png"
              alt="PeerPull"
              width={96}
              height={96}
            />
          </div>

          <div className="text-center mb-8">
            <h1 className="font-montserrat text-3xl sm:text-4xl font-bold text-dark-text leading-tight">
              {profile.first_name
                ? `Hey ${profile.first_name}, let\u2019s get your project listed`
                : "Let\u2019s get your project listed"}
            </h1>
            <p className="mt-3 text-base text-dark-text-muted max-w-md mx-auto">
              Submit your project and you&apos;ll be first in line when builders
              start exchanging video feedback.
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-dark-text-muted mb-1.5">
                Project Name
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="My Awesome Project"
                className="w-full rounded-lg border border-dark-border bg-dark-surface px-4 py-3 text-base text-dark-text placeholder-dark-text-muted/50 focus:border-blue-primary focus:outline-none focus:ring-1 focus:ring-blue-primary"
              />
            </div>

            <div>
              <label htmlFor="url" className="block text-sm font-medium text-dark-text-muted mb-1.5">
                Project URL
              </label>
              <input
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://yourproject.com"
                className="w-full rounded-lg border border-dark-border bg-dark-surface px-4 py-3 text-base text-dark-text placeholder-dark-text-muted/50 focus:border-blue-primary focus:outline-none focus:ring-1 focus:ring-blue-primary"
              />
              <p className="text-xs text-dark-text-muted mt-1.5">
                Where reviewers will go to try your product
              </p>
            </div>

            {/* Live / Draft Toggle */}
            <div>
              <label className="block text-sm font-medium text-dark-text-muted mb-2.5">
                Launch Mode
              </label>
              <div className="grid grid-cols-2 gap-3">
                {/* Live Option */}
                <button
                  type="button"
                  onClick={() => setMode("live")}
                  className={`relative overflow-hidden rounded-xl border-2 p-3.5 text-left transition-all duration-300 ${
                    isLive
                      ? "border-blue-primary bg-dark-surface"
                      : "border-dark-border bg-dark-surface/50 hover:border-dark-border/80"
                  }`}
                >
                  {/* Electrified glow effects for live mode */}
                  {isLive && (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-primary/10 via-transparent to-teal-accent/10" />
                      <div className="absolute -top-1 -right-1 h-20 w-20 rounded-full bg-blue-primary/20 blur-2xl animate-pulse" />
                      <div className="absolute -bottom-1 -left-1 h-16 w-16 rounded-full bg-teal-accent/15 blur-xl animate-pulse [animation-delay:0.5s]" />
                    </>
                  )}
                  <div className="relative flex items-start gap-2.5">
                    <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all duration-300 ${
                      isLive
                        ? "bg-gradient-to-br from-blue-primary to-teal-accent shadow-[0_0_12px_rgba(212,168,83,0.4)]"
                        : "bg-dark-border/50"
                    }`}>
                      <Zap className={`h-4 w-4 transition-colors duration-300 ${
                        isLive ? "text-dark-bg" : "text-dark-text-muted/50"
                      }`} />
                    </div>
                    <div>
                      <span className={`block text-sm font-semibold transition-colors duration-300 ${
                        isLive ? "text-dark-text" : "text-dark-text-muted/70"
                      }`}>
                        Live
                      </span>
                      <span className={`block text-[11px] mt-0.5 transition-colors duration-300 ${
                        isLive ? "text-dark-text-muted" : "text-dark-text-muted/50"
                      }`}>
                        Join the queue now and start getting feedback
                      </span>
                    </div>
                  </div>
                  {/* Active indicator dot */}
                  {isLive && (
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                      </span>
                    </div>
                  )}
                </button>

                {/* Draft Option */}
                <button
                  type="button"
                  onClick={() => setMode("draft")}
                  className={`relative overflow-hidden rounded-xl border-2 p-3.5 text-left transition-all duration-300 ${
                    !isLive
                      ? "border-dark-text-muted/40 bg-dark-surface"
                      : "border-dark-border bg-dark-surface/50 hover:border-dark-border/80"
                  }`}
                >
                  <div className="relative flex items-start gap-2.5">
                    <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all duration-300 ${
                      !isLive
                        ? "bg-dark-border"
                        : "bg-dark-border/50"
                    }`}>
                      <FileText className={`h-4 w-4 transition-colors duration-300 ${
                        !isLive ? "text-dark-text-muted" : "text-dark-text-muted/50"
                      }`} />
                    </div>
                    <div>
                      <span className={`block text-sm font-semibold transition-colors duration-300 ${
                        !isLive ? "text-dark-text" : "text-dark-text-muted/70"
                      }`}>
                        Draft
                      </span>
                      <span className={`block text-[11px] mt-0.5 transition-colors duration-300 ${
                        !isLive ? "text-dark-text-muted" : "text-dark-text-muted/50"
                      }`}>
                        Save for later, go live from your dashboard
                      </span>
                    </div>
                  </div>
                  {/* Selected check */}
                  {!isLive && (
                    <div className="absolute top-2.5 right-2.5">
                      <Check className="h-4 w-4 text-dark-text-muted" />
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={handleSubmitProject}
            disabled={isPending}
            className={`mt-8 w-full inline-flex items-center justify-center gap-2 rounded-lg py-3.5 text-base font-semibold transition-all disabled:opacity-50 ${
              isLive
                ? "bg-gradient-to-r from-blue-primary to-teal-accent text-dark-bg shadow-[0_0_20px_rgba(212,168,83,0.2)] hover:shadow-[0_0_30px_rgba(212,168,83,0.35)]"
                : "bg-dark-surface border border-dark-border text-dark-text hover:bg-dark-border/50"
            }`}
          >
            {isPending && <Spinner size="sm" />}
            {isPending
              ? "Submitting..."
              : isLive
                ? "Submit Project"
                : "Save as Draft"}
          </button>
        </div>
      )}

      {/* Step 1: Confirmation */}
      {step === 1 && (
        <div className="rounded-2xl border border-dark-border bg-dark-card p-6 sm:p-10">
          <div className="flex justify-center mb-6">
            <Image
              src="/images/logo/peerpull-icon.png"
              alt="PeerPull"
              width={96}
              height={96}
            />
          </div>

          <div className="text-center mb-8">
            <h2 className="font-montserrat text-3xl sm:text-4xl font-bold text-dark-text">
              {isLive ? "You\u2019re in." : "Draft saved."}
            </h2>
            <p className="mt-3 text-base text-dark-text-muted max-w-md mx-auto">
              {isLive
                ? "Your project is queued. We\u2019ll notify you when PeerPull goes live and the feedback starts rolling in."
                : "Your project is saved as a draft. You can publish it to the feedback queue anytime from your dashboard."}
            </p>
          </div>

          <div className="rounded-xl border border-dark-border bg-dark-surface p-5 space-y-3.5 mb-8">
            <div className="flex items-start gap-3">
              <Check className="h-5 w-5 text-blue-primary shrink-0 mt-0.5" />
              <span className="text-sm text-dark-text">Complete your profile to stand out</span>
            </div>
            <div className="flex items-start gap-3">
              <Check className="h-5 w-5 text-blue-primary shrink-0 mt-0.5" />
              <span className="text-sm text-dark-text">Share your referral link, earn {referralBonus} bonus PeerPoints per signup</span>
            </div>
            <div className="flex items-start gap-3">
              <Check className="h-5 w-5 text-blue-primary shrink-0 mt-0.5" />
              <span className="text-sm text-dark-text">Add focus areas, questions, and details to help reviewers give better feedback</span>
            </div>
          </div>

          <button
            onClick={handleGoToDashboard}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-primary to-teal-accent py-3.5 text-base font-semibold text-dark-bg shadow-[0_0_20px_rgba(212,168,83,0.2)] hover:shadow-[0_0_30px_rgba(212,168,83,0.35)] transition-all"
          >
            Go to Dashboard
          </button>
        </div>
      )}
    </div>
  );
}
