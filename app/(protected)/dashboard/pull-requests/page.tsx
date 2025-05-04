import React from "react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function PullRequestsPage() {
  // Mock data for UI mockup
  const activePullRequests = [
    {
      id: 1,
      title: "SaaS Dashboard",
      type: "Landing Page",
      dateSubmitted: "2025-04-30",
      status: "awaiting_reviews",
      feedbackCount: "0/3",
    },
    {
      id: 2,
      title: "Mobile App Concept",
      type: "Concept",
      dateSubmitted: "2025-04-25",
      status: "reviews_in",
      feedbackCount: "2/3",
    },
    {
      id: 3,
      title: "E-commerce Platform",
      type: "Prototype",
      dateSubmitted: "2025-04-22",
      status: "awaiting_reviews",
      feedbackCount: "1/3",
    },
  ];

  const completedPullRequests = [
    {
      id: 4,
      title: "AI Assistant Interface",
      type: "UI Design",
      dateSubmitted: "2025-03-15",
      status: "completed",
      feedbackCount: "3/3",
      averageRating: 4.2,
    },
    {
      id: 5,
      title: "Subscription Pricing Model",
      type: "Business Model",
      dateSubmitted: "2025-03-01",
      status: "completed",
      feedbackCount: "3/3",
      averageRating: 4.7,
    },
  ];

  const draftPullRequests = [
    {
      id: 6,
      title: "Social Network Feature",
      type: "Feature",
      lastEdited: "2025-04-28",
    },
    {
      id: 7,
      title: "Mobile App Onboarding",
      type: "UX Flow",
      lastEdited: "2025-04-20",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "awaiting_reviews":
        return (
          <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            Awaiting Reviews
          </span>
        );
      case "reviews_in":
        return (
          <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
            Reviews In
          </span>
        );
      case "completed":
        return (
          <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            Completed
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My PullRequests</h1>
        <Link href="/dashboard/pull-requests/new">
          <Button className="bg-[#3366FF] hover:bg-blue-600">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New PullRequest
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="active">Active PullRequests</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="drafts">Drafts</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <div className="rounded-lg bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                    <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Project Name</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Type</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Date Submitted</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Status</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Feedback</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {activePullRequests.map((pullRequest) => (
                    <tr key={pullRequest.id} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="px-4 py-4">
                        <Link href={`/dashboard/pull-requests/${pullRequest.id}`} className="font-medium text-blue-600 dark:text-blue-400 hover:underline">
                          {pullRequest.title}
                        </Link>
                      </td>
                      <td className="px-4 py-4 text-gray-600 dark:text-gray-300">{pullRequest.type}</td>
                      <td className="px-4 py-4 text-gray-600 dark:text-gray-300">{new Date(pullRequest.dateSubmitted).toLocaleDateString()}</td>
                      <td className="px-4 py-4">{getStatusBadge(pullRequest.status)}</td>
                      <td className="px-4 py-4 text-gray-600 dark:text-gray-300">{pullRequest.feedbackCount}</td>
                      <td className="px-4 py-4">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <div className="rounded-lg bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                    <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Project Name</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Type</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Date Submitted</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Feedback</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Rating</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {completedPullRequests.map((pullRequest) => (
                    <tr key={pullRequest.id} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="px-4 py-4">
                        <Link href={`/dashboard/pull-requests/${pullRequest.id}`} className="font-medium text-blue-600 dark:text-blue-400 hover:underline">
                          {pullRequest.title}
                        </Link>
                      </td>
                      <td className="px-4 py-4 text-gray-600 dark:text-gray-300">{pullRequest.type}</td>
                      <td className="px-4 py-4 text-gray-600 dark:text-gray-300">{new Date(pullRequest.dateSubmitted).toLocaleDateString()}</td>
                      <td className="px-4 py-4 text-gray-600 dark:text-gray-300">{pullRequest.feedbackCount}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                xmlns="http://www.w3.org/2000/svg"
                                className={`h-4 w-4 ${i < Math.floor(pullRequest.averageRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="ml-2 text-gray-600 dark:text-gray-300">{pullRequest.averageRating}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            View Feedback
                          </Button>
                          <Button variant="outline" size="sm">
                            Re-activate
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="drafts" className="space-y-4">
          <div className="rounded-lg bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                    <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Project Name</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Type</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Last Edited</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {draftPullRequests.map((pullRequest) => (
                    <tr key={pullRequest.id} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="px-4 py-4">
                        <Link href={`/dashboard/pull-requests/drafts/${pullRequest.id}`} className="font-medium text-blue-600 dark:text-blue-400 hover:underline">
                          {pullRequest.title}
                        </Link>
                      </td>
                      <td className="px-4 py-4 text-gray-600 dark:text-gray-300">{pullRequest.type}</td>
                      <td className="px-4 py-4 text-gray-600 dark:text-gray-300">{new Date(pullRequest.lastEdited).toLocaleDateString()}</td>
                      <td className="px-4 py-4">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                          <Button variant="outline" size="sm">
                            Submit
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600">
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
