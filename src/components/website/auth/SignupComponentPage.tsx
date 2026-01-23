"use client"

import { useCallback, useRef, useState } from 'react';
import { Loader2, Check, Mail } from 'lucide-react';
import { Button } from '@components/3rdparty/ui/button';
import { Input } from '@components/3rdparty/ui/input';
import { Label } from '@components/3rdparty/ui/label';
import { z } from 'zod';
import { PasswordInput } from './PasswordInput';
import { TrustBadge } from './TrustBadge';
import { SocialAuthButtons } from './SocialAuthButtons';
import { useAuthQueries } from './libs/useAuthQueries';
import { EmailValidationRequest, OtpVerificationRequest, SocialAuthProvider, SocialAuthType } from './models';
import { useRouter } from 'next/navigation';
import { CreateUserDto} from '@components/admin/user/models';
import Link from 'next/link';
import { SignUpProgress } from './SignUpProgress';
import { cn, isMobileBrowser} from '@lib/utils';
import { OtpVerification } from './OtpVerification';
import { openSocialPopup } from './libs/auth-utils';

type Step = 'email' | 'otp' | 'details';

const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

const detailsSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function SignupComponentPage() {
  const router = useRouter();
  const {useSendEmailValidationMessage, useValidateEmailVerificationOtp, useCreateUser, useInitSocialAuth} = useAuthQueries();
    
    const sendEmailValidationMessage = useSendEmailValidationMessage()
    const validateEmailVerificationOtp = useValidateEmailVerificationOtp()
    const createUser = useCreateUser()
    const initSocialAuth = useInitSocialAuth()

    const [loading, setLoading] = useState<{
      email: boolean;
      otp: boolean;
      details: boolean;
      social: boolean;
    }>({
      email: false,
      otp: false,
      details: false,
      social: false,
    });


  // Step state
  const [currentStep, setCurrentStep] = useState<Step>('email')
  
  // Form data
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Error states
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [otpError, setOtpError] = useState('');
  const [socialAuthError, setSocialAuthError] = useState<string | null>(null);

  const popupRef = useRef<Window | null>(null);

  // Step 1: Email submission
  const handleEmailSubmit = async (e?: React.FormEvent) => {
    if(e){
      e.preventDefault()
    }
    
    const result = emailSchema.safeParse({ email });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        const field = err.path[0] as string;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    
    setErrors({});
    const payload: EmailValidationRequest = {email: email, is_a_new_user: true}

    setLoading(l => ({ ...l, email: true }));
    sendEmailValidationMessage.mutate(payload, {
            onSuccess: () => {
            setLoading(l => ({ ...l, email: false }));
            setCurrentStep('otp');
            },
            onError: (error) => {
              setLoading(l => ({ ...l, email: false }));
              setErrors({ email: error.message || 'Failed to send verification code' });
            }
          });
  };

  // Step 2: OTP verification
  const handleOtpVerify = useCallback(async (otp: string) => {
    setOtpError('');

    const payload: OtpVerificationRequest = {email_or_phone: email, otp: otp}

    setLoading(l => ({ ...l, otp: true }));
    validateEmailVerificationOtp.mutate(payload, {
            onSuccess: () => {
            setOtp(otp)
            setLoading(l => ({ ...l, otp: false }));
            setCurrentStep('details');
            },
            onError: (error) => {
              setLoading(l => ({ ...l, otp: false }));
              setOtpError(error.message || 'Invalid verification code');
            }
          });
  }, [email, validateEmailVerificationOtp]);

  const handleOtpResend = async () => {
    await handleEmailSubmit();
  };

  const handleOtpBack = useCallback(() => {
    setCurrentStep('email');
    setOtpError('');
  }, []);

  // Step 3: Account details submission
  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = detailsSchema.safeParse({ firstName, lastName, password, confirmPassword });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        const field = err.path[0] as string;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    
    setErrors({});

    setLoading(l => ({ ...l, details: true }));
    const payload: CreateUserDto = {
                otp: otp,
                email: email,
                password: password,
                firstname: firstName,
                lastname: lastName,
            };
            
            createUser.mutate(payload, {
              onSuccess: () => {
              setLoading(l => ({ ...l, details: false }));
              router.push("/portal/dashboard");
              },
              onError: (error) => {
                setLoading(l => ({ ...l, details: false }));
                setErrors({ general: error.message || 'An error occurred' });
              }
            });
  };

