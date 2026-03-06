"use client";

import Link from "next/link";
import type { SiteSettings } from "@/app/(public)/page";
import { ScreenshotCarousel } from "./ScreenshotCarousel";

const SCREENSHOTS = [
  { src: "/images/screenshots/dashboard-1.png", alt: "PeerPull Dashboard" },
  { src: "/images/screenshots/dashboard-2.png", alt: "Feedback Request View" },
  { src: "/images/screenshots/dashboard-3.png", alt: "Review Session" },
];

export function Hero({ settings }: { settings: SiteSettings }) {
  const exchangeLabel =
    settings.reviewReward === settings.reviewCost
      ? `${settings.reviewReward}:${settings.reviewCost} Exchange Ratio`
      : `Earn ${settings.reviewReward} Per Feedback`;

  return (
    <section
      id="hero"
      className="relative min-h-[90vh] md:min-h-screen flex items-center pt-16 md:pt-0 bg-dark-bg overflow-hidden"
    >
      {/* Subtle grid overlay */}
      <div className="absolute inset-0 hero-grid pointer-events-none"></div>

      {/* Animated ambient lights */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="hero-glow-1 absolute w-[700px] h-[400px] -ml-[350px] -mt-[200px] rounded-full bg-blue-primary/20 blur-[120px]"></div>
        <div className="hero-glow-2 absolute w-[500px] h-[350px] -ml-[250px] -mt-[175px] rounded-full bg-teal-accent/15 blur-[100px]"></div>
      </div>

      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <div className="flex flex-col items-center gap-5 md:gap-8 text-center max-w-5xl mx-auto">
          <div className="space-y-4 md:space-y-5">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl leading-[0.95]">
              <span className="text-blue-primary">Real Feedback</span>
              <br />
              <span className="text-dark-text">From Real Builders</span>
            </h1>

            <p className="text-lg md:text-xl text-dark-text max-w-2xl mx-auto leading-relaxed">
              PeerPull is a peer exchange platform where builders trade honest
              feedback.{" "}
              <span className="text-blue-primary font-medium">
                Give feedback, get feedback.
              </span>
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-blue-primary/30 bg-blue-primary/10 text-sm font-medium text-dark-text">
                {exchangeLabel}
              </span>
              <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-blue-primary/30 bg-blue-primary/10 text-sm font-medium text-dark-text">
                {settings.signupBonus} Free Credits at Signup
              </span>
              <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-blue-primary/30 bg-blue-primary/10 text-sm font-medium text-dark-text">
                Earn {settings.referralBonus} Credits Per Referral
              </span>
            </div>
          </div>

          <Link
            href="/signup"
            className="group relative inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-primary to-teal-accent px-10 py-3.5 text-lg font-semibold text-dark-bg shadow-[0_0_20px_rgba(212,168,83,0.3)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(212,168,83,0.5)] overflow-hidden"
          >
            <span className="absolute inset-0 -translate-x-full skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-full"></span>
            <span className="relative">Join the private beta launch</span>
          </Link>

          {/* Screenshot Carousel */}
          <div className="w-full mt-2 md:mt-4">
            <ScreenshotCarousel images={SCREENSHOTS} />
          </div>
        </div>
      </div>
    </section>
  );
}
