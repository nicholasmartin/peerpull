"use client";

import React from 'react';
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
});

export function Comparison() {
  return (
    <section className="py-20 md:py-32 bg-dark-surface relative">
      {/* Abstract geometric shapes for background */}
      <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
        <div className="absolute top-[20%] left-[15%] w-[300px] h-[300px] rounded-full bg-gradient-to-r from-blue-primary to-teal-accent blur-3xl opacity-20"></div>
        <div className="absolute bottom-[10%] right-[10%] w-[250px] h-[250px] rounded-full bg-gradient-to-r from-teal-accent to-blue-primary blur-3xl opacity-15"></div>
      </div>
      
      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`${montserrat.className} text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl mb-4`}>
              <span className="bg-gradient-to-r from-gradient-start to-gradient-end bg-clip-text text-transparent">How We're Different</span>
            </h2>
            <h3 className="text-xl font-medium text-dark-text-muted mb-6">Not Another Shallow Feedback Tool</h3>
          </div>
          
          <div className="overflow-x-auto rounded-lg shadow-xl backdrop-blur-sm bg-glass-highlight border border-glass-border">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-6 text-left bg-gradient-to-r from-dark-card/80 to-dark-card font-bold rounded-tl-lg text-lg text-dark-text-muted backdrop-blur-sm border-b border-glass-border">Traditional Feedback</th>
                  <th className="p-6 text-left bg-gradient-to-r from-blue-primary/10 to-teal-accent/10 font-bold rounded-tr-lg text-lg bg-clip-text text-transparent backdrop-blur-sm border-b border-glass-border">
                    <span className="bg-gradient-to-r from-blue-primary to-teal-accent bg-clip-text text-transparent">PeerPull</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-glass-border">
                <tr>
                  <td className="p-5 border-r border-glass-border bg-dark-card/60 text-dark-text-muted">Generic comments from non-founders</td>
                  <td className="p-5 bg-dark-card/40 font-medium text-dark-text backdrop-blur-sm">
                    <span className="bg-gradient-to-r from-blue-primary/90 to-teal-accent bg-clip-text text-transparent font-semibold">Technical</span> feedback from builders who understand your challenges
                  </td>
                </tr>
                <tr>
                  <td className="p-5 border-r border-glass-border bg-dark-card/60 text-dark-text-muted">Shallow "looks good!" comments</td>
                  <td className="p-5 bg-dark-card/40 font-medium text-dark-text backdrop-blur-sm">
                    <span className="bg-gradient-to-r from-blue-primary/90 to-teal-accent bg-clip-text text-transparent font-semibold">Structured</span>, actionable PeerInsights
                  </td>
                </tr>
                <tr>
                  <td className="p-5 border-r border-glass-border bg-dark-card/60 text-dark-text-muted">Days or weeks of waiting</td>
                  <td className="p-5 bg-dark-card/40 font-medium text-dark-text backdrop-blur-sm">Feedback within 
                    <span className="bg-gradient-to-r from-blue-primary/90 to-teal-accent bg-clip-text text-transparent font-semibold"> hours</span>
                  </td>
                </tr>
                <tr>
                  <td className="p-5 border-r border-glass-border bg-dark-card/60 text-dark-text-muted">Expensive consulting fees</td>
                  <td className="p-5 bg-dark-card/40 font-medium text-dark-text backdrop-blur-sm">
                    <span className="bg-gradient-to-r from-blue-primary/90 to-teal-accent bg-clip-text text-transparent font-semibold">Free</span> exchange of value
                  </td>
                </tr>
                <tr>
                  <td className="p-5 border-r border-glass-border bg-dark-card/60 text-dark-text-muted rounded-bl-lg">One-way feedback</td>
                  <td className="p-5 bg-dark-card/40 font-medium text-dark-text backdrop-blur-sm rounded-br-lg">
                    <span className="bg-gradient-to-r from-blue-primary/90 to-teal-accent bg-clip-text text-transparent font-semibold">Community</span> of ongoing support
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
