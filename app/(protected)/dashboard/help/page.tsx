import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  Search, 
  HelpCircle, 
  FileText, 
  MessageSquare, 
  Mail, 
  BookOpen, 
  Video, 
  CheckCircle2, 
  ArrowRight
} from "lucide-react";

export default function HelpSupportPage() {
  // Mock data for UI mockup
  const faqs = [
    {
      id: "faq-1",
      question: "How does the PeerPull review process work?",
      answer: "When you submit a PullRequest, it enters our review queue where other founders can claim it for review. Each PullRequest requires 3 reviews to be considered complete. Reviewers provide structured feedback on your project, focusing on the areas you've specified. Once all reviews are in, you'll receive a notification and can view the detailed feedback."
    },
    {
      id: "faq-2",
      question: "What are PeerPoints and how do I earn them?",
      answer: "PeerPoints are our platform's currency that enables the feedback exchange. You earn PeerPoints by reviewing other founders' projects (2 points per review). You spend PeerPoints when submitting your own projects for review (1 point per submission). You can also earn bonus points for high-quality reviews and by inviting other founders to join the platform."
    },
    {
      id: "faq-3",
      question: "How do I get matched with the right reviewers?",
      answer: "Our matching algorithm considers several factors: the expertise areas you've specified for your project, the categories you've selected, and the specific feedback focus areas. We prioritize matching you with founders who have relevant experience in your industry or with similar technical challenges."
    },
    {
      id: "faq-4",
      question: "What types of projects can I submit for review?",
      answer: "You can submit various types of projects including landing pages, MVPs, prototypes, business models, marketing strategies, and feature ideas. The platform is designed to support early-stage founders across different stages of product development."
    },
    {
      id: "faq-5",
      question: "How can I provide effective feedback as a reviewer?",
      answer: "Good feedback is specific, actionable, and balanced. Focus on the areas the founder has requested feedback on, provide concrete examples, suggest alternatives when pointing out issues, and balance constructive criticism with positive observations. Use the structured review format to organize your thoughts."
    }
  ];
  
  const guides = [
    {
      id: 1,
      title: "Getting Started with PeerPull",
      description: "A comprehensive guide to setting up your profile and submitting your first PullRequest",
      icon: <CheckCircle2 className="h-8 w-8 text-green-500" />,
      type: "Article"
    },
    {
      id: 2,
      title: "How to Write Effective Reviews",
      description: "Learn how to provide valuable feedback that helps other founders improve their projects",
      icon: <FileText className="h-8 w-8 text-blue-500" />,
      type: "Article"
    },
    {
      id: 3,
      title: "Understanding PeerPoints",
      description: "Everything you need to know about earning and spending PeerPoints",
      icon: <Video className="h-8 w-8 text-purple-500" />,
      type: "Video"
    },
    {
      id: 4,
      title: "Optimizing Your PullRequest for Better Feedback",
      description: "Tips and tricks to structure your submission for maximum value",
      icon: <BookOpen className="h-8 w-8 text-yellow-500" />,
      type: "Guide"
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Help & Support</h1>
      
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
        <Input
          type="search"
          placeholder="Search for help articles, FAQs, or topics..."
          className="pl-8"
        />
      </div>
      
      <Tabs defaultValue="faqs" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="faqs">
            <HelpCircle className="mr-2 h-4 w-4" />
            FAQs
          </TabsTrigger>
          <TabsTrigger value="guides">
            <BookOpen className="mr-2 h-4 w-4" />
            Guides & Tutorials
          </TabsTrigger>
          <TabsTrigger value="contact">
            <MessageSquare className="mr-2 h-4 w-4" />
            Contact Support
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="faqs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>
                Find answers to common questions about using PeerPull
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id}>
                    <AccordionTrigger className="text-left font-medium">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 dark:text-gray-300">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Popular Topics</CardTitle>
              <CardDescription>
                Browse help articles by topic
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="flex flex-col space-y-2 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                  <h3 className="font-medium">Getting Started</h3>
                  <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                    <li className="hover:text-blue-600 hover:underline cursor-pointer">Creating your profile</li>
                    <li className="hover:text-blue-600 hover:underline cursor-pointer">Submitting your first PullRequest</li>
                    <li className="hover:text-blue-600 hover:underline cursor-pointer">Claiming reviews</li>
                  </ul>
                </div>
                
                <div className="flex flex-col space-y-2 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                  <h3 className="font-medium">PeerPoints</h3>
                  <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                    <li className="hover:text-blue-600 hover:underline cursor-pointer">How to earn PeerPoints</li>
                    <li className="hover:text-blue-600 hover:underline cursor-pointer">Spending PeerPoints</li>
                    <li className="hover:text-blue-600 hover:underline cursor-pointer">PeerPoint rewards</li>
                  </ul>
                </div>
                
                <div className="flex flex-col space-y-2 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                  <h3 className="font-medium">Reviews</h3>
                  <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                    <li className="hover:text-blue-600 hover:underline cursor-pointer">Writing effective reviews</li>
                    <li className="hover:text-blue-600 hover:underline cursor-pointer">Review etiquette</li>
                    <li className="hover:text-blue-600 hover:underline cursor-pointer">Responding to feedback</li>
                  </ul>
                </div>
                
                <div className="flex flex-col space-y-2 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                  <h3 className="font-medium">Account Management</h3>
                  <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                    <li className="hover:text-blue-600 hover:underline cursor-pointer">Updating your profile</li>
                    <li className="hover:text-blue-600 hover:underline cursor-pointer">Notification settings</li>
                    <li className="hover:text-blue-600 hover:underline cursor-pointer">Privacy and security</li>
                  </ul>
                </div>
                
                <div className="flex flex-col space-y-2 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                  <h3 className="font-medium">Community</h3>
                  <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                    <li className="hover:text-blue-600 hover:underline cursor-pointer">Joining discussions</li>
                    <li className="hover:text-blue-600 hover:underline cursor-pointer">Community guidelines</li>
                    <li className="hover:text-blue-600 hover:underline cursor-pointer">Events and meetups</li>
                  </ul>
                </div>
                
                <div className="flex flex-col space-y-2 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                  <h3 className="font-medium">Troubleshooting</h3>
                  <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                    <li className="hover:text-blue-600 hover:underline cursor-pointer">Common issues</li>
                    <li className="hover:text-blue-600 hover:underline cursor-pointer">Bug reporting</li>
                    <li className="hover:text-blue-600 hover:underline cursor-pointer">Feature requests</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="guides" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Guides & Tutorials</CardTitle>
              <CardDescription>
                Learn how to make the most of PeerPull with these resources
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {guides.map((guide) => (
                  <div key={guide.id} className="flex space-x-4 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                    <div className="flex h-12 w-12 items-center justify-center">
                      {guide.icon}
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium">{guide.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {guide.description}
                      </p>
                      <div className="flex items-center pt-2">
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 mr-2">
                          {guide.type}
                        </span>
                        <Button variant="link" className="h-auto p-0 text-blue-600 dark:text-blue-400">
                          Read More
                          <ArrowRight className="ml-1 h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6">
                <h3 className="font-medium mb-4">Video Tutorials</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="aspect-w-16 aspect-h-9 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <Video className="h-10 w-10 text-gray-400" />
                    </div>
                    <div className="p-3">
                      <h4 className="font-medium">Getting Started with PeerPull</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        5:32 • 2.5k views
                      </p>
                    </div>
                  </div>
                  
                  <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="aspect-w-16 aspect-h-9 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <Video className="h-10 w-10 text-gray-400" />
                    </div>
                    <div className="p-3">
                      <h4 className="font-medium">How to Write Effective Reviews</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        7:15 • 1.8k views
                      </p>
                    </div>
                  </div>
                  
                  <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="aspect-w-16 aspect-h-9 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <Video className="h-10 w-10 text-gray-400" />
                    </div>
                    <div className="p-3">
                      <h4 className="font-medium">Maximizing Your PeerPoints</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        6:48 • 1.2k views
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="contact" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Support</CardTitle>
              <CardDescription>
                Get help from our support team
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex flex-col items-center justify-center space-y-2 rounded-lg border border-gray-200 p-6 text-center dark:border-gray-700">
                  <Mail className="h-10 w-10 text-blue-500" />
                  <h3 className="font-medium">Email Support</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Send us an email and we'll get back to you within 24 hours
                  </p>
                  <Button variant="outline">
                    support@peerpull.com
                  </Button>
                </div>
                
                <div className="flex flex-col items-center justify-center space-y-2 rounded-lg border border-gray-200 p-6 text-center dark:border-gray-700">
                  <MessageSquare className="h-10 w-10 text-green-500" />
                  <h3 className="font-medium">Live Chat</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Chat with our support team in real-time during business hours
                  </p>
                  <Button className="bg-[#3366FF] hover:bg-blue-600">
                    Start Chat
                  </Button>
                </div>
              </div>
              
              <div className="rounded-lg border border-gray-200 p-6 dark:border-gray-700">
                <h3 className="font-medium mb-4">Send a Support Request</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Name
                      </label>
                      <Input id="name" placeholder="Your name" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email
                      </label>
                      <Input id="email" type="email" placeholder="Your email address" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">
                      Subject
                    </label>
                    <Input id="subject" placeholder="What is your question about?" />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      placeholder="Please describe your issue in detail"
                      className="min-h-[150px]"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="terms"
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-300">
                      I agree to the{" "}
                      <a href="#" className="text-blue-600 hover:underline dark:text-blue-400">
                        privacy policy
                      </a>
                    </label>
                  </div>
                  
                  <Button className="bg-[#3366FF] hover:bg-blue-600">
                    Submit Request
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
