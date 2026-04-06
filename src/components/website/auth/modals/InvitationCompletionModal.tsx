"use client";

import { useState } from 'react';
import { XIcon, ArrowDownRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@components/3rdparty/ui/dialog';
import { Button } from '@components/3rdparty/ui/button';
import { SignUpProgress, SignupStep } from '../signup/SignUpProgress';
import VerifyEmailPhoneForm from '../signup/VerifyEmailPhoneForm';
import { cn } from '@lib/utils';
import { TrustBadge } from '../TrustBadge';
import SignupDetailsForm from '../signup/SignupDetailsForm';
import { EmailSource } from '../models';
import { QueryInvitedUserDto } from '@components/admin/user/models';

export default function InvitationCompletionModal({userInfo, token}:{token: string, userInfo: QueryInvitedUserDto | null}) {
  const [open, setOpen] = useState(true);
  const router = useRouter();
  // Step state
  const [currentStep, setCurrentStep] = useState<SignupStep>(SignupStep.EMAIL_PHONE)
  const emailIsVerified = true


  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      // Only allow closing programmatically
      if (!newOpen) return; // ignore backdrop clicks
      }}
    >
      <DialogOverlay className="fixed inset-0 bg-black/1 backdrop-blur-sm" />
      <DialogContent showCloseButton={false} className={
        cn("sm:max-w-lg overflow-y-auto", 
        currentStep == SignupStep.EMAIL_PHONE ? "h-[calc(100%-4rem)] sm:h-[calc(90%-4rem)] md:h-[calc(70%-4rem)]" : 
        "h-[calc(100%-4rem)] sm:h-[calc(95%-4rem)] md:h-[calc(90%-4rem)]")}>
        <DialogHeader className="relative">
          <DialogTitle className="text-xl font-semibold">Complete your registration</DialogTitle>
          <button
            type="button"
            className="absolute -top-2 right-2 p-1 text-muted-foreground opacity-70 transition-opacity hover:opacity-100"
            onClick={() => setOpen(false)}
            aria-label="Close"
          >
            <XIcon />
            <span className="sr-only">Close</span>
          </button>
        </DialogHeader>

        {/* Progress Indicator */}
        <SignUpProgress currentStep={currentStep} />

        {/* Step 1: Email & Phone Entry */}
        <div className={cn("space-y-6", currentStep !== 'email_phone' && "hidden")}>
            <VerifyEmailPhoneForm 
              onSetCurrentStep={setCurrentStep} 
              email={userInfo?.email} 
              emailSource={EmailSource.ADMIN} 
              emailOtp={token} 
              emailVerified={emailIsVerified} />
        
            {/* Trust Badge */}
            <TrustBadge variant="documents" />
        </div>

        {/* Step 2: Account Details */}
        <div className={cn("space-y-6", currentStep !== 'details' && "hidden")}>
            <SignupDetailsForm firstname={userInfo?.firstname} lastname={userInfo?.lastname} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
