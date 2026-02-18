"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { submitPullRequest } from "@/app/actions";

const CATEGORIES = ["SaaS", "Mobile App", "E-commerce", "AI/ML", "Marketplace", "Other"];
const FOCUS_AREAS = ["Value Proposition", "Technical Architecture", "UI/UX", "Market Fit", "Pricing", "Messaging"];

export default function NewPullRequestPage() {
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedFocusAreas, setSelectedFocusAreas] = useState<string[]>([]);
  const [stage, setStage] = useState("");
  const router = useRouter();

  React.useEffect(() => {
    async function loadBalance() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("peer_points_balance")
        .eq("id", user.id)
        .single();
      if (data) setBalance(data.peer_points_balance);
    }
    loadBalance();
  }, []);

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const toggleFocus = (area: string) => {
    setSelectedFocusAreas(prev =>
      prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area]
    );
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    // Add array fields
    selectedCategories.forEach(cat => formData.append("categories", cat));
    selectedFocusAreas.forEach(area => formData.append("focus_areas", area));
    formData.set("stage", stage);

    try {
      await submitPullRequest(formData);
    } catch {
      setError("Failed to submit. You may not have enough PeerPoints.");
      setLoading(false);
    }
  }

  const insufficientPoints = balance !== null && balance < 2;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Link href="/dashboard/pull-requests" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold">Submit New PullRequest</h1>
        {balance !== null && (
          <span className="ml-auto text-sm text-gray-500 dark:text-gray-400">
            Balance: <span className="font-bold text-blue-500">{balance} PeerPoints</span>
          </span>
        )}
      </div>

      {insufficientPoints && (
        <div className="rounded-lg border border-yellow-300 bg-yellow-50 p-4 text-yellow-800 dark:border-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-200">
          You need at least 2 PeerPoints to submit a PullRequest. Review other projects to earn points!
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-red-800 dark:border-red-700 dark:bg-red-900/30 dark:text-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Basics</CardTitle>
              <CardDescription>Provide the basic information about your project</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Project Name</Label>
                  <Input id="title" name="title" placeholder="E.g., SaaS Dashboard, Mobile App" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="url">Project URL (if applicable)</Label>
                  <Input id="url" name="url" placeholder="https://your-project-url.com" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="stage">Project Stage</Label>
                <Select value={stage} onValueChange={setStage}>
                  <SelectTrigger id="stage">
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
                <Label htmlFor="description">Brief Description</Label>
                <Textarea id="description" name="description" placeholder="Describe your project in a few sentences" className="min-h-[100px]" />
              </div>

              <div className="space-y-2">
                <Label>Project Categories</Label>
                <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                  {CATEGORIES.map(cat => (
                    <div key={cat} className="flex items-center space-x-2">
                      <Checkbox
                        id={`cat-${cat}`}
                        checked={selectedCategories.includes(cat)}
                        onCheckedChange={() => toggleCategory(cat)}
                      />
                      <Label htmlFor={`cat-${cat}`} className="font-normal">{cat}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Feedback Focus</CardTitle>
              <CardDescription>Select areas where you'd like reviewers to focus their feedback</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  {FOCUS_AREAS.slice(0, 3).map(area => (
                    <div key={area} className="flex items-center space-x-2">
                      <Checkbox
                        id={`focus-${area}`}
                        checked={selectedFocusAreas.includes(area)}
                        onCheckedChange={() => toggleFocus(area)}
                      />
                      <Label htmlFor={`focus-${area}`} className="font-normal">{area}</Label>
                    </div>
                  ))}
                </div>
                <div className="space-y-4">
                  {FOCUS_AREAS.slice(3).map(area => (
                    <div key={area} className="flex items-center space-x-2">
                      <Checkbox
                        id={`focus-${area}`}
                        checked={selectedFocusAreas.includes(area)}
                        onCheckedChange={() => toggleFocus(area)}
                      />
                      <Label htmlFor={`focus-${area}`} className="font-normal">{area}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Specific Questions</CardTitle>
              <CardDescription>What would you like reviewers to answer? (Up to 3)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Input name="question1" placeholder="Question 1: E.g., Is my pricing strategy clear and compelling?" />
              <Input name="question2" placeholder="Question 2: E.g., Does the user flow make sense?" />
              <Input name="question3" placeholder="Question 3: E.g., What feature should I prioritize next?" />
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-[#3366FF] hover:bg-blue-600"
              disabled={insufficientPoints || loading}
            >
              {loading ? "Submitting..." : "Submit PullRequest (2 PeerPoints)"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
