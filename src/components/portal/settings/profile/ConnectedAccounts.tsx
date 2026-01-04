"use client"

import { Badge } from "@components/3rdparty/ui/badge";
import { Button } from "@components/3rdparty/ui/button";
import { toast } from "@components/3rdparty/ui/use-toast";
import { useState } from "react";

export default function ConnectedAccounts() {
  // Social account states
  const [socialAccounts, setSocialAccounts] = useState({
    google: { connected: true, email: "john@example.com" },
    apple: { connected: false, email: null },
    linkedin: { connected: true, email: "john@linkedin.com" },
  });

  const toggleSocialAccount = (provider: keyof typeof socialAccounts) => {
    setSocialAccounts((prev) => ({
      ...prev,
      [provider]: {
        ...prev[provider],
        connected: !prev[provider].connected,
      },
    }));

    const action = socialAccounts[provider].connected
      ? "disconnected"
      : "connected";
    toast({
      title: `${provider.charAt(0).toUpperCase() + provider.slice(1)} ${action}`,
      description: `Your ${provider} account has been ${action}.`,
    });
  };
  
  return (
    <>
      {Object.entries(socialAccounts).map(([provider, account]) => (
        <div
          key={provider}
          className="flex items-center justify-between p-4 border rounded-lg"
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                provider === "google"
                  ? "bg-red-500 text-white"
                  : provider === "apple"
                    ? "bg-gray-800 text-white"
                    : "bg-blue-600 text-white"
              }`}
            >
              {provider.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-medium capitalize">{provider}</p>
              {account.connected && account.email && (
                <p className="text-sm text-muted-foreground">{account.email}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={account.connected ? "default" : "secondary"}>
              {account.connected ? "Connected" : "Not Connected"}
            </Badge>
            <Button
              variant={account.connected ? "destructive" : "default"}
              size="sm"
              onClick={() =>
                toggleSocialAccount(provider as keyof typeof socialAccounts)
              }
            >
              {account.connected ? "Disconnect" : "Connect"}
            </Button>
          </div>
        </div>
      ))}
    </>
  );
}
