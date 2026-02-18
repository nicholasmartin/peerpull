"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { approveReview, rejectReview } from "@/app/actions";

export function ReviewActions({ reviewId }: { reviewId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleApprove() {
    setLoading(true);
    await approveReview(reviewId);
    router.refresh();
    setLoading(false);
  }

  async function handleReject() {
    setLoading(true);
    await rejectReview(reviewId);
    router.refresh();
    setLoading(false);
  }

  return (
    <div className="flex gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
      <Button
        onClick={handleApprove}
        disabled={loading}
        className="bg-green-600 hover:bg-green-700 text-white"
      >
        Approve (+1 point to reviewer)
      </Button>
      <Button
        onClick={handleReject}
        disabled={loading}
        variant="outline"
        className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
      >
        Reject
      </Button>
    </div>
  );
}
