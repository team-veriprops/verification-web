"use client"

import { useState } from 'react';
import { TrustBadge } from './TrustBadge';
import { SocialAuthButtons } from './SocialAuthButtons';
import { SocialAuthType } from './models';
import Link from 'next/link';
import { SignUpProgress, SignupStep } from './signup/SignUpProgress';
import { cn} from '@lib/utils';
import SignupDetailsForm from './signup/SignupDetailsForm';
import VerifyEmailPhoneForm from './signup/VerifyEmailPhoneForm';


export default function SignupComponentPage() {

  // Step state
  const [currentStep, setCurrentStep] = useState<SignupStep>(SignupStep.EMAIL_PHONE)

  return (
    <>
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-display font-semibold text-foreground mb-2">
            Sign Up
          </h1>
          <p className="text-muted-foreground">
            Create an account to submit property documents and receive an independent verification report.
          </p>
        </div>
    {/* Progress Indicator */}
      <SignUpProgress currentStep={currentStep} />

      {/* Step 1: Email & Phone Entry */}
      <div className={cn("space-y-6", currentStep !== 'email_phone' && "hidden")}>
        <VerifyEmailPhoneForm onSetCurrentStep={setCurrentStep} />

        {/* Trust Badge */}
          <TrustBadge variant="documents" />

          {/* Social Auth */}
        <SocialAuthButtons
          authType={SocialAuthType.SIGNUP}
          isLoading={false}
        />

          {/* Sign In Link */}
          <p className="text-center text-sm text-muted-foreground pt-2">
            Already have an account?{' '}
            <Link
              href="/auth/sign-in"
              className="font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Sign in
            </Link>
          </p>
      </div>

      {/* Step 2: Account Details */}
      <div className={cn("space-y-6", currentStep !== 'details' && "hidden")}>
        <SignupDetailsForm />
      </div>
    </>
  );
}
