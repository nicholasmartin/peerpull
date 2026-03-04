"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
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
    <section id="hero" className="relative min-h-[90vh] md:min-h-screen flex items-center pt-16 md:pt-0 bg-dark-bg overflow-hidden">
      {/* Subtle grid overlay */}
      <div className="absolute inset-0 hero-grid pointer-events-none"></div>

      {/* Animated ambient lights — drift slowly behind the heading */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="hero-glow-1 absolute w-[700px] h-[400px] -ml-[350px] -mt-[200px] rounded-full bg-blue-primary/20 blur-[120px]"></div>
        <div className="hero-glow-2 absolute w-[500px] h-[350px] -ml-[250px] -mt-[175px] rounded-full bg-teal-accent/15 blur-[100px]"></div>
      </div>

      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <div className="flex flex-col items-center gap-6 md:gap-10 text-center max-w-5xl mx-auto">
          <div className="space-y-6 md:space-y-8">
            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl leading-[0.95]">
              <span className="text-blue-primary">Real Feedback</span>
              <br />
              <span className="text-dark-text">From Real Builders</span>
            </h1>

            <p className="text-xl md:text-2xl text-dark-text max-w-2xl mx-auto leading-relaxed">
              PeerPull is a peer exchange platform where builders trade honest feedback. <span className="text-blue-primary font-medium">Give a review, get a review.</span>
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <span className="inline-flex items-center px-5 py-2 rounded-full border border-blue-primary/30 bg-blue-primary/10 text-sm font-medium text-dark-text">{exchangeLabel}</span>
              <span className="inline-flex items-center px-5 py-2 rounded-full border border-blue-primary/30 bg-blue-primary/10 text-sm font-medium text-dark-text">{settings.signupBonus} Free Credits at Signup</span>
              <span className="inline-flex items-center px-5 py-2 rounded-full border border-blue-primary/30 bg-blue-primary/10 text-sm font-medium text-dark-text">Earn {settings.referralBonus} Credits Per Referral</span>
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

          <div className="flex items-center justify-center mt-4 sm:mt-6">
            <Link
              href="/signup"
              className="group relative inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-primary to-teal-accent px-12 py-4 text-lg font-semibold text-dark-bg shadow-[0_0_20px_rgba(212,168,83,0.3)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(212,168,83,0.5)] overflow-hidden"
            >
              <span className="absolute inset-0 -translate-x-full skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-full"></span>
              <span className="relative">Join the private beta launch</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
