"use client";

import React from 'react';
import Button from "@/components/ui/button/Button";

export function ForExperiencedFounders() {
  return (
    <section className="py-16 md:py-24 bg-muted/20">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-2">For Experienced Founders</h2>
            <h3 className="text-2xl font-semibold text-primary mb-6">Why Veterans Pull Others Forward</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-background rounded-xl p-8 shadow-sm border border-border/40">
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="bg-primary/10 text-primary rounded-full p-1 mt-1 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  </div>
                  <span><strong>Discover promising startups</strong> before anyone else</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-primary/10 text-primary rounded-full p-1 mt-1 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  </div>
                  <span><strong>Build your advisory portfolio</strong> with founders you help nurture</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-primary/10 text-primary rounded-full p-1 mt-1 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  </div>
                  <span><strong>Earn recognition</strong> through our PeerPro badge and leaderboard</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-background rounded-xl p-8 shadow-sm border border-border/40">
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="bg-primary/10 text-primary rounded-full p-1 mt-1 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  </div>
                  <span><strong>Pay it forward</strong> to the next generation of builders</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-primary/10 text-primary rounded-full p-1 mt-1 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  </div>
                  <span><strong>Refine your own ideas</strong> by seeing what others are building</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="bg-background rounded-xl p-8 shadow-sm border border-border/40 text-center">
            <p className="text-lg italic text-muted-foreground mb-2">
              "I regularly review projects on PeerPull to stay connected with new trends. I've already found two startups I'm now advising."
            </p>
            <p className="font-medium">— Michael R., 3x Founder</p>
            
            <div className="mt-8">
              <Button size="md" variant="outline" className="text-base font-medium">
                Join as an Experienced Founder
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
