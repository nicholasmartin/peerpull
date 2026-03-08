import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

export default async function FeedbackInProgressPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/signin");

  const { data: myReviews } = await supabase
    .from("reviews")
    .select("*, feedback_requests(*)")
    .eq("reviewer_id", user.id)
    .in("status", ["in_progress"])
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">In Progress</h1>

      {myReviews && myReviews.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {myReviews.map((review: any) => (
            <Card key={review.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">
                  <Link href={`/dashboard/feedback/${review.feedback_request_id}/review`} className="hover:text-primary hover:underline">
                    {review.feedback_requests?.title}
                  </Link>
                </CardTitle>
                <CardDescription>
                  Claimed {new Date(review.created_at).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href={`/dashboard/feedback/${review.feedback_request_id}/review`}
                  className="inline-flex items-center justify-center w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-muted"
                >
                  Continue
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <CheckCircle2 className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-dark-text">No in-progress feedback</h3>
          <p className="mt-2 text-sm text-dark-text-muted">
            Go to <Link href="/dashboard/feedback/submit" className="text-primary hover:underline">Submit</Link> to get assigned the next project in the queue.
          </p>
        </div>
      )}
    </div>
  );
}
