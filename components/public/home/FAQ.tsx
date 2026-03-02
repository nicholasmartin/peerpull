"use client";

import type { SiteSettings } from "@/app/(public)/page";

type AccordionProps = {
  items: Array<{
    question: string;
    answer: string;
  }>;
};

const Accordion = ({ items }: AccordionProps) => {
  return (
    <div className="divide-y divide-dark-border rounded-lg border border-dark-border overflow-hidden">
      {items.map((item, i: number) => (
        <details key={i} className="group [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer items-center justify-between gap-3 p-6 text-dark-text hover:bg-dark-card/50 transition-colors duration-200">
            <h3 className="text-base font-medium">{item.question}</h3>
            <svg
              className="h-4 w-4 flex-shrink-0 transform transition duration-200 group-open:rotate-180 text-dark-text-muted"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </summary>
          <div className="px-6 pb-6">
            <p className="text-dark-text-muted text-sm leading-relaxed">{item.answer}</p>
          </div>
        </details>
      ))}
    </div>
  );
};

export function FAQ({ settings }: { settings: SiteSettings }) {
  const exchangeRatio =
    settings.reviewReward === settings.reviewCost
      ? `a ${settings.reviewReward}:${settings.reviewCost} exchange ratio (give ${settings.reviewCost} review, get ${settings.reviewReward} back)`
      : `${settings.reviewReward} points per review given`;

  return (
    <section id="faq" className="py-20 md:py-32 bg-dark-surface relative">
      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-blue-primary text-sm font-semibold tracking-widest uppercase mb-4">FAQ</p>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-dark-text">
              Everything You Need to Know
            </h2>
          </div>

          <Accordion
            items={[
              {
                question: "How do I get access to the beta?",
                answer: `PeerPull is currently in closed beta and available by invite only. Request an invite from our homepage or get one from an existing member. Existing members earn ${settings.referralBonus} bonus credits for every friend they invite.`
              },
              {
                question: "What are the beta perks?",
                answer: `Beta members enjoy ${exchangeRatio}, ${settings.signupBonus} free credits at signup, and a +${settings.firstReviewBonus} credit bonus for your first review. Plus, refer a friend and you both earn bonus credits. These perks are time-limited and will adjust as we grow.`
              },
              {
                question: "How do you ensure quality feedback?",
                answer: "All reviews must be approved by recipients before the reviewer earns PeerPoints. Our templates also guide reviewers to provide specific, actionable insights rather than generic comments. This approval mechanism works the same during beta."
              },
              {
                question: "What if I don't have a landing page yet?",
                answer: "You can still submit a concept document, pitch deck, or even a detailed description of your idea as a Feedback Request. The key is having something concrete for others to evaluate."
              },
              {
                question: "How technical should the feedback be?",
                answer: "Our community is primarily solo founders, so the feedback tends to be practical and implementation-focused. However, you can specify if you want feedback on specific aspects like market fit, UX, or technical architecture."
              },
              {
                question: "What if I'm an experienced founder without a current project?",
                answer: "We welcome experienced founders to join as PeerPros! You'll get special recognition and can bank PeerPoints for future projects."
              },
              {
                question: "Is my idea protected?",
                answer: "While we can't guarantee absolute confidentiality in a community setting, our terms prohibit stealing ideas. Remember that execution, not the idea itself, is typically the differentiator in startup success."
              }
            ]}
          />
        </div>
      </div>
    </section>
  );
}
