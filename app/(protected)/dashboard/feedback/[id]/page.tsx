import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/utils/supabase/server";
import { SignalBadges } from "@/components/protected/dashboard/SignalBadges";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function FeedbackDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/signin");

  const { data: review } = await supabase
    .from("reviews")
    .select("*, feedback_requests(*)")
    .eq("id", id)
    .single();

  if (!review) return redirect("/dashboard/feedback/completed");

  // Authorization: only the reviewer can view their own feedback detail
  if (review.reviewer_id !== user.id) {
    return redirect("/dashboard/feedback/completed");
  }

  const fr = review.feedback_requests as {
    title: string;
    url: string | null;
    stage: string | null;
    categories: string[] | null;
  } | null;

  const statusLabel = review.status === "approved" ? "Helpful" : review.status === "rejected" ? "Unhelpful" : "Submitted";
  const statusColor = review.status === "approved"
    ? "bg-dark-surface text-green-400"
    : review.status === "rejected"
    ? "bg-dark-surface text-gray-400"
    : "bg-dark-surface text-yellow-400";
  const dotColor = review.status === "approved" ? "bg-green-500" : review.status === "rejected" ? "bg-gray-400" : "bg-yellow-500";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <Link href="/dashboard/feedback/completed" className="text-dark-text-muted hover:text-dark-text">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-xl font-semibold">{fr?.title || "Feedback Detail"}</h1>
          <div className="flex items-center space-x-2 text-sm text-dark-text-muted">
            {fr?.stage && <span className="capitalize">{fr.stage}</span>}
            {fr?.stage && review.submitted_at && <span>•</span>}
            {review.submitted_at && (
              <span>{new Date(review.submitted_at).toLocaleDateString()}</span>
            )}
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs text-dark-text-muted">
          <span className={`inline-block h-1.5 w-1.5 rounded-full ${dotColor}`} />
          {statusLabel}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Main content */}
        <div className="md:col-span-2 space-y-6">
          {/* Video */}
          {review.video_url && (
            <Card>
              <CardHeader>
                <CardTitle>Your Video Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md overflow-hidden bg-black">
                  <video src={review.video_url} controls className="w-full max-h-[400px]" />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Written Feedback */}
          {(review.strengths || review.improvements) && (
            <Card>
              <CardHeader>
                <CardTitle>Written Feedback</CardTitle>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>
          )}

          {/* Builder's Response */}
          {review.builder_rating != null && (
            <Card>
              <CardHeader>
                <CardTitle>Builder&apos;s Rating of Your Feedback</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-5 w-5 ${i < (review.builder_rating || 0) ? "text-yellow-400" : "text-dark-text-muted/50"}`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-dark-text-muted">{review.builder_rating}/5</span>
                </div>

                {review.builder_flags && review.builder_flags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {review.builder_flags.map((flag: string) => (
                      <Badge key={flag} variant="outline" className="bg-dark-surface text-red-400 text-xs">
                        {flag.replace(/_/g, " ")}
                      </Badge>
                    ))}
                  </div>
                )}

                {review.builder_feedback && (
                  <p className="text-dark-text-muted text-sm">{review.builder_feedback}</p>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status & Points */}
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-dark-text-muted">Status</span>
                <Badge variant="outline" className={statusColor}>
                  {statusLabel}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-dark-text-muted">Points Earned</span>
                <span className="font-semibold text-green-400">+1</span>
              </div>

              {/* Your Rating */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-dark-text-muted">Your Rating</span>
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
              </div>

              {review.submitted_at && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-dark-text-muted">Submitted</span>
                  <span className="text-sm">{new Date(review.submitted_at).toLocaleDateString()}</span>
                </div>
              )}

              {review.video_duration != null && review.video_duration > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-dark-text-muted">Video Duration</span>
                  <span className="text-sm">{Math.floor(review.video_duration / 60)}:{String(review.video_duration % 60).padStart(2, "0")}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Signals */}
          {(review.signal_follow || review.signal_engage || review.signal_invest) && (
            <Card>
              <CardHeader>
                <CardTitle>Your Interest Signals</CardTitle>
              </CardHeader>
              <CardContent>
                <SignalBadges
                  signalFollow={review.signal_follow}
                  signalEngage={review.signal_engage}
                  signalInvest={review.signal_invest}
                />
              </CardContent>
            </Card>
          )}

          {/* Project Link */}
          {fr?.url && (
            <Card>
              <CardHeader>
                <CardTitle>Project</CardTitle>
              </CardHeader>
              <CardContent>
                <a href={fr.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm break-all">
                  {fr.url}
                </a>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
