import React from "react";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function ProjectsCompletedPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/signin");

  const { data: completedRequests } = await supabase
    .from("feedback_requests")
    .select("id, title, url, description, stage, categories, status, queue_position, created_at, reviews(id)")
    .eq("user_id", user.id)
    .in("status", ["completed", "closed"])
    .order("created_at", { ascending: false });

  const getStatusBadge = (status: string) => {
    const color = status === "completed" ? "bg-primary" : "bg-dark-text-muted";
    const label = status === "completed" ? "Completed" : "Closed";
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-dark-text-muted">
        <span className={`inline-block h-1.5 w-1.5 rounded-full ${color}`} />
        {label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold">Completed Projects</h1>
        <p className="text-sm text-dark-text-muted">
          Projects that have finished receiving feedback.
        </p>
      </div>

      {completedRequests && completedRequests.length > 0 ? (
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
                {completedRequests.map((pr: any) => (
                  <tr key={pr.id} className="border-b border-dark-border/50">
                    <td className="px-4 py-4">
                      <Link href={`/dashboard/projects/${pr.id}`} className="font-medium text-primary hover:underline">
                        {pr.title}
                      </Link>
                    </td>
                    <td className="px-4 py-4 text-dark-text-muted whitespace-nowrap">{new Date(pr.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-4 whitespace-nowrap">{getStatusBadge(pr.status)}</td>
                    <td className="px-4 py-4 text-dark-text-muted whitespace-nowrap">{pr.reviews?.length || 0} feedback</td>
                    <td className="px-4 py-4 text-right">
                      <Link href={`/dashboard/projects/${pr.id}`}>
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
        <div className="rounded-md border border-dark-border bg-dark-card p-12 text-center">
          <PlusCircle className="h-12 w-12 text-dark-text-muted mx-auto mb-4" />
          <h3 className="text-lg font-medium text-dark-text">No completed projects yet</h3>
          <p className="mt-2 text-sm text-dark-text-muted max-w-sm mx-auto">
            Once your projects have received feedback, they&apos;ll appear here.
          </p>
        </div>
      )}
    </div>
  );
}
