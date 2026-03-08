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
            You need to see how people actually use your product
          </h2>
          <p className="text-dark-text-muted max-w-2xl mx-auto text-lg mt-4">Text feedback misses the hesitations, confusion, and "aha" moments that only a video walkthrough can capture.</p>
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
                { bold: "Text feedback hides the real story", rest: "— someone writes \"the signup flow is confusing\" but you can't see where they hesitated, what they misread, or where they almost gave up" },
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
                You don't need more opinions. You need to <span className="text-blue-primary font-medium">watch someone actually use your product.</span>
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
                { bold: "Video walkthroughs, not text comments", rest: "— watch a real founder navigate your product, thinking out loud as they go. See exactly where they get stuck, confused, or excited" },
                { bold: "Think-aloud narration reveals the invisible", rest: "— the pause before clicking, the squint at confusing copy, the \"oh wait, what does this do?\" moments that text feedback can never capture" },
                { bold: "From builders who get it", rest: "— every reviewer is a founder or maker who has shipped products and understands the challenges you face" },
                { bold: "Credit-based exchange, zero cost", rest: "— record a video review for someone else, earn the right to receive one back. No subscriptions, no invoices" },
                { bold: "Fast turnaround", rest: "— submit your product and get a recorded walkthrough back, typically within minutes" },
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
                One video walkthrough is worth a thousand text comments. <span className="text-blue-primary font-medium">See your product through fresh eyes.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
