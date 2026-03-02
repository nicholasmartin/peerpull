"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Button from "@/components/ui/button/Button";
import type { SiteSettings } from "@/app/(public)/page";

function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    function calc() {
      const now = Date.now();
      const diff = targetDate.getTime() - now;
      if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      };
    }

    setTimeLeft(calc());
    const interval = setInterval(() => setTimeLeft(calc()), 1_000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return timeLeft;
}

// March 9 2026 04:00 SGT (UTC+8) = March 8 20:00 UTC
const LAUNCH_DATE = new Date("2026-03-09T04:00:00+08:00");

export function Hero({ settings }: { settings: SiteSettings }) {
  const exchangeLabel =
    settings.reviewReward === settings.reviewCost
      ? `${settings.reviewReward}:${settings.reviewCost} Exchange Ratio`
      : `Earn ${settings.reviewReward} Per Review`;

  const { days, hours, minutes, seconds } = useCountdown(LAUNCH_DATE);
  const isExpired = days === 0 && hours === 0 && minutes === 0 && seconds === 0;

  return (
    <section id="hero" className="relative min-h-[90vh] md:min-h-screen flex items-center bg-dark-bg overflow-hidden">
      {/* Larger, more dramatic warm glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[30%] left-[50%] -translate-x-1/2 w-[1000px] h-[600px] rounded-full bg-gradient-to-r from-blue-primary/10 to-teal-accent/10 blur-3xl"></div>
        <div className="absolute bottom-[10%] left-[20%] w-[400px] h-[400px] rounded-full bg-blue-primary/5 blur-3xl"></div>
      </div>

      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <div className="flex flex-col items-center gap-6 md:gap-10 text-center max-w-5xl mx-auto">
          <div className="space-y-6 md:space-y-8">
            <div className="inline-flex items-center px-5 py-2.5 rounded-full border border-dark-border bg-dark-card/60 backdrop-blur-sm">
              <span className="text-blue-primary font-semibold text-sm tracking-wide uppercase">Closed Beta</span>
              <div className="w-1.5 h-1.5 rounded-full bg-blue-primary mx-3 animate-pulse"></div>
              <span className="text-dark-text-muted text-sm">Invite Only</span>
            </div>

            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl leading-[0.95]">
              <span className="text-blue-primary">Real Feedback</span>
              <br />
              <span className="text-dark-text">From Real Builders</span>
            </h1>

            <p className="text-xl md:text-2xl text-dark-text-muted max-w-2xl mx-auto leading-relaxed">
              PeerPull is a peer exchange platform where builders trade honest feedback. Give a review, get a review.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-dark-border bg-dark-card/40 text-sm text-dark-text-muted">{exchangeLabel}</span>
              <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-dark-border bg-dark-card/40 text-sm text-dark-text-muted">{settings.signupBonus} Free Credits at Signup</span>
              <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-dark-border bg-dark-card/40 text-sm text-dark-text-muted">Earn {settings.referralBonus} Credits Per Referral</span>
            </div>
          </div>

          {!isExpired && (
            <div className="flex items-center gap-6 mt-2">
              <div className="text-center">
                <span className="block text-3xl md:text-4xl font-bold text-blue-primary tabular-nums">{String(days).padStart(2, "0")}</span>
                <span className="text-xs uppercase tracking-widest text-dark-text-muted">Days</span>
              </div>
              <span className="text-dark-border text-2xl font-light">:</span>
              <div className="text-center">
                <span className="block text-3xl md:text-4xl font-bold text-blue-primary tabular-nums">{String(hours).padStart(2, "0")}</span>
                <span className="text-xs uppercase tracking-widest text-dark-text-muted">Hours</span>
              </div>
              <span className="text-dark-border text-2xl font-light">:</span>
              <div className="text-center">
                <span className="block text-3xl md:text-4xl font-bold text-blue-primary tabular-nums">{String(minutes).padStart(2, "0")}</span>
                <span className="text-xs uppercase tracking-widest text-dark-text-muted">Min</span>
              </div>
              <span className="text-dark-border text-2xl font-light">:</span>
              <div className="text-center">
                <span className="block text-3xl md:text-4xl font-bold text-blue-primary tabular-nums">{String(seconds).padStart(2, "0")}</span>
                <span className="text-xs uppercase tracking-widest text-dark-text-muted">Sec</span>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 mt-4 sm:mt-6 w-full sm:w-auto">
            <Link href="/signup" className="w-full sm:w-auto">
              <Button
                size="md"
                className="text-lg font-semibold px-10 py-5 bg-blue-primary hover:bg-blue-secondary transition-colors text-dark-bg w-full sm:w-auto"
              >
                Join the Beta
              </Button>
            </Link>
            <Button
              size="md"
              variant="outline"
              className="text-lg font-medium px-10 py-5 border-dark-border text-dark-text-muted hover:text-dark-text hover:border-dark-text-muted/30 transition-all w-full sm:w-auto mt-3 sm:mt-0"
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
