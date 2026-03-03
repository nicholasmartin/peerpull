"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Profile } from "@/utils/supabase/profiles";
import { updateProfile } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Upload, User } from "lucide-react";

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [firstName, setFirstName] = useState(profile.first_name || "");
  const [lastName, setLastName] = useState(profile.last_name || "");
  const [website, setWebsite] = useState(profile.website || "");
  const [selectedExpertise, setSelectedExpertise] = useState<string[]>(
    profile.expertise || []
  );
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const toggleExpertise = (tag: string) => {
    setSelectedExpertise((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleAvatarSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }

      setAvatarFile(file);

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };

  const handleAvatarButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleSaveProfile = () => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("first_name", firstName.trim());
      formData.append("last_name", lastName.trim());
      if (website) formData.append("website", website);
      selectedExpertise.forEach((tag) => formData.append("expertise", tag));
      if (avatarFile) formData.append("avatar", avatarFile);

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

    // Reset avatar
    setAvatarFile(null);
    if (avatarPreview) {
      URL.revokeObjectURL(avatarPreview);
      setAvatarPreview(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
          <CardDescription>Upload your profile avatar</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Current/Preview Avatar */}
            <div className="flex flex-col items-center gap-2">
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src={avatarPreview || profile.avatar_url || ""}
                  alt={`${profile.first_name || "User"} ${profile.last_name || ""}`}
                />
                <AvatarFallback className="text-2xl">
                  <User className="h-12 w-12" />
                </AvatarFallback>
              </Avatar>
              {avatarPreview && (
                <p className="text-xs text-dark-text-muted">New avatar selected</p>
              )}
            </div>

            {/* Upload Controls */}
            <div className="flex-1 space-y-3">
              <div className="flex flex-col gap-2">
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarSelect}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAvatarButtonClick}
                  className="w-full sm:w-auto"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {avatarFile ? "Change Image" : "Upload Image"}
                </Button>
                {avatarFile && (
                  <p className="text-sm text-dark-text-muted">
                    Selected: {avatarFile.name}
                  </p>
                )}
              </div>
              <p className="text-xs text-dark-text-muted">
                Recommended: Square image, at least 200x200px. Max file size: 5MB.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

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
