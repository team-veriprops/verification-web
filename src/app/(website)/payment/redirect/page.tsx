"use client";

import { useEffect, useState } from "react";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { base64UrlToString } from "@lib/utils";

type Status = "processing" | "cancelled" | "success" | "error";

export default function SocialAuthPopupPage() {
  const [status, setStatus] = useState<Status>("processing");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentStatus = params.get("status");
    const userInfoBase64 = params.get("user_info");
    const userInfo = base64UrlToString(userInfoBase64!)

    const isCancelled = paymentStatus?.toLowerCase() === "PAYMENT_CANCELLED"
    const isSuccess = paymentStatus === "PAYMENT_SUCCEEDED";

    const messageType = isCancelled  ? "PAYMENT_CANCELLED" :
    isSuccess ? "PAYMENT_SUCCESS" : "PAYMENT_ERROR";

    // Desktop popup flow
    if (window.opener) {
      window.opener.postMessage(
        { type: messageType },
        window.location.origin
      );
    } else {
      // Mobile / full redirect fallback
      window.location.href = isCancelled ? "/payment/redirect/cancelled" :
      isSuccess
        ? "/payment/redirect/success"
        : "/payment/redirect/failure";
      return;
    }

    setTimeout(() => { // Just to achieve async
      setStatus(
        isCancelled ? "cancelled" :
        isSuccess ? "success" : "error");
    }, 0);

    const timer = setTimeout(() => {
      window.close();
    }, isSuccess || !isCancelled ? 8000 : 3500);

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

        {status === "cancelled" && (
          <>
            <XCircle className="h-6 w-6 text-accent-foreground" />
            <p className="text-sm text-accent-foreground">
              Payment cancelled
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
