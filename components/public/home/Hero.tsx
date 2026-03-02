"use client";

import Link from 'next/link';
import Button from "@/components/ui/button/Button";
import type { SiteSettings } from "@/app/(public)/page";

export function Hero({ settings }: { settings: SiteSettings }) {
  const exchangeLabel =
    settings.reviewReward === settings.reviewCost
      ? `${settings.reviewReward}:${settings.reviewCost} Exchange Ratio`
      : `Earn ${settings.reviewReward} Per Review`;

  return (
    <section id="hero" className="relative py-20 md:min-h-screen md:flex md:items-center bg-dark-bg overflow-hidden">
      {/* Subtle warm glow — restrained */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-gradient-to-r from-blue-primary/8 to-teal-accent/8 blur-3xl"></div>
      </div>

      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <div className="flex flex-col items-center gap-4 md:gap-8 text-center max-w-4xl mx-auto">
          <div className="space-y-5 md:space-y-6">
            <div className="inline-flex items-center px-5 py-2.5 rounded-full border border-dark-border bg-dark-card/60 backdrop-blur-sm">
              <span className="text-blue-primary font-semibold text-sm tracking-wide uppercase">Closed Beta</span>
              <div className="w-1.5 h-1.5 rounded-full bg-blue-primary mx-3 animate-pulse"></div>
              <span className="text-dark-text-muted text-sm">Invite Only</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-dark-border bg-dark-card/40 text-sm text-dark-text-muted">{exchangeLabel}</span>
              <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-dark-border bg-dark-card/40 text-sm text-dark-text-muted">{settings.signupBonus} Free Credits at Signup</span>
              <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-dark-border bg-dark-card/40 text-sm text-dark-text-muted">Earn {settings.referralBonus} Credits Per Referral</span>
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="text-blue-primary">Real Feedback</span>
              <br />
              <span className="text-dark-text">From Real Builders</span>
            </h1>

            <p className="text-lg md:text-xl text-dark-text-muted max-w-2xl mx-auto leading-relaxed">
              PeerPull is a peer exchange platform where builders trade honest feedback. Give a review, get a review.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 mt-8 sm:mt-10 w-full sm:w-auto">
            <Link href="/signup" className="w-full sm:w-auto">
              <Button
                size="md"
                className="text-base font-semibold px-8 py-4 bg-blue-primary hover:bg-blue-secondary transition-colors text-dark-bg w-full sm:w-auto"
              >
                Join the Beta
              </Button>
            </Link>
            <Button
              size="md"
              variant="outline"
              className="text-base font-medium px-8 py-4 border-dark-border text-dark-text-muted hover:text-dark-text hover:border-dark-text-muted/30 transition-all w-full sm:w-auto mt-3 sm:mt-0"
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView()}
            >
              See How It Works
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
