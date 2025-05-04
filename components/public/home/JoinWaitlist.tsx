"use client";

import React from 'react';
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
          
          <div className="bg-papaya-whip rounded-xl p-8 shadow-lg border-2 border-fire-brick">
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1 text-prussian-blue">Your Name</label>
                <input
                  type="text"
                  id="name"
                  placeholder="Your Name"
                  className="w-full px-4 py-3 rounded-md border-2 border-air-blue bg-white text-prussian-blue focus:outline-none focus:ring-2 focus:ring-fire-brick/50 placeholder-prussian-blue/50"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1 text-prussian-blue">Your Email</label>
                <input
                  type="email"
                  id="email"
                  placeholder="Your Email"
                  className="w-full px-4 py-3 rounded-md border-2 border-air-blue bg-white text-prussian-blue focus:outline-none focus:ring-2 focus:ring-fire-brick/50 placeholder-prussian-blue/50"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="projectUrl" className="block text-sm font-medium mb-1 text-prussian-blue">Your Project URL (Optional)</label>
                <input
                  type="url"
                  id="projectUrl"
                  placeholder="Your Project URL (Optional)"
                  className="w-full px-4 py-3 rounded-md border-2 border-air-blue bg-white text-prussian-blue focus:outline-none focus:ring-2 focus:ring-fire-brick/50 placeholder-prussian-blue/50"
                />
              </div>
              
              <div>
                <label htmlFor="stage" className="block text-sm font-medium mb-1 text-prussian-blue">What stage is your startup in?</label>
                <select
                  id="stage"
                  className="w-full px-4 py-3 rounded-md border-2 border-air-blue bg-white text-prussian-blue focus:outline-none focus:ring-2 focus:ring-fire-brick/50"
                >
                  <option value="">What stage is your startup in?</option>
                  <option value="idea">Just an idea</option>
                  <option value="landing">Landing page built</option>
                  <option value="prototype">Working prototype</option>
                  <option value="launched">Launched but pre-revenue</option>
                  <option value="revenue">Generating revenue</option>
                  <option value="experienced">Experienced founder helping others</option>
                </select>
              </div>
              
              <div className="pt-4">
                <Button
                  size="md"
                  className="w-full py-4 text-base font-medium bg-fire-brick hover:bg-barn-red text-papaya-whip border-none shadow-md"
                >
                  Join the Waitlist
                </Button>
              </div>
            </form>
            
            <p className="text-center text-sm text-prussian-blue mt-6 italic font-medium">
              Early members get priority access and additional PeerPoints
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
