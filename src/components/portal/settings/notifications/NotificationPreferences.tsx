"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@3rdparty/ui/card";
import { Switch } from "@3rdparty/ui/switch";
import { Label } from "@3rdparty/ui/label";
import { Button } from "@3rdparty/ui/button";
import { toast } from "@3rdparty/ui/use-toast";

export default function NotificationPreferences() {
  const [notificationSaving, setNotificationSaving] = useState(false);

  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    inApp: true,
    marketing: false,
  });

  const saveNotificationPreferences = async () => {
    setNotificationSaving(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setNotificationSaving(false);
    toast({
      title: "Notification preferences saved",
      description: "Your notification settings have been updated.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications via email
              </p>
            </div>
            <Switch
              checked={notifications.email}
              onCheckedChange={(checked) =>
                setNotifications((prev) => ({ ...prev, email: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>SMS Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications via SMS
              </p>
            </div>
            <Switch
              checked={notifications.sms}
              onCheckedChange={(checked) =>
                setNotifications((prev) => ({ ...prev, sms: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>In-App Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Show notifications within the app
              </p>
            </div>
            <Switch
              checked={notifications.inApp}
              onCheckedChange={(checked) =>
                setNotifications((prev) => ({ ...prev, inApp: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Product Updates & Marketing</Label>
              <p className="text-sm text-muted-foreground">
                Receive updates about new features and promotions
              </p>
            </div>
            <Switch
              checked={notifications.marketing}
              onCheckedChange={(checked) =>
                setNotifications((prev) => ({ ...prev, marketing: checked }))
              }
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={saveNotificationPreferences}
            className="w-full sm:w-auto min-w-32"
            disabled={notificationSaving}
          >
            {notificationSaving ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Saving...
              </div>
            ) : (
              "Save Preferences"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
