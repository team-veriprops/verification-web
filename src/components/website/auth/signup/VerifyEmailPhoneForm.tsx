import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@3rdparty/ui/button";
import { motion } from "framer-motion";
import VerifiedInput, { VerifiedInputType, verifyFormSchema, type VerifyFormValues } from "@components/ui/verified_input/VerifiedInput";
import { useUserStore } from "../../../admin/user/libs/useUserStore";
import { useEffect } from "react";
import { SignupStep } from "./SignUpProgress";
import { useUserQueries } from "../../../admin/user/libs/useUserQueries";
import { EmailSource, VerificationRequestDto } from "../models";


const STORAGE_KEY = 'veriprops-signup-email_phone-draft'


export type VerifiedInputVerificationProps = {
  type: VerifiedInputType,
  otp?: string,
  onSuccess: () => void,
  onError: (errorMessage: string) => void
}

type SignupProps  = {
  onSetCurrentStep: (step: SignupStep) => void
  email?: string
  emailSource?: EmailSource
  emailOtp?: string
  emailVerified?: boolean
  phoneVerified?: boolean
}

export default function VerifyEmailPhoneForm({onSetCurrentStep, email, emailSource, emailOtp, emailVerified=false, phoneVerified=false}: SignupProps) {
  const {updateCreateUserPayload} = useUserStore();
  const {useSendEmailVerificationMessage, useValidateEmailVerificationOtp, useSendPhoneVerificationMessage, useValidatePhoneVerificationOtp} = useUserQueries();
  
  const sendEmailVerificationMessage = useSendEmailVerificationMessage()
  const validateEmailVerificationOtp = useValidateEmailVerificationOtp()
  const sendPhoneVerificationMessage = useSendPhoneVerificationMessage()
  const validatePhoneVerificationOtp = useValidatePhoneVerificationOtp()

  const form = useForm<VerifyFormValues>({
    resolver: zodResolver(verifyFormSchema),
    mode: "onChange",
    defaultValues: {
      email: email,
      countryCode: "NG",
      phone: "",
      dialCode: "+234",
      emailVerified: emailVerified,
      phoneVerified: phoneVerified
    },
  });

    const { watch, reset } = form
  
    /* -------- Persist to localStorage -------- */
  
  useEffect(()=>{
      updateCreateUserPayload({emailOtp: emailOtp, emailSource: emailSource})
  }, [emailOtp, emailSource, updateCreateUserPayload])
  
  useEffect(() => {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) reset(JSON.parse(saved))
    }, [reset])
  
  useEffect(() => {
      const sub = watch(values => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(values))
      })
      return () => sub.unsubscribe()
    }, [watch])

  const { isValid, isSubmitting } = form.formState;
  const formValues = form.watch();

  /* ---------------------- Validation ------------------------------------------------*/
  // Step 1: Email & Phone submission
  const handleSendEmailVerificationMessage = async (props: VerifiedInputVerificationProps) => {
    const payload: VerificationRequestDto = {email: formValues.email, isANewUser: true, otp: props.otp}

    sendEmailVerificationMessage.mutate(payload, {
            onSuccess: () => {
              props.onSuccess()
            },
            onError: (error) => {
              const errorMessage = error.message || 'Failed to send verification code'
              props.onError(errorMessage)
            }
          });
  };

  const handleSendPhoneVerificationMessage = async (props: VerifiedInputVerificationProps) => {
    
    const phone = {number: formValues.phone, dialCode: formValues.dialCode, countryCode: formValues.countryCode}
    const payload: VerificationRequestDto = {phone: phone, isANewUser: true, otp: props.otp}

    sendPhoneVerificationMessage.mutate(payload, {
            onSuccess: () => {
              props.onSuccess()
            },
            onError: (error) => {
              const errorMessage = error.message || 'Failed to send verification code'
              props.onError(errorMessage)
            }
          });
  };

  const handleSendVerificationMessage = async (props: VerifiedInputVerificationProps) => {
    if(props.type === VerifiedInputType.EMAIL){
      await handleSendEmailVerificationMessage(props)
    }else if(props.type === VerifiedInputType.PHONE){
      await handleSendPhoneVerificationMessage(props)
    }
  }

  // Step 2: OTP verification
    const handleValidateEmailVerificationOtp = async (props: VerifiedInputVerificationProps) => {

    const payload: VerificationRequestDto = {email: formValues.email, isANewUser: true, otp: props.otp}

    validateEmailVerificationOtp.mutate(payload, {
            onSuccess: () => {
              updateCreateUserPayload({emailOtp: props.otp})
              props.onSuccess()
            },
            onError: (error) => {
              const errorMessage = error.message || 'Failed to verify Email address'
              props.onError(errorMessage)
            }
          });
    };

    const handleValidatePhoneVerificationOtp = async (props: VerifiedInputVerificationProps) => {
    const phone = {number: formValues.phone, dialCode: formValues.dialCode, countryCode: formValues.countryCode}

    const payload: VerificationRequestDto = {phone: phone, isANewUser: true, otp: props.otp}

    validatePhoneVerificationOtp.mutate(payload, {
            onSuccess: () => {
              updateCreateUserPayload({phoneOtp: props.otp})
              props.onSuccess()
            },
            onError: (error) => {
              const errorMessage = error.message || 'Failed to verify Phone number'
              props.onError(errorMessage)
            }
          });
    };
  
  
    const handleValidateVerificationOtp = async (props: VerifiedInputVerificationProps) => {
      if(props.type === VerifiedInputType.EMAIL){
        await handleValidateEmailVerificationOtp(props)
      }else if(props.type === VerifiedInputType.PHONE){
        await handleValidatePhoneVerificationOtp(props)
      }
    }

  /* ---------------------- Submit ------------------------------------------------*/
  const onSubmit = (data: VerifyFormValues) => {
    updateCreateUserPayload({email: data.email, phone: {number: data.phone, dialCode: data.dialCode, countryCode: data.countryCode}})

    localStorage.removeItem(STORAGE_KEY)

    onSetCurrentStep(SignupStep.DETAILS)
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <VerifiedInput 
              form={form} 
              field="email" 
              label="Email Address" 
              type={VerifiedInputType.EMAIL} 
              placeholder="you@example.com" 
              inputType="email" 
              onSendVerificationMessage={handleSendVerificationMessage}
              onValidateVerificationOtp={handleValidateVerificationOtp}
            />

            <VerifiedInput 
              form={form} 
              field="phone" 
              label="Phone Number" 
              type={VerifiedInputType.PHONE} 
              placeholder="8039018727" 
              inputType="tel" 
              onSendVerificationMessage={handleSendVerificationMessage}
              onValidateVerificationOtp={handleValidateVerificationOtp}
            />

            <Button type="submit" className="w-full mt-2" size="lg" disabled={!isValid || isSubmitting}>
              {isSubmitting ? "Submitting…" : "Continue securely"}
            </Button>
          </form>
    </motion.div>
  );
};
