import React from "react";
import Link from "next/link";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dark relative flex min-h-screen flex-col bg-dark-bg">
      {/* Subtle background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-blue-primary/5 blur-[120px]" />
      </div>

      {/* Minimal header — logo only */}
      <header className="relative z-10 flex h-16 items-center px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="bg-blue-primary rounded-md w-7 h-7 flex items-center justify-center">
            <span className="font-montserrat text-dark-bg font-bold text-sm">P</span>
          </div>
          <span className="font-montserrat text-lg font-bold text-dark-text">PeerPull</span>
        </Link>
      </header>

      {/* Content area */}
      <div className="relative z-10 flex flex-1 items-start justify-center px-4 pt-8 sm:pt-16">
        {children}
      </div>
    </div>
  );
}
