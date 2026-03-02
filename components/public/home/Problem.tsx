"use client";

import React from 'react';

const XCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m15 9-6 6"></path>
    <path d="m9 9 6 6"></path>
  </svg>
);

export function Problem() {
  return (
    <section id="problem-solution" className="py-20 md:py-32 bg-dark-surface relative">
      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <div className="text-center mb-14">
          <p className="text-blue-primary text-sm font-semibold tracking-widest uppercase mb-4">Problem & Solution</p>
          <h2 className="text-3xl font-bold md:text-4xl lg:text-5xl text-dark-text">
            Most solo founders build the wrong thing
          </h2>
          <p className="text-dark-text-muted max-w-2xl mx-auto text-lg mt-4">Because they lack unbiased feedback at crucial early stages.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Problem Column */}
          <div className="relative bg-dark-card p-8 rounded-lg border border-dark-border overflow-hidden">
            <div className="absolute top-0 left-0 h-px w-full bg-gradient-to-r from-red-500/60 via-red-500/20 to-transparent"></div>

            <div className="mb-8">
              <h3 className="text-2xl font-bold text-dark-text mb-2">The Problem</h3>
              <p className="text-red-400/80 font-medium">Building Without Direction</p>
            </div>

            <p className="text-dark-text-muted mb-6">
              As a solo founder, you face challenges that funded startups don't:
            </p>

            <ul className="space-y-4">
              {[
                { bold: "No co-founders", rest: "to bounce ideas off or spot your blindspots" },
                { bold: "Limited budget", rest: "for user research or professional feedback" },
                { bold: "No investor board", rest: "providing guidance and accountability" },
                { bold: "Limited network", rest: "of other solo founders who understand your challenges" },
                { bold: "Uncertain validation", rest: "if your landing page or MVP is on the right track" },
                { bold: "Echo chambers", rest: "of friends and family who won't give harsh truths" },
                { bold: "Wasted dev time", rest: "building features no one will use" },
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
              <p className="text-dark-text-muted">
                Most solo founders spend weeks building the <span className="text-dark-text font-medium">wrong thing</span> because they lacked <span className="text-blue-primary font-medium">unbiased feedback</span> at the crucial early stage.
              </p>
            </div>
          </div>

          {/* Solution Column */}
          <div className="relative bg-dark-card p-8 rounded-lg border border-dark-border overflow-hidden">
            <div className="absolute top-0 left-0 h-px w-full bg-gradient-to-r from-blue-primary/60 via-blue-primary/20 to-transparent"></div>

            <div className="mb-8">
              <h3 className="text-2xl font-bold text-dark-text mb-2">The Solution</h3>
              <p className="text-blue-primary font-medium">Pull Insights From Peers Who Get It</p>
            </div>

            <p className="text-dark-text-muted mb-8">
              PeerPull connects you with a community of solo founders who love giving unbiased feedback and understand what you're building.
            </p>

            <div className="bg-dark-surface border border-dark-border p-6 rounded-lg">
              <h4 className="text-lg font-semibold mb-6 text-dark-text">Here's how it works:</h4>

              <ol className="space-y-5">
                {[
                  "Submit your landing page or startup concept as a PullRequest",
                  "Give quality feedback to one other founder",
                  "Receive one thoughtful review in return — usually within minutes",
                  "Iterate with confidence, knowing real founders have validated your direction",
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <span className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full border border-blue-primary/40 text-blue-primary font-medium text-sm">
                      {i + 1}
                    </span>
                    <p className="text-dark-text-muted mt-0.5">{step}</p>
                  </li>
                ))}
              </ol>
            </div>

            <p className="text-dark-text-muted mt-8 text-center">
              <span className="text-blue-primary font-medium">It's that simple.</span> No marketing fluff, no generic advice — just targeted, unbiased feedback from solo founders who speak your language.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
