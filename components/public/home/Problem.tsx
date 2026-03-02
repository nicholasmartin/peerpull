"use client";

import React from 'react';

const XCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m15 9-6 6"></path>
    <path d="m9 9 6 6"></path>
  </svg>
);

const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5"></path>
  </svg>
);

export function Problem() {
  return (
    <section id="problem-solution" className="py-20 md:py-32 bg-dark-surface relative">
      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <div className="text-center mb-14">
          <p className="text-blue-primary text-sm font-semibold tracking-widest uppercase mb-4">Why PeerPull</p>
          <h2 className="text-3xl font-bold md:text-4xl lg:text-5xl text-dark-text">
            Good feedback is hard to get when you need it most
          </h2>
          <p className="text-dark-text-muted max-w-2xl mx-auto text-lg mt-4">The early days are when feedback matters most — and when it's hardest to find.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Problem Column */}
          <div className="relative bg-dark-card p-8 rounded-lg border border-dark-border overflow-hidden flex flex-col">
            <div className="absolute top-0 left-0 h-px w-full bg-gradient-to-r from-red-500/60 via-red-500/20 to-transparent"></div>

            <div className="mb-8">
              <h3 className="text-2xl font-bold text-dark-text mb-2">The Reality</h3>
              <p className="text-red-400/80 font-medium">Every Builder Faces This</p>
            </div>

            <ul className="space-y-4 flex-1">
              {[
                { bold: "Friends and family sugarcoat it", rest: "— they don't want to hurt your feelings, so you get \"looks great!\" instead of what you need to hear" },
                { bold: "Professional feedback is expensive", rest: "— UX audits, consultants, and agencies are built for funded teams, not bootstrapped builders" },
                { bold: "Online communities are hit-or-miss", rest: "— you post in a forum and get silence, generic advice, or feedback from people who've never shipped anything" },
                { bold: "You're too close to your own product", rest: "— after weeks of building, you can't see what a fresh pair of eyes would catch in minutes" },
                { bold: "The window closes fast", rest: "— every day without honest feedback is a day you might be heading in the wrong direction" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="text-red-400/70 mt-0.5 flex-shrink-0">
                    <XCircleIcon />
                  </div>
                  <span className="text-dark-text-muted"><strong className="text-dark-text">{item.bold}</strong> {item.rest}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 p-5 rounded-lg border border-dark-border bg-dark-surface">
              <p className="text-dark-text-muted text-center">
                You don't need more opinions. You need <span className="text-blue-primary font-medium">honest feedback from people who get it.</span>
              </p>
            </div>
          </div>

          {/* Solution Column */}
          <div className="relative bg-dark-card p-8 rounded-lg border border-dark-border overflow-hidden flex flex-col">
            <div className="absolute top-0 left-0 h-px w-full bg-gradient-to-r from-blue-primary/60 via-blue-primary/20 to-transparent"></div>

            <div className="mb-8">
              <h3 className="text-2xl font-bold text-dark-text mb-2">PeerPull Fixes This</h3>
              <p className="text-blue-primary font-medium">Built by Builders, for Builders</p>
            </div>

            <ul className="space-y-4 flex-1">
              {[
                { bold: "Feedback from real builders", rest: "— every reviewer on PeerPull is a founder or maker who understands what you're going through" },
                { bold: "Fast turnaround", rest: "— submit your product and get a detailed video review back, typically within minutes" },
                { bold: "Guaranteed quality", rest: "— reviewers earn credits by giving thoughtful feedback, so low-effort reviews don't survive" },
                { bold: "Zero cost", rest: "— give a review, get a review. No subscriptions, no invoices, no catch" },
                { bold: "Built for the early days", rest: "— when you need a second opinion most, not after you've already launched and it's too late to pivot" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="text-blue-primary mt-0.5 flex-shrink-0">
                    <CheckCircleIcon />
                  </div>
                  <span className="text-dark-text-muted"><strong className="text-dark-text">{item.bold}</strong> {item.rest}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 p-5 rounded-lg border border-dark-border bg-dark-surface">
              <p className="text-dark-text-muted text-center">
                Built by builders, for builders. <span className="text-blue-primary font-medium">Finally, feedback you can actually trust.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
