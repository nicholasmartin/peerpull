import { Eye, ShoppingBag, TrendingUp } from "lucide-react";

interface SignalBadgesProps {
  signalFollow: boolean;
  signalEngage: boolean;
  signalInvest: boolean;
}

export function SignalBadges({ signalFollow, signalEngage, signalInvest }: SignalBadgesProps) {
  const hasAny = signalFollow || signalEngage || signalInvest;
  if (!hasAny) return null;

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {signalFollow && (
          <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs" style={{ backgroundColor: "rgba(0,112,221,0.12)", color: "#0070dd" }}>
            <Eye className="h-3 w-3" />
            Wants to Follow
          </span>
        )}
        {signalEngage && (
          <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs" style={{ backgroundColor: "rgba(163,53,238,0.12)", color: "#a335ee" }}>
            <ShoppingBag className="h-3 w-3" />
            Wants to Engage
          </span>
        )}
        {signalInvest && (
          <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs" style={{ backgroundColor: "rgba(255,128,0,0.12)", color: "#ff8000" }}>
            <TrendingUp className="h-3 w-3" />
            Wants to Invest
          </span>
        )}
      </div>
      <p className="text-xs text-gray-500">Interest signals from feedback givers — only you can see these</p>
    </div>
  );
}
