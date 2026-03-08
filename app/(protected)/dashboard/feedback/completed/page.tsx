import React from "react";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

export default async function FeedbackCompletedPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/signin");

  const { data: completedReviews } = await supabase
    .from("reviews")
    .select("*, feedback_requests(*)")
    .eq("reviewer_id", user.id)
    .in("status", ["submitted", "approved", "rejected"])
    .order("submitted_at", { ascending: false });

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Completed Feedback</h1>

      {completedReviews && completedReviews.length > 0 ? (
        <div className="rounded-md border border-dark-border bg-dark-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-border">
                  <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider font-medium text-dark-text-muted">Project</th>
                  <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider font-medium text-dark-text-muted">Status</th>
                  <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider font-medium text-dark-text-muted">Submitted</th>
                  <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider font-medium text-dark-text-muted">Points</th>
                </tr>
              </thead>
              <tbody>
                {completedReviews.map((review: any) => (
                  <tr key={review.id} className="border-b border-dark-border/50">
                    <td className="px-4 py-4 font-medium">{review.feedback_requests?.title}</td>
                    <td className="px-4 py-4">
                      <Badge variant="outline" className={
                        review.status === "approved"
                          ? "bg-dark-surface text-green-400"
                          : review.status === "rejected"
                          ? "bg-dark-surface text-red-400"
                          : "bg-dark-surface text-yellow-400"
                      }>
                        {review.status === "approved" ? "Approved" : review.status === "rejected" ? "Rejected" : "Submitted"}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 text-dark-text-muted">
                      {review.submitted_at ? new Date(review.submitted_at).toLocaleDateString() : "-"}
                    </td>
                    <td className="px-4 py-4">
                      <span className={review.status === "approved" ? "font-medium text-green-400" : "text-gray-400"}>
                        {review.status === "approved" ? "+1" : "0"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-dark-text">No completed feedback</h3>
          <p className="mt-2 text-sm text-dark-text-muted">
            Give your first feedback to see it here.
          </p>
        </div>
      )}
    </div>
  );
}
