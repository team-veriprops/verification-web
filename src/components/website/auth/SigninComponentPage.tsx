"use client"

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@components/3rdparty/ui/button';
import { Input } from '@components/3rdparty/ui/input';
import { Label } from '@components/3rdparty/ui/label';
import { z } from 'zod';
import { SocialAuthButtons } from './SocialAuthButtons';
import { TrustBadge } from './TrustBadge';
import { PasswordInput } from './PasswordInput';
import { useAuthQueries } from './libs/useAuthQueries';
import { LoginPayload, SocialAuthProvider, SocialAuthType } from './models';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { openSocialPopup } from '@lib/utils';

const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export default function SigninComponentPage() {  
    const {useLogin, useInitSocialAuth} = useAuthQueries();
    const login = useLogin()
    const initSocialAuth = useInitSocialAuth()
    const [isLoading,  setIsLoading] = useState(false);
    const [socialLoginHasError,  setSocialLoginHasError] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  const validateForm = () => {
    const result = signInSchema.safeParse({ email, password });
    if (!result.success) {
      const fieldErrors: { email?: string; password?: string } = {};
      result.error.issues.forEach((err) => {
        if (err.path[0] === 'email') fieldErrors.email = err.message;
        if (err.path[0] === 'password') fieldErrors.password = err.message;
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

        const payload: LoginPayload = {
          username: email,
          password: password
        };
        
        login.mutate(payload, {
          onSuccess: (data) => {
          setIsLoading(false)
          redirect('/dashboard');
          },
          onError: (error) => {
            console.log("error: ", error)
            setIsLoading(false)
            setErrors({ general: error.message });
          }
        });
  };

  const handleSocialAuth = async (provider: SocialAuthProvider) => {
    const payload = {provider: provider, authType: SocialAuthType.LOGIN}

    initSocialAuth.mutate(payload, {
                onSuccess: (data) => {
                setSocialLoginHasError(false)
                openSocialPopup(
                  data.redirectUrl,
                  provider
                );
                },
                onError: (error) => {
                  setSocialLoginHasError(true)
                  setErrors({ general: error.message });
                }
              });
  };

  const isFormValid = email.length > 0 && password.length > 0;

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-display font-semibold text-foreground mb-2">
          Secure access to property verification
        </h1>
        <p className="text-muted-foreground">
          Sign in to request, track, or review property verification reports.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* General Error */}
        {errors.general && (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
            {errors.general}
          </div>
        )}

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
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/auth/forgot-password"
              className="text-sm text-primary hover:text-primary/80 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <PasswordInput
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!errors.password}
            disabled={isLoading}
            autoComplete="current-password"
          />
          {errors.password && (
            <p className="text-sm text-destructive animate-fade-in">{errors.password}</p>
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
              Signing in...
            </>
          ) : (
            'Continue securely'
          )}
        </Button>

        {/* Trust Badge */}
        <TrustBadge variant="security" />

        {/* Social Auth */}
        <SocialAuthButtons
          onGoogleClick={()=> handleSocialAuth(SocialAuthProvider.GOOGLE)}
          onAppleClick={()=> handleSocialAuth(SocialAuthProvider.APPLE)}
          isLoading={isLoading}
          socialLoginHasError={socialLoginHasError}
          action="sign-in"
        />

        {/* Sign Up Link */}
        <p className="text-center text-sm text-muted-foreground pt-4">
          New to Veriprops?{' '}
          <Link
            href="/auth/sign-up"
            className="font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Create an account
          </Link>
        </p>
      </form>
    </>
  );
}