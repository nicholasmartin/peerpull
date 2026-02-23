"use client";

import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/context/ThemeContext";
import { createClient } from "@/utils/supabase/client";
import {
  Bell,
  Lock,
  CreditCard,
  User,
  Shield,
  Mail,
  Globe,
  Moon,
  Sun,
  LogOut,
  Monitor
} from "lucide-react";

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState(theme || "dark");
  const [mounted, setMounted] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  
  // After mounting, get the theme and user data
  useEffect(() => {
    setMounted(true);
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setSelectedTheme(storedTheme as "light" | "dark" | "system");
    } else {
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setSelectedTheme(systemPrefersDark ? "system" : "light");
    }

    // Fetch user data
    const supabase = createClient();
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email || "");
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .single();
        if (profile) {
          setFullName(profile.full_name || "");
        }
      }
    })();
  }, []);
  
  // Function to apply the selected theme
  const applyTheme = (newTheme: "light" | "dark" | "system") => {
    if (!mounted) return;
    
    setSelectedTheme(newTheme);
    
    if (newTheme === "system") {
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (systemPrefersDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      localStorage.setItem("theme", "system");
    } else if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };
  
  // Set up listener for system preference changes (only if using "system" theme)
  useEffect(() => {
    if (!mounted) return;
    
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const handleChange = (e: MediaQueryListEvent) => {
      if (selectedTheme === "system") {
        if (e.matches) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
    };
    
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [mounted, selectedTheme]);
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Settings</h1>
      
      <Tabs defaultValue="account" className="w-full">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/4">
            <TabsList className="flex flex-col h-auto bg-transparent p-0 space-y-1">
              <TabsTrigger 
                value="account" 
                className="justify-start px-4 py-2 h-auto data-[state=active]:bg-dark-surface"
              >
                <User className="mr-2 h-4 w-4" />
                Account
              </TabsTrigger>
              <TabsTrigger 
                value="security" 
                className="justify-start px-4 py-2 h-auto data-[state=active]:bg-dark-surface"
              >
                <Lock className="mr-2 h-4 w-4" />
                Security
              </TabsTrigger>
              <TabsTrigger 
                value="notifications" 
                className="justify-start px-4 py-2 h-auto data-[state=active]:bg-dark-surface"
              >
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger 
                value="appearance" 
                className="justify-start px-4 py-2 h-auto data-[state=active]:bg-dark-surface"
              >
                <Globe className="mr-2 h-4 w-4" />
                Appearance
              </TabsTrigger>
              <TabsTrigger 
                value="billing" 
                className="justify-start px-4 py-2 h-auto data-[state=active]:bg-dark-surface"
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Billing
              </TabsTrigger>
            </TabsList>
          </div>
          
          <div className="md:w-3/4">
            <TabsContent value="account" className="space-y-6 mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>
                    Update your account details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" value={email} disabled />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Not set" />
                  </div>
                  
                  <Button className="bg-primary hover:bg-primary-muted">
                    Save Changes
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Delete Account</CardTitle>
                  <CardDescription>
                    Permanently delete your account and all of your data
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-dark-text-muted">
                    Once you delete your account, there is no going back. All of your data will be permanently removed.
                  </p>
                  <Button variant="destructive">
                    Delete Account
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="security" className="space-y-6 mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>
                    Update your password to keep your account secure
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                  
                  <Button className="bg-primary hover:bg-primary-muted">
                    Update Password
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Two-Factor Authentication</CardTitle>
                  <CardDescription>
                    Add an extra layer of security to your account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="2fa">Two-Factor Authentication</Label>
                      <p className="text-sm text-dark-text-muted">
                        Require a verification code when logging in
                      </p>
                    </div>
                    <Switch id="2fa" />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="sms-auth">SMS Authentication</Label>
                      <p className="text-sm text-dark-text-muted">
                        Receive verification codes via SMS
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-dark-text-muted">
                        Not configured
                      </span>
                      <Button variant="outline" size="sm">
                        Setup
                      </Button>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="app-auth">Authenticator App</Label>
                      <p className="text-sm text-dark-text-muted">
                        Use an authenticator app to generate verification codes
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Setup
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Active Sessions</CardTitle>
                  <CardDescription>
                    Manage your active sessions across devices
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-dark-text-muted">
                    Session management coming soon
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications" className="space-y-6 mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Choose how and when you want to be notified
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <h3 className="font-medium">PullRequest Notifications</h3>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="new-review">New Review Received</Label>
                        <p className="text-sm text-dark-text-muted">
                          When someone submits a review on your PullRequest
                        </p>
                      </div>
                      <Switch id="new-review" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="review-reminder">Review Reminders</Label>
                        <p className="text-sm text-dark-text-muted">
                          Reminders when your PullRequest is waiting for reviews
                        </p>
                      </div>
                      <Switch id="review-reminder" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="review-complete">Review Completed</Label>
                        <p className="text-sm text-dark-text-muted">
                          When all reviews for your PullRequest are completed
                        </p>
                      </div>
                      <Switch id="review-complete" defaultChecked />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">Review Queue Notifications</h3>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="new-pullrequest">New PullRequests Available</Label>
                        <p className="text-sm text-dark-text-muted">
                          When new PullRequests are available for review
                        </p>
                      </div>
                      <Switch id="new-pullrequest" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="review-due">Review Due Reminders</Label>
                        <p className="text-sm text-dark-text-muted">
                          Reminders when your reviews are due soon
                        </p>
                      </div>
                      <Switch id="review-due" defaultChecked />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">Community Notifications</h3>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="new-event">New Events</Label>
                        <p className="text-sm text-dark-text-muted">
                          When new community events are scheduled
                        </p>
                      </div>
                      <Switch id="new-event" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="discussion-reply">Discussion Replies</Label>
                        <p className="text-sm text-dark-text-muted">
                          When someone replies to your discussion post
                        </p>
                      </div>
                      <Switch id="discussion-reply" defaultChecked />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">Notification Channels</h3>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Mail className="h-5 w-5 text-dark-text-muted" />
                        <div className="space-y-0.5">
                          <Label htmlFor="email-notifications">Email Notifications</Label>
                        </div>
                      </div>
                      <Switch id="email-notifications" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Bell className="h-5 w-5 text-dark-text-muted" />
                        <div className="space-y-0.5">
                          <Label htmlFor="push-notifications">Push Notifications</Label>
                        </div>
                      </div>
                      <Switch id="push-notifications" defaultChecked />
                    </div>
                  </div>
                  
                  <Button className="bg-primary hover:bg-primary-muted">
                    Save Preferences
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="appearance" className="space-y-6 mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Appearance</CardTitle>
                  <CardDescription>
                    Customize how PeerPull looks on your device
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <h3 className="font-medium">Theme</h3>
                    
                    <div className="grid grid-cols-3 gap-4">
                      {/* Light Theme Option */}
                      <div 
                        className="flex flex-col items-center space-y-2 cursor-pointer"
                        onClick={() => applyTheme("light")}
                      >
                        <div className={`flex h-20 w-full items-center justify-center rounded-md border-2 ${selectedTheme === "light" ? "border-primary" : "border-dark-border"} bg-dark-card`}>
                          <Sun className="h-6 w-6 text-dark-text" />
                        </div>
                        <Label className="text-sm font-normal">Light</Label>
                      </div>
                      
                      {/* Dark Theme Option */}
                      <div 
                        className="flex flex-col items-center space-y-2 cursor-pointer"
                        onClick={() => applyTheme("dark")}
                      >
                        <div className={`flex h-20 w-full items-center justify-center rounded-md border-2 ${selectedTheme === "dark" ? "border-primary" : "border-dark-border"} bg-dark-bg`}>
                          <Moon className="h-6 w-6 text-dark-text" />
                        </div>
                        <Label className="text-sm font-normal">Dark</Label>
                      </div>
                      
                      {/* System Theme Option */}
                      <div 
                        className="flex flex-col items-center space-y-2 cursor-pointer"
                        onClick={() => applyTheme("system")}
                      >
                        <div className={`flex h-20 w-full items-center justify-center rounded-md border-2 ${selectedTheme === "system" ? "border-primary" : "border-dark-border"} bg-gradient-to-r from-dark-card to-dark-bg`}>
                          <div className="flex space-x-1">
                            <Monitor className="h-6 w-6 text-dark-text-muted" />
                          </div>
                        </div>
                        <Label className="text-sm font-normal">System</Label>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">Font Size</h3>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex flex-col items-center space-y-2">
                        <div className="flex h-12 w-full items-center justify-center rounded-md border-2 border-dark-border bg-dark-surface text-sm">
                          <span>Aa</span>
                        </div>
                        <Label className="text-sm font-normal">Small</Label>
                      </div>
                      
                      <div className="flex flex-col items-center space-y-2">
                        <div className="flex h-12 w-full items-center justify-center rounded-md border-2 border-primary bg-dark-surface text-base">
                          <span>Aa</span>
                        </div>
                        <Label className="text-sm font-normal">Medium</Label>
                      </div>
                      
                      <div className="flex flex-col items-center space-y-2">
                        <div className="flex h-12 w-full items-center justify-center rounded-md border-2 border-dark-border bg-dark-surface text-lg">
                          <span>Aa</span>
                        </div>
                        <Label className="text-sm font-normal">Large</Label>
                      </div>
                    </div>
                  </div>
                  
                  <Button className="bg-primary hover:bg-primary-muted">
                    Save Preferences
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="billing" className="space-y-6 mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Current Plan</CardTitle>
                  <CardDescription>
                    You are currently on the Free Plan
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-md border border-dark-border p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium text-lg">Free Plan</h3>
                        <p className="text-sm text-dark-text-muted">
                          Basic features for early-stage founders
                        </p>
                      </div>
                      <Badge>Current Plan</Badge>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Shield className="h-4 w-4 mr-2 text-green-500" />
                        <span className="text-sm">Up to 3 PullRequests per month</span>
                      </div>
                      <div className="flex items-center">
                        <Shield className="h-4 w-4 mr-2 text-green-500" />
                        <span className="text-sm">Basic review tools</span>
                      </div>
                      <div className="flex items-center">
                        <Shield className="h-4 w-4 mr-2 text-green-500" />
                        <span className="text-sm">Community access</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="rounded-md border border-dark-border p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium text-lg">Pro Plan</h3>
                        <p className="text-sm text-dark-text-muted">
                          Advanced features for growing startups
                        </p>
                      </div>
                      <div className="text-lg font-bold">
                        $29<span className="text-sm font-normal text-dark-text-muted">/month</span>
                      </div>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Shield className="h-4 w-4 mr-2 text-green-500" />
                        <span className="text-sm">Unlimited PullRequests</span>
                      </div>
                      <div className="flex items-center">
                        <Shield className="h-4 w-4 mr-2 text-green-500" />
                        <span className="text-sm">Priority review queue</span>
                      </div>
                      <div className="flex items-center">
                        <Shield className="h-4 w-4 mr-2 text-green-500" />
                        <span className="text-sm">Expert reviewer matching</span>
                      </div>
                      <div className="flex items-center">
                        <Shield className="h-4 w-4 mr-2 text-green-500" />
                        <span className="text-sm">Advanced analytics</span>
                      </div>
                    </div>
                    
                    <Button className="w-full mt-4 bg-primary hover:bg-primary-muted">
                      Upgrade to Pro
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                  <CardDescription>
                    Add a payment method to upgrade to a paid plan
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-md border border-dark-border">
                    <div className="flex items-center space-x-4">
                      <CreditCard className="h-6 w-6 text-dark-text-muted" />
                      <div>
                        <p className="font-medium">Add Payment Method</p>
                        <p className="text-sm text-dark-text-muted">
                          Add a credit card or PayPal account
                        </p>
                      </div>
                    </div>
                    <Button variant="outline">Add Method</Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Billing History</CardTitle>
                  <CardDescription>
                    View your past invoices and payment history
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-6 text-dark-text-muted">
                    <p>No billing history available</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
}
