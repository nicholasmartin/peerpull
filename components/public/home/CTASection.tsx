"use client";

import Button from "@/components/ui/button/Button";

export function CTASection() {
  return (
    <section className="py-16 md:py-24 bg-prussian-blue text-papaya-whip">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-6 text-papaya-whip">
                Ready to Get the Startup Validation You Need?
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
                      Get startup validation before investing months of development time.
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
                      Tap into a network of startup founders who've been where you are.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 mt-4">
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
                    <h3 className="text-lg font-semibold text-papaya-whip">Get Rapid Feedback</h3>
                    <p className="text-papaya-whip/80">
                      Receive valuable insights on your startup idea within hours, not weeks.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <Button 
                  size="md" 
                  className="bg-air-blue text-white hover:bg-air-blue/90 border-none font-medium shadow-md"
                  onClick={() => window.location.href = '/signup'}
                >
                  Join the Waitlist
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
