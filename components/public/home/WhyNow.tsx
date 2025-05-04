"use client";

import React from 'react';

export function WhyNow() {
  return (
    <section className="py-16 md:py-24 bg-papaya-whip text-prussian-blue">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-2 text-barn-red">Why Now?</h2>
            <h3 className="text-2xl font-semibold text-prussian-blue mb-6">The Timing Has Never Been Better</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "AI tools are democratizing creation",
                description: "But not validation",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a10 10 0 1 0 10 10H12V2z"></path>
                    <path d="M12 2a10 10 0 0 1 10 10h-10V2z"></path>
                    <path d="M12 12l9.44 9.44"></path>
                    <path d="M12 12l-9.44 9.44"></path>
                  </svg>
                )
              },
              {
                title: "Remote work has isolated",
                description: "Many solo founders",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                )
              },
              {
                title: "Technical talent is expensive",
                description: "Making mistakes costlier than ever",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="1" x2="12" y2="23"></line>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
                )
              },
              {
                title: "Early-stage funding is tighter",
                description: "Requiring stronger validation before pitching",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                  </svg>
                )
              },
              {
                title: "Market windows move faster",
                description: "Making quick feedback loops essential",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                )
              }
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 border-2 border-air-blue flex flex-col">
                <div className="text-air-blue mb-4">
                  {item.icon}
                </div>
                <h4 className="text-lg font-semibold mb-2 text-prussian-blue">{item.title}</h4>
                <p className="text-prussian-blue/80">{item.description}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12 bg-fire-brick/10 p-6 rounded-xl border-2 border-fire-brick shadow-md">
            <p className="text-xl font-semibold text-prussian-blue">Don't wait until you've built the wrong product. Pull in validation now.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
