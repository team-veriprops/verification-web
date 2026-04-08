'use client'

import { useUserQueries } from "@components/admin/user/libs/useUserQueries";
import { AsyncStateComponent } from "@components/ui/AsyncStateComponent";
import { useState } from "react";
import { SignUpProgress, SignupStep } from "./SignUpProgress";
import { cn } from "@lib/utils";
import VerifyEmailPhoneForm from "./VerifyEmailPhoneForm";
import { EmailSource } from "../models";
import { TrustBadge } from "../TrustBadge";
import SignupDetailsForm from "./SignupDetailsForm";
import { Info } from "lucide-react";

export default function InvitationCompletionComponentPage({inviteId, token}:{inviteId: string, token: string}){
    const {useGetInviteUser} = useUserQueries()
    const { data: inviteData, isLoading, isError } = useGetInviteUser(inviteId)
      // Step state
    const [currentStep, setCurrentStep] = useState<SignupStep>(SignupStep.EMAIL_PHONE)
    const emailIsVerified = true
    const userInfo = inviteData?.data

    return (
        <div>
            {/* Progress Indicator */}
            <SignUpProgress currentStep={currentStep} />

        
            <AsyncStateComponent
                  isLoading={isLoading}
                  isError={isError}
                  data={inviteData}
                  loadingText="Loading invitation details..."
                  errorText="Failed to load your invitation details, please try again later."
                  emptyText="No invitation details found."
                >
                  {() =>  (
                    <TrustBadge icon={Info} text={`Welcome ${userInfo?.firstname}! Kindly fill-in your details to complete your onboarding.`} />
                )}
            </AsyncStateComponent>
            
                    {/* Step 1: Email & Phone Entry */}
                    <div className={cn("space-y-6", currentStep !== 'email_phone' && "hidden")}>
                        {inviteData && <VerifyEmailPhoneForm 
                          onSetCurrentStep={setCurrentStep} 
                          email={userInfo?.email} 
                          emailSource={EmailSource.ADMIN} 
                          emailOtp={token} 
                          emailVerified={emailIsVerified} />}

                        {/* Trust Badge */}
                        {/* <TrustBadge variant="security" /> */}
                    </div>

                    {/* Step 2: Account Details */}
                    <div className={cn("space-y-6", currentStep !== 'details' && "hidden")}>
                        {inviteData && <SignupDetailsForm firstname={userInfo?.firstname} lastname={userInfo?.lastname} invitedUserId={inviteId} />}
                    </div>
        </div>
    )
}
