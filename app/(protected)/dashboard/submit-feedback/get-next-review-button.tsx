"use client";

import { useTransition, useState } from "react";
import { Button } from "@/components/ui/button";
import { getNextReview } from "@/app/actions";

export function GetNextReviewButton() {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  function handleClick() {
    setMessage(null);
    startTransition(async () => {
      const result = await getNextReview();
      if (result?.error) {
        setMessage(result.error);
      }
    });
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
        Ready to review?
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
        Click the button below to get assigned the next project in the queue.
        You&apos;ll earn <span className="font-semibold text-green-400">+1 PeerPoint</span> for each completed review.
      </p>
      <Button
        className="bg-[#3366FF] hover:bg-blue-600 px-8 py-3 text-base"
        onClick={handleClick}
        disabled={isPending}
      >
        {isPending ? "Finding a project..." : "Get Next Review"}
      </Button>
      {message && (
        <p className="text-sm text-yellow-500">{message}</p>
      )}
    </div>
  );
}
