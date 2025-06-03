"use client";

import Link from 'next/link';
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
});

export function Footer() {
  return (
    <footer className="border-t border-glass-border bg-dark-bg relative overflow-hidden py-10 md:py-8">
      {/* Subtle gradient background effect */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-dark-bg to-dark-card/50 opacity-50"></div>
      
      {/* Subtle glass reflection */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-glass-highlight to-transparent opacity-30"></div>
      
      <div className="container flex flex-col items-center justify-between gap-6 md:h-24 md:flex-row px-4 md:px-6 relative z-10">
        <div className="flex items-center">
          <div className="bg-gradient-to-r from-blue-primary to-teal-accent rounded-md w-8 h-8 flex items-center justify-center mr-3 shadow-sm">
            <span className={`${montserrat.className} text-dark-text font-bold text-lg`}>P</span>
          </div>
          <p className="text-center text-sm leading-loose text-dark-text md:text-left">
            © 2025 <span className="bg-gradient-to-r from-gradient-start to-gradient-end bg-clip-text text-transparent font-medium">PeerPull</span>. All rights reserved.
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-6 md:gap-8">
          <Link href="#" className="text-sm text-dark-text-muted hover:text-dark-text transition-colors duration-200 hover:bg-gradient-to-r hover:from-blue-primary hover:to-teal-accent hover:bg-clip-text hover:text-transparent px-1">
            Terms
          </Link>
          <Link href="#" className="text-sm text-dark-text-muted hover:text-dark-text transition-colors duration-200 hover:bg-gradient-to-r hover:from-blue-primary hover:to-teal-accent hover:bg-clip-text hover:text-transparent px-1">
            Privacy
          </Link>
          <Link href="#" className="text-sm text-dark-text-muted hover:text-dark-text transition-colors duration-200 hover:bg-gradient-to-r hover:from-blue-primary hover:to-teal-accent hover:bg-clip-text hover:text-transparent px-1">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
