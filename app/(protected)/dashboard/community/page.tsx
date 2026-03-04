import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function CommunityPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Community</h1>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <Users className="mb-4 h-12 w-12 text-dark-text-muted" />
          <h3 className="text-lg font-medium text-dark-text">Community features coming soon</h3>
          <p className="mt-2 text-sm text-dark-text-muted max-w-md">
            Connect with other founders, share feedback, and participate in community events.
            We&apos;re building this next.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
