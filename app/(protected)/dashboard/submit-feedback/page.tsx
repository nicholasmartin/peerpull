import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { GetNextReviewButton } from "./get-next-review-button";

export default async function ReviewQueuePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/signin");

  // My in-progress reviews
  const { data: myReviews } = await supabase
    .from("reviews")
    .select("*, pull_requests(*)")
    .eq("reviewer_id", user.id)
    .in("status", ["in_progress"])
    .order("created_at", { ascending: false });

  // My completed reviews
  const { data: completedReviews } = await supabase
    .from("reviews")
    .select("*, pull_requests(*)")
    .eq("reviewer_id", user.id)
    .in("status", ["submitted", "approved", "rejected"])
    .order("submitted_at", { ascending: false });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Submit Feedback</h1>

      <Tabs defaultValue="get-review" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="get-review">Get a Review</TabsTrigger>
          <TabsTrigger value="assigned">My In-Progress ({myReviews?.length || 0})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedReviews?.length || 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="get-review" className="space-y-6">
          <GetNextReviewButton />
        </TabsContent>

        <TabsContent value="assigned" className="space-y-6">
          {myReviews && myReviews.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {myReviews.map((review: any) => (
                <Card key={review.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">
                      <Link href={`/dashboard/submit-feedback/${review.pull_request_id}/review`} className="hover:text-blue-600 hover:underline">
                        {review.pull_requests?.title}
                      </Link>
                    </CardTitle>
                    <CardDescription>
                      Claimed {new Date(review.created_at).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link
                      href={`/dashboard/submit-feedback/${review.pull_request_id}/review`}
                      className="inline-flex items-center justify-center w-full rounded-md bg-[#3366FF] px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
                    >
                      Continue Review
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CheckCircle2 className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No assigned reviews</h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Click &quot;Get a Review&quot; to get assigned the next project in the queue.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-6">
          {completedReviews && completedReviews.length > 0 ? (
            <div className="rounded-lg bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                      <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Project</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Status</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Submitted</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {completedReviews.map((review: any) => (
                      <tr key={review.id} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="px-4 py-4 font-medium">{review.pull_requests?.title}</td>
                        <td className="px-4 py-4">
                          <Badge variant="outline" className={
                            review.status === "approved"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : review.status === "rejected"
                              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          }>
                            {review.status === "approved" ? "Approved" : review.status === "rejected" ? "Rejected" : "Submitted"}
                          </Badge>
                        </td>
                        <td className="px-4 py-4 text-gray-600 dark:text-gray-300">
                          {review.submitted_at ? new Date(review.submitted_at).toLocaleDateString() : "-"}
                        </td>
                        <td className="px-4 py-4">
                          <span className={review.status === "approved" ? "font-medium text-green-600 dark:text-green-400" : "text-gray-400"}>
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
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No completed reviews</h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Complete your first review to see it here.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
