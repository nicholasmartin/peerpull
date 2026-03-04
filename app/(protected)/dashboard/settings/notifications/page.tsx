"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Bell, Mail } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { updateNotificationPreferences } from "@/app/actions";
import { toast } from "sonner";

const NOTIFICATION_EVENTS = [
  { key: "review_received", label: "New Feedback Received", description: "When someone submits feedback on your Feedback Request" },
  { key: "review_approved", label: "Feedback Approved", description: "When a project owner approves your feedback" },
  { key: "review_rejected", label: "Feedback Not Accepted", description: "When a project owner does not accept your feedback" },
  { key: "review_rated", label: "Feedback Rated", description: "When a project owner rates your feedback" },
];

export default function SettingsNotificationsPage() {
  const [prefs, setPrefs] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadPreferences = useCallback(async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("notification_preferences")
      .select("event_type, email_enabled")
      .eq("user_id", user.id);

    const prefMap: Record<string, boolean> = {};
    for (const event of NOTIFICATION_EVENTS) {
      const row = data?.find((d: { event_type: string }) => d.event_type === event.key);
      prefMap[event.key] = row?.email_enabled ?? true;
    }
    setPrefs(prefMap);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

  async function handleSave() {
    setSaving(true);
    const preferences = Object.entries(prefs).map(([event_type, email_enabled]) => ({
      event_type,
      email_enabled,
    }));
    const result = await updateNotificationPreferences(preferences);
    setSaving(false);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Notification preferences saved");
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-sm text-dark-text-muted text-center">Loading preferences...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>
          Choose which events trigger email notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <h3 className="font-medium">Email Notifications</h3>

          {NOTIFICATION_EVENTS.map((event) => (
            <div key={event.key} className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor={event.key}>{event.label}</Label>
                <p className="text-sm text-dark-text-muted">{event.description}</p>
              </div>
              <Switch
                id={event.key}
                checked={prefs[event.key] ?? true}
                onCheckedChange={(checked: boolean) =>
                  setPrefs((prev) => ({ ...prev, [event.key]: checked }))
                }
              />
            </div>
          ))}
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="font-medium">Notification Channels</h3>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="h-5 w-5 text-dark-text-muted" />
              <div className="space-y-0.5">
                <Label>In-App Notifications</Label>
                <p className="text-sm text-dark-text-muted">Always enabled</p>
              </div>
            </div>
            <Switch checked disabled />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-dark-text-muted" />
              <div className="space-y-0.5">
                <Label>Email</Label>
                <p className="text-sm text-dark-text-muted">Controlled per event above</p>
              </div>
            </div>
            <Badge variant="outline">Configurable</Badge>
          </div>
        </div>

        <Button
          className="bg-primary hover:bg-primary-muted"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Preferences"}
        </Button>
      </CardContent>
    </Card>
  );
}
