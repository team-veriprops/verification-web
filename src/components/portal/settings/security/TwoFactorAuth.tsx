"use client";

import { useState } from "react";
import { Input } from "@3rdparty/ui/input";
import { Button } from "@3rdparty/ui/button";
import { toast } from "@3rdparty/ui/use-toast";
import { QrCode, Check } from "lucide-react";
import { Label } from "recharts";
import { Switch } from "@components/3rdparty/ui/switch";

export default function TwoFactorAuth() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  const enableTwoFactor = () => {
    if (!twoFactorEnabled) {
      setShowQRCode(true);
    } else {
      setTwoFactorEnabled(false);
      setShowQRCode(false);
      toast({
        title: "Two-factor authentication disabled",
        description: "2FA has been turned off for your account.",
      });
    }
  };

  const verifyTwoFactor = () => {
    if (verificationCode.length === 6) {
      setTwoFactorEnabled(true);
      setShowQRCode(false);
      setVerificationCode("");
      toast({
        title: "Two-factor authentication enabled",
        description: "Your account is now secured with 2FA.",
      });
    }
  };
  // const [enabled, setEnabled] = useState(false);
  // const [verifying, setVerifying] = useState(false);
  // const [code, setCode] = useState("");

  // const handleEnable = () => setEnabled(true);
  // const handleVerify = async () => {
  //   if (code === "123456") {
  //     setVerifying(false);
  //     toast({ title: "2FA Enabled", description: "Two-factor authentication is now active." });
  //   } else {
  //     toast({ title: "Invalid Code", description: "Please try again.", variant: "destructive" });
  //   }
  // };

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Two-Factor Authentication</Label>
          <p className="text-sm text-muted-foreground">
            Add an extra layer of security to your account
          </p>
        </div>
        <Switch checked={twoFactorEnabled} onCheckedChange={enableTwoFactor} />
      </div>

      {showQRCode && (
        <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
          <div className="text-center space-y-2">
            <div className="w-32 h-32 bg-background border rounded-lg mx-auto flex items-center justify-center">
              <QrCode className="h-16 w-16 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium">
              Scan this QR code with your authenticator app
            </p>
            <p className="text-xs text-muted-foreground">
              Or manually enter: JBSWY3DPEHPK3PXP
            </p>
          </div>
          <div className="space-y-2">
            <Label>Verification Code</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Enter 6-digit code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                maxLength={6}
              />
              
              <Button variant={"outline"}
                onClick={() => setShowQRCode(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={verifyTwoFactor}
                disabled={verificationCode.length !== 6}
              >
                Verify
              </Button>
            </div>
          </div>
        </div>
      )}

      {twoFactorEnabled && (
        <div className="flex items-center gap-2 text-sm text-green-600">
          <Check className="h-4 w-4" />
          Two-factor authentication is enabled
        </div>
      )}
    </>
  );
}
