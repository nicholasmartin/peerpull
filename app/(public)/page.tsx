import { Hero } from "@/components/public/home/Hero";
import { Problem } from "@/components/public/home/Problem";
import { HowItWorks } from "@/components/public/home/HowItWorks";
import { Comparison } from "@/components/public/home/Comparison";
import { FAQ } from "@/components/public/home/FAQ";
import { CTASection } from "@/components/public/home/CTASection";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1">
        <Hero />
        <Problem />
        <HowItWorks />
        <Comparison />
        <CTASection />
        <FAQ />
      </main>
    </div>
  );
}
