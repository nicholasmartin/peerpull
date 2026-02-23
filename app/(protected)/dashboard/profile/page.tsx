import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  User,
  Mail,
  Award
} from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getUserProfile } from "@/utils/supabase/profiles";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/signin");

  const profile = await getUserProfile(user);

  const { count: prCount } = await supabase
    .from("pull_requests")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  const { count: reviewCount } = await supabase
    .from("reviews")
    .select("*", { count: "exact", head: true })
    .eq("reviewer_id", user.id);

  const displayName = profile?.full_name || user.email || "User";
  const initials = displayName.charAt(0).toUpperCase();
  const balance = profile?.peer_points_balance || 0;
  const expertise = profile?.expertise || [];

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">My Profile</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profile?.avatar_url || ""} alt={displayName} />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>

                <h2 className="mt-4 text-lg font-semibold">{displayName}</h2>

                {profile?.website && (
                  <a href={profile.website.startsWith("http") ? profile.website : `https://${profile.website}`} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline mt-1">
                    {profile.website}
                  </a>
                )}

                <div className="w-full mt-6 grid grid-cols-2 gap-2">
                  <div className="flex flex-col items-center p-3 rounded-md border border-dark-border">
                    <span className="text-lg font-semibold">{prCount || 0}</span>
                    <span className="text-xs text-dark-text-muted">PullRequests</span>
                  </div>
                  <div className="flex flex-col items-center p-3 rounded-md border border-dark-border">
                    <span className="text-lg font-semibold">{reviewCount || 0}</span>
                    <span className="text-xs text-dark-text-muted">Reviews</span>
                  </div>
                  <div className="flex flex-col items-center p-3 rounded-md border border-dark-border col-span-2">
                    <span className="text-lg font-semibold">{balance}</span>
                    <span className="text-xs text-dark-text-muted">PeerPoints</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Achievements</CardTitle>
              <CardDescription>Badges and milestones you've earned</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-8 text-dark-text-muted">
                <Award className="mb-3 h-10 w-10 text-dark-text-muted" />
                <p className="text-sm">No achievements yet</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="profile">Profile Information</TabsTrigger>
              <TabsTrigger value="activity">Recent Activity</TabsTrigger>
              <TabsTrigger value="edit">Edit Profile</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-dark-text-muted" />
                    <span>{user.email}</span>
                  </div>
                </CardContent>
              </Card>

              {expertise.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Expertise</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {expertise.map((skill: string, index: number) => (
                        <Badge key={index} variant="secondary">{skill}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="activity" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-8 text-dark-text-muted">
                    <User className="mb-3 h-10 w-10 text-dark-text-muted" />
                    <p className="text-sm">No recent activity</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="edit" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Update your profile details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" defaultValue={profile?.full_name || ""} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue={user.email || ""} disabled />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input id="website" defaultValue={profile?.website || ""} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Expertise</CardTitle>
                  <CardDescription>Add your areas of expertise</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {expertise.map((skill: string, index: number) => (
                      <Badge key={index} variant="secondary">{skill}</Badge>
                    ))}
                  </div>

                  <div className="flex space-x-2">
                    <Input placeholder="Add a skill (e.g., React, Growth Marketing)" />
                    <Button variant="outline">Add</Button>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end space-x-2">
                <Button variant="outline">Cancel</Button>
                <Button className="bg-primary hover:bg-primary-muted">Save Changes</Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
