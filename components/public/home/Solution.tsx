"use client";

import React from 'react';

export function Solution() {
  return (
    <section className="py-16 md:py-24 bg-prussian-blue text-papaya-whip">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-2 text-papaya-whip">The Solution</h2>
            <h3 className="text-2xl font-semibold text-air-blue mb-6">Pull Insights From Peers Who Get It</h3>
          </div>
          
          <div className="prose prose-lg prose-invert mx-auto">
            <p className="text-lg mb-8 text-papaya-whip/90">
              PeerPull connects you with other technical founders who understand what you're building.
            </p>
            
            <div className="bg-papaya-whip/10 p-8 rounded-xl border border-air-blue/30 shadow-lg">
              <h4 className="text-xl font-semibold mb-6 text-papaya-whip">Here's how it works:</h4>
              
              <ol className="space-y-6 counter-reset my-counter">
                <li className="flex items-start gap-4">
                  <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-fire-brick text-papaya-whip font-medium text-sm shadow-md">1</div>
                  <div>
                    <p className="font-medium text-papaya-whip">Submit your landing page or startup concept as a PullRequest</p>
                  </div>
                </li>
                
                <li className="flex items-start gap-4">
                  <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-fire-brick text-papaya-whip font-medium text-sm shadow-md">2</div>
                  <div>
                    <p className="font-medium text-papaya-whip">Give quality feedback to two other founders</p>
                  </div>
                </li>
                
                <li className="flex items-start gap-4">
                  <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-fire-brick text-papaya-whip font-medium text-sm shadow-md">3</div>
                  <div>
                    <p className="font-medium text-papaya-whip">Receive one thoughtful review in return—usually within hours</p>
                  </div>
                </li>
                
                <li className="flex items-start gap-4">
                  <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-fire-brick text-papaya-whip font-medium text-sm shadow-md">4</div>
                  <div>
                    <p className="font-medium text-papaya-whip">Iterate with confidence, knowing real founders have validated your direction</p>
                  </div>
                </li>
              </ol>
            </div>
            
            <p className="text-lg font-medium mt-8 text-center text-air-blue">
              It's that simple. No marketing fluff, no generic advice—just targeted, technical feedback from people who speak your language.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
