import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Upload, Eye, Save, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Props = {
  params: { id: string }
}

export default function DraftPullRequestPage({ params }: Props) {
  // Mock data for UI mockup
  const draftPullRequest = {
    id: params.id,
    title: "Social Network Feature",
    type: "Feature",
    lastEdited: "2025-04-28",
    description: "A new social networking feature that allows users to connect with other founders in their industry. This will include a profile matching algorithm, direct messaging, and activity feed.",
    projectUrl: "https://example.com/social-feature",
    categories: ["SaaS", "Social Network", "Community"],
    feedbackFocus: ["UI/UX", "Technical Architecture", "Market Fit"],
    questions: [
      "Is this feature aligned with our core value proposition?",
      "How should we prioritize this against other planned features?",
      "What potential scaling issues should we consider?"
    ],
    screenshots: [
      "/mockup/social1.jpg",
      "/mockup/social2.jpg"
    ]
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="/dashboard/pull-requests" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold">Edit Draft PullRequest</h1>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700">
            Draft
          </Badge>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Last edited: {new Date(draftPullRequest.lastEdited).toLocaleDateString()}
          </div>
        </div>
      </div>

      <Tabs defaultValue="edit" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="edit">Edit Draft</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="edit" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Basics</CardTitle>
              <CardDescription>
                Provide the basic information about your project
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="project-name">Project Name</Label>
                  <Input id="project-name" defaultValue={draftPullRequest.title} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="project-url">Project URL (if applicable)</Label>
                  <Input id="project-url" defaultValue={draftPullRequest.projectUrl} />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="project-stage">Project Stage</Label>
                <Select defaultValue="feature">
                  <SelectTrigger id="project-stage">
                    <SelectValue placeholder="Select stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="idea">Idea</SelectItem>
                    <SelectItem value="landing-page">Landing Page</SelectItem>
                    <SelectItem value="prototype">Prototype</SelectItem>
                    <SelectItem value="feature">Feature</SelectItem>
                    <SelectItem value="mvp">MVP</SelectItem>
                    <SelectItem value="launched">Launched</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="project-description">Brief Description</Label>
                <Textarea 
                  id="project-description" 
                  defaultValue={draftPullRequest.description}
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Project Categories</Label>
                <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="category-saas" defaultChecked={draftPullRequest.categories.includes("SaaS")} />
                    <Label htmlFor="category-saas" className="font-normal">SaaS</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="category-mobile" />
                    <Label htmlFor="category-mobile" className="font-normal">Mobile App</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="category-ecommerce" />
                    <Label htmlFor="category-ecommerce" className="font-normal">E-commerce</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="category-ai" />
                    <Label htmlFor="category-ai" className="font-normal">AI/ML</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="category-social" defaultChecked={draftPullRequest.categories.includes("Social Network")} />
                    <Label htmlFor="category-social" className="font-normal">Social Network</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="category-community" defaultChecked={draftPullRequest.categories.includes("Community")} />
                    <Label htmlFor="category-community" className="font-normal">Community</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Feedback Focus</CardTitle>
              <CardDescription>
                Select areas where you'd like reviewers to focus their feedback
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="focus-value-proposition" />
                    <Label htmlFor="focus-value-proposition" className="font-normal">Value Proposition</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="focus-technical-architecture" defaultChecked={draftPullRequest.feedbackFocus.includes("Technical Architecture")} />
                    <Label htmlFor="focus-technical-architecture" className="font-normal">Technical Architecture</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="focus-ui-ux" defaultChecked={draftPullRequest.feedbackFocus.includes("UI/UX")} />
                    <Label htmlFor="focus-ui-ux" className="font-normal">UI/UX</Label>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="focus-market-fit" defaultChecked={draftPullRequest.feedbackFocus.includes("Market Fit")} />
                    <Label htmlFor="focus-market-fit" className="font-normal">Market Fit</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="focus-pricing" />
                    <Label htmlFor="focus-pricing" className="font-normal">Pricing</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="focus-messaging" />
                    <Label htmlFor="focus-messaging" className="font-normal">Messaging</Label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="custom-focus">Custom Focus Area</Label>
                <Input id="custom-focus" placeholder="E.g., Onboarding flow, Feature prioritization" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Additional Context</CardTitle>
              <CardDescription>
                Provide additional information to help reviewers understand your project
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="context">Context for Reviewers</Label>
                <Textarea 
                  id="context" 
                  placeholder="Provide any additional context that will help reviewers understand your project better" 
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Specific Questions (Up to 3)</Label>
                <div className="space-y-2">
                  <Input defaultValue={draftPullRequest.questions[0]} />
                  <Input defaultValue={draftPullRequest.questions[1]} />
                  <Input defaultValue={draftPullRequest.questions[2]} />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Screenshots or Documents</Label>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {draftPullRequest.screenshots.map((screenshot, index) => (
                    <div key={index} className="relative rounded-lg border border-gray-200 dark:border-gray-700 p-2">
                      <div className="aspect-w-16 aspect-h-9 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          [Screenshot {index + 1}]
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="absolute top-2 right-2 text-red-500 hover:text-red-700 hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex justify-center rounded-lg border border-dashed border-gray-300 px-6 py-10">
                    <div className="text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-4 flex text-sm leading-6 text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500"
                        >
                          <span>Upload files</span>
                          <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs leading-5 text-gray-600">PNG, JPG, PDF up to 10MB</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Draft
            </Button>
            <div className="space-x-2">
              <Button variant="outline">
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
              <Button className="bg-[#3366FF] hover:bg-blue-600">
                Submit PullRequest (1 PeerPoint)
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>
                This is how your PullRequest will appear to reviewers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-6">
                <div>
                  <h2 className="text-xl font-bold">{draftPullRequest.title}</h2>
                  <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                    <span>{draftPullRequest.type}</span>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Project Description</h3>
                  <p className="text-gray-700 dark:text-gray-300">{draftPullRequest.description}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {draftPullRequest.categories.map((category, index) => (
                      <Badge key={index} variant="secondary">{category}</Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Feedback Focus</h3>
                  <div className="flex flex-wrap gap-2">
                    {draftPullRequest.feedbackFocus.map((focus, index) => (
                      <Badge key={index} variant="outline">{focus}</Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Specific Questions</h3>
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                    {draftPullRequest.questions.map((question, index) => (
                      <li key={index}>{question}</li>
                    ))}
                  </ul>
                </div>
                
                {draftPullRequest.screenshots.length > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Screenshots</h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {draftPullRequest.screenshots.map((screenshot, index) => (
                        <div key={index} className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                          <div className="aspect-w-16 aspect-h-9 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              [Screenshot {index + 1}]
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
