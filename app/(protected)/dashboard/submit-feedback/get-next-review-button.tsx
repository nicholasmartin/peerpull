"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getNextReview } from "@/app/actions";
import { toast } from "sonner";

export function GetNextReviewButton() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleClick() {
    startTransition(async () => {
      const result = await getNextReview();
      if (result && "error" in result) {
        if (result.error.includes("No projects available")) {
          toast.info(result.error);
        } else {
          toast.error(result.error);
        }
      } else if (result && "pr_id" in result) {
        router.push(`/dashboard/submit-feedback/${result.pr_id}/review`);
      }
    });
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
      <h3 className="text-lg font-medium text-dark-text">
        Ready to review?
      </h3>
      <p className="text-sm text-dark-text-muted max-w-md">
        Click the button below to get assigned the next project in the queue.
        You&apos;ll earn <span className="font-semibold text-green-400">+1 PeerPoint</span> for each completed review.
      </p>
      <Button
        className="bg-primary hover:bg-primary-muted px-8 py-3 text-base"
        onClick={handleClick}
        disabled={isPending}
      >
        {isPending ? "Finding a project..." : "Get Next Review"}
      </Button>
    </div>
  );
}
