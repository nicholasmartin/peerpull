import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  User, 
  Mail, 
  MapPin, 
  Briefcase, 
  Link, 
  Twitter, 
  Linkedin,
  Github,
  Edit,
  Upload,
  Star,
  MessageSquare,
  ThumbsUp,
  Award,
  Zap
} from "lucide-react";

export default function ProfilePage() {
  // Mock data for UI mockup
  const profile = {
    name: "John Smith",
    avatar: "/avatars/john.jpg",
    role: "Founder & CEO",
    company: "TechLaunch",
    location: "Boston, MA",
    email: "john@techlaunch.io",
    bio: "Serial entrepreneur with a passion for building products that solve real problems. Currently working on TechLaunch, a platform that helps startups get off the ground faster.",
    expertise: ["SaaS", "Product Strategy", "UX Design", "Startup Growth"],
    social: {
      twitter: "@johnsmith",
      linkedin: "johnsmith",
      github: "johnsmith",
      website: "techlaunch.io"
    },
    stats: {
      pullRequests: 5,
      reviewsCompleted: 12,
      peerPoints: 18,
      helpfulRating: 4.7
    }
  };
  
  const achievements = [
    {
      id: 1,
      title: "Early Adopter",
      description: "Joined PeerPull in the first month of launch",
      icon: <Zap className="h-6 w-6 text-yellow-500" />,
      date: "2025-01-15"
    },
    {
      id: 2,
      title: "Feedback Pro",
      description: "Completed 10+ reviews with an average rating above 4.5",
      icon: <Star className="h-6 w-6 text-blue-500" />,
      date: "2025-03-20"
    },
    {
      id: 3,
      title: "Helpful Reviewer",
      description: "Received 'Helpful' votes on 5+ reviews",
      icon: <ThumbsUp className="h-6 w-6 text-green-500" />,
      date: "2025-04-05"
    }
  ];
  
  const activities = [
    {
      id: 1,
      type: "review",
      project: "AI Content Generator",
      date: "2025-04-22",
      description: "Completed a review for Emma Wilson's AI Content Generator"
    },
    {
      id: 2,
      type: "pullRequest",
      project: "SaaS Dashboard",
      date: "2025-04-30",
      description: "Submitted a new PullRequest: SaaS Dashboard"
    },
    {
      id: 3,
      type: "achievement",
      achievement: "Helpful Reviewer",
      date: "2025-04-05",
      description: "Earned the Helpful Reviewer achievement"
    },
    {
      id: 4,
      type: "review",
      project: "Smart Home IoT Platform",
      date: "2025-04-18",
      description: "Completed a review for James Chen's Smart Home IoT Platform"
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Profile</h1>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profile.avatar} alt={profile.name} />
                    <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <Button variant="ghost" size="icon" className="absolute bottom-0 right-0 rounded-full bg-white dark:bg-gray-800 shadow-sm h-8 w-8">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
                
                <h2 className="mt-4 text-xl font-bold">{profile.name}</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  {profile.role} at {profile.company}
                </p>
                
                <div className="flex items-center justify-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                  <MapPin className="h-3 w-3 mr-1" />
                  <span>{profile.location}</span>
                </div>
                
                <div className="flex justify-center space-x-2 mt-4">
                  {profile.social.twitter && (
                    <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
                      <Twitter className="h-4 w-4" />
                    </Button>
                  )}
                  {profile.social.linkedin && (
                    <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
                      <Linkedin className="h-4 w-4" />
                    </Button>
                  )}
                  {profile.social.github && (
                    <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
                      <Github className="h-4 w-4" />
                    </Button>
                  )}
                  {profile.social.website && (
                    <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
                      <Link className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <div className="w-full mt-6 grid grid-cols-2 gap-2">
                  <div className="flex flex-col items-center p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                    <span className="text-xl font-bold">{profile.stats.pullRequests}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">PullRequests</span>
                  </div>
                  <div className="flex flex-col items-center p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                    <span className="text-xl font-bold">{profile.stats.reviewsCompleted}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Reviews</span>
                  </div>
                  <div className="flex flex-col items-center p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                    <span className="text-xl font-bold">{profile.stats.peerPoints}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">PeerPoints</span>
                  </div>
                  <div className="flex flex-col items-center p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                      <span className="text-xl font-bold mr-1">{profile.stats.helpfulRating}</span>
                      <Star className="h-4 w-4 text-yellow-400" />
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Rating</span>
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
            <CardContent className="space-y-4">
              {achievements.map((achievement) => (
                <div key={achievement.id} className="flex items-start space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                    {achievement.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">{achievement.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {achievement.description}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      Earned on {new Date(achievement.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
              
              <Button variant="outline" className="w-full">
                <Award className="mr-2 h-4 w-4" />
                View All Achievements
              </Button>
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
                  <CardTitle>About Me</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300">
                    {profile.bio}
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Expertise</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {profile.expertise.map((skill, index) => (
                      <Badge key={index} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    <span>{profile.email}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Briefcase className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    <span>{profile.company}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    <span>{profile.location}</span>
                  </div>
                  
                  {profile.social.website && (
                    <div className="flex items-center space-x-3">
                      <Link className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                      <a href={`https://${profile.social.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                        {profile.social.website}
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="activity" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {activities.map((activity) => (
                      <div key={activity.id} className="flex">
                        <div className="mr-4 flex flex-col items-center">
                          <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                            activity.type === 'review' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400' : 
                            activity.type === 'pullRequest' ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400' :
                            'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400'
                          }`}>
                            {activity.type === 'review' ? <MessageSquare className="h-5 w-5" /> : 
                             activity.type === 'pullRequest' ? <Upload className="h-5 w-5" /> :
                             <Award className="h-5 w-5" />}
                          </div>
                          <div className="h-full w-0.5 bg-gray-200 dark:bg-gray-700"></div>
                        </div>
                        <div className="pb-6">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              {activity.type === 'review' ? `Reviewed ${activity.project}` : 
                               activity.type === 'pullRequest' ? `Submitted ${activity.project}` :
                               `Earned ${activity.achievement}`}
                            </span>
                          </div>
                          <time className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(activity.date).toLocaleDateString()}
                          </time>
                          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                            {activity.description}
                          </p>
                        </div>
                      </div>
                    ))}
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
                    <Input id="name" defaultValue={profile.name} />
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="role">Role/Title</Label>
                      <Input id="role" defaultValue={profile.role} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input id="company" defaultValue={profile.company} />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" defaultValue={profile.location} />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue={profile.email} />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea id="bio" defaultValue={profile.bio} className="min-h-[100px]" />
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
                    {profile.expertise.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {skill}
                        <Button variant="ghost" size="icon" className="h-4 w-4 p-0 ml-1">
                          <span className="sr-only">Remove</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-3 w-3"
                          >
                            <path d="M18 6 6 18" />
                            <path d="m6 6 12 12" />
                          </svg>
                        </Button>
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Input placeholder="Add a skill (e.g., React, Growth Marketing)" />
                    <Button variant="outline">Add</Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Social Links</CardTitle>
                  <CardDescription>Connect your social profiles</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400">
                        https://
                      </span>
                      <Input id="website" defaultValue={profile.social.website} className="rounded-l-none" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="twitter">Twitter</Label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400">
                        @
                      </span>
                      <Input id="twitter" defaultValue={profile.social.twitter?.replace('@', '')} className="rounded-l-none" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400">
                        linkedin.com/in/
                      </span>
                      <Input id="linkedin" defaultValue={profile.social.linkedin} className="rounded-l-none" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="github">GitHub</Label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400">
                        github.com/
                      </span>
                      <Input id="github" defaultValue={profile.social.github} className="rounded-l-none" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline">Cancel</Button>
                <Button className="bg-[#3366FF] hover:bg-blue-600">Save Changes</Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
