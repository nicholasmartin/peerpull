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
      ? `a ${settings.reviewReward}:${settings.reviewCost} exchange ratio (give ${settings.reviewCost} feedback, get ${settings.reviewReward} back)`
      : `${settings.reviewReward} points per feedback given`;

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
                question: "Why video reviews instead of text feedback?",
                answer: "Text feedback tells you what someone thought after the fact. Video captures what they experienced in real time. You see the hesitation before a click, the confusion at unclear copy, the moment they try to find navigation and can't. These think-aloud recordings reveal usability issues and first impressions that no written comment can replicate."
              },
              {
                question: "How does the video recording work?",
                answer: "PeerPull has a built-in screen recorder right in the browser. When you review someone's project, you open their URL, hit record, and narrate your thoughts as you navigate. No software to install, no uploads from external tools. The recording is saved and delivered directly to the project owner."
              },
              {
                question: "How do I get access to the beta?",
                answer: `PeerPull is currently in closed beta and available by invite only. Request an invite from our homepage or get one from an existing member. Existing members earn ${settings.referralBonus} bonus PeerPoints for every friend they invite.`
              },
              {
                question: "What are the beta perks?",
                answer: `Beta members enjoy ${exchangeRatio}, ${settings.signupBonus} free PeerPoints at signup, and a +${settings.firstReviewBonus} PeerPoint bonus for your first video review. Plus, refer a friend and you both earn bonus PeerPoints. These perks are time-limited and will adjust as we grow.`
              },
              {
                question: "How do you ensure quality reviews?",
                answer: "All video reviews must be approved by recipients before the reviewer earns PeerPoints. Videos have a minimum recording length to prevent rushed, low-effort walkthroughs. And because every reviewer is also a builder with their own projects on the line, there's a natural incentive to give the kind of feedback you'd want to receive."
              },
              {
                question: "How long are the video reviews?",
                answer: "Reviews typically run 1 to 5 minutes. That's enough time to navigate the key flows, react naturally, and share meaningful observations without dragging on. Think of it as a quick, honest first impression from someone who builds products for a living."
              },
              {
                question: "What if I don't have a landing page yet?",
                answer: "You can submit any URL: a prototype, a Figma link, a pitch deck, or a staging environment. The key is having something a reviewer can interact with on screen and narrate their reactions to."
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
