"use client";

import Link from 'next/link';
import Button from "@/components/ui/button/Button";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
});

export function Hero() {
  return (
    <section id="hero" className="relative py-20 md:py-32 bg-dark-bg overflow-hidden">
      {/* Abstract geometric shapes */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute -top-[300px] -left-[300px] w-[600px] h-[600px] rounded-full bg-gradient-to-r from-blue-primary to-teal-accent blur-3xl opacity-20"></div>
        <div className="absolute top-[10%] right-[5%] w-[300px] h-[300px] rounded-full bg-gradient-to-r from-blue-secondary to-blue-primary blur-3xl opacity-20"></div>
        <div className="absolute bottom-[5%] left-[10%] w-[400px] h-[400px] rounded-full bg-gradient-to-r from-teal-accent to-blue-secondary blur-3xl opacity-30"></div>
      </div>
      
      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <div className="flex flex-col items-center gap-4 md:gap-8 text-center max-w-4xl mx-auto">
          <div className="space-y-5 md:space-y-6">
            <div className="inline-flex items-center px-4 py-2 rounded-md bg-glass-highlight backdrop-blur-sm border border-glass-border mb-2">
              <span className="bg-gradient-to-r from-blue-primary to-teal-accent bg-clip-text text-transparent font-medium">2:1 Exchange Ratio</span>
              <div className="w-1.5 h-1.5 rounded-full bg-dark-text-muted mx-2"></div>
              <span className="text-dark-text-muted">Give 2 reviews, get 1 back</span>
            </div>
            
            <h1 className={`${montserrat.className} text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl`}>
              <span className="bg-gradient-to-r from-gradient-start via-blue-secondary to-gradient-end bg-clip-text text-transparent">Valuable Feedback</span>
              <span className="text-dark-text"> on Your Startup Idea</span>
            </h1>
            
            <p className="text-lg md:text-xl lg:text-2xl text-dark-text-muted max-w-3xl mx-auto">
              Submit your landing page or MVP for targeted feedback from other technical founders who understand your challenges.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 mt-8 sm:mt-10 w-full sm:w-auto">
            <Link href="/signup" className="w-full sm:w-auto">
              <Button 
                size="md" 
                className="text-base font-medium px-6 py-3.5 md:px-8 md:py-4 bg-gradient-to-r from-blue-primary to-blue-secondary hover:from-blue-primary/90 hover:to-blue-secondary/90 transition-all text-white shadow-lg shadow-blue-primary/20 w-full sm:w-auto"
              >
                Get Early Access
              </Button>
            </Link>
            <Button 
              size="md" 
              variant="outline" 
              className="text-base font-medium px-6 py-3.5 md:px-8 md:py-4 border-glass-border text-dark-text hover:bg-glass-highlight hover:border-glass-border/80 backdrop-blur-sm transition-all w-full sm:w-auto mt-3 sm:mt-0"
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
            >
              See How It Works
            </Button>
          </div>
          
          <div className="mt-10 md:mt-14 max-w-2xl mx-auto">
            <div className="relative">
              {/* Glassmorphism card */}
              <div className="bg-dark-card/30 backdrop-blur-md p-6 md:p-8 rounded-lg border border-glass-border shadow-xl relative overflow-hidden">
                {/* Subtle gradient highlight */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-r from-blue-primary/10 to-teal-accent/10 rounded-full blur-2xl"></div>
                
                <div className="relative z-10">
                  <svg className="w-8 h-8 text-blue-primary/30 mb-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-10zm-10 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                  <p className="text-base md:text-lg font-light tracking-wide text-dark-text leading-relaxed">
                    I avoided months of wasted development after just <span className="bg-gradient-to-r from-blue-primary to-teal-accent bg-clip-text text-transparent font-medium">three pieces of feedback</span> from fellow founders.
                  </p>
                  <div className="flex items-center mt-4 md:mt-6">
                    <div className="flex-shrink-0 mr-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-primary to-blue-secondary flex items-center justify-center text-white font-medium">
                        AK
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-dark-text">Alex K.</p>
                      <p className="text-sm text-dark-text-muted">SaaSFounder</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
