import React from "react";
import Link from "next/link";
import { PlusCircle, Info, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { closeFeedbackRequest } from "@/app/actions";
import { CloseProjectButton } from "@/components/protected/dashboard/CloseProjectButton";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getSettings } from "@/utils/supabase/settings";

export default async function ProjectsListPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/signin");

  const settings = await getSettings();

  const { data: feedbackRequests } = await supabase
    .from("feedback_requests")
    .select("id, title, url, description, stage, categories, status, queue_position, created_at, reviews(id)")
    .eq("user_id", user.id)
    .in("status", ["draft", "open", "in_review"])
    .order("created_at", { ascending: false });

  const activeQueuedCount = (feedbackRequests || []).filter(
    (fr: any) => fr.status === "open" && fr.queue_position != null
  ).length;
  const atLimit = activeQueuedCount >= settings.active_project_limit;

  const getStatusBadge = (status: string) => {
    const color = {
      draft: "bg-dark-text-muted/60",
      open: "bg-green-500",
      in_review: "bg-blue-500",
    }[status] || "bg-dark-text-muted";
    const label = {
      draft: "Draft",
      open: "Live",
      in_review: "In Review",
    }[status] || status;
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-dark-text-muted">
        <span className={`inline-block h-1.5 w-1.5 rounded-full ${color}`} />
        {label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold">My Projects</h1>
          <p className="flex items-center gap-1.5 text-xs text-dark-text-muted">
            <Info className="h-3 w-3" />
            {activeQueuedCount}/{settings.active_project_limit} active project{settings.active_project_limit !== 1 ? "s" : ""} in queue
          </p>
        </div>
        {atLimit ? (
          <Button className="flex items-center gap-2" disabled title={`You can only have ${settings.active_project_limit} active project${settings.active_project_limit !== 1 ? "s" : ""} in the queue at a time`}>
            <PlusCircle className="h-4 w-4" />
            New Project
          </Button>
        ) : (
          <Link href="/dashboard/projects/new">
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              New Project
            </Button>
          </Link>
        )}
      </div>

      {feedbackRequests && feedbackRequests.length > 0 ? (
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
                {feedbackRequests.map((pr: any) => (
                  <tr key={pr.id} className="border-b border-dark-border/50">
                    <td className="px-4 py-4">
                      <Link href={`/dashboard/projects/${pr.id}`} className="font-medium text-primary hover:underline">
                        {pr.title}
                      </Link>
                    </td>
                    <td className="px-4 py-4 text-dark-text-muted whitespace-nowrap">{new Date(pr.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-4 whitespace-nowrap">{getStatusBadge(pr.status)}</td>
                    <td className="px-4 py-4 text-dark-text-muted whitespace-nowrap">{pr.reviews?.length || 0} feedback</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/dashboard/projects/${pr.id}`}>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
                        <Link href={`/dashboard/projects/${pr.id}/edit`}>
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
        <div className="rounded-md border border-dark-border bg-dark-card p-12 text-center">
          <PlusCircle className="h-12 w-12 text-dark-text-muted mx-auto mb-4" />
          <h3 className="text-lg font-medium text-dark-text">No projects yet</h3>
          <p className="mt-2 text-sm text-dark-text-muted max-w-sm mx-auto">
            1 PeerPoint per feedback received, not upfront.
          </p>
          <Link href="/dashboard/projects/new">
            <Button className="mt-4 bg-primary hover:bg-primary-muted">
              <PlusCircle className="h-4 w-4 mr-2" />
              Submit Your First Project
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
