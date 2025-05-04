import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  MessageSquare, 
  Users, 
  Calendar, 
  Filter, 
  MapPin, 
  Briefcase, 
  Link, 
  Twitter, 
  Linkedin,
  ThumbsUp
} from "lucide-react";

export default function CommunityPage() {
  // Mock data for UI mockup
  const founders = [
    {
      id: 1,
      name: "Alex Johnson",
      avatar: "/avatars/alex.jpg",
      role: "UX Designer",
      company: "DesignCo",
      location: "San Francisco, CA",
      expertise: ["UI/UX", "Product Design", "User Research"],
      bio: "Experienced UX designer with a passion for creating intuitive interfaces. Previously at Google and Airbnb.",
      social: {
        twitter: "@alexjohnson",
        linkedin: "alexjohnson",
        website: "alexjohnson.design"
      },
      reviewCount: 12,
      helpfulRating: 4.8
    },
    {
      id: 2,
      name: "Sarah Miller",
      avatar: "/avatars/sarah.jpg",
      role: "Product Manager",
      company: "TechStart",
      location: "New York, NY",
      expertise: ["Product Strategy", "Market Research", "Growth"],
      bio: "Product manager with 8+ years of experience in B2B SaaS. Launched 3 successful products with over 100k users.",
      social: {
        twitter: "@sarahmiller",
        linkedin: "sarahmiller",
        website: "sarahmiller.io"
      },
      reviewCount: 8,
      helpfulRating: 4.6
    },
    {
      id: 3,
      name: "Michael Chen",
      avatar: "/avatars/michael.jpg",
      role: "Frontend Developer",
      company: "CodeWorks",
      location: "Austin, TX",
      expertise: ["React", "TypeScript", "UI Development"],
      bio: "Frontend developer specializing in React and TypeScript. Building performant and accessible web applications.",
      social: {
        twitter: "@michaelchen",
        linkedin: "michaelchen",
        website: "michaelchen.dev"
      },
      reviewCount: 15,
      helpfulRating: 4.9
    },
    {
      id: 4,
      name: "Emma Wilson",
      avatar: "/avatars/emma.jpg",
      role: "Founder & CEO",
      company: "ContentAI",
      location: "Seattle, WA",
      expertise: ["AI/ML", "Content Strategy", "Startups"],
      bio: "Founder of ContentAI, an AI-powered content generation platform. Previously ML engineer at Amazon.",
      social: {
        twitter: "@emmawilson",
        linkedin: "emmawilson",
        website: "contentai.com"
      },
      reviewCount: 6,
      helpfulRating: 4.7
    }
  ];
  
  const events = [
    {
      id: 1,
      title: "Founder Feedback Friday",
      description: "Weekly virtual meetup for founders to share progress and get feedback from peers.",
      date: "2025-05-02T17:00:00",
      type: "Virtual",
      attendees: 24,
      tags: ["Feedback", "Networking"]
    },
    {
      id: 2,
      title: "Product-Market Fit Workshop",
      description: "Interactive workshop on finding and validating product-market fit for early-stage startups.",
      date: "2025-05-10T14:00:00",
      type: "Virtual",
      attendees: 42,
      tags: ["Workshop", "Product Strategy"]
    },
    {
      id: 3,
      title: "PeerPull SF Meetup",
      description: "In-person networking event for Bay Area founders. Food and drinks provided.",
      date: "2025-05-15T18:30:00",
      type: "In-Person",
      location: "San Francisco, CA",
      attendees: 35,
      tags: ["Networking", "In-Person"]
    },
    {
      id: 4,
      title: "Tech Stack Show & Tell",
      description: "Founders share their tech stack decisions and lessons learned.",
      date: "2025-05-20T16:00:00",
      type: "Virtual",
      attendees: 18,
      tags: ["Technical", "Knowledge Sharing"]
    }
  ];
  
  const discussions = [
    {
      id: 1,
      title: "Best practices for SaaS pricing?",
      author: {
        name: "David Kim",
        avatar: "/avatars/david.jpg"
      },
      date: "2025-04-30T09:15:00",
      replies: 12,
      likes: 8,
      tags: ["Pricing", "SaaS", "Revenue"]
    },
    {
      id: 2,
      title: "How to approach user onboarding for a complex product?",
      author: {
        name: "Jennifer Lee",
        avatar: "/avatars/jennifer.jpg"
      },
      date: "2025-04-29T14:22:00",
      replies: 9,
      likes: 15,
      tags: ["UX", "Onboarding", "User Retention"]
    },
    {
      id: 3,
      title: "Technical co-founder or outsource development?",
      author: {
        name: "Marcus Johnson",
        avatar: "/avatars/marcus.jpg"
      },
      date: "2025-04-28T11:05:00",
      replies: 21,
      likes: 18,
      tags: ["Co-founders", "Development", "Team Building"]
    },
    {
      id: 4,
      title: "Experiences with different analytics tools?",
      author: {
        name: "Sophia Garcia",
        avatar: "/avatars/sophia.jpg"
      },
      date: "2025-04-27T16:40:00",
      replies: 14,
      likes: 7,
      tags: ["Analytics", "Tools", "Data"]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Community</h1>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Input
              type="search"
              placeholder="Search community..."
              className="pl-8 w-[250px]"
            />
          </div>
        </div>
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

        <TabsContent value="founders" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Connect with Founders</h2>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {founders.map((founder) => (
              <Card key={founder.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={founder.avatar} alt={founder.name} />
                      <AvatarFallback>{founder.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{founder.name}</CardTitle>
                      <CardDescription>
                        {founder.role} at {founder.company}
                      </CardDescription>
                      <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>{founder.location}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-1">
                    {founder.expertise.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">{skill}</Badge>
                    ))}
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {founder.bio}
                  </p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      <span>{founder.reviewCount} reviews</span>
                    </div>
                    <div className="flex items-center">
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      <span>{founder.helpfulRating}/5</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex space-x-2">
                      {founder.social.twitter && (
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Twitter className="h-4 w-4 text-gray-500 hover:text-blue-400" />
                        </Button>
                      )}
                      {founder.social.linkedin && (
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Linkedin className="h-4 w-4 text-gray-500 hover:text-blue-600" />
                        </Button>
                      )}
                      {founder.social.website && (
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Link className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                        </Button>
                      )}
                    </div>
                    <Button size="sm" className="bg-[#3366FF] hover:bg-blue-600">
                      Connect
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="flex justify-center">
            <Button variant="outline">
              View More Founders
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Upcoming Events</h2>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button className="bg-[#3366FF] hover:bg-blue-600" size="sm">
                Suggest Event
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {events.map((event) => (
              <Card key={event.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                      <CardDescription>
                        {new Date(event.date).toLocaleDateString()} at {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </CardDescription>
                    </div>
                    <Badge variant={event.type === "Virtual" ? "outline" : "secondary"}>
                      {event.type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {event.description}
                  </p>
                  
                  {event.location && (
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{event.location}</span>
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-1">
                    {event.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-gray-800">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      <Users className="inline h-4 w-4 mr-1" />
                      <span>{event.attendees} attending</span>
                    </div>
                    <Button size="sm" className="bg-[#3366FF] hover:bg-blue-600">
                      RSVP
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="flex justify-center">
            <Button variant="outline">
              View All Events
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="discussions" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Recent Discussions</h2>
            <Button className="bg-[#3366FF] hover:bg-blue-600" size="sm">
              Start Discussion
            </Button>
          </div>
          
          <div className="space-y-4">
            {discussions.map((discussion) => (
              <Card key={discussion.id} className="overflow-hidden">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={discussion.author.avatar} alt={discussion.author.name} />
                        <AvatarFallback>{discussion.author.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium text-lg text-gray-900 dark:text-gray-100">
                          {discussion.title}
                        </h3>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-medium text-gray-700 dark:text-gray-300">{discussion.author.name}</span>
                          <span className="mx-2">•</span>
                          <span>{new Date(discussion.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {discussion.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">{tag}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4 pt-2 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        <span>{discussion.replies} replies</span>
                      </div>
                      <div className="flex items-center">
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        <span>{discussion.likes} likes</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View Discussion
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="flex justify-center">
            <Button variant="outline">
              View All Discussions
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
