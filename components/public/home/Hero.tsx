"use client";

import Link from 'next/link';
import Button from "@/components/ui/button/Button";

export function Hero() {
  return (
    <section id="hero" className="py-16 md:py-28 bg-gradient-to-b from-prussian-blue via-prussian-blue/90 to-prussian-blue/80 text-papaya-whip overflow-hidden">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center gap-4 md:gap-6 text-center max-w-4xl mx-auto">
          <div className="space-y-3 md:space-y-4">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-papaya-whip">
              Get Valuable Feedback on Your Startup Idea Today!
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl font-semibold text-air-blue">
              Submit Your Landing Page or MVP for Free Feedback From Other Founders and Startup Entrepreneurs.
            </p>
            <p className="text-base md:text-lg text-papaya-whip/80 mt-2">
              Join a community of like minded founders eager to provide feedback on your startup idea.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-4 sm:mt-6 w-full sm:w-auto">
            <Link href="/signup" className="w-full sm:w-auto">
              <Button size="md" className="text-base font-medium px-5 py-3 md:px-6 md:py-4 bg-fire-brick hover:bg-barn-red text-papaya-whip w-full sm:w-auto">
                Get Early Access
              </Button>
            </Link>
            <Button 
              size="md" 
              variant="outline" 
              className="text-base font-medium px-5 py-3 md:px-6 md:py-4 border-air-blue text-air-blue hover:bg-air-blue/10 w-full sm:w-auto mt-2 sm:mt-0"
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
            >
              See How It Works
            </Button>
          </div>
          
          <div className="mt-8 md:mt-12 bg-papaya-whip/10 p-4 md:p-6 rounded-lg border border-air-blue/30 max-w-2xl mx-auto shadow-lg">
            <p className="text-sm md:text-md lg:text-lg italic text-papaya-whip/90">
              "I avoided months of wasted development after just 3 pieces of feedback from fellow founders."
              <span className="block mt-2 font-medium text-air-blue">- Alex K., SaaSFounder</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
