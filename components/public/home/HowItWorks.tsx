"use client";

import React from 'react';
import Image from 'next/image';

export function HowItWorks() {
  return (
    <section className="py-16 md:py-24 bg-papaya-whip text-prussian-blue">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-2 text-barn-red">How It Works</h2>
            <h3 className="text-2xl font-semibold text-prussian-blue mb-6">The 2:1 Exchange That Powers PeerPull</h3>
          </div>
          
          {/* Placeholder for diagram - would be replaced with actual image */}
          <div className="relative w-full h-64 md:h-80 mb-16 bg-prussian-blue/10 rounded-xl flex items-center justify-center border-2 border-air-blue shadow-lg">
            <p className="text-prussian-blue font-semibold">How PeerPull Works - Diagram</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            <div className="bg-white rounded-xl border-2 border-fire-brick p-6 md:p-8 shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-fire-brick text-papaya-whip font-medium text-lg shadow-md">1</div>
                <h4 className="text-xl font-semibold text-barn-red">Submit Your PullRequest</h4>
              </div>
              <ul className="space-y-3 pl-14">
                <li className="flex items-start gap-2">
                  <span className="text-fire-brick mr-2">•</span>
                  <span className="text-prussian-blue">Add your landing page URL</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-fire-brick mr-2">•</span>
                  <span className="text-prussian-blue">Specify what feedback you need most</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-fire-brick mr-2">•</span>
                  <span className="text-prussian-blue">Choose from our templates to get structured insights</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-xl border-2 border-air-blue p-6 md:p-8 shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-air-blue text-white font-medium text-lg shadow-md">2</div>
                <h4 className="text-xl font-semibold text-air-blue">Review Other Projects</h4>
              </div>
              <ul className="space-y-3 pl-14">
                <li className="flex items-start gap-2">
                  <span className="text-air-blue mr-2">•</span>
                  <span className="text-prussian-blue">Browse available projects in your expertise areas</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-air-blue mr-2">•</span>
                  <span className="text-prussian-blue">Provide thoughtful reviews using our guided frameworks</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-air-blue mr-2">•</span>
                  <span className="text-prussian-blue">Each review takes about 10-15 minutes</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-xl border-2 border-fire-brick p-6 md:p-8 shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-fire-brick text-papaya-whip font-medium text-lg shadow-md">3</div>
                <h4 className="text-xl font-semibold text-barn-red">Earn PeerPoints</h4>
              </div>
              <ul className="space-y-3 pl-14">
                <li className="flex items-start gap-2">
                  <span className="text-fire-brick mr-2">•</span>
                  <span className="text-prussian-blue">For every two reviews you give, you earn one PeerPoint</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-fire-brick mr-2">•</span>
                  <span className="text-prussian-blue">Each PeerPoint gets you one review on your project</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-fire-brick mr-2">•</span>
                  <span className="text-prussian-blue">All feedback is vetted to ensure quality</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-fire-brick mr-2">•</span>
                  <span className="text-prussian-blue">Average time to first PeerInsight: under 4 hours</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-xl border-2 border-air-blue p-6 md:p-8 shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-air-blue text-white font-medium text-lg shadow-md">4</div>
                <h4 className="text-xl font-semibold text-air-blue">Build Better, Faster</h4>
              </div>
              <ul className="space-y-3 pl-14">
                <li className="flex items-start gap-2">
                  <span className="text-air-blue mr-2">•</span>
                  <span className="text-prussian-blue">Identify blindspots before writing a line of code</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-air-blue mr-2">•</span>
                  <span className="text-prussian-blue">Avoid wasting time on features your users won't want</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-air-blue mr-2">•</span>
                  <span className="text-prussian-blue">Make data-driven decisions based on real founder insights</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
