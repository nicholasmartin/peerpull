"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Profile } from "@/utils/supabase/profiles";
import { completeOnboarding, updateProfileOnboarding } from "@/app/actions";
import { CheckCircle2, ArrowRight, Globe, Sparkles, Users, Coins, Send } from "lucide-react";

const EXPERTISE_OPTIONS = [
  "SaaS",
  "Mobile App",
  "Web App",
  "API/Backend",
  "UI/UX Design",
  "Marketing",
  "DevTools",
  "E-commerce",
  "AI/ML",
  "Fintech",
  "Other",
];

interface OnboardingFlowProps {
  profile: Profile;
}

export default function OnboardingFlow({ profile }: OnboardingFlowProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [firstName, setFirstName] = useState(profile.first_name || "");
  const [lastName, setLastName] = useState(profile.last_name || "");
  const [website, setWebsite] = useState(profile.website || "");
  const [selectedExpertise, setSelectedExpertise] = useState<string[]>(
    profile.expertise || []
  );
  const [isPending, startTransition] = useTransition();

  const steps = [
    { label: "Welcome", icon: Sparkles },
    { label: "Profile", icon: Globe },
    { label: "Ready", icon: CheckCircle2 },
  ];

  const toggleExpertise = (tag: string) => {
    setSelectedExpertise((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSaveProfile = () => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("first_name", firstName.trim());
      formData.append("last_name", lastName.trim());
      if (website) formData.append("website", website);
      selectedExpertise.forEach((tag) => formData.append("expertise", tag));

      const result = await updateProfileOnboarding(formData);
      if (result?.error) {
        toast.error(result.error);
        return;
      }

      // Move to step 3 and complete onboarding
      const completeResult = await completeOnboarding();
      if (completeResult?.error) {
        toast.error(completeResult.error);
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
                <h3 className="text-sm font-medium text-dark-text">Review others</h3>
                <p className="text-xs text-dark-text-muted mt-1">
                  Give honest video reviews to earn PeerPoints
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

        {/* Step 2: Profile Setup */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-dark-text">Complete Your Profile</h2>
              <p className="mt-1 text-sm text-dark-text-muted">
                Help other builders know who you are
              </p>
            </div>

            <div className="space-y-5">
              {/* Name */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="first_name" className="block text-sm font-medium text-dark-text-muted mb-1">
                    First Name
                  </label>
                  <input
                    id="first_name"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First name"
                    className="w-full rounded-md border border-dark-border bg-dark-surface px-3 py-2 text-sm text-dark-text placeholder-dark-text-muted/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label htmlFor="last_name" className="block text-sm font-medium text-dark-text-muted mb-1">
                    Last Name
                  </label>
                  <input
                    id="last_name"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last name"
                    className="w-full rounded-md border border-dark-border bg-dark-surface px-3 py-2 text-sm text-dark-text placeholder-dark-text-muted/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Website */}
              <div>
                <label htmlFor="website" className="block text-sm font-medium text-dark-text-muted mb-1">
                  Website or Project URL <span className="text-dark-text-muted">(optional)</span>
                </label>
                <input
                  id="website"
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://yourproject.com"
                  className="w-full rounded-md border border-dark-border bg-dark-surface px-3 py-2 text-sm text-dark-text placeholder-dark-text-muted/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Expertise */}
              <div>
                <label className="block text-sm font-medium text-dark-text-muted mb-2">
                  Your Expertise <span className="text-dark-text-muted">(select all that apply)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {EXPERTISE_OPTIONS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleExpertise(tag)}
                      className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                        selectedExpertise.includes(tag)
                          ? "bg-primary text-white"
                          : "border border-dark-border bg-dark-surface text-dark-text-muted hover:border-dark-text-muted/50"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
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
                onClick={handleSaveProfile}
                disabled={isPending}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-primary-muted disabled:opacity-50 transition"
              >
                {isPending ? "Saving..." : "Continue"}
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
