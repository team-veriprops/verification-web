"use client";

import { useEffect, useState } from "react";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { base64UrlToString } from "@lib/utils";

type Status = "processing" | "success" | "error";

export default function SocialAuthPopupPage() {
  const [status, setStatus] = useState<Status>("processing");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const authStatus = params.get("status");
    const userInfoBase64 = params.get("user_info");
    const userInfo = base64UrlToString(userInfoBase64!)


    const isSuccess = authStatus === "PAYMENT_SUCCEEDED";
    const messageType = isSuccess
      ? "PAYMENT_SUCCESS"
      : "PAYMENT_ERROR";

    // Desktop popup flow
    if (window.opener) {
      window.opener.postMessage(
        { type: messageType },
        window.location.origin
      );
    } else {
      // Mobile / full redirect fallback
      window.location.href = isSuccess
        ? "/payment/success"
        : "/payment/failure";
      return;
    }

    setTimeout(() => { // Just to achieve async
      setStatus(isSuccess ? "success" : "error");
    }, 0);

    const timer = setTimeout(() => {
      window.close();
    }, isSuccess ? 800 : 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3 text-center">
        {status === "processing" && (
          <>
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Completing payment…
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle className="h-6 w-6 text-success" />
            <p className="text-sm text-foreground">
              Payment successful
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="h-6 w-6 text-destructive" />
            <p className="text-sm text-destructive">
              Payment failed
            </p>
          </>
        )}
      </div>
    </div>
  );
}