import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, MessageSquare, Edit, Share2, Flag, ThumbsUp, ThumbsDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

type Props = {
  params: { id: string }
}

export default function PullRequestDetailPage({ params }: Props) {
  // Mock data for UI mockup
  const pullRequest = {
    id: params.id,
    title: "SaaS Dashboard",
    type: "Landing Page",
    dateSubmitted: "2025-04-30",
    status: "awaiting_reviews",
    feedbackCount: "1/3",
    description: "A modern SaaS dashboard for managing customer subscriptions, analytics, and user management. The design focuses on clarity and ease of use, with a clean interface and intuitive navigation.",
    projectUrl: "https://example.com/saas-dashboard",
    categories: ["SaaS", "Web App", "Dashboard"],
    feedbackFocus: ["UI/UX", "Value Proposition", "Market Fit"],
    questions: [
      "Is the pricing strategy clear and compelling?",
      "Does the user flow make sense?",
      "What feature should I prioritize next?"
    ],
    screenshots: [
      "/mockup/dashboard1.jpg",
      "/mockup/dashboard2.jpg"
    ]
  };

  const reviews = [
    {
      id: 1,
      reviewer: {
        name: "Alex Johnson",
        avatar: "/avatars/alex.jpg",
        role: "UX Designer",
        company: "DesignCo"
      },
      rating: 4,
      date: "2025-05-01",
      content: "The dashboard layout is clean and intuitive. I particularly like the use of cards to segment different data points. The color scheme is professional and consistent throughout the interface. Navigation is straightforward, which is crucial for a dashboard that will be used frequently.",
      strengths: [
        "Clean, modern UI",
        "Intuitive navigation",
        "Good use of white space"
      ],
      improvements: [
        "Consider adding more data visualization options",
        "The mobile view could be more optimized",
        "Add keyboard shortcuts for power users"
      ],
      helpful: 5
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "awaiting_reviews":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-800">
            Awaiting Reviews
          </Badge>
        );
      case "reviews_in":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-800">
            Reviews In
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-800">
            Completed
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Link href="/dashboard/pull-requests" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{pullRequest.title}</h1>
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <span>{pullRequest.type}</span>
            <span>•</span>
            <span>Submitted {new Date(pullRequest.dateSubmitted).toLocaleDateString()}</span>
            <span>•</span>
            <span>ID: {pullRequest.id}</span>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {getStatusBadge(pullRequest.status)}
          <div className="text-sm">
            <span className="font-medium">Feedback: </span>
            <span>{pullRequest.feedbackCount}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="feedback">Feedback</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Project Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300">{pullRequest.description}</p>
                  
                  {pullRequest.projectUrl && (
                    <div className="mt-4">
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">Project URL</h3>
                      <a 
                        href={pullRequest.projectUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {pullRequest.projectUrl}
                      </a>
                    </div>
                  )}
                  
                  <div className="mt-4">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">Categories</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {pullRequest.categories.map((category, index) => (
                        <Badge key={index} variant="secondary">{category}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">Feedback Focus</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {pullRequest.feedbackFocus.map((focus, index) => (
                        <Badge key={index} variant="outline">{focus}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  {pullRequest.questions.length > 0 && (
                    <div className="mt-4">
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">Specific Questions</h3>
                      <ul className="mt-2 list-disc list-inside text-gray-700 dark:text-gray-300">
                        {pullRequest.questions.map((question, index) => (
                          <li key={index}>{question}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {pullRequest.screenshots.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Screenshots</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {pullRequest.screenshots.map((screenshot, index) => (
                        <div key={index} className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                          <div className="aspect-w-16 aspect-h-9 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              [Screenshot {index + 1}]
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
              
              <Card>
                <CardHeader>
                  <CardTitle>Feedback Progress</CardTitle>
                  <CardDescription>
                    Track the progress of feedback collection
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1 text-sm">
                        <span>Feedback Received</span>
                        <span>1/3</span>
                      </div>
                      <Progress value={33} className="h-2" />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">1</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Completed</div>
                      </div>
                      <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3">
                        <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">2</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Pending</div>
                      </div>
                      <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3">
                        <div className="text-2xl font-bold">3</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Total</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="feedback" className="space-y-6">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <Card key={review.id} className="relative">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <Avatar>
                            <AvatarImage src={review.reviewer.avatar} alt={review.reviewer.name} />
                            <AvatarFallback>{review.reviewer.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-base">{review.reviewer.name}</CardTitle>
                            <CardDescription>
                              {review.reviewer.role} at {review.reviewer.company}
                            </CardDescription>
                            <div className="mt-1 flex items-center">
                              <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                  <svg
                                    key={i}
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                                {new Date(review.date).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon">
                          <Flag className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-gray-700 dark:text-gray-300">{review.content}</p>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                          <h3 className="font-medium text-green-600 dark:text-green-400 mb-2">Strengths</h3>
                          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
                            {review.strengths.map((strength, index) => (
                              <li key={index}>{strength}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h3 className="font-medium text-amber-600 dark:text-amber-400 mb-2">Areas for Improvement</h3>
                          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
                            {review.improvements.map((improvement, index) => (
                              <li key={index}>{improvement}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
                        <div className="flex items-center space-x-4">
                          <Button variant="ghost" size="sm" className="text-gray-500 dark:text-gray-400">
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Reply
                          </Button>
                          <div className="flex items-center space-x-1">
                            <Button variant="ghost" size="sm" className="text-gray-500 dark:text-gray-400">
                              <ThumbsUp className="h-4 w-4" />
                            </Button>
                            <span className="text-sm text-gray-500 dark:text-gray-400">{review.helpful}</span>
                            <Button variant="ghost" size="sm" className="text-gray-500 dark:text-gray-400">
                              <ThumbsDown className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Thank Reviewer
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <MessageSquare className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No feedback yet</h3>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Feedback will appear here once reviewers submit their responses.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="activity" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Activity Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex">
                      <div className="mr-4 flex flex-col items-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                          <MessageSquare className="h-5 w-5" />
                        </div>
                        <div className="h-full w-0.5 bg-gray-200 dark:bg-gray-700"></div>
                      </div>
                      <div className="pb-6">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900 dark:text-gray-100">Alex Johnson submitted feedback</span>
                          <Badge variant="outline" className="text-xs">New</Badge>
                        </div>
                        <time className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date("2025-05-01").toLocaleDateString()} at {new Date("2025-05-01T14:30:00").toLocaleTimeString()}
                        </time>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                          Alex Johnson submitted a review with a rating of 4/5 stars.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="mr-4 flex flex-col items-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400">
                          <Edit className="h-5 w-5" />
                        </div>
                        <div className="h-full w-0.5 bg-gray-200 dark:bg-gray-700"></div>
                      </div>
                      <div className="pb-6">
                        <span className="font-medium text-gray-900 dark:text-gray-100">You updated the project description</span>
                        <time className="block text-xs text-gray-500 dark:text-gray-400">
                          {new Date("2025-04-30").toLocaleDateString()} at {new Date("2025-04-30T10:15:00").toLocaleTimeString()}
                        </time>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="mr-4 flex flex-col items-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400">
                          <Share2 className="h-5 w-5" />
                        </div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900 dark:text-gray-100">You submitted this PullRequest</span>
                        <time className="block text-xs text-gray-500 dark:text-gray-400">
                          {new Date("2025-04-30").toLocaleDateString()} at {new Date("2025-04-30T09:00:00").toLocaleTimeString()}
                        </time>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Feedback Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="mb-2 text-sm font-medium">Reviewers</div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 p-2">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/avatars/alex.jpg" alt="Alex Johnson" />
                          <AvatarFallback>AJ</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm font-medium">Alex Johnson</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">UX Designer</div>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-800">
                        Completed
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 p-2">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/avatars/sarah.jpg" alt="Sarah Miller" />
                          <AvatarFallback>SM</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm font-medium">Sarah Miller</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Product Manager</div>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-yellow-600 dark:text-yellow-400">
                        Pending
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 p-2">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/avatars/michael.jpg" alt="Michael Chen" />
                          <AvatarFallback>MC</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm font-medium">Michael Chen</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Frontend Developer</div>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-yellow-600 dark:text-yellow-400">
                        Pending
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <Button className="w-full" variant="outline">
                  Send Reminder
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button className="w-full" variant="outline">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit PullRequest
                </Button>
                <Button className="w-full" variant="outline">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share with Others
                </Button>
                <Button className="w-full text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600" variant="outline">
                  Cancel PullRequest
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
