import { Coins, Star, Bell } from "lucide-react";
import { API_BASE_URL } from "@/lib/constants";
import type { UserProfile } from "@/lib/messages";

interface StatusBarProps {
  profile: UserProfile;
}

export default function StatusBar({ profile }: StatusBarProps) {
  return (
    <div className="flex items-center justify-between px-4 py-2 border-b border-dark-border bg-dark-card">
      <div className="flex items-center gap-4">
        {/* PeerPoints balance */}
        <div className="flex items-center gap-1.5 text-xs">
          <Coins className="h-3.5 w-3.5 text-primary" />
          <span className="font-medium">{profile.peerPointsBalance}</span>
        </div>

        {/* Quality score (hidden if null) */}
        {profile.qualityScore !== null && (
          <div className="flex items-center gap-1.5 text-xs">
            <Star className="h-3.5 w-3.5 text-primary" />
            <span className="font-medium">{profile.qualityScore.toFixed(1)}</span>
          </div>
        )}
      </div>

      {/* Notification badge */}
      <a
        href={`${API_BASE_URL}/dashboard`}
        target="_blank"
        rel="noopener noreferrer"
        className="relative p-1 rounded hover:bg-dark-surface transition-colors"
        title="Open Dashboard"
      >
        <Bell className="h-4 w-4 text-dark-text-muted" />
        {profile.unreadNotificationCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white">
            {profile.unreadNotificationCount > 99 ? "99+" : profile.unreadNotificationCount}
          </span>
        )}
      </a>
    </div>
  );
}
