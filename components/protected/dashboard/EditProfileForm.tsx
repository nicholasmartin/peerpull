"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Profile } from "@/utils/supabase/profiles";
import { updateProfile } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const EXPERTISE_OPTIONS = [
  "SaaS",
  "Mobile App",
  "Web App",
  "API/Backend",
  "UI/UX Design",
  "Marketing",
  "DevTools",
  "E-commerce",
  "AI/ML",
  "Fintech",
  "Other",
];

interface EditProfileFormProps {
  profile: Profile;
  userEmail: string;
}

export default function EditProfileForm({ profile, userEmail }: EditProfileFormProps) {
  const router = useRouter();
  const [firstName, setFirstName] = useState(profile.first_name || "");
  const [lastName, setLastName] = useState(profile.last_name || "");
  const [website, setWebsite] = useState(profile.website || "");
  const [selectedExpertise, setSelectedExpertise] = useState<string[]>(
    profile.expertise || []
  );
  const [isPending, startTransition] = useTransition();

  const toggleExpertise = (tag: string) => {
    setSelectedExpertise((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSaveProfile = () => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("first_name", firstName.trim());
      formData.append("last_name", lastName.trim());
      if (website) formData.append("website", website);
      selectedExpertise.forEach((tag) => formData.append("expertise", tag));

      const result = await updateProfile(formData);

      // The updateProfile action uses encodedRedirect, so if we get here,
      // it means there was an error before the redirect
      if (result?.error) {
        toast.error(result.error);
        return;
      }

      // Success - the action will handle the redirect
      router.refresh();
    });
  };

  const handleCancel = () => {
    // Reset form to original values
    setFirstName(profile.first_name || "");
    setLastName(profile.last_name || "");
    setWebsite(profile.website || "");
    setSelectedExpertise(profile.expertise || []);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Update your profile details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={userEmail} disabled />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://yourproject.com"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Expertise</CardTitle>
          <CardDescription>Select your areas of expertise</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {EXPERTISE_OPTIONS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleExpertise(tag)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  selectedExpertise.includes(tag)
                    ? "bg-primary text-white"
                    : "border border-dark-border bg-dark-surface text-dark-text-muted hover:border-dark-text-muted/50"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {selectedExpertise.length > 0 && (
            <div>
              <p className="text-sm text-dark-text-muted mb-2">Selected:</p>
              <div className="flex flex-wrap gap-2">
                {selectedExpertise.map((skill: string, index: number) => (
                  <Badge key={index} variant="secondary">{skill}</Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={handleCancel} disabled={isPending}>
          Cancel
        </Button>
        <Button
          className="bg-primary hover:bg-primary-muted"
          onClick={handleSaveProfile}
          disabled={isPending}
        >
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
