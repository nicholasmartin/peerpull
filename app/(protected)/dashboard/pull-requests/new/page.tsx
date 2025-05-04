import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Upload, Eye } from "lucide-react";

export default function NewPullRequestPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Link href="/dashboard/pull-requests" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold">Submit New PullRequest</h1>
      </div>

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
              <Input id="project-name" placeholder="E.g., SaaS Dashboard, Mobile App" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="project-url">Project URL (if applicable)</Label>
              <Input id="project-url" placeholder="https://your-project-url.com" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="project-stage">Project Stage</Label>
            <Select>
              <SelectTrigger id="project-stage">
                <SelectValue placeholder="Select stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="idea">Idea</SelectItem>
                <SelectItem value="landing-page">Landing Page</SelectItem>
                <SelectItem value="prototype">Prototype</SelectItem>
                <SelectItem value="mvp">MVP</SelectItem>
                <SelectItem value="launched">Launched</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="project-description">Brief Description</Label>
            <Textarea 
              id="project-description" 
              placeholder="Describe your project in a few sentences" 
              className="min-h-[100px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Project Categories</Label>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
              <div className="flex items-center space-x-2">
                <Checkbox id="category-saas" />
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
                <Checkbox id="category-marketplace" />
                <Label htmlFor="category-marketplace" className="font-normal">Marketplace</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="category-other" />
                <Label htmlFor="category-other" className="font-normal">Other</Label>
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
                <Checkbox id="focus-technical-architecture" />
                <Label htmlFor="focus-technical-architecture" className="font-normal">Technical Architecture</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="focus-ui-ux" />
                <Label htmlFor="focus-ui-ux" className="font-normal">UI/UX</Label>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox id="focus-market-fit" />
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
              <Input placeholder="Question 1: E.g., Is my pricing strategy clear and compelling?" />
              <Input placeholder="Question 2: E.g., Does the user flow make sense?" />
              <Input placeholder="Question 3: E.g., What feature should I prioritize next?" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Screenshots or Documents</Label>
            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-300 px-6 py-10">
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
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline">
          <Eye className="mr-2 h-4 w-4" />
          Preview
        </Button>
        <div className="space-x-2">
          <Button variant="outline">Save as Draft</Button>
          <Button className="bg-[#3366FF] hover:bg-blue-600">
            Submit PullRequest (1 PeerPoint)
          </Button>
        </div>
      </div>
    </div>
  );
}
