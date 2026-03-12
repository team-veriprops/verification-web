"use client";

import { XCircle } from "lucide-react";

export default function SocialAuthPopupPage() {

  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3 text-center">
          <>
            <XCircle className="h-6 w-6 text-accent" />
            <p className="text-sm text-accent">
              Payment cancelled
            </p>
          </>
      </div>
    </div>
  );
}