"use client";

import React from 'react';
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
});

// Icon component for problem list items
const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
    <path d="m9 12 2 2 4-4"></path>
  </svg>
);

export function Problem() {
  return (
    <section id="problem-solution" className="py-20 md:py-32 bg-dark-bg relative">
      {/* Abstract geometric shapes for background */}
      <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
        <div className="absolute top-[30%] left-[5%] w-[400px] h-[400px] rounded-full bg-gradient-to-r from-blue-primary to-blue-secondary blur-3xl opacity-10"></div>
        <div className="absolute bottom-[20%] right-[10%] w-[300px] h-[300px] rounded-full bg-gradient-to-r from-teal-accent to-blue-primary blur-3xl opacity-10"></div>
      </div>
      
      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className={`${montserrat.className} text-3xl font-bold md:text-4xl lg:text-5xl mb-4`}>
            <span className="bg-gradient-to-r from-gradient-start to-gradient-end bg-clip-text text-transparent">The Problem & Solution</span>
          </h2>
          <p className="text-dark-text-muted max-w-2xl mx-auto text-lg">Most solo founders spend weeks building the wrong thing because they lack unbiased feedback at crucial early stages.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Problem Column */}
          <div className="relative bg-dark-card p-8 rounded-lg border border-glass-border shadow-lg backdrop-blur-sm overflow-hidden">
            {/* Subtle gradient highlight */}
            <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-blue-primary to-teal-accent"></div>
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-r from-blue-primary/5 to-teal-accent/5 rounded-full blur-3xl"></div>
            
            <div className="text-center mb-8">
              <h2 className={`${montserrat.className} text-3xl font-bold md:text-4xl mb-3 text-dark-text`}>The Problem</h2>
              <h3 className="text-xl font-medium text-dark-text-muted mb-4 bg-gradient-to-r from-blue-primary to-teal-accent bg-clip-text text-transparent">Building Without Direction</h3>
            </div>
            
            <div className="mx-auto">
              <p className="text-lg mb-6 text-dark-text">
                As a solo founder, you face challenges that funded startups don't:
              </p>
              
              <ul className="space-y-5 my-8">
                <li className="flex items-start gap-4">
                  <div className="bg-gradient-to-r from-blue-primary to-blue-secondary text-dark-text rounded-full p-1.5 mt-0.5">
                    <CheckCircleIcon />
                  </div>
                  <span className="text-dark-text"><strong className="text-blue-primary">No co-founders</strong> to bounce ideas off or spot your blindspots</span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="bg-gradient-to-r from-blue-primary to-blue-secondary text-dark-text rounded-full p-1.5 mt-0.5">
                    <CheckCircleIcon />
                  </div>
                  <span className="text-dark-text"><strong className="text-blue-primary">Limited budget</strong> for user research or professional feedback</span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="bg-gradient-to-r from-blue-primary to-blue-secondary text-dark-text rounded-full p-1.5 mt-0.5">
                    <CheckCircleIcon />
                  </div>
                  <span className="text-dark-text"><strong className="text-blue-primary">No investor board</strong> providing guidance and accountability</span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="bg-gradient-to-r from-blue-primary to-blue-secondary text-dark-text rounded-full p-1.5 mt-0.5">
                    <CheckCircleIcon />
                  </div>
                  <span className="text-dark-text"><strong className="text-blue-primary">Limited network</strong> of other solo founders who understand your challenges</span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="bg-gradient-to-r from-blue-primary to-blue-secondary text-dark-text rounded-full p-1.5 mt-0.5">
                    <CheckCircleIcon />
                  </div>
                  <span className="text-dark-text"><strong className="text-blue-primary">Uncertain validation</strong> if your landing page or MVP is on the right track</span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="bg-gradient-to-r from-blue-primary to-blue-secondary text-dark-text rounded-full p-1.5 mt-0.5">
                    <CheckCircleIcon />
                  </div>
                  <span className="text-dark-text"><strong className="text-blue-primary">Echo chambers</strong> of friends and family who won't give harsh truths</span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="bg-gradient-to-r from-blue-primary to-blue-secondary text-dark-text rounded-full p-1.5 mt-0.5">
                    <CheckCircleIcon />
                  </div>
                  <span className="text-dark-text"><strong className="text-blue-primary">Wasted dev time</strong> building features no one will use</span>
                </li>
              </ul>
            
              <div className="mt-8 p-0.5 rounded-lg bg-gradient-to-r from-blue-primary to-teal-accent">
                <div className="bg-dark-surface rounded-md p-5">
                  <p className="text-lg font-medium text-dark-text">
                    Most solo founders spend weeks building the <span className="text-blue-primary">wrong thing</span> because they lacked <span className="bg-gradient-to-r from-blue-primary to-teal-accent bg-clip-text text-transparent">unbiased feedback</span> at the crucial early stage.
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Solution Column */}
          <div className="relative bg-dark-card p-8 rounded-lg border border-glass-border shadow-lg backdrop-blur-sm overflow-hidden">
            {/* Subtle gradient highlight */}
            <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-teal-accent to-blue-primary"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-r from-teal-accent/5 to-blue-primary/5 rounded-full blur-3xl"></div>
            
            <div className="text-center mb-8">
              <h2 className={`${montserrat.className} text-3xl font-bold md:text-4xl mb-3 text-dark-text`}>The Solution</h2>
              <h3 className="text-xl font-medium bg-gradient-to-r from-teal-accent to-blue-primary bg-clip-text text-transparent mb-4">Pull Insights From Peers Who Get It</h3>
            </div>
            
            <div className="mx-auto">
              <p className="text-lg mb-8 text-dark-text">
                PeerPull connects you with a community of solo founders who love giving unbiased feedback and understand what you're building.
              </p>
              
              <div className="bg-glass-highlight backdrop-blur-md p-6 rounded-xl border border-glass-border shadow-xl relative overflow-hidden">
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-r from-blue-primary/10 to-teal-accent/10 rounded-full blur-2xl"></div>
                <h4 className="text-xl font-semibold mb-6 text-dark-text relative z-10">Here's how it works:</h4>
                
                <ol className="space-y-6 relative z-10">
                  <li className="flex items-start gap-4">
                    <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-blue-primary to-teal-accent text-white font-medium text-sm shadow-lg">
                      1
                    </div>
                    <div>
                      <p className="font-medium text-dark-text">Submit your landing page or startup concept as a PullRequest</p>
                    </div>
                  </li>
                  
                  <li className="flex items-start gap-4">
                    <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-blue-primary to-teal-accent text-white font-medium text-sm shadow-lg">
                      2
                    </div>
                    <div>
                      <p className="font-medium text-dark-text">Give quality feedback to two other founders</p>
                    </div>
                  </li>
                  
                  <li className="flex items-start gap-4">
                    <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-blue-primary to-teal-accent text-white font-medium text-sm shadow-lg">
                      3
                    </div>
                    <div>
                      <p className="font-medium text-dark-text">Receive one thoughtful review in return—usually within minutes</p>
                    </div>
                  </li>
                  
                  <li className="flex items-start gap-4">
                    <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-blue-primary to-teal-accent text-white font-medium text-sm shadow-lg">
                      4
                    </div>
                    <div>
                      <p className="font-medium text-dark-text">Iterate with confidence, knowing real founders have validated your direction</p>
                    </div>
                  </li>
                </ol>
              </div>
              
              <p className="text-lg font-medium mt-8 text-center">
                <span className="bg-gradient-to-r from-blue-primary to-teal-accent bg-clip-text text-transparent">It's that simple.</span> <span className="text-dark-text-muted">No marketing fluff, no generic advice—just targeted, unbiased feedback from solo founders who speak your language.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      
    </section>
  );
}
