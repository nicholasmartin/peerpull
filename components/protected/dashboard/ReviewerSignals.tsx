"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Eye, ShoppingBag, TrendingUp } from "lucide-react";

interface ReviewerSignalsProps {
  signalFollow: boolean;
  signalEngage: boolean;
  signalInvest: boolean;
  onSignalFollowChange: (v: boolean) => void;
  onSignalEngageChange: (v: boolean) => void;
  onSignalInvestChange: (v: boolean) => void;
}

export function ReviewerSignals({
  signalFollow,
  signalEngage,
  signalInvest,
  onSignalFollowChange,
  onSignalEngageChange,
  onSignalInvestChange,
}: ReviewerSignalsProps) {
  return (
    <div className="rounded-xl border border-dark-border bg-dark-card p-4 space-y-3">
      <div>
        <h3 className="text-sm font-semibold text-white">Interest Signals</h3>
        <p className="text-xs text-gray-400 mt-0.5">
          Optional — let the builder know if their product resonated with you
        </p>
      </div>

      <div className="space-y-2.5">
        <label className="flex items-center gap-3 cursor-pointer group">
          <Checkbox
            checked={signalFollow}
            onCheckedChange={(v) => onSignalFollowChange(v === true)}
          />
          <Eye className="h-4 w-4 shrink-0" style={{ color: "#0070dd" }} />
          <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
            I want to follow this project&apos;s progress
          </span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer group">
          <Checkbox
            checked={signalEngage}
            onCheckedChange={(v) => onSignalEngageChange(v === true)}
          />
          <ShoppingBag className="h-4 w-4 shrink-0" style={{ color: "#a335ee" }} />
          <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
            I&apos;m interested in using or buying this product
          </span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer group">
          <Checkbox
            checked={signalInvest}
            onCheckedChange={(v) => onSignalInvestChange(v === true)}
          />
          <TrendingUp className="h-4 w-4 shrink-0" style={{ color: "#ff8000" }} />
          <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
            I&apos;m interested in investing in or acquiring this
          </span>
        </label>
      </div>
    </div>
  );
}
