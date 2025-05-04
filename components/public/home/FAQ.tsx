"use client";

type AccordionProps = {
  items: Array<{
    question: string;
    answer: string;
  }>;
};

const Accordion = ({ items }: AccordionProps) => {
  return (
    <div className="divide-y rounded-md border-2 border-air-blue bg-white shadow-md">
      {items.map((item, i: number) => (
        <details key={i} className="group p-6 [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-prussian-blue font-medium hover:bg-air-blue/10 rounded-md p-2">
            <h3 className="text-lg font-medium">{item.question}</h3>
            <svg
              className="h-5 w-5 transform transition duration-300 group-open:rotate-180 text-fire-brick"
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
          </summary>
          <p className="mt-4 px-4 text-prussian-blue/80">{item.answer}</p>
        </details>
      ))}
    </div>
  );
};

export function FAQ() {
  return (
    <section id="faq" className="py-16 md:py-24 bg-papaya-whip">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-2 text-barn-red">Frequently Asked Questions</h2>
            <h3 className="text-2xl font-semibold text-prussian-blue mb-6">Everything You Need to Know</h3>
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
                  answer: "Our community is primarily technical founders, so the feedback tends to be practical and implementation-focused. However, you can specify if you want feedback on specific aspects like market fit, UX, or technical architecture."
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
