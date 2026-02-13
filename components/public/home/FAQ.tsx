"use client";

import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
});

type AccordionProps = {
  items: Array<{
    question: string;
    answer: string;
  }>;
};

const Accordion = ({ items }: AccordionProps) => {
  return (
    <div className="divide-y divide-glass-border rounded-lg bg-dark-card/50 backdrop-blur-sm shadow-xl border border-glass-border overflow-hidden">
      {items.map((item, i: number) => (
        <details key={i} className="group p-6 [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer items-center justify-between gap-3 text-dark-text font-medium rounded-md p-3 hover:bg-glass-highlight/20 transition-all duration-300">
            <h3 className={`${montserrat.className} text-lg font-medium`}>{item.question}</h3>
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-blue-primary to-teal-accent bg-opacity-10 flex items-center justify-center">
              <svg
                className="h-4 w-4 transform transition duration-300 ease-out group-open:rotate-180 text-dark-text"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </summary>
          <div className="mt-4 ml-2 pl-4 border-l-2 border-glass-border">
            <p className="text-dark-text-muted">{item.answer}</p>
          </div>
        </details>
      ))}
    </div>
  );
};

export function FAQ() {
  return (
    <section id="faq" className="py-20 md:py-32 bg-dark-surface relative">
      {/* Abstract geometric shapes for background */}
      <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
        <div className="absolute bottom-[30%] right-[20%] w-[280px] h-[280px] rounded-full bg-gradient-to-r from-blue-primary to-teal-accent blur-3xl opacity-20"></div>
        <div className="absolute top-[20%] left-[15%] w-[320px] h-[320px] rounded-full bg-gradient-to-r from-teal-accent to-blue-primary blur-3xl opacity-15"></div>
      </div>
      
      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`${montserrat.className} text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl mb-4`}>
              <span className="bg-gradient-to-r from-gradient-start to-gradient-end bg-clip-text text-transparent">Frequently Asked Questions</span>
            </h2>
            <h3 className="text-xl font-medium text-dark-text-muted mb-6">Everything You Need to Know</h3>
          </div>
          
          <div className="mx-auto max-w-3xl py-6">
            <Accordion 
              items={[
                {
                  question: "How do you ensure quality feedback?",
                  answer: "All PeerInsights must be approved by recipients before the reviewer earns PeerPoints. Our templates also guide reviewers to provide specific, actionable insights rather than generic comments."
                },
                {
                  question: "What if I don't have a landing page yet?",
                  answer: "You can still submit a concept document, pitch deck, or even a detailed description of your idea as a PullRequest. The key is having something concrete for others to evaluate."
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
      </div>
    </section>
  );
}
