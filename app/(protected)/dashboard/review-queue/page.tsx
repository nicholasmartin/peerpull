import React from "react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Filter, Clock, CheckCircle2, AlertCircle } from "lucide-react";

export default function ReviewQueuePage() {
  // Mock data for UI mockup
  const availableReviews = [
    {
      id: 1,
      title: "AI-Powered Fitness App",
      type: "Mobile App",
      founder: {
        name: "David Kim",
        avatar: "/avatars/david.jpg",
        company: "FitTech AI"
      },
      dateSubmitted: "2025-04-29",
      reviewsNeeded: 3,
      reviewsCompleted: 1,
      peerPoints: 2,
      categories: ["Mobile App", "AI/ML", "Health"],
      feedbackFocus: ["UI/UX", "Market Fit", "Technical Architecture"]
    },
    {
      id: 2,
      title: "B2B SaaS Analytics Platform",
      type: "Web App",
      founder: {
        name: "Jennifer Lee",
        avatar: "/avatars/jennifer.jpg",
        company: "DataSense"
      },
      dateSubmitted: "2025-04-28",
      reviewsNeeded: 3,
      reviewsCompleted: 0,
      peerPoints: 2,
      categories: ["SaaS", "Analytics", "B2B"],
      feedbackFocus: ["Value Proposition", "Pricing", "Technical Architecture"]
    },
    {
      id: 3,
      title: "Sustainable E-commerce Platform",
      type: "E-commerce",
      founder: {
        name: "Marcus Johnson",
        avatar: "/avatars/marcus.jpg",
        company: "EcoShop"
      },
      dateSubmitted: "2025-04-27",
      reviewsNeeded: 3,
      reviewsCompleted: 2,
      peerPoints: 1,
      categories: ["E-commerce", "Sustainability", "Marketplace"],
      feedbackFocus: ["UI/UX", "Messaging", "Market Fit"]
    }
  ];

  const myAssignedReviews = [
    {
      id: 4,
      title: "Remote Team Collaboration Tool",
      type: "SaaS",
      founder: {
        name: "Sophia Garcia",
        avatar: "/avatars/sophia.jpg",
        company: "TeamSync"
      },
      dateSubmitted: "2025-04-30",
      dueDate: "2025-05-03",
      status: "in_progress",
      categories: ["SaaS", "Productivity", "Remote Work"],
      feedbackFocus: ["UI/UX", "Value Proposition", "Technical Architecture"]
    },
    {
      id: 5,
      title: "Crypto Portfolio Tracker",
      type: "Web App",
      founder: {
        name: "Ryan Taylor",
        avatar: "/avatars/ryan.jpg",
        company: "CryptoTrack"
      },
      dateSubmitted: "2025-04-25",
      dueDate: "2025-04-28",
      status: "overdue",
      categories: ["FinTech", "Crypto", "Web App"],
      feedbackFocus: ["UI/UX", "Technical Architecture", "Market Fit"]
    }
  ];

  const completedReviews = [
    {
      id: 6,
      title: "AI Content Generator",
      type: "SaaS",
      founder: {
        name: "Emma Wilson",
        avatar: "/avatars/emma.jpg",
        company: "ContentAI"
      },
      dateSubmitted: "2025-04-20",
      completedDate: "2025-04-22",
      categories: ["SaaS", "AI/ML", "Content"],
      feedbackFocus: ["Value Proposition", "Technical Architecture", "Pricing"],
      peerPointsEarned: 2
    },
    {
      id: 7,
      title: "Smart Home IoT Platform",
      type: "IoT Platform",
      founder: {
        name: "James Chen",
        avatar: "/avatars/james.jpg",
        company: "HomeIQ"
      },
      dateSubmitted: "2025-04-15",
      completedDate: "2025-04-18",
      categories: ["IoT", "Smart Home", "Hardware"],
      feedbackFocus: ["Technical Architecture", "UI/UX", "Market Fit"],
      peerPointsEarned: 2
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in_progress":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-800">
            In Progress
          </Badge>
        );
      case "overdue":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-800">
            Overdue
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-800">
            Completed
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Review Queue</h1>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filter Reviews
        </Button>
      </div>

      <Tabs defaultValue="available" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="available">Available Reviews</TabsTrigger>
          <TabsTrigger value="assigned">My Assigned Reviews</TabsTrigger>
          <TabsTrigger value="completed">Completed Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {availableReviews.map((review) => (
              <Card key={review.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">
                      <Link href={`/dashboard/review-queue/${review.id}`} className="hover:text-blue-600 hover:underline">
                        {review.title}
                      </Link>
                    </CardTitle>
                    <Badge>{review.type}</Badge>
                  </div>
                  <CardDescription>
                    <div className="flex items-center mt-1">
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarImage src={review.founder.avatar} alt={review.founder.name} />
                        <AvatarFallback>{review.founder.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span>{review.founder.name} • {review.founder.company}</span>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Reviews</span>
                      <span>{review.reviewsCompleted}/{review.reviewsNeeded}</span>
                    </div>
                    <Progress value={(review.reviewsCompleted / review.reviewsNeeded) * 100} className="h-2" />
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-2">
                    {review.categories.map((category, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">{category}</Badge>
                    ))}
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Feedback Focus:</p>
                    <div className="flex flex-wrap gap-1">
                      {review.feedbackFocus.map((focus, index) => (
                        <Badge key={index} variant="outline" className="text-xs">{focus}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-2 flex items-center justify-between border-t border-gray-100 dark:border-gray-800">
                    <div className="text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Submitted: </span>
                      <span>{new Date(review.dateSubmitted).toLocaleDateString()}</span>
                    </div>
                    <div className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      {review.peerPoints} PeerPoints
                    </div>
                  </div>
                  
                  <Button className="w-full bg-[#3366FF] hover:bg-blue-600">
                    Claim Review
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="assigned" className="space-y-6">
          {myAssignedReviews.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {myAssignedReviews.map((review) => (
                <Card key={review.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">
                        <Link href={`/dashboard/review-queue/${review.id}/review`} className="hover:text-blue-600 hover:underline">
                          {review.title}
                        </Link>
                      </CardTitle>
                      {getStatusBadge(review.status)}
                    </div>
                    <CardDescription>
                      <div className="flex items-center mt-1">
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarImage src={review.founder.avatar} alt={review.founder.name} />
                          <AvatarFallback>{review.founder.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{review.founder.name} • {review.founder.company}</span>
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-1 mb-2">
                      <Badge>{review.type}</Badge>
                      {review.categories.map((category, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">{category}</Badge>
                      ))}
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Feedback Focus:</p>
                      <div className="flex flex-wrap gap-1">
                        {review.feedbackFocus.map((focus, index) => (
                          <Badge key={index} variant="outline" className="text-xs">{focus}</Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
                      <div className="flex items-center text-sm">
                        <Clock className="h-4 w-4 mr-1 text-gray-500 dark:text-gray-400" />
                        <span className={`${review.status === 'overdue' ? 'text-red-500 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}>
                          Due: {new Date(review.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Claimed: </span>
                        <span>{new Date(review.dateSubmitted).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button variant="outline" className="flex-1">
                        View Project
                      </Button>
                      <Button className="flex-1 bg-[#3366FF] hover:bg-blue-600">
                        {review.status === 'overdue' ? 'Submit Overdue Review' : 'Continue Review'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CheckCircle2 className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No assigned reviews</h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                You don't have any reviews assigned to you at the moment.
              </p>
              <Button className="mt-4 bg-[#3366FF] hover:bg-blue-600">
                Find Reviews to Claim
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-6">
          {completedReviews.length > 0 ? (
            <div className="rounded-lg bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                      <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Project</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Founder</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Type</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Completed Date</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">PeerPoints</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {completedReviews.map((review) => (
                      <tr key={review.id} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="px-4 py-4">
                          <Link href={`/dashboard/review-queue/${review.id}/review`} className="font-medium text-blue-600 dark:text-blue-400 hover:underline">
                            {review.title}
                          </Link>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center">
                            <Avatar className="h-6 w-6 mr-2">
                              <AvatarImage src={review.founder.avatar} alt={review.founder.name} />
                              <AvatarFallback>{review.founder.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="text-gray-600 dark:text-gray-300">{review.founder.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-gray-600 dark:text-gray-300">{review.type}</td>
                        <td className="px-4 py-4 text-gray-600 dark:text-gray-300">{new Date(review.completedDate).toLocaleDateString()}</td>
                        <td className="px-4 py-4">
                          <span className="font-medium text-blue-600 dark:text-blue-400">+{review.peerPointsEarned}</span>
                        </td>
                        <td className="px-4 py-4">
                          <Button variant="outline" size="sm">
                            View Review
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No completed reviews</h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                You haven't completed any reviews yet.
              </p>
              <Button className="mt-4 bg-[#3366FF] hover:bg-blue-600">
                Find Reviews to Claim
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
