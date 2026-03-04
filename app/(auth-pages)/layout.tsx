import React from "react";
import Link from "next/link";
import { ThemeProvider } from "@/context/ThemeContext";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider isProtected={false}>
      <div className="dark relative flex min-h-screen flex-col bg-dark-bg">
        {/* Subtle background glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-blue-primary/5 blur-[120px]" />
        </div>

        {/* Minimal header */}
        <header className="relative z-10 flex h-16 items-center border-b border-dark-border bg-dark-bg/90 backdrop-blur-md px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="bg-blue-primary rounded-md w-7 h-7 flex items-center justify-center">
              <span className="font-montserrat text-dark-bg font-bold text-sm">P</span>
            </div>
            <span className="font-montserrat text-lg font-bold text-dark-text">PeerPull</span>
          </Link>
        </header>

        {/* Form area */}
        <div className="relative z-10 flex flex-1 items-center justify-center p-4 sm:p-8">
          <div className="w-full max-w-md rounded-xl border border-dark-border bg-dark-card p-6 sm:p-8 shadow-lg">
            {children}
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
