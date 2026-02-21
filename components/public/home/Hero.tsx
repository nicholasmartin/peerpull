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
    <section id="hero" className="relative py-20 md:min-h-screen md:flex md:items-center bg-dark-bg overflow-hidden">
      {/* Abstract geometric shapes */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute -top-[300px] -left-[300px] w-[600px] h-[600px] rounded-full bg-gradient-to-r from-blue-primary to-teal-accent blur-3xl opacity-20"></div>
        <div className="absolute top-[10%] right-[5%] w-[300px] h-[300px] rounded-full bg-gradient-to-r from-blue-secondary to-blue-primary blur-3xl opacity-20"></div>
        <div className="absolute bottom-[5%] left-[10%] w-[400px] h-[400px] rounded-full bg-gradient-to-r from-teal-accent to-blue-secondary blur-3xl opacity-30"></div>
      </div>
      
      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <div className="flex flex-col items-center gap-4 md:gap-8 text-center max-w-4xl mx-auto">
          <div className="space-y-5 md:space-y-6">
            <div className="inline-flex items-center px-6 py-3 rounded-md bg-glass-highlight backdrop-blur-sm border border-glass-border mb-4">
              <span className="bg-gradient-to-r from-blue-primary to-teal-accent bg-clip-text text-transparent font-semibold text-lg">Closed Beta</span>
              <div className="w-2 h-2 rounded-full bg-emerald-400 mx-3 animate-pulse"></div>
              <span className="text-dark-text-muted text-lg">Invite Only — Limited Spots</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-glass-highlight border border-glass-border text-sm text-dark-text">1:1 Exchange Ratio</span>
              <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-glass-highlight border border-glass-border text-sm text-dark-text">3 Free Credits at Signup</span>
              <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-glass-highlight border border-glass-border text-sm text-dark-text">Earn 5 Credits Per Referral</span>
            </div>
            
            <h1 className={`${montserrat.className} text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl`}>
              <span className="bg-gradient-to-r from-gradient-start via-blue-secondary to-gradient-end bg-clip-text text-transparent">Valuable Feedback</span>
              <span className="text-dark-text"> For Builders in Minutes</span>
            </h1>
            
            <p className="text-lg md:text-xl lg:text-2xl text-dark-text-muted max-w-3xl mx-auto">
              Join an exclusive community of solo founders giving each other real, unbiased feedback on landing pages and MVPs — completely free during beta.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 mt-8 sm:mt-10 w-full sm:w-auto">
            <Link href="/signup" className="w-full sm:w-auto">
              <Button 
                size="md" 
                className="text-base font-medium px-6 py-3.5 md:px-8 md:py-4 bg-gradient-to-r from-blue-primary to-blue-secondary hover:from-blue-primary/90 hover:to-blue-secondary/90 transition-all text-white shadow-lg shadow-blue-primary/20 w-full sm:w-auto"
              >
                Join the Beta
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
          
          
        </div>
      </div>
    </section>
  );
}
