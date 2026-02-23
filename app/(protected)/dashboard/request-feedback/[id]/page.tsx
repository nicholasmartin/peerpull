import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/utils/supabase/server";
import { ReviewActions } from "./review-actions";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function PullRequestDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/signin");

  const { data: pr } = await supabase
    .from("pull_requests")
    .select("*")
    .eq("id", id)
    .single();

  if (!pr) return redirect("/dashboard/request-feedback");

  const isOwner = pr.user_id === user.id;

  // Get reviews
  const { data: reviews } = await supabase
    .from("reviews")
    .select("*")
    .eq("pull_request_id", id)
    .in("status", ["submitted", "approved", "rejected"])
    .order("submitted_at", { ascending: false });

  // Fetch reviewer names
  const reviewerIds = [...new Set((reviews || []).map((r: any) => r.reviewer_id))];
  const { data: reviewerProfiles } = reviewerIds.length > 0
    ? await supabase.from("profiles").select("id, full_name").in("id", reviewerIds)
    : { data: [] };
  const reviewerMap = Object.fromEntries((reviewerProfiles || []).map((p: any) => [p.id, p.full_name]));

  const statusLabel = pr.status === "open" ? "Open" : pr.status === "in_review" ? "In Review" : pr.status === "completed" ? "Completed" : "Closed";
  const dotColor = pr.status === "open" ? "bg-yellow-500" : pr.status === "completed" ? "bg-green-500" : "bg-primary";

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Link href="/dashboard/request-feedback" className="text-dark-text-muted hover:text-dark-text">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-xl font-semibold">{pr.title}</h1>
          <div className="flex items-center space-x-2 text-sm text-dark-text-muted">
            {pr.stage && <span className="capitalize">{pr.stage}</span>}
            <span>•</span>
            <span>{new Date(pr.created_at).toLocaleDateString()}</span>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs text-dark-text-muted">
          <span className={`inline-block h-1.5 w-1.5 rounded-full ${dotColor}`} />
          {statusLabel}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="feedback">Feedback ({reviews?.length || 0})</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Project Description</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {pr.description && (
                    <p className="text-dark-text-muted">{pr.description}</p>
                  )}

                  {pr.url && (
                    <div>
                      <h3 className="font-medium text-dark-text">Project URL</h3>
                      <a href={pr.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        {pr.url}
                      </a>
                    </div>
                  )}

                  {pr.categories?.length > 0 && (
                    <div>
                      <h3 className="font-medium text-dark-text">Categories</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {pr.categories.map((cat: string, i: number) => (
                          <Badge key={i} variant="secondary">{cat}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {pr.focus_areas?.length > 0 && (
                    <div>
                      <h3 className="font-medium text-dark-text">Feedback Focus</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {pr.focus_areas.map((area: string, i: number) => (
                          <Badge key={i} variant="outline">{area}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {pr.questions?.length > 0 && (
                    <div>
                      <h3 className="font-medium text-dark-text">Specific Questions</h3>
                      <ul className="mt-2 list-disc list-inside text-dark-text-muted">
                        {pr.questions.map((q: string, i: number) => (
                          <li key={i}>{q}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="feedback" className="space-y-6">
              {reviews && reviews.length > 0 ? (
                reviews.map((review: any) => (
                  <Card key={review.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <Avatar>
                            <AvatarFallback>{(reviewerMap[review.reviewer_id] || "?")[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">{reviewerMap[review.reviewer_id] || "Anonymous"}</h3>
                            <div className="mt-1 flex items-center gap-2">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <svg
                                    key={i}
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={`h-4 w-4 ${i < (review.rating || 0) ? "text-yellow-400" : "text-dark-text-muted/50"}`}
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                              <span className="inline-flex items-center gap-1.5 text-xs text-dark-text-muted">
                                <span className={`inline-block h-1.5 w-1.5 rounded-full ${
                                  review.status === "approved" ? "bg-green-500" :
                                  review.status === "rejected" ? "bg-red-500" : "bg-yellow-500"
                                }`} />
                                {review.status}
                              </span>
                            </div>
                          </div>
                        </div>
                        <span className="text-xs text-dark-text-muted">
                          {review.submitted_at ? new Date(review.submitted_at).toLocaleDateString() : ""}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Video player */}
                      {review.video_url && (
                        <div className="rounded-md overflow-hidden bg-black">
                          <video src={review.video_url} controls className="w-full max-h-[400px]" />
                        </div>
                      )}

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {review.strengths && (
                          <div>
                            <h3 className="font-medium text-green-400 mb-2">Strengths</h3>
                            <p className="text-dark-text-muted text-sm">{review.strengths}</p>
                          </div>
                        )}
                        {review.improvements && (
                          <div>
                            <h3 className="font-medium text-amber-400 mb-2">Areas for Improvement</h3>
                            <p className="text-dark-text-muted text-sm">{review.improvements}</p>
                          </div>
                        )}
                      </div>

                      {/* Approve/Reject buttons for PR owner */}
                      {isOwner && review.status === "submitted" && (
                        <ReviewActions reviewId={review.id} />
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <MessageSquare className="h-12 w-12 text-dark-text-muted mb-4" />
                  <h3 className="text-lg font-medium text-dark-text">No feedback yet</h3>
                  <p className="mt-2 text-sm text-dark-text-muted">
                    Feedback will appear here once reviewers submit their reviews.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Review Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="rounded-md border p-3">
                  <div className="text-2xl font-bold text-green-400">
                    {reviews?.filter((r: any) => r.status === "approved").length || 0}
                  </div>
                  <div className="text-xs text-dark-text-muted">Approved</div>
                </div>
                <div className="rounded-md border p-3">
                  <div className="text-2xl font-bold text-yellow-400">
                    {reviews?.filter((r: any) => r.status === "submitted").length || 0}
                  </div>
                  <div className="text-xs text-dark-text-muted">Pending</div>
                </div>
                <div className="rounded-md border p-3">
                  <div className="text-2xl font-bold">
                    {reviews?.length || 0}
                  </div>
                  <div className="text-xs text-dark-text-muted">Total</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
