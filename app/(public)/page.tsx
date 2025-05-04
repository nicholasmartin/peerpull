import { Hero } from "@/components/public/home/Hero";
import { Problem } from "@/components/public/home/Problem";
import { Solution } from "@/components/public/home/Solution";
import { HowItWorks } from "@/components/public/home/HowItWorks";
import { Testimonials } from "@/components/public/home/Testimonials";
import { ForExperiencedFounders } from "@/components/public/home/ForExperiencedFounders";
import { Comparison } from "@/components/public/home/Comparison";
import { UseCases } from "@/components/public/home/UseCases";
import { WhyNow } from "@/components/public/home/WhyNow";
import { JoinWaitlist } from "@/components/public/home/JoinWaitlist";
import { FAQ } from "@/components/public/home/FAQ";
import { CTASection } from "@/components/public/home/CTASection";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1">
        <Hero />
        <Problem />
        <Solution />
        <HowItWorks />
        <Testimonials />
        <ForExperiencedFounders />
        <Comparison />
        <UseCases />
        <WhyNow />
        <JoinWaitlist />
        <FAQ />
        <CTASection />
      </main>
    </div>
  );
}
