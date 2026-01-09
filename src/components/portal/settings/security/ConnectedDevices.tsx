"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@3rdparty/ui/card";
import { Button } from "@3rdparty/ui/button";
import { Badge } from "@3rdparty/ui/badge";
import { Smartphone, Monitor, Chrome, Trash2 } from "lucide-react";
import { toast } from "@3rdparty/ui/use-toast";

interface Device {
  id: string;
  name: string;
  browser: string;
  location: string;
  lastActive: string;
  current: boolean;
}

export default function ConnectedDevices() {
  const [connectedDevices] = useState([
    {
      id: 1,
      name: "MacBook Pro",
      browser: "Chrome 119",
      location: "Lagos, Nigeria",
      lastActive: "2 hours ago",
      current: true,
    },
    {
      id: 2,
      name: "iPhone 14",
      browser: "Safari Mobile",
      location: "Lagos, Nigeria",
      lastActive: "1 day ago",
      current: false,
    },
    {
      id: 3,
      name: "Windows Desktop",
      browser: "Edge 119",
      location: "Abuja, Nigeria",
      lastActive: "3 days ago",
      current: false,
    },
  ]);

  const revokeDevice = (deviceId: number) => {
    toast({
      title: "Device access revoked",
      description: "The selected device can no longer access your account.",
    });
  };

  return (
    <>
      {connectedDevices.map((device) => (
        <div
          key={device.id}
          className="flex items-center justify-between p-4 border border-border rounded-lg"
        >
          <div className="flex items-center gap-3">
            {device.name.includes("iPhone") ? (
              <Smartphone className="h-6 w-6 text-muted-foreground" />
            ) : (
              <Monitor className="h-6 w-6 text-muted-foreground" />
            )}
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium">{device.name}</p>
                {device.current && (
                  <Badge variant="secondary" className="text-xs">
                    Current
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Chrome className="h-3 w-3" />
                <span>{device.browser}</span>
                <span>•</span>
                <span>{device.location}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Last active: {device.lastActive}
              </p>
            </div>
          </div>
          {!device.current && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => revokeDevice(device.id)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Revoke
            </Button>
          )}
        </div>
      ))}
    </>
  );
}
