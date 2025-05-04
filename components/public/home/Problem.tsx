"use client";

import React from 'react';

export function Problem() {
  return (
    <section id="problem" className="py-16 md:py-24 bg-papaya-whip text-prussian-blue">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-2 text-barn-red">The Problem</h2>
            <h3 className="text-2xl font-semibold text-prussian-blue mb-6">Building Without Direction</h3>
          </div>
          
          <div className="prose prose-lg mx-auto">
            <p className="text-lg mb-6 text-prussian-blue">
              As a solo founder, you face challenges that funded startups don't:
            </p>
            
            <ul className="space-y-4 my-8">
              <li className="flex items-start gap-3">
                <div className="bg-fire-brick text-papaya-whip rounded-full p-1 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                    <path d="m9 12 2 2 4-4"></path>
                  </svg>
                </div>
                <span className="text-prussian-blue"><strong>No co-founders</strong> to bounce ideas off or spot your blindspots</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-fire-brick text-papaya-whip rounded-full p-1 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                    <path d="m9 12 2 2 4-4"></path>
                  </svg>
                </div>
                <span className="text-prussian-blue"><strong>Limited budget</strong> for user research or professional feedback</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-fire-brick text-papaya-whip rounded-full p-1 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                    <path d="m9 12 2 2 4-4"></path>
                  </svg>
                </div>
                <span className="text-prussian-blue"><strong>Uncertain validation</strong> if your landing page or MVP is on the right track</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-fire-brick text-papaya-whip rounded-full p-1 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                    <path d="m9 12 2 2 4-4"></path>
                  </svg>
                </div>
                <span className="text-prussian-blue"><strong>Echo chambers</strong> of friends and family who won't give harsh truths</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-fire-brick text-papaya-whip rounded-full p-1 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                    <path d="m9 12 2 2 4-4"></path>
                  </svg>
                </div>
                <span className="text-prussian-blue"><strong>Wasted dev time</strong> building features no one will use</span>
              </li>
            </ul>
            
            <p className="text-lg font-medium text-prussian-blue mt-8 border-l-4 border-barn-red pl-4 py-2 bg-fire-brick/5 rounded-r-md shadow-sm">
              Most technical founders spend weeks building the wrong thing because they lacked objective feedback at the crucial early stage.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
