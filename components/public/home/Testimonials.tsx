"use client";

type TestimonialCardProps = {
  quote: string;
  author: string;
  role: string;
  imagePlaceholder?: boolean;
};

const TestimonialCard = ({ quote, author, role, imagePlaceholder = true }: TestimonialCardProps) => (
  <div className="rounded-xl border-2 border-fire-brick bg-papaya-whip/20 p-6 shadow-md hover:shadow-lg transition-shadow duration-200">
    {imagePlaceholder && (
      <div className="w-16 h-16 rounded-full bg-air-blue mb-4 flex items-center justify-center text-papaya-whip shadow-md">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      </div>
    )}
    <p className="text-papaya-whip mb-4 italic">"{quote}"</p>
    <div>
      <p className="font-semibold text-fire-brick">{author}</p>
      <p className="text-sm text-papaya-whip/80">{role}</p>
    </div>
  </div>
);

export function Testimonials() {
  return (
    <section className="py-16 md:py-24 bg-prussian-blue text-papaya-whip">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-2 text-papaya-whip">
              Why Founders Love Us
            </h2>
            <h3 className="text-2xl font-semibold text-air-blue mb-6">
              Real Stories from Technical Founders
            </h3>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
          <TestimonialCard
            quote="After six months of building my SaaS tool, I realized I was solving the wrong problem. PeerPull would have saved me thousands of dollars and countless hours."
            author="Mira J."
            role="First-time Founder"
          />
          <TestimonialCard
            quote="The technical feedback I received was invaluable—fellow developers immediately spotted architecture issues I had missed completely."
            author="Chris T."
            role="Solo Technical Founder"
          />
          <TestimonialCard
            quote="It's like having a team of co-founders available whenever I need a reality check on my ideas."
            author="Samantha L."
            role="Developer Turned Entrepreneur"
          />
        </div>
      </div>
    </section>
  );
}
