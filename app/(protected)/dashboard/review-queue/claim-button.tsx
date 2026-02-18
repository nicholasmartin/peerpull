"use client";

import { useTransition, useState } from "react";
import { Button } from "@/components/ui/button";
import { claimReview } from "@/app/actions";

export function ClaimReviewButton({ pullRequestId }: { pullRequestId: string }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleClaim() {
    setError(null);
    startTransition(async () => {
      const result = await claimReview(pullRequestId);
      if (result?.error) {
        setError(result.error);
      }
    });
  }

  return (
    <div>
      <Button
        className="w-full bg-[#3366FF] hover:bg-blue-600"
        onClick={handleClaim}
        disabled={isPending}
      >
        {isPending ? "Claiming..." : "Claim Review"}
      </Button>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
}
