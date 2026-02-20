import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

type Props = {
  params: { id: string }
}

export default function DraftPullRequestPage({ params }: Props) {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Link href="/dashboard/request-feedback" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold">Draft PullRequest</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Draft not found</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 dark:text-gray-400">
            Draft PullRequests are not currently supported. Go to the{" "}
            <Link href="/dashboard/request-feedback" className="text-blue-600 dark:text-blue-400 hover:underline">
              Request Feedback
            </Link>{" "}
            page instead.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