const handleSocialAuth = (provider: SocialAuthProvider) => {
  const payload = {
    provider,
    authType: SocialAuthType.SIGNUP,
  };

  const isMobile = isMobileBrowser();

  // Desktop: open popup immediately (sync)
  popupRef.current = !isMobile
    ? openSocialPopup('about:blank', provider)
    : null;

  setLoading(l => ({ ...l, social: true }));
  initSocialAuth.mutate(payload, {
    onSuccess: (data) => {
      setLoading(l => ({ ...l, social: false }));
      setSocialAuthError('');

      if (isMobile) {
        // Mobile-safe full redirect
        window.location.href = data.redirectUrl;
        return;
      }

      // Desktop: redirect existing popup
      popupRef.current!.location.href = data.redirectUrl;
    },
    onError: (error) => {
      setLoading(l => ({ ...l, social: false }));
      popupRef.current?.close();
      popupRef.current = null;

      setSocialAuthError(error.message || 'Social sign-up failed');
    },
  });
};

  const isEmailValid = email.length > 0 && emailSchema.safeParse({ email }).success;
  const isDetailsValid = firstName.length >= 2 && lastName.length >= 2 && password.length >= 8 && password === confirmPassword;
  const passwordLength = password.length >= 8;

  return (
    <>

    {/* Progress Indicator */}
      <SignUpProgress currentStep={currentStep} />

      {/* Step 1: Email Entry */}
      <div className={cn(
        'transition-all duration-300',
        currentStep === 'email' ? 'opacity-100' : 'opacity-0 hidden'
      )}>
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-display font-semibold text-foreground mb-2">
            Verify a property before you pay
          </h1>
          <p className="text-muted-foreground">
            Create an account to submit property documents and receive an independent verification report.
          </p>
        </div>

        {/* Email Form */}
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          {errors.general && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              {errors.general}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={errors.email ? 'border-destructive focus:border-destructive focus:ring-destructive/20' : ''}
              disabled={loading.email}
              autoComplete="email"
            />
            {errors.email && (
              <p className="text-sm text-destructive animate-fade-in">{errors.email}</p>
            )}
          </div>

          <Button
            type="submit"
            variant="default"
            className="w-full"
            disabled={!isEmailValid || loading.email}
          >
            {loading.email ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending code...
              </>
            ) : (
              <>
                <Mail className="w-4 h-4" />
                Send verification code
              </>
            )}
          </Button>

          {/* Trust Badge */}
          <TrustBadge variant="documents" />

          {/* Social Auth */}
        <SocialAuthButtons
          onGoogleClick={()=> handleSocialAuth(SocialAuthProvider.GOOGLE)}
          onAppleClick={()=> handleSocialAuth(SocialAuthProvider.APPLE)}
          isLoading={loading.social}
          action="sign-up"
          inputSocialAuthError={socialAuthError!}
          popupRef={popupRef}
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
        </form>
      </div>

      {/* Step 2: OTP Verification */}
      <div className={cn(
        'transition-all duration-300',
        currentStep === 'otp' ? 'opacity-100' : 'opacity-0 hidden'
      )}>
        <OtpVerification
          email={email}
          isLoading={loading.otp}
          onVerify={handleOtpVerify}
          onResend={handleOtpResend}
          onBack={handleOtpBack}
          error={otpError}
        />
      </div>

      {/* Step 3: Account Details */}
      <div className={cn(
        'transition-all duration-300',
        currentStep === 'details' ? 'opacity-100' : 'opacity-0 hidden'
      )}>
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-display font-semibold text-foreground mb-2">
            Complete your account
          </h1>
          <p className="text-muted-foreground">
            Enter your details to finish creating your secure Veriprops account.
          </p>
        </div>

        {/* Details Form */}
        <form onSubmit={handleDetailsSubmit} className="space-y-4">
          {errors.general && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              {errors.general}
            </div>
          )}

          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First name</Label>
              <Input
                id="firstName"
                type="text"
                placeholder="John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={errors.firstName ? 'border-destructive focus:border-destructive focus:ring-destructive/20' : ''}
                disabled={loading.details}
                autoComplete="given-name"
              />
              {errors.firstName && (
                <p className="text-sm text-destructive animate-fade-in">{errors.firstName}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input
                id="lastName"
                type="text"
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={errors.lastName ? 'border-destructive focus:border-destructive focus:ring-destructive/20' : ''}
                disabled={loading.details}
                autoComplete="family-name"
              />
              {errors.lastName && (
                <p className="text-sm text-destructive animate-fade-in">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <PasswordInput
              id="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!errors.password}
              disabled={loading.details}
              autoComplete="new-password"
            />
            {password.length > 0 && (
              <div className="flex items-center gap-2 text-xs">
                <div className={`flex items-center gap-1 ${passwordLength ? 'text-success' : 'text-muted-foreground'}`}>
                  <Check className={`w-3 h-3 ${passwordLength ? 'opacity-100' : 'opacity-50'}`} />
                  <span>8+ characters</span>
                </div>
              </div>
            )}
            {errors.password && (
              <p className="text-sm text-destructive animate-fade-in">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm password</Label>
            <PasswordInput
              id="confirmPassword"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={!!errors.confirmPassword}
              disabled={loading.details}
              autoComplete="new-password"
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive animate-fade-in">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="default"
            className="w-full"
            disabled={!isDetailsValid || loading.details}
          >
            {loading.details ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating account...
              </>
            ) : (
              'Create secure account'
            )}
          </Button>

          {/* Consent */}
        <p className="text-xs text-center text-muted-foreground">
          {"By creating an account, you agree to Veriprops' "}
          <a href="#" className="text-primary hover:underline">{"Terms of Service"}</a>
          {" and "}
          <a href="#" className="text-primary hover:underline">{"Privacy Policy"}</a>.
        </p>

          {/* Trust Badge */}
          <TrustBadge variant="documents" />
        </form>
      </div>
    </>
  );
}
