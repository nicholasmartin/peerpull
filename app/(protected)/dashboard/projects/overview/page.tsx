import React from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getSettings } from "@/utils/supabase/settings";
import { PlusCircle, FolderOpen, MessageSquare, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function ProjectsOverviewPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/signin");

  const settings = await getSettings();

  // Total projects
  const { count: totalProjects } = await supabase
    .from("feedback_requests")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  // Active queued count
  const { count: activeQueuedCount } = await supabase
    .from("feedback_requests")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("status", "open")
    .not("queue_position", "is", null);

  // Total feedback received
  const { count: totalFeedback } = await supabase
    .from("reviews")
    .select("*, feedback_requests!inner(user_id)", { count: "exact", head: true })
    .eq("feedback_requests.user_id", user.id)
    .in("status", ["submitted", "approved"]);

  const atLimit = (activeQueuedCount ?? 0) >= settings.active_project_limit;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold">Projects</h1>
          <p className="text-sm text-dark-text-muted">
            Submit your projects to collect video feedback from other builders.
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

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-md border border-dark-border bg-dark-card p-5 text-center">
          <div className="text-2xl font-semibold tabular-nums text-dark-text">{totalProjects || 0}</div>
          <div className="text-xs text-dark-text-muted mt-1">Total Projects</div>
        </div>
        <div className="rounded-md border border-dark-border bg-dark-card p-5 text-center">
          <div className="text-2xl font-semibold tabular-nums text-dark-text">{totalFeedback || 0}</div>
          <div className="text-xs text-dark-text-muted mt-1">Total Feedback Received</div>
        </div>
        <div className="rounded-md border border-dark-border bg-dark-card p-5 text-center">
          <div className="flex items-center justify-center gap-1">
            <span className="text-2xl font-semibold tabular-nums text-dark-text">{activeQueuedCount || 0}</span>
            <span className="text-sm text-dark-text-muted">/ {settings.active_project_limit}</span>
          </div>
          <div className="text-xs text-dark-text-muted mt-1">Active Project Slots</div>
        </div>
      </div>

      {/* How it works */}
      <div className="rounded-md border border-dark-border bg-dark-card p-6">
        <h2 className="text-sm font-medium text-dark-text-muted uppercase tracking-wider mb-4">How Projects Work</h2>
        <ol className="space-y-3">
          {[
            { title: "Submit a project", desc: "Add your project URL and describe what kind of feedback you need." },
            { title: "Enter the queue", desc: "Your project joins the feedback queue. It costs 1 PeerPoint per feedback received, not upfront." },
            { title: "Receive video feedback", desc: "Other builders record screen + voice narrations of their experience with your project." },
            { title: "Review and rate", desc: "Watch the feedback videos, approve or reject them, and rate their quality." },
          ].map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary-subtle text-xs font-bold text-primary">
                {i + 1}
              </span>
              <div>
                <span className="text-sm font-medium text-dark-text">{step.title}</span>
                <p className="text-sm text-dark-text-muted">{step.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Link href="/dashboard/projects/new" className="rounded-md border border-dark-border bg-dark-card p-4 hover:border-dark-text-muted/30 transition-all flex items-center gap-3">
          <PlusCircle className="h-5 w-5 text-primary shrink-0" />
          <div>
            <span className="block text-sm font-semibold text-dark-text">New Project</span>
            <span className="text-xs text-dark-text-muted">Submit a project for feedback</span>
          </div>
        </Link>
        <Link href="/dashboard/projects/list" className="rounded-md border border-dark-border bg-dark-card p-4 hover:border-dark-text-muted/30 transition-all flex items-center gap-3">
          <FolderOpen className="h-5 w-5 text-primary shrink-0" />
          <div>
            <span className="block text-sm font-semibold text-dark-text">My Projects</span>
            <span className="text-xs text-dark-text-muted">View active and draft projects</span>
          </div>
        </Link>
        <Link href="/dashboard/projects/completed" className="rounded-md border border-dark-border bg-dark-card p-4 hover:border-dark-text-muted/30 transition-all flex items-center gap-3">
          <MessageSquare className="h-5 w-5 text-primary shrink-0" />
          <div>
            <span className="block text-sm font-semibold text-dark-text">Completed</span>
            <span className="text-xs text-dark-text-muted">View past projects and feedback</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
