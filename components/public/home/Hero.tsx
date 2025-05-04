"use client";

import Link from 'next/link';
import Button from "@/components/ui/button/Button";

export function Hero() {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-prussian-blue via-prussian-blue/90 to-prussian-blue/80 text-papaya-whip">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center gap-6 text-center max-w-4xl mx-auto">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-papaya-whip">
              Validate Before You Build
            </h1>
            <p className="text-xl md:text-2xl font-semibold text-air-blue">
              Pull your startup forward with honest feedback from fellow technical founders.
            </p>
            <p className="text-lg text-papaya-whip/80 mt-2">
              Join 500+ founders who are building better startups through peer validation
            </p>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
            <Link href="/signup">
              <Button size="md" className="text-base font-medium px-6 py-4 bg-fire-brick hover:bg-barn-red text-papaya-whip">
                Get Early Access
              </Button>
            </Link>
            <Button size="md" variant="outline" className="text-base font-medium px-6 py-4 border-air-blue text-air-blue hover:bg-air-blue/10">
              See How It Works
            </Button>
          </div>
          
          <div className="mt-12 bg-papaya-whip/10 p-6 rounded-lg border border-air-blue/30 max-w-2xl mx-auto shadow-lg">
            <p className="text-md md:text-lg italic text-papaya-whip/90">
              "I avoided months of wasted development after just 3 pieces of feedback from fellow founders."
              <span className="block mt-2 font-medium text-air-blue">- Alex K., SaaSFounder</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
