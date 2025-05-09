"use client";

import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row px-4 md:px-6">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          © 2025 PeerPull. All rights reserved.
        </p>
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          <Link href="/terms" className="text-sm text-muted-foreground hover:underline px-1">
            Terms
          </Link>
          <Link href="/privacy" className="text-sm text-muted-foreground hover:underline px-1">
            Privacy
          </Link>
          <Link href="/contact" className="text-sm text-muted-foreground hover:underline px-1">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
