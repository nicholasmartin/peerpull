"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Profile } from "@/utils/supabase/profiles";
import { submitOnboardingProject } from "@/app/actions";
import { Check } from "lucide-react";
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
  const [isPending, startTransition] = useTransition();

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
        <div className="rounded-2xl border border-dark-border bg-dark-card p-8 sm:p-12">
          <div className="flex justify-center mb-8">
            <Image
              src="/images/logo/peerpull-icon.png"
              alt="PeerPull"
              width={120}
              height={120}
            />
          </div>

          <div className="text-center mb-10">
            <h1 className="font-montserrat text-4xl sm:text-5xl font-bold text-dark-text leading-tight">
              {profile.first_name
                ? `Hey ${profile.first_name}, let\u2019s get your project listed`
                : "Let\u2019s get your project listed"}
            </h1>
            <p className="mt-4 text-lg text-dark-text-muted max-w-md mx-auto">
              Submit your project and you&apos;ll be first in line when builders
              start exchanging video feedback.
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-base font-medium text-dark-text-muted mb-2">
                Project Name
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="My Awesome Project"
                className="w-full rounded-lg border border-dark-border bg-dark-surface px-5 py-4 text-lg text-dark-text placeholder-dark-text-muted/50 focus:border-blue-primary focus:outline-none focus:ring-1 focus:ring-blue-primary"
              />
            </div>

            <div>
              <label htmlFor="url" className="block text-base font-medium text-dark-text-muted mb-2">
                Project URL
              </label>
              <input
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://yourproject.com"
                className="w-full rounded-lg border border-dark-border bg-dark-surface px-5 py-4 text-lg text-dark-text placeholder-dark-text-muted/50 focus:border-blue-primary focus:outline-none focus:ring-1 focus:ring-blue-primary"
              />
              <p className="text-sm text-dark-text-muted mt-2">
                Where reviewers will go to try your product
              </p>
            </div>
          </div>

          <button
            onClick={handleSubmitProject}
            disabled={isPending}
            className="mt-10 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-primary to-teal-accent py-4 text-lg font-semibold text-dark-bg shadow-[0_0_20px_rgba(212,168,83,0.2)] hover:shadow-[0_0_30px_rgba(212,168,83,0.35)] disabled:opacity-50 transition-all"
          >
            {isPending && <Spinner size="sm" />}
            {isPending ? "Submitting..." : "Submit Project"}
          </button>
        </div>
      )}

      {/* Step 1: Confirmation */}
      {step === 1 && (
        <div className="rounded-2xl border border-dark-border bg-dark-card p-8 sm:p-12">
          <div className="flex justify-center mb-8">
            <Image
              src="/images/logo/peerpull-icon.png"
              alt="PeerPull"
              width={120}
              height={120}
            />
          </div>

          <div className="text-center mb-10">
            <h2 className="font-montserrat text-4xl sm:text-5xl font-bold text-dark-text">
              You&apos;re in.
            </h2>
            <p className="mt-4 text-lg text-dark-text-muted max-w-md mx-auto">
              Your project is queued. We&apos;ll notify you when PeerPull goes
              live and the feedback starts rolling in.
            </p>
          </div>

          <div className="rounded-xl border border-dark-border bg-dark-surface p-6 space-y-4 mb-10">
            <div className="flex items-start gap-3">
              <Check className="h-6 w-6 text-blue-primary shrink-0 mt-0.5" />
              <span className="text-base text-dark-text">Complete your profile to stand out</span>
            </div>
            <div className="flex items-start gap-3">
              <Check className="h-6 w-6 text-blue-primary shrink-0 mt-0.5" />
              <span className="text-base text-dark-text">Share your referral link, earn {referralBonus} bonus PeerPoints per signup</span>
            </div>
            <div className="flex items-start gap-3">
              <Check className="h-6 w-6 text-blue-primary shrink-0 mt-0.5" />
              <span className="text-base text-dark-text">You start with {signupBonus} PeerPoints in your balance</span>
            </div>
          </div>

          <button
            onClick={handleGoToDashboard}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-primary to-teal-accent py-4 text-lg font-semibold text-dark-bg shadow-[0_0_20px_rgba(212,168,83,0.2)] hover:shadow-[0_0_30px_rgba(212,168,83,0.35)] transition-all"
          >
            Go to Dashboard
          </button>
        </div>
      )}
    </div>
  );
}
