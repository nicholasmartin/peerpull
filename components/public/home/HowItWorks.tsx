"use client";

import React from 'react';

const ChevronRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 18 6-6-6-6" />
  </svg>
);

const ChevronDown = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 md:py-32 bg-dark-bg relative">
      {/* Abstract geometric shapes for background */}
      <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
        <div className="absolute top-[10%] right-[5%] w-[350px] h-[350px] rounded-full bg-gradient-to-r from-blue-primary to-blue-secondary blur-3xl opacity-20"></div>
        <div className="absolute bottom-[5%] left-[10%] w-[250px] h-[250px] rounded-full bg-gradient-to-r from-teal-accent to-blue-secondary blur-3xl opacity-20"></div>
      </div>

      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl mb-4">
              <span className="bg-gradient-to-r from-gradient-start to-gradient-end bg-clip-text text-transparent">How It Works</span>
            </h2>
            <h3 className="text-xl font-medium text-dark-text-muted mb-6">Get Quality Feedback Super Early & Super Quickly from Solo Founders Who Get It</h3>
          </div>

       

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-14">
            <div className="relative bg-dark-card rounded-lg border border-glass-border p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm overflow-hidden group">
              {/* Gradient accent line at top */}
              <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-blue-primary to-teal-accent"></div>

              {/* Background gradient */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-r from-blue-primary/5 to-teal-accent/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-blue-primary to-blue-secondary text-dark-text font-medium text-lg shadow-lg">
                  1
                </div>
                <h4 className="text-xl font-semibold bg-gradient-to-r from-blue-primary to-blue-secondary bg-clip-text text-transparent">Submit Your PullRequest</h4>
              </div>

              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-blue-primary flex-shrink-0"></span>
                  <p className="text-dark-text">Add your landing page URL</p>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-blue-primary flex-shrink-0"></span>
                  <p className="text-dark-text">Specify what feedback you need most</p>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-blue-primary flex-shrink-0"></span>
                  <p className="text-dark-text">Choose from our templates to get structured insights</p>
                </li>
              </ul>
            </div>

            <div className="relative bg-dark-card rounded-lg border border-glass-border p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm overflow-hidden group">
              {/* Gradient accent line at top */}
              <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-teal-accent to-blue-primary"></div>

              {/* Background gradient */}
              <div className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-r from-teal-accent/5 to-blue-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-teal-accent to-blue-primary text-dark-text font-medium text-lg shadow-lg">
                  2
                </div>
                <h4 className="text-xl font-semibold bg-gradient-to-r from-teal-accent to-blue-primary bg-clip-text text-transparent">Review Other Projects</h4>
              </div>

              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-teal-accent flex-shrink-0"></span>
                  <p className="text-dark-text">Browse available projects in your expertise areas</p>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-teal-accent flex-shrink-0"></span>
                  <p className="text-dark-text">Provide thoughtful reviews using our guided frameworks</p>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-teal-accent flex-shrink-0"></span>
                  <p className="text-dark-text">Each review takes about 1-2 minutes</p>
                </li>
              </ul>
            </div>

            <div className="relative bg-dark-card rounded-lg border border-glass-border p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm overflow-hidden group">
              {/* Gradient accent line at top */}
              <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-blue-primary to-teal-accent"></div>

              {/* Background gradient */}
              <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-gradient-to-r from-blue-primary/5 to-teal-accent/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-blue-primary to-blue-secondary text-dark-text font-medium text-lg shadow-lg">
                  3
                </div>
                <h4 className="text-xl font-semibold bg-gradient-to-r from-blue-primary to-blue-secondary bg-clip-text text-transparent">Earn PeerPoints</h4>
              </div>

              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-blue-primary flex-shrink-0"></span>
                  <p className="text-dark-text">During beta, every review you give earns you one PeerPoint</p>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-blue-primary flex-shrink-0"></span>
                  <p className="text-dark-text">Each PeerPoint gets you one review on your project</p>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-blue-primary flex-shrink-0"></span>
                  <p className="text-dark-text">All feedback is vetted to ensure quality</p>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
