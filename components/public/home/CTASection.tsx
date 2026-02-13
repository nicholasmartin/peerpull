"use client";

import Button from "@/components/ui/button/Button";
import { Montserrat } from "next/font/google";
import Link from "next/link";

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
});

export function CTASection() {
  return (
    <section className="py-20 md:py-32 bg-dark-bg relative overflow-hidden">
      {/* Abstract geometric shapes for background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-[5%] -left-[10%] w-[600px] h-[600px] rounded-full bg-gradient-to-r from-blue-primary/20 to-teal-accent/20 blur-3xl opacity-20"></div>
        <div className="absolute -bottom-[10%] -right-[5%] w-[500px] h-[500px] rounded-full bg-gradient-to-r from-teal-accent/20 to-blue-primary/20 blur-3xl opacity-15"></div>
      </div>
      
      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 items-center">
            <div className="relative bg-dark-card/60 backdrop-blur-md p-8 md:p-12 rounded-lg border border-glass-border shadow-xl">
              {/* Gradient border effect */}
              <div className="absolute inset-0 rounded-lg p-[1px] overflow-hidden pointer-events-none">
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-primary/30 to-teal-accent/30 blur-sm"></div>
              </div>
              
              <h2 className={`${montserrat.className} text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl mb-8 text-dark-text relative z-10`}>
                Ready to Get the <span className="bg-gradient-to-r from-blue-primary to-teal-accent bg-clip-text text-transparent">Startup Validation</span> You Need?
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-r from-blue-primary/20 to-teal-accent/20 backdrop-blur-sm flex items-center justify-center mt-1 border border-glass-border shadow-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-blue-primary"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-dark-text">Avoid Building the Wrong Thing</h3>
                    <p className="text-dark-text-muted mt-1">
                      Get startup validation before investing months of development time.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-r from-teal-accent/20 to-blue-primary/20 backdrop-blur-sm flex items-center justify-center mt-1 border border-glass-border shadow-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-teal-accent"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-dark-text">Connect with Fellow Solo Founders</h3>
                    <p className="text-dark-text-muted mt-1">
                      Tap into a community of solo founders who understand your challenges and love giving unbiased feedback.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-r from-blue-primary/20 to-teal-accent/20 backdrop-blur-sm flex items-center justify-center mt-1 border border-glass-border shadow-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-blue-primary"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-dark-text">Get Quality Feedback Super Fast</h3>
                    <p className="text-dark-text-muted mt-1">
                      Receive unbiased, quality insights on your startup idea within hours, not weeks—it's hard to find this elsewhere as a solo founder.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-10">
                <a 
                  href="/signup"
                  style={{
                    display: 'inline-block',
                    padding: '16px 32px',
                    background: 'linear-gradient(to right, #4F46E5, #06B6D4)',
                    color: 'white',
                    fontWeight: 'bold',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    boxShadow: '0 4px 14px rgba(79, 70, 229, 0.3)',
                    cursor: 'pointer'
                  }}
                >
                  Secure your spot on the waitlist
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
