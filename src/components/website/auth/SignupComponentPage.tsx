"use client"

import { useState } from 'react';
import { Loader2, Check } from 'lucide-react';
import { Button } from '@components/3rdparty/ui/button';
import { Input } from '@components/3rdparty/ui/input';
import { Label } from '@components/3rdparty/ui/label';
import { z } from 'zod';
import { PasswordInput } from './PasswordInput';
import { TrustBadge } from './TrustBadge';
import { SocialAuthButtons } from './SocialAuthButtons';
import { useAuthQueries } from './libs/useAuthQueries';
import { SocialAuthProvider, SocialAuthType } from './models';
import { redirect } from 'next/navigation';
import { CreateUserDto, Gender } from '@components/admin/user/models';
import Link from 'next/link';

const signUpSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const benefits = [
  'Confirm ownership, title, and physical existence',
  'Identify encumbrances, disputes, or government claims',
  'Detect forged or inconsistent documents',
  'Prevent double sales and hidden legal risks',
];

export default function SignupComponentPage() {
  const {useCreateUser, useInitSocialAuth} = useAuthQueries();
    const createUser = useCreateUser()
    const initSocialAuth = useInitSocialAuth()
    const [isLoading,  setIsLoading] = useState(false);
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const result = signUpSchema.safeParse({ fullName, email, password, confirmPassword });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        const field = err.path[0] as string;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    setIsLoading(true)
    e.preventDefault();
    if (!validateForm()) return;

    const payload: CreateUserDto = {
                otp: "otp",
                email: email,
                phone: "phone",
                phone_ext: "phone_ext",
                password: password,
                first_name: fullName.split("")[0],
                last_name: fullName.split("")[1],
                gender: Gender.MALE,
            };
            
            createUser.mutate(payload, {
              onSuccess: (data) => {
              setIsLoading(false)
              redirect('/dashboard');
              },
              onError: (error) => {
                setIsLoading(false)
                setErrors({ general: error.message || 'An error occurred' });
              }
            });
  };

  const handleSocialAuth = async (provider: SocialAuthProvider) => {
      const payload = {provider: provider, authType: SocialAuthType.SIGNUP}
  
      initSocialAuth.mutate(payload, {
            onSuccess: (data) => {
            setIsLoading(false)
            redirect('/dashboard');
            },
            onError: (error) => {
        setIsLoading(false)
              setErrors({ general: error.message });
            }
          });
    };

  const isFormValid = fullName.length >= 2 && email.length > 0 && password.length >= 8 && password === confirmPassword;

  // Password strength indicators
  const passwordLength = password.length >= 8;

  return (
    <>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-display font-semibold text-foreground mb-2">
          Verify a property before you pay
        </h1>
        <p className="text-muted-foreground">
          Create an account to submit property documents and receive an independent verification report.
        </p>
      </div>

      {/* Benefits */}
      <div className="mb-6 p-4 rounded-lg bg-secondary/50 border border-border/50">
        <ul className="space-y-2">
          {benefits.map((benefit, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-foreground/80">
              <Check className="w-4 h-4 text-success mt-0.5 shrink-0" />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* General Error */}
        {errors.general && (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
            {errors.general}
          </div>
        )}

        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="fullName">Full name</Label>
          <Input
            id="fullName"
            type="text"
            placeholder="Enter your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={errors.fullName ? 'border-destructive focus:border-destructive focus:ring-destructive/20' : ''}
            disabled={isLoading}
            autoComplete="name"
          />
          {errors.fullName && (
            <p className="text-sm text-destructive animate-fade-in">{errors.fullName}</p>
          )}
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={errors.email ? 'border-destructive focus:border-destructive focus:ring-destructive/20' : ''}
            disabled={isLoading}
            autoComplete="email"
          />
          {errors.email && (
            <p className="text-sm text-destructive animate-fade-in">{errors.email}</p>
          )}
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
            disabled={isLoading}
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
            disabled={isLoading}
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
          disabled={!isFormValid || isLoading}
        >
          {isLoading ? (
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

        {/* Social Auth */}
        <SocialAuthButtons
          onGoogleClick={()=> handleSocialAuth(SocialAuthProvider.GOOGLE)}
          onAppleClick={()=> handleSocialAuth(SocialAuthProvider.APPLE)}
          isLoading={isLoading}
          action="sign-up"
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
    </>
  );
}
