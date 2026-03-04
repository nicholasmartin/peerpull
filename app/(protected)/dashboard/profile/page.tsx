import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Mail,
  Award
} from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getUserProfile } from "@/utils/supabase/profiles";
import EditProfileForm from "@/components/protected/dashboard/EditProfileForm";
import { ProfileStats } from "@/components/protected/dashboard/ProfileStats";
import { QualityScoreBadge } from "@/components/protected/dashboard/QualityScoreBadge";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/signin");

  const profile = await getUserProfile(user);

  // Builder stats — Step 1: get this user's feedback request IDs
  const { data: myRequests } = await supabase
    .from("feedback_requests")
    .select("id")
    .eq("user_id", user.id);

  const projectsSubmitted = myRequests?.length ?? 0;
  const myRequestIds = myRequests?.map((r: any) => r.id) ?? [];

  // Builder stats — Step 2: get reviews on those feedback requests
  const { data: receivedReviews } = myRequestIds.length > 0
    ? await supabase
        .from("reviews")
        .select("builder_rating, signal_follow, signal_engage, signal_invest, status")
        .in("feedback_request_id", myRequestIds)
    : { data: [] as any[] };

  // Reviewer stats
  const { data: givenReviews } = await supabase
    .from("reviews")
    .select("rating, status, builder_rating")
    .eq("reviewer_id", user.id)
    .in("status", ["submitted", "approved", "rejected"]);

  // Compute aggregations
  const reviewsReceived = receivedReviews?.length ?? 0;
  const ratedReceivedReviews = receivedReviews?.filter((r: any) => r.builder_rating != null) ?? [];
  const avgRatingReceived = ratedReceivedReviews.length > 0
    ? ratedReceivedReviews.reduce((sum: number, r: any) => sum + r.builder_rating, 0) / ratedReceivedReviews.length
    : null;
  const signalsReceived = {
    follow: receivedReviews?.filter((r: any) => r.signal_follow).length ?? 0,
    engage: receivedReviews?.filter((r: any) => r.signal_engage).length ?? 0,
    invest: receivedReviews?.filter((r: any) => r.signal_invest).length ?? 0,
  };

  const reviewsGiven = givenReviews?.length ?? 0;
  const avgRatingGiven = reviewsGiven > 0
    ? givenReviews!.reduce((sum: number, r: any) => sum + (r.rating ?? 0), 0) / reviewsGiven
    : null;
  const approvalRate = reviewsGiven > 0
    ? givenReviews!.filter((r: any) => r.status === "approved").length / reviewsGiven
    : null;

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

                <div className="w-full mt-6 grid grid-cols-3 gap-2">
                  <div className="flex flex-col items-center p-3 rounded-md border border-dark-border">
                    <span className="text-lg font-semibold">{projectsSubmitted}</span>
                    <span className="text-xs text-dark-text-muted">Projects</span>
                  </div>
                  <div className="flex flex-col items-center p-3 rounded-md border border-dark-border">
                    <span className="text-lg font-semibold">{reviewsGiven}</span>
                    <span className="text-xs text-dark-text-muted">Reviews</span>
                  </div>
                  <div className="flex flex-col items-center p-3 rounded-md border border-dark-border">
                    <span className="text-lg font-semibold">{balance}</span>
                    <span className="text-xs text-dark-text-muted">Points</span>
                  </div>
                </div>

                {/* Quality Score */}
                <div className="w-full mt-4 flex justify-center">
                  <QualityScoreBadge score={profile?.quality_score ?? null} />
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
              <ProfileStats
                builderStats={{
                  projectsSubmitted,
                  reviewsReceived,
                  avgRatingReceived,
                  signalsReceived,
                }}
                reviewerStats={{
                  reviewsGiven,
                  qualityScore: profile?.quality_score ?? null,
                  avgRatingGiven,
                  approvalRate,
                }}
              />

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
              <EditProfileForm profile={profile} userEmail={user.email || ""} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
