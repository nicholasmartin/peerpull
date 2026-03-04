"use client";

import React from 'react';

export function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Submit Your Feedback Request",
      items: [
        "Add your landing page URL",
        "Specify what feedback you need most",
        "Choose from our templates to get structured insights",
      ],
    },
    {
      num: "02",
      title: "Give Feedback on Projects",
      items: [
        "Browse available projects in your expertise areas",
        "Provide thoughtful feedback using our guided frameworks",
        "Each feedback session takes about 1-2 minutes",
      ],
    },
    {
      num: "03",
      title: "Earn PeerPoints",
      items: [
        "During beta, every feedback you give earns you one PeerPoint",
        "Each PeerPoint gets you one feedback on your project",
        "All feedback is vetted to ensure quality",
      ],
    },
  ];

  return (
    <section id="how-it-works" className="py-20 md:py-32 bg-dark-bg relative">
      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-blue-primary text-sm font-semibold tracking-widest uppercase mb-4">How It Works</p>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl text-dark-text">
              Get Quality Feedback Super Early
            </h2>
            <p className="text-dark-text-muted text-lg mt-4">From solo founders who get it.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            {steps.map((step) => (
              <div key={step.num} className="relative bg-dark-card rounded-lg border border-dark-border p-6 md:p-8 hover:border-dark-text-muted/20 transition-colors duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-blue-primary font-semibold text-sm tracking-wider">{step.num}</span>
                  <div className="h-px flex-1 bg-dark-border"></div>
                </div>

                <h4 className="text-lg font-semibold text-dark-text mb-5">{step.title}</h4>

                <ul className="space-y-3">
                  {step.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <span className="mt-2 w-1 h-1 rounded-full bg-blue-primary/60 flex-shrink-0"></span>
                      <p className="text-dark-text-muted text-sm">{item}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
