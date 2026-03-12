"use client";

import { CheckCircle } from "lucide-react";

export default function SocialAuthPopupPage() {

  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3 text-center">
          <>
            <CheckCircle className="h-6 w-6 text-success" />
            <p className="text-sm text-foreground">
              Payment successful
            </p>
          </>
      </div>
    </div>
  );
}