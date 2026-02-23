import React from "react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function PullRequestsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/signin");

  // Fetch user's pull requests with review counts
  const { data: pullRequests } = await supabase
    .from("pull_requests")
    .select("id, title, url, description, stage, categories, status, created_at, reviews(id)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const activePRs = (pullRequests || []).filter(
    (pr: any) => pr.status === "open" || pr.status === "in_review"
  );
  const completedPRs = (pullRequests || []).filter(
    (pr: any) => pr.status === "completed" || pr.status === "closed"
  );

  const getStatusBadge = (status: string) => {
    const color = {
      open: "bg-yellow-500",
      in_review: "bg-green-500",
      completed: "bg-primary",
      closed: "bg-dark-text-muted",
    }[status] || "bg-dark-text-muted";
    const label = {
      open: "Open",
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
        1 PeerPoint per review received, not upfront &mdash; you start with 3.
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
        Once your projects have been reviewed, they&apos;ll appear here.
      </p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Request Feedback</h1>
        <Link href="/dashboard/request-feedback/new">
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            New Request
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="active">Active PullRequests</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activePRs.length > 0 ? (
            <div className="rounded-md border border-dark-border bg-dark-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-dark-border">
                      <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider font-medium text-dark-text-muted">Project Name</th>
                      <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider font-medium text-dark-text-muted">Date Submitted</th>
                      <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider font-medium text-dark-text-muted">Status</th>
                      <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider font-medium text-dark-text-muted">Feedback</th>
                      <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider font-medium text-dark-text-muted">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activePRs.map((pr: any) => (
                      <tr key={pr.id} className="border-b border-dark-border/50">
                        <td className="px-4 py-4">
                          <Link href={`/dashboard/request-feedback/${pr.id}`} className="font-medium text-primary hover:underline">
                            {pr.title}
                          </Link>
                        </td>
                        <td className="px-4 py-4 text-dark-text-muted">{new Date(pr.created_at).toLocaleDateString()}</td>
                        <td className="px-4 py-4">{getStatusBadge(pr.status)}</td>
                        <td className="px-4 py-4 text-dark-text-muted">{pr.reviews?.length || 0} reviews</td>
                        <td className="px-4 py-4">
                          <Link href={`/dashboard/request-feedback/${pr.id}`}>
                            <Button variant="outline" size="sm">
                              View
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
            <ActiveEmptyState />
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedPRs.length > 0 ? (
            <div className="rounded-md border border-dark-border bg-dark-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-dark-border">
                      <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider font-medium text-dark-text-muted">Project Name</th>
                      <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider font-medium text-dark-text-muted">Date Submitted</th>
                      <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider font-medium text-dark-text-muted">Status</th>
                      <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider font-medium text-dark-text-muted">Feedback</th>
                      <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider font-medium text-dark-text-muted">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {completedPRs.map((pr: any) => (
                      <tr key={pr.id} className="border-b border-dark-border/50">
                        <td className="px-4 py-4">
                          <Link href={`/dashboard/request-feedback/${pr.id}`} className="font-medium text-primary hover:underline">
                            {pr.title}
                          </Link>
                        </td>
                        <td className="px-4 py-4 text-dark-text-muted">{new Date(pr.created_at).toLocaleDateString()}</td>
                        <td className="px-4 py-4">{getStatusBadge(pr.status)}</td>
                        <td className="px-4 py-4 text-dark-text-muted">{pr.reviews?.length || 0} reviews</td>
                        <td className="px-4 py-4">
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
