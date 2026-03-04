"use client";

import Link from 'next/link';
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
});

export function Footer() {
  return (
    <footer className="border-t border-dark-border bg-dark-bg py-10 md:py-8">
      <div className="container flex flex-col items-center justify-between gap-6 md:h-24 md:flex-row px-4 md:px-6">
        <div className="flex items-center">
          <div className="bg-blue-primary rounded-md w-7 h-7 flex items-center justify-center mr-3">
            <span className={`${montserrat.className} text-dark-bg font-bold text-sm`}>P</span>
          </div>
          <p className="text-center text-sm text-dark-text-muted md:text-left">
            &copy; 2025 <span className="text-dark-text font-medium">PeerPull</span>. All rights reserved.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6 md:gap-8">
          <Link href="/terms" className="text-sm text-dark-text-muted hover:text-dark-text transition-colors duration-200">
            Terms
          </Link>
          <Link href="/privacy" className="text-sm text-dark-text-muted hover:text-dark-text transition-colors duration-200">
            Privacy
          </Link>
          <Link href="#" className="text-sm text-dark-text-muted hover:text-dark-text transition-colors duration-200">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
