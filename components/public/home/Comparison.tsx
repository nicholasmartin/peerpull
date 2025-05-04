"use client";

import React from 'react';

export function Comparison() {
  return (
    <section className="py-16 md:py-24 bg-papaya-whip text-prussian-blue">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-2 text-barn-red">How We're Different</h2>
            <h3 className="text-2xl font-semibold text-prussian-blue mb-6">Not Another Shallow Feedback Tool</h3>
          </div>
          
          <div className="overflow-x-auto rounded-xl shadow-lg">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-6 text-left bg-barn-red text-papaya-whip font-bold rounded-tl-lg text-lg">Traditional Feedback</th>
                  <th className="p-6 text-left bg-prussian-blue text-papaya-whip font-bold rounded-tr-lg text-lg">PeerPull</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-5 border-b border-r border-fire-brick/20 bg-white">Generic comments from non-founders</td>
                  <td className="p-5 border-b border-fire-brick/20 bg-air-blue/10 font-medium">Technical feedback from builders who understand your challenges</td>
                </tr>
                <tr>
                  <td className="p-5 border-b border-r border-fire-brick/20 bg-white">Shallow "looks good!" comments</td>
                  <td className="p-5 border-b border-fire-brick/20 bg-air-blue/10 font-medium">Structured, actionable PeerInsights</td>
                </tr>
                <tr>
                  <td className="p-5 border-b border-r border-fire-brick/20 bg-white">Days or weeks of waiting</td>
                  <td className="p-5 border-b border-fire-brick/20 bg-air-blue/10 font-medium">Feedback within hours</td>
                </tr>
                <tr>
                  <td className="p-5 border-b border-r border-fire-brick/20 bg-white">Expensive consulting fees</td>
                  <td className="p-5 border-b border-fire-brick/20 bg-air-blue/10 font-medium">Free exchange of value</td>
                </tr>
                <tr>
                  <td className="p-5 border-r border-fire-brick/20 bg-white rounded-bl-lg">One-way feedback</td>
                  <td className="p-5 bg-air-blue/10 font-medium rounded-br-lg">Community of ongoing support</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
