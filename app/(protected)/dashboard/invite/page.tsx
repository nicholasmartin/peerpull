import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Mail,
  Share2,
  Gift,
  Users,
  CheckCircle2
} from "lucide-react";

export default function InviteFoundersPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Invite Founders</h1>

      <Card>
        <CardHeader>
          <CardTitle>Invite & Earn PeerPoints</CardTitle>
          <CardDescription>
            Invite other founders to join PeerPull and earn 3 PeerPoints for each successful referral
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
            <div className="flex-1 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
              <h3 className="font-medium">Your Referral Link</h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Referral system coming soon
              </p>
            </div>

            <div className="flex-1 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
              <h3 className="font-medium">Your Referral Code</h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Referral system coming soon
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card className="bg-white dark:bg-gray-800">
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-medium">Invite Founders</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  Share your referral link with other founders
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800">
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-medium">They Join</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  They sign up using your referral link or code
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800">
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-400">
                  <Gift className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-medium">Earn Rewards</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  Get 3 PeerPoints for each successful referral
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="status" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="email">
            <Mail className="mr-2 h-4 w-4" />
            Email Invite
          </TabsTrigger>
          <TabsTrigger value="social">
            <Share2 className="mr-2 h-4 w-4" />
            Social Share
          </TabsTrigger>
          <TabsTrigger value="status">
            <Users className="mr-2 h-4 w-4" />
            Invitation Status
          </TabsTrigger>
        </TabsList>

        <TabsContent value="email">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <Mail className="mb-4 h-12 w-12 text-gray-300 dark:text-gray-600" />
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Email invitations coming soon</h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                You'll be able to send personalized invitations to other founders.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <Share2 className="mb-4 h-12 w-12 text-gray-300 dark:text-gray-600" />
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Social sharing coming soon</h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Share PeerPull on your social networks.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Invitation Status</CardTitle>
              <CardDescription>
                Track the status of your sent invitations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium mb-4">Pending Invitations</h3>
                <div className="rounded-lg border border-gray-200 p-6 text-center dark:border-gray-700">
                  <p className="text-gray-500 dark:text-gray-400">No pending invitations</p>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-4">Successful Referrals</h3>
                <div className="rounded-lg border border-gray-200 p-6 text-center dark:border-gray-700">
                  <p className="text-gray-500 dark:text-gray-400">No successful referrals yet</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Referral Stats</CardTitle>
              <CardDescription>
                Track your referral performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-lg border border-gray-200 p-4 text-center dark:border-gray-700">
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">0</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Pending Invites</div>
                </div>
                <div className="rounded-lg border border-gray-200 p-4 text-center dark:border-gray-700">
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">0</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Successful Invites</div>
                </div>
                <div className="rounded-lg border border-gray-200 p-4 text-center dark:border-gray-700">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">0</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">PeerPoints Earned</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
