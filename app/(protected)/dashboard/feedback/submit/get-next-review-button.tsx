"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { getNextReview } from "@/app/actions";
import { toast } from "sonner";
import posthog from "posthog-js";

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
        posthog.capture("review_started", {
          feedback_request_id: result.pr_id,
        });
        router.push(`/dashboard/feedback/${result.pr_id}/review`);
      }
    });
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
      <h3 className="text-lg font-medium text-dark-text">
        Ready to give feedback?
      </h3>
      <p className="text-sm text-dark-text-muted max-w-md">
        Click the button below to get assigned the next project in the queue.
        You&apos;ll earn <span className="font-semibold text-green-400">+1 PeerPoint</span> for each feedback you give.
      </p>
      <Button
        className="bg-primary hover:bg-primary-muted px-8 py-3 text-base"
        onClick={handleClick}
        disabled={isPending}
      >
        {isPending && <Spinner size="sm" />}
        {isPending ? "Finding a project..." : "Get Next Project"}
      </Button>
    </div>
  );
}
