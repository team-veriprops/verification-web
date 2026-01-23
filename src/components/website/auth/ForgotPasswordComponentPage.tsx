"use client"

import { useState } from 'react';
import { Loader2, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@components/3rdparty/ui/button';
import { Input } from '@components/3rdparty/ui/input';
import { Label } from '@components/3rdparty/ui/label';
import { z } from 'zod';
import { useAuthQueries } from './libs/useAuthQueries';
import { RecoverPasswordMessagePayload } from './models';
import Link from 'next/link';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export default function ForgotPasswordComponentPage() {
  const {useSendRecoverPasswordMessage} = useAuthQueries();
  const sendRecoverPasswordMessage = useSendRecoverPasswordMessage()
  const [isLoading,  setIsLoading] = useState(false);
  
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    setIsLoading(true)
    
    e.preventDefault();
    
    const result = forgotPasswordSchema.safeParse({ email });
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }
    
    setError('');
    
    const payload: RecoverPasswordMessagePayload = {email: email};

    sendRecoverPasswordMessage.mutate(payload, {
      onSuccess: () => {
      setIsLoading(false)
      setIsSuccess(true);
      },
      onError: () => {
        setIsSuccess(false);
        setIsLoading(false)
      }
    });
  };

  const isFormValid = email.length > 0;

  if (isSuccess) {
    return (
      <>
        <div className="text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
          </div>
          
          {/* Success Message */}
          <h1 className="text-2xl font-display font-semibold text-foreground mb-3">
            Check your email
          </h1>
          <p className="text-muted-foreground mb-8">
            If an account exists for <span className="font-medium text-foreground">{email}</span>, 
            recovery instructions have been sent to your inbox.
          </p>
          
          {/* Back to Sign In */}
          <Link href="/auth/sign-in">
            <Button variant="outline" className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to sign in
            </Button>
          </Link>
          
          {/* Resend Option */}
          <p className="text-sm text-muted-foreground mt-6">
            {"Didn't receive the email? "}
            <button
              type="button"
              onClick={() => setIsSuccess(false)}
              className="font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Try again
            </button>
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Back Link */}
      <Link 
        href="/auth/sign-in"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to sign in
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-display font-semibold text-foreground mb-2">
          Recover secure access
        </h1>
        <p className="text-muted-foreground">
          {"Enter your email address and we'll send you password reset instructions."}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={error ? 'border-destructive focus:border-destructive focus:ring-destructive/20' : ''}
            disabled={isLoading}
            autoComplete="email"
          />
          {error && (
            <p className="text-sm text-destructive animate-fade-in">{error}</p>
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
              Sending instructions...
            </>
          ) : (
            'Send reset instructions'
          )}
        </Button>
      </form>
    </>
  );
}
