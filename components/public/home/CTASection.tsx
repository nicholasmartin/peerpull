"use client";

import Button from "@/components/ui/button/Button";

export function CTASection() {
  return (
    <section className="py-16 md:py-24 bg-fire-brick text-papaya-whip">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-6 text-papaya-whip">
                Ready to Get the Technical Validation You Need?
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-papaya-whip/20 p-1 rounded-full mt-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-papaya-whip"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-papaya-whip">Avoid Building the Wrong Thing</h3>
                    <p className="text-papaya-whip/80">
                      Get technical validation before investing months of development time
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-papaya-whip/20 p-1 rounded-full mt-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-papaya-whip"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-papaya-whip">Connect with Experienced Peers</h3>
                    <p className="text-papaya-whip/80">
                      Tap into a network of technical founders who've been where you are
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <Button 
                  size="md" 
                  className="bg-papaya-whip text-fire-brick hover:bg-papaya-whip/90 border-none font-medium shadow-md"
                >
                  Join the Waitlist
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-video rounded-xl overflow-hidden bg-barn-red flex items-center justify-center shadow-lg border-2 border-papaya-whip/30">
                <p className="text-papaya-whip text-center px-4 font-medium">
                  [Placeholder for testimonial video or product demo]
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
