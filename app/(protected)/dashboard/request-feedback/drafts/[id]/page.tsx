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
        <Link href="/dashboard/request-feedback" className="text-dark-text-muted hover:text-dark-text">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-xl font-semibold">Draft PullRequest</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Draft not found</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-dark-text-muted">
            Draft PullRequests are not currently supported. Go to the{" "}
            <Link href="/dashboard/request-feedback" className="text-primary hover:text-primary/80 hover:underline">
              Request Feedback
            </Link>{" "}
            page instead.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
