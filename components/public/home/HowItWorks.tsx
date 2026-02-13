"use client";

import React from 'react';
import Image from 'next/image';
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
});

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 md:py-32 bg-dark-surface relative">
      {/* Abstract geometric shapes for background */}
      <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
        <div className="absolute top-[10%] right-[5%] w-[350px] h-[350px] rounded-full bg-gradient-to-r from-blue-primary to-blue-secondary blur-3xl opacity-20"></div>
        <div className="absolute bottom-[5%] left-[10%] w-[250px] h-[250px] rounded-full bg-gradient-to-r from-teal-accent to-blue-secondary blur-3xl opacity-20"></div>
      </div>
      
      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`${montserrat.className} text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl mb-4`}>
              <span className="bg-gradient-to-r from-gradient-start to-gradient-end bg-clip-text text-transparent">How It Works</span>
            </h2>
            <h3 className="text-xl font-medium text-dark-text-muted mb-6">Get Quality Feedback Super Early & Super Quickly from Solo Founders Who Get It</h3>
          </div>
          
          {/* Placeholder for diagram with dark mode styling */}
          <div className="relative w-full h-64 md:h-96 mb-16 bg-glass-highlight backdrop-blur-sm rounded-xl flex items-center justify-center border border-glass-border shadow-xl overflow-hidden">
            {/* Gradient decoration */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-r from-blue-primary/10 to-teal-accent/10 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-gradient-to-r from-teal-accent/10 to-blue-primary/10 rounded-full blur-2xl"></div>
            
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <div className="bg-dark-card/60 backdrop-blur-md p-8 rounded-lg border border-glass-border w-full max-w-2xl">
                <div className="grid grid-cols-3 gap-6 relative">
                  {/* Flow diagram with gradient arrows */}
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-primary to-blue-secondary flex items-center justify-center text-dark-text text-lg font-medium">1</div>
                    <p className="text-sm text-dark-text">Submit your project</p>
                  </div>
                  
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-primary to-blue-secondary flex items-center justify-center text-dark-text text-lg font-medium">2</div>
                    <p className="text-sm text-dark-text">Review two others</p>
                  </div>
                  
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-primary to-blue-secondary flex items-center justify-center text-dark-text text-lg font-medium">3</div>
                    <p className="text-sm text-dark-text">Get one review back</p>
                  </div>
                  
                  {/* Connecting arrows */}
                  <div className="absolute top-1/2 left-[27%] w-[12%] h-0.5 bg-gradient-to-r from-blue-primary to-teal-accent transform -translate-y-1/2"></div>
                  <div className="absolute top-1/2 left-[60%] w-[12%] h-0.5 bg-gradient-to-r from-blue-primary to-teal-accent transform -translate-y-1/2"></div>
                </div>
                
                <p className="text-dark-text-muted text-center mt-6 text-sm">The 2:1 exchange ensures unbiased, quality feedback for everyone</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-14">
            <div className="relative bg-dark-card rounded-lg border border-glass-border p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm overflow-hidden group">
              {/* Gradient accent line at top */}
              <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-blue-primary to-teal-accent"></div>
              
              {/* Background gradient */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-r from-blue-primary/5 to-teal-accent/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-md bg-gradient-to-r from-blue-primary to-blue-secondary text-dark-text font-medium text-lg shadow-lg">
                  1
                </div>
                <h4 className="text-xl font-semibold bg-gradient-to-r from-blue-primary to-blue-secondary bg-clip-text text-transparent">Submit Your PullRequest</h4>
              </div>
              
              <div className="space-y-4 pl-16">
                <p className="text-dark-text">Add your landing page URL</p>
                <p className="text-dark-text">Specify what feedback you need most</p>
                <p className="text-dark-text">Choose from our templates to get structured insights</p>
              </div>
            </div>
            
            <div className="relative bg-dark-card rounded-lg border border-glass-border p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm overflow-hidden group">
              {/* Gradient accent line at top */}
              <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-teal-accent to-blue-primary"></div>
              
              {/* Background gradient */}
              <div className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-r from-teal-accent/5 to-blue-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-md bg-gradient-to-r from-teal-accent to-blue-primary text-dark-text font-medium text-lg shadow-lg">
                  2
                </div>
                <h4 className="text-xl font-semibold bg-gradient-to-r from-teal-accent to-blue-primary bg-clip-text text-transparent">Review Other Projects</h4>
              </div>
              
              <div className="space-y-4 pl-16">
                <p className="text-dark-text">Browse available projects in your expertise areas</p>
                <p className="text-dark-text">Provide thoughtful reviews using our guided frameworks</p>
                <p className="text-dark-text">Each review takes about 1-2 minutes</p>
              </div>
            </div>
            
            <div className="relative bg-dark-card rounded-lg border border-glass-border p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm overflow-hidden group">
              {/* Gradient accent line at top */}
              <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-blue-primary to-teal-accent"></div>
              
              {/* Background gradient */}
              <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-gradient-to-r from-blue-primary/5 to-teal-accent/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-md bg-gradient-to-r from-blue-primary to-blue-secondary text-dark-text font-medium text-lg shadow-lg">
                  3
                </div>
                <h4 className="text-xl font-semibold bg-gradient-to-r from-blue-primary to-blue-secondary bg-clip-text text-transparent">Earn PeerPoints</h4>
              </div>
              
              <div className="space-y-4 pl-16">
                <p className="text-dark-text">For every two reviews you give, you earn one PeerPoint</p>
                <p className="text-dark-text">Each PeerPoint gets you one review on your project</p>
                <p className="text-dark-text">All feedback is vetted to ensure quality</p>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
}
