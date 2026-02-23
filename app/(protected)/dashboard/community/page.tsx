import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  Calendar,
  MessageSquare
} from "lucide-react";

export default function CommunityPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Community</h1>
      </div>

      <Tabs defaultValue="founders" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="founders">
            <Users className="mr-2 h-4 w-4" />
            Founders
          </TabsTrigger>
          <TabsTrigger value="events">
            <Calendar className="mr-2 h-4 w-4" />
            Events
          </TabsTrigger>
          <TabsTrigger value="discussions">
            <MessageSquare className="mr-2 h-4 w-4" />
            Discussions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="founders">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <Users className="mb-4 h-12 w-12 text-dark-text-muted" />
              <h3 className="text-lg font-medium text-dark-text">Community features coming soon</h3>
              <p className="mt-2 text-sm text-dark-text-muted">
                Connect with other founders and share feedback.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <Calendar className="mb-4 h-12 w-12 text-dark-text-muted" />
              <h3 className="text-lg font-medium text-dark-text">No upcoming events</h3>
              <p className="mt-2 text-sm text-dark-text-muted">
                Community events will appear here once available.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="discussions">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <MessageSquare className="mb-4 h-12 w-12 text-dark-text-muted" />
              <h3 className="text-lg font-medium text-dark-text">No discussions yet</h3>
              <p className="mt-2 text-sm text-dark-text-muted">
                Discussion forums are coming soon.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
