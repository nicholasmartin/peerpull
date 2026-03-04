import Link from "next/link";
import { Profile } from "@/utils/supabase/profiles";
import { Clock, User, Send, Coins } from "lucide-react";

interface WaitlistBannerProps {
  profile: Profile;
}

export function WaitlistBanner({ profile }: WaitlistBannerProps) {
  const firstName = profile.first_name || "there";

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="rounded-xl border border-primary/30 bg-primary/5 p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <Clock className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-dark-text">
              Hey {firstName}, you&apos;re on the waitlist!
            </h1>
            <p className="mt-2 text-sm text-dark-text-muted max-w-lg">
              We&apos;re preparing PeerPull for launch. Once we go live, you&apos;ll be able to
              submit your projects for feedback and start giving feedback on other builders&apos; work.
            </p>
          </div>
        </div>
      </div>

      {/* PeerPoints Balance */}
      <div className="rounded-md border border-dark-border bg-dark-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-medium text-dark-text-muted uppercase tracking-wider">Your PeerPoints</h2>
            <div className="mt-2 text-3xl font-semibold tabular-nums text-dark-text">
              {profile.peer_points_balance}
            </div>
            <p className="mt-1 text-xs text-dark-text-muted">Ready to use when we launch</p>
          </div>
        </div>
      </div>

      {/* What You Can Do Now */}
      <div>
        <h2 className="text-sm font-medium text-dark-text-muted uppercase tracking-wider mb-4">
          While you wait
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Link
            href="/dashboard/profile"
            className="rounded-md border border-dark-border bg-dark-card p-5 hover:border-dark-text-muted/30 transition group"
          >
            <User className="h-5 w-5 text-primary mb-3" />
            <h3 className="text-sm font-medium text-dark-text group-hover:text-primary transition">
              Complete your profile
            </h3>
            <p className="mt-1 text-xs text-dark-text-muted">
              Add your bio, website, and expertise
            </p>
          </Link>

          <Link
            href="/dashboard/invite"
            className="rounded-md border border-dark-border bg-dark-card p-5 hover:border-dark-text-muted/30 transition group"
          >
            <Send className="h-5 w-5 text-primary mb-3" />
            <h3 className="text-sm font-medium text-dark-text group-hover:text-primary transition">
              Invite builders
            </h3>
            <p className="mt-1 text-xs text-dark-text-muted">
              Share your referral link and earn bonus points
            </p>
          </Link>

          <Link
            href="/dashboard/peerpoints"
            className="rounded-md border border-dark-border bg-dark-card p-5 hover:border-dark-text-muted/30 transition group"
          >
            <Coins className="h-5 w-5 text-primary mb-3" />
            <h3 className="text-sm font-medium text-dark-text group-hover:text-primary transition">
              Check PeerPoints
            </h3>
            <p className="mt-1 text-xs text-dark-text-muted">
              View your balance and transaction history
            </p>
          </Link>
        </div>
      </div>

      {/* Footer Note */}
      <p className="text-center text-xs text-dark-text-muted">
        You&apos;ll receive a notification when PeerPull launches. Stay tuned!
      </p>
    </div>
  );
}
