"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { approveReview, rejectReview } from "@/app/actions";
import { toast } from "sonner";

export function ReviewActions({ reviewId }: { reviewId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleApprove() {
    setLoading(true);
    const result = await approveReview(reviewId);
    if (result && "error" in result) {
      toast.error(result.error);
    } else {
      toast.success("Review approved");
    }
    router.refresh();
    setLoading(false);
  }

  async function handleReject() {
    setLoading(true);
    const result = await rejectReview(reviewId);
    if (result && "error" in result) {
      toast.error(result.error);
    } else {
      toast.success("Review rejected");
    }
    router.refresh();
    setLoading(false);
  }

  return (
    <div className="flex gap-2 pt-2 border-t border-dark-border">
      <Button
        onClick={handleApprove}
        disabled={loading}
        className="bg-green-600 hover:bg-green-700 text-white"
      >
        {loading && <Spinner size="sm" />}
        Approve
      </Button>
      <Button
        onClick={handleReject}
        disabled={loading}
        variant="outline"
        className="text-red-400 border-red-500/20 hover:bg-red-500/10 hover:text-red-300"
      >
        {loading && <Spinner size="sm" />}
        Reject
      </Button>
    </div>
  );
}
