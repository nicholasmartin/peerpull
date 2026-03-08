import React from "react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle, Info, Pencil } from "lucide-react";
import { closeFeedbackRequest } from "@/app/actions";
import { CloseProjectButton } from "@/components/protected/dashboard/CloseProjectButton";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getSettings } from "@/utils/supabase/settings";

export default async function FeedbackRequestsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/signin");

  const settings = await getSettings();

  // Fetch user's feedback requests with review counts
  const { data: feedbackRequests } = await supabase
    .from("feedback_requests")
    .select("id, title, url, description, stage, categories, status, queue_position, created_at, reviews(id)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const activeFeedbackRequests = (feedbackRequests || []).filter(
    (fr: any) => fr.status === "open" || fr.status === "in_review" || fr.status === "draft"
  );
  const completedFeedbackRequests = (feedbackRequests || []).filter(
    (fr: any) => fr.status === "completed" || fr.status === "closed"
  );

  // Active project limit check
  const activeQueuedCount = (feedbackRequests || []).filter(
    (fr: any) => fr.status === "open" && fr.queue_position != null
  ).length;
  const atLimit = activeQueuedCount >= settings.active_project_limit;

  const getStatusBadge = (status: string) => {
    const color = {
      draft: "bg-dark-text-muted/60",
      open: "bg-green-500",
      in_review: "bg-blue-500",
      completed: "bg-primary",
      closed: "bg-dark-text-muted",
    }[status] || "bg-dark-text-muted";
    const label = {
      draft: "Draft",
      open: "Live",
      in_review: "In Review",
      completed: "Completed",
      closed: "Closed",
    }[status] || status;
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-dark-text-muted">
        <span className={`inline-block h-1.5 w-1.5 rounded-full ${color}`} />
        {label}
      </span>
    );
  };

  const ActiveEmptyState = () => (
    <div className="rounded-md border border-dark-border bg-dark-card p-12 text-center">
      <PlusCircle className="h-12 w-12 text-dark-text-muted mx-auto mb-4" />
      <h3 className="text-lg font-medium text-dark-text">No projects yet</h3>
      <p className="mt-2 text-sm text-dark-text-muted max-w-sm mx-auto">
        1 PeerPoint per feedback received, not upfront &mdash; you start with 3.
      </p>
      <Link href="/dashboard/request-feedback/new">
        <Button className="mt-4 bg-primary hover:bg-primary-muted">
          <PlusCircle className="h-4 w-4 mr-2" />
          Submit Your First Project
        </Button>
      </Link>
    </div>
  );

  const CompletedEmptyState = () => (
    <div className="rounded-md border border-dark-border bg-dark-card p-12 text-center">
      <PlusCircle className="h-12 w-12 text-dark-text-muted mx-auto mb-4" />
      <h3 className="text-lg font-medium text-dark-text">No completed projects yet</h3>
      <p className="mt-2 text-sm text-dark-text-muted max-w-sm mx-auto">
        Once your projects have received feedback, they&apos;ll appear here.
      </p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold">Request Feedback</h1>
          <p className="flex items-center gap-1.5 text-xs text-dark-text-muted">
            <Info className="h-3 w-3" />
            {activeQueuedCount}/{settings.active_project_limit} active project{settings.active_project_limit !== 1 ? "s" : ""} in queue
          </p>
        </div>
        {atLimit ? (
          <Button className="flex items-center gap-2" disabled title={`You can only have ${settings.active_project_limit} active project${settings.active_project_limit !== 1 ? "s" : ""} in the queue at a time`}>
            <PlusCircle className="h-4 w-4" />
            New Request
          </Button>
        ) : (
          <Link href="/dashboard/request-feedback/new">
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              New Request
            </Button>
          </Link>
        )}
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="active">Active Feedback Requests</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeFeedbackRequests.length > 0 ? (
            <div className="rounded-md border border-dark-border bg-dark-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-dark-border">
                      <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider font-medium text-dark-text-muted">Project Name</th>
                      <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider font-medium text-dark-text-muted">Date Submitted</th>
                      <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider font-medium text-dark-text-muted">Status</th>
                      <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider font-medium text-dark-text-muted">Feedback</th>
                      <th className="px-4 py-3 text-right text-[11px] uppercase tracking-wider font-medium text-dark-text-muted">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeFeedbackRequests.map((pr: any) => (
                      <tr key={pr.id} className="border-b border-dark-border/50">
                        <td className="px-4 py-4">
                          <Link href={`/dashboard/request-feedback/${pr.id}`} className="font-medium text-primary hover:underline">
                            {pr.title}
                          </Link>
                        </td>
                        <td className="px-4 py-4 text-dark-text-muted whitespace-nowrap">{new Date(pr.created_at).toLocaleDateString()}</td>
                        <td className="px-4 py-4 whitespace-nowrap">{getStatusBadge(pr.status)}</td>
                        <td className="px-4 py-4 text-dark-text-muted whitespace-nowrap">{pr.reviews?.length || 0} feedback</td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Link href={`/dashboard/request-feedback/${pr.id}`}>
                              <Button variant="outline" size="sm">
                                View
                              </Button>
                            </Link>
                            <Link href={`/dashboard/request-feedback/${pr.id}/edit`}>
                              <Button variant="outline" size="sm">
                                <Pencil className="h-3.5 w-3.5 mr-1" />
                                Edit
                              </Button>
                            </Link>
                            {["draft", "open"].includes(pr.status) && (
                              <CloseProjectButton projectId={pr.id} action={closeFeedbackRequest} />
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <ActiveEmptyState />
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedFeedbackRequests.length > 0 ? (
            <div className="rounded-md border border-dark-border bg-dark-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-dark-border">
                      <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider font-medium text-dark-text-muted">Project Name</th>
                      <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider font-medium text-dark-text-muted">Date Submitted</th>
                      <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider font-medium text-dark-text-muted">Status</th>
                      <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider font-medium text-dark-text-muted">Feedback</th>
                      <th className="px-4 py-3 text-right text-[11px] uppercase tracking-wider font-medium text-dark-text-muted">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {completedFeedbackRequests.map((pr: any) => (
                      <tr key={pr.id} className="border-b border-dark-border/50">
                        <td className="px-4 py-4">
                          <Link href={`/dashboard/request-feedback/${pr.id}`} className="font-medium text-primary hover:underline">
                            {pr.title}
                          </Link>
                        </td>
                        <td className="px-4 py-4 text-dark-text-muted whitespace-nowrap">{new Date(pr.created_at).toLocaleDateString()}</td>
                        <td className="px-4 py-4 whitespace-nowrap">{getStatusBadge(pr.status)}</td>
                        <td className="px-4 py-4 text-dark-text-muted whitespace-nowrap">{pr.reviews?.length || 0} feedback</td>
                        <td className="px-4 py-4 text-right">
                          <Link href={`/dashboard/request-feedback/${pr.id}`}>
                            <Button variant="outline" size="sm">
                              View Feedback
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <CompletedEmptyState />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
