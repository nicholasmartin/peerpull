"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Profile } from "@/utils/supabase/profiles";
import { updateProfile } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Upload, User, Plus, X } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

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
  "Growth Hacking",
  "Data Analytics",
  "Cloud/Infrastructure",
  "Cybersecurity",
  "Blockchain/Web3",
  "SEO/Content",
  "Community Building",
  "Product Management",
  "Open Source",
  "No-Code/Low-Code",
  "Hardware/IoT",
  "EdTech",
  "HealthTech",
  "Gaming",
  "Social Media",
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
  const [emailPublic, setEmailPublic] = useState(profile.email_public ?? false);
  const [selectedExpertise, setSelectedExpertise] = useState<string[]>(
    profile.expertise || []
  );
  const [customExpertise, setCustomExpertise] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    website?: string;
  }>({});

  const toggleExpertise = (tag: string) => {
    setSelectedExpertise((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const addCustomExpertise = () => {
    const trimmed = customExpertise.trim();
    if (!trimmed) return;
    if (selectedExpertise.includes(trimmed)) {
      toast.error("That expertise is already added");
      return;
    }
    setSelectedExpertise((prev) => [...prev, trimmed]);
    setCustomExpertise("");
  };

  const removeExpertise = (tag: string) => {
    setSelectedExpertise((prev) => prev.filter((t) => t !== tag));
  };

  const handleAvatarSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }

      setAvatarFile(file);
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };

  const handleAvatarButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleSaveProfile = () => {
    const newErrors: typeof errors = {};

    if (!firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (website && website.trim()) {
      let testUrl = website.trim();
      if (!/^https?:\/\//i.test(testUrl)) {
        testUrl = "https://" + testUrl;
      }
      try {
        new URL(testUrl);
      } catch {
        newErrors.website = "Please enter a valid URL";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    startTransition(async () => {
      const formData = new FormData();
      formData.append("first_name", firstName.trim());
      formData.append("last_name", lastName.trim());
      if (website) formData.append("website", website.trim());
      formData.append("email_public", emailPublic ? "true" : "false");
      selectedExpertise.forEach((tag) => formData.append("expertise", tag));
      if (avatarFile) formData.append("avatar", avatarFile);

      await updateProfile(formData);
    });
  };

  const handleCancel = () => {
    router.push("/dashboard/profile");
  };

  // Custom tags are those not in the predefined options
  const customTags = selectedExpertise.filter((t) => !EXPERTISE_OPTIONS.includes(t));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
          <CardDescription>Upload your profile avatar</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-center gap-6">
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
                onChange={(e) => {
                  setFirstName(e.target.value);
                  if (errors.firstName) {
                    setErrors({ ...errors, firstName: undefined });
                  }
                }}
                placeholder="First name"
              />
              {errors.firstName && (
                <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                type="text"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                  if (errors.lastName) {
                    setErrors({ ...errors, lastName: undefined });
                  }
                }}
                placeholder="Last name"
              />
              {errors.lastName && (
                <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={userEmail} disabled />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email_public">Show email on profile</Label>
              <p className="text-xs text-dark-text-muted">Allow others to see your email address</p>
            </div>
            <Switch
              id="email_public"
              checked={emailPublic}
              onCheckedChange={setEmailPublic}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              type="url"
              value={website}
              onChange={(e) => {
                setWebsite(e.target.value);
                if (errors.website) {
                  setErrors({ ...errors, website: undefined });
                }
              }}
              placeholder="https://yourproject.com"
            />
            {errors.website && (
              <p className="text-sm text-red-500 mt-1">{errors.website}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Expertise</CardTitle>
          <CardDescription>Select your areas of expertise or add your own</CardDescription>
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

          <div className="flex gap-2">
            <Input
              type="text"
              value={customExpertise}
              onChange={(e) => setCustomExpertise(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addCustomExpertise();
                }
              }}
              placeholder="Add custom expertise..."
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              onClick={addCustomExpertise}
              disabled={!customExpertise.trim()}
              className="shrink-0"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>

          {customTags.length > 0 && (
            <div>
              <p className="text-xs text-dark-text-muted mb-2">Custom tags:</p>
              <div className="flex flex-wrap gap-2">
                {customTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-full bg-primary text-white px-3 py-1.5 text-xs font-medium"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeExpertise(tag)}
                      className="hover:text-white/70"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {selectedExpertise.length > 0 && (
            <p className="text-xs text-dark-text-muted">
              {selectedExpertise.length} selected
            </p>
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
          {isPending && <Spinner size="sm" />}
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
