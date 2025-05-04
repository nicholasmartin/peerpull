"use client";

import React from 'react';
import Link from 'next/link';
import Button from "@/components/ui/button/Button";

export function JoinWaitlist() {
  return (
    <section className="py-16 md:py-24 bg-prussian-blue text-papaya-whip">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-2 text-papaya-whip">How to Join</h2>
            <h3 className="text-2xl font-semibold text-air-blue mb-6">Be Among the First to Access PeerPull</h3>
          </div>
          
          <div className="bg-papaya-whip rounded-xl p-12 shadow-lg border-2 border-fire-brick text-center">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-prussian-blue">Ready to get started?</h3>
              <p className="text-lg text-prussian-blue/80 max-w-xl mx-auto">
                Join PeerPull today and connect with experienced technical founders who can help validate your ideas and accelerate your startup journey.
              </p>
              
              <div className="mt-8">
                <Link href="/signup">
                  <Button
                    size="md"
                    className="px-8 py-4 text-lg font-medium bg-fire-brick hover:bg-barn-red text-papaya-whip border-none shadow-md"
                  >
                    Create Your Account
                  </Button>
                </Link>
              </div>
              
              <p className="text-center text-sm text-prussian-blue mt-6 italic font-medium">
                Early members get priority access and additional PeerPoints
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
