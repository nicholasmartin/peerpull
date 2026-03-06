"use client";

import Button from "@/components/ui/button/Button";
import Link from "next/link";
import type { SiteSettings } from "@/app/(public)/page";

export function CTASection({ settings }: { settings: SiteSettings }) {
  const exchangeLabel =
    settings.reviewReward === settings.reviewCost
      ? `${settings.reviewReward}:${settings.reviewCost} Exchange — Limited Time`
      : `Earn ${settings.reviewReward} Per Feedback`;

  const perks = [
    {
      title: exchangeLabel,
      description: `During beta, give just ${settings.reviewCost === 1 ? "one feedback" : `${settings.reviewCost} feedback`} to get one back. This generous ratio won't last forever — lock it in now.`,
    },
    {
      title: `${settings.signupBonus} Free PeerPoints on Signup`,
      description: "Start giving and getting feedback immediately. No earning required to submit your first project.",
    },
    {
      title: "Earn More Through Referrals",
      description: `Invite fellow founders and earn ${settings.referralBonus} PeerPoints per referral. Build your feedback balance before the ratio changes.`,
    },
  ];

  return (
    <section className="py-20 md:py-32 bg-dark-bg relative overflow-hidden">
      {/* Single subtle glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-blue-primary/5 blur-3xl pointer-events-none"></div>

      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl text-dark-text">
              Ready to <span className="text-blue-primary">Join the Beta</span>?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
            {perks.map((perk, i) => (
              <div key={i} className="bg-dark-card border border-dark-border rounded-lg p-6">
                <h3 className="text-sm font-semibold text-dark-text mb-2">{perk.title}</h3>
                <p className="text-dark-text-muted text-sm leading-relaxed">{perk.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/signup">
              <Button
                size="md"
                className="text-base font-semibold px-10 py-4 bg-blue-primary hover:bg-blue-secondary transition-colors text-dark-bg"
              >
                Join the Beta
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
