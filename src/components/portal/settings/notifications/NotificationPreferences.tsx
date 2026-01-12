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
    payment_reminder: true,
    verification_update: true,
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
    <Card className="border border-border">
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {[
            { label: "Email Notifications", desc: "Receive updates via email", key: "email", isChecked: notifications.email },
            { label: "SMS Notifications", desc: "Receive updates via SMS", key: "sms", isChecked: notifications.sms },
            { label: "Payment Reminders", desc: "Get reminded about pending payments", key: "payment_reminder", isChecked: notifications.payment_reminder },
            { label: "Verification Updates", desc: "Status updates for your verifications", key: "verification_update", isChecked: notifications.verification_update },
            { label: "Product Updates & Marketing", desc: "Receive updates about new features and promotions", key: "marketing", isChecked: notifications.marketing }
          ].map((item: { label: string; desc: string; key: string; isChecked: boolean }) => (
            <div
              key={item.label}
              className="flex items-center justify-between py-2"
            >
              <div>
                <Label>{item.label}</Label>
                <p className="text-sm text-muted-foreground">
                  {item.desc}
                </p>
              </div>
              <Switch
                checked={item.isChecked}
                onCheckedChange={(checked) =>
                  setNotifications((prev) => ({ ...prev, [item.key]: checked }))
                }
              />
            </div>
          ))}
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
