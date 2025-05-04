import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Copy, 
  Mail, 
  Share2, 
  Gift, 
  Users, 
  CheckCircle2, 
  Twitter, 
  Linkedin, 
  Facebook,
  MessageSquare
} from "lucide-react";

export default function InviteFoundersPage() {
  // Mock data for UI mockup
  const referralLink = "https://peerpull.com/join?ref=johnsmith";
  const referralCode = "JOHNSMITH";
  
  const pendingInvites = [
    {
      id: 1,
      email: "alex@example.com",
      date: "2025-05-01",
      status: "pending"
    },
    {
      id: 2,
      email: "sarah@example.com",
      date: "2025-04-28",
      status: "pending"
    }
  ];
  
  const successfulInvites = [
    {
      id: 3,
      name: "Michael Chen",
      avatar: "/avatars/michael.jpg",
      email: "michael@example.com",
      date: "2025-04-15",
      joinedDate: "2025-04-16",
      peerPointsEarned: 3
    },
    {
      id: 4,
      name: "Emma Wilson",
      avatar: "/avatars/emma.jpg",
      email: "emma@example.com",
      date: "2025-03-20",
      joinedDate: "2025-03-22",
      peerPointsEarned: 3
    }
  ];

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
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Your Referral Link</h3>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Copy className="h-4 w-4" />
                  <span className="sr-only">Copy</span>
                </Button>
              </div>
              <p className="mt-2 break-all text-sm text-gray-600 dark:text-gray-300">
                {referralLink}
              </p>
            </div>
            
            <div className="flex-1 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Your Referral Code</h3>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Copy className="h-4 w-4" />
                  <span className="sr-only">Copy</span>
                </Button>
              </div>
              <p className="mt-2 text-center text-xl font-bold text-gray-800 dark:text-gray-200">
                {referralCode}
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
      
      <Tabs defaultValue="email" className="w-full">
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
        
        <TabsContent value="email" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Invite via Email</CardTitle>
              <CardDescription>
                Send personalized invitations to other founders
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email-addresses" className="text-sm font-medium">
                  Email Addresses
                </label>
                <Input
                  id="email-addresses"
                  placeholder="Enter email addresses separated by commas"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  You can invite up to 10 people at once
                </p>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="invite-message" className="text-sm font-medium">
                  Personal Message (Optional)
                </label>
                <Textarea
                  id="invite-message"
                  placeholder="Add a personal note to your invitation"
                  className="min-h-[100px]"
                  defaultValue="Hey! I've been using PeerPull to get feedback on my startup projects, and I think you'd find it valuable too. It's a platform where founders can exchange feedback on their projects. Join using my referral link!"
                />
              </div>
              
              <Button className="bg-[#3366FF] hover:bg-blue-600">
                <Mail className="mr-2 h-4 w-4" />
                Send Invitations
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="social" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Share on Social Media</CardTitle>
              <CardDescription>
                Spread the word about PeerPull on your social networks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                <h3 className="font-medium mb-2">Share Message</h3>
                <Textarea
                  className="min-h-[100px]"
                  defaultValue="I've been using @PeerPull to get valuable feedback on my startup projects from other founders. If you're building something, check it out and use my referral code: JOHNSMITH"
                />
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button className="bg-[#1DA1F2] hover:bg-blue-500">
                    <Twitter className="mr-2 h-4 w-4" />
                    Share on Twitter
                  </Button>
                  <Button className="bg-[#0077B5] hover:bg-blue-700">
                    <Linkedin className="mr-2 h-4 w-4" />
                    Share on LinkedIn
                  </Button>
                  <Button className="bg-[#1877F2] hover:bg-blue-600">
                    <Facebook className="mr-2 h-4 w-4" />
                    Share on Facebook
                  </Button>
                </div>
              </div>
              
              <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                <h3 className="font-medium mb-2">Or Copy and Share Manually</h3>
                <div className="flex">
                  <Input
                    readOnly
                    value="I've been using @PeerPull to get valuable feedback on my startup projects from other founders. If you're building something, check it out and use my referral code: JOHNSMITH https://peerpull.com/join?ref=johnsmith"
                  />
                  <Button variant="outline" className="ml-2">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
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
                {pendingInvites.length > 0 ? (
                  <div className="rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                            <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Email</th>
                            <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Date Sent</th>
                            <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Status</th>
                            <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pendingInvites.map((invite) => (
                            <tr key={invite.id} className="border-b border-gray-100 dark:border-gray-800">
                              <td className="px-4 py-4 text-gray-600 dark:text-gray-300">{invite.email}</td>
                              <td className="px-4 py-4 text-gray-600 dark:text-gray-300">{new Date(invite.date).toLocaleDateString()}</td>
                              <td className="px-4 py-4">
                                <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-800">
                                  Pending
                                </Badge>
                              </td>
                              <td className="px-4 py-4">
                                <Button variant="outline" size="sm">
                                  Resend
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg border border-gray-200 p-6 text-center dark:border-gray-700">
                    <p className="text-gray-500 dark:text-gray-400">No pending invitations</p>
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="font-medium mb-4">Successful Invitations</h3>
                {successfulInvites.length > 0 ? (
                  <div className="rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                            <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Founder</th>
                            <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Date Invited</th>
                            <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Date Joined</th>
                            <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">PeerPoints Earned</th>
                            <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {successfulInvites.map((invite) => (
                            <tr key={invite.id} className="border-b border-gray-100 dark:border-gray-800">
                              <td className="px-4 py-4">
                                <div className="flex items-center">
                                  <Avatar className="h-8 w-8 mr-2">
                                    <AvatarImage src={invite.avatar} alt={invite.name} />
                                    <AvatarFallback>{invite.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium">{invite.name}</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">{invite.email}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-4 text-gray-600 dark:text-gray-300">{new Date(invite.date).toLocaleDateString()}</td>
                              <td className="px-4 py-4 text-gray-600 dark:text-gray-300">{new Date(invite.joinedDate).toLocaleDateString()}</td>
                              <td className="px-4 py-4">
                                <span className="font-medium text-green-600 dark:text-green-400">+{invite.peerPointsEarned}</span>
                              </td>
                              <td className="px-4 py-4">
                                <Button variant="outline" size="sm">
                                  <MessageSquare className="mr-2 h-4 w-4" />
                                  Message
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg border border-gray-200 p-6 text-center dark:border-gray-700">
                    <p className="text-gray-500 dark:text-gray-400">No successful invitations yet</p>
                  </div>
                )}
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
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">2</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Pending Invites</div>
                </div>
                <div className="rounded-lg border border-gray-200 p-4 text-center dark:border-gray-700">
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">2</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Successful Invites</div>
                </div>
                <div className="rounded-lg border border-gray-200 p-4 text-center dark:border-gray-700">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">6</div>
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
