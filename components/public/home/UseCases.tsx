"use client";

import React from 'react';

export function UseCases() {
  return (
    <section className="py-16 md:py-24 bg-prussian-blue text-papaya-whip">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-2 text-papaya-whip">Use Cases</h2>
            <h3 className="text-2xl font-semibold text-air-blue mb-6">Perfect For Technical Founders Who Are:</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Validating a new idea",
                description: "Get feedback before investing development time",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 16v-4"></path>
                    <path d="M12 8h.01"></path>
                  </svg>
                )
              },
              {
                title: "Testing landing page messaging",
                description: "Ensure your copy resonates with your audience",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                )
              },
              {
                title: "Evaluating pricing strategies",
                description: "Get objective eyes on your monetization approach",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="1" x2="12" y2="23"></line>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
                )
              },
              {
                title: "Identifying UX issues",
                description: "Spot problems in early prototypes",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                    <line x1="8" y1="21" x2="16" y2="21"></line>
                    <line x1="12" y1="17" x2="12" y2="21"></line>
                  </svg>
                )
              },
              {
                title: "Refining technical architecture",
                description: "Get expert eyes on your technical decisions",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                    <polyline points="2 17 12 22 22 17"></polyline>
                    <polyline points="2 12 12 17 22 12"></polyline>
                  </svg>
                )
              },
              {
                title: "Finding blindspots",
                description: "Identify gaps in your core value proposition",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )
              }
            ].map((item, index) => (
              <div key={index} className="bg-papaya-whip/10 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 border-2 border-fire-brick flex flex-col">
                <div className="text-fire-brick mb-4">
                  {item.icon}
                </div>
                <h4 className="text-lg font-semibold mb-2 text-papaya-whip">{item.title}</h4>
                <p className="text-papaya-whip/80">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
