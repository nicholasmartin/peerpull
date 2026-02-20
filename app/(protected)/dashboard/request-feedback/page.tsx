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
    switch (status) {
      case "open":
        return (
          <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            Open
          </span>
        );
      case "in_review":
        return (
          <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
            In Review
          </span>
        );
      case "completed":
        return (
          <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            Completed
          </span>
        );
      case "closed":
        return (
          <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-200">
            Closed
          </span>
        );
      default:
        return null;
    }
  };

  const EmptyState = ({ message }: { message: string }) => (
    <div className="rounded-lg bg-white dark:bg-gray-800 shadow-sm p-12 text-center">
      <p className="text-gray-500 dark:text-gray-400">{message}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Request Feedback</h1>
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
            <div className="rounded-lg bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                      <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Project Name</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Date Submitted</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Status</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Feedback</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activePRs.map((pr: any) => (
                      <tr key={pr.id} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="px-4 py-4">
                          <Link href={`/dashboard/request-feedback/${pr.id}`} className="font-medium text-blue-600 dark:text-blue-400 hover:underline">
                            {pr.title}
                          </Link>
                        </td>
                        <td className="px-4 py-4 text-gray-600 dark:text-gray-300">{new Date(pr.created_at).toLocaleDateString()}</td>
                        <td className="px-4 py-4">{getStatusBadge(pr.status)}</td>
                        <td className="px-4 py-4 text-gray-600 dark:text-gray-300">{pr.reviews?.length || 0} reviews</td>
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
            <EmptyState message="No active PullRequests. Submit one to get video feedback!" />
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedPRs.length > 0 ? (
            <div className="rounded-lg bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                      <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Project Name</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Date Submitted</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Status</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Feedback</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {completedPRs.map((pr: any) => (
                      <tr key={pr.id} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="px-4 py-4">
                          <Link href={`/dashboard/request-feedback/${pr.id}`} className="font-medium text-blue-600 dark:text-blue-400 hover:underline">
                            {pr.title}
                          </Link>
                        </td>
                        <td className="px-4 py-4 text-gray-600 dark:text-gray-300">{new Date(pr.created_at).toLocaleDateString()}</td>
                        <td className="px-4 py-4">{getStatusBadge(pr.status)}</td>
                        <td className="px-4 py-4 text-gray-600 dark:text-gray-300">{pr.reviews?.length || 0} reviews</td>
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
            <EmptyState message="No completed PullRequests yet." />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
