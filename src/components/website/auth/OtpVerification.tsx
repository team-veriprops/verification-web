import { useState, useEffect, useCallback, useRef } from 'react';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@components/3rdparty/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@components/3rdparty/ui/input-otp';
import { cn } from '@lib/utils';

interface OtpVerificationProps {
  email: string;
  isLoading: boolean;
  onVerify: (otp: string) => Promise<void>;
  onResend: () => Promise<void>;
  onBack: () => void;
  error?: string;
}

const RESEND_COOL_DOWN = 60;

export function OtpVerification({
  email,
  isLoading,
  onVerify,
  onResend,
  onBack,
  error,
}: OtpVerificationProps) {
  const [otp, setOtp] = useState('');
  const [resendTimer, setResendTimer] = useState(RESEND_COOL_DOWN);
  const [isResending, setIsResending] = useState(false);

  const hasVerifiedRef = useRef(false);

  /* ---------------- Resend countdown ---------------- */
  useEffect(() => {
    if (resendTimer <= 0) return;

    const interval = setInterval(() => {
      setResendTimer((t) => {
        if (t <= 1) {
          clearInterval(interval);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [resendTimer]);

  /* ---------------- Auto verify (once) ---------------- */
  useEffect(() => {
    if (
      otp.length !== 6 ||
      isLoading ||
      error ||
      hasVerifiedRef.current
    ) {
      return;
    }

    hasVerifiedRef.current = true;
    onVerify(otp);
  }, [otp, isLoading, error, onVerify]);

  /* ---------------- Resend handler ---------------- */
  const handleResend = useCallback(async () => {
    if (resendTimer > 0 || isResending) return;

    setIsResending(true);
    try {
      await onResend();
      setOtp('');
      setResendTimer(RESEND_COOL_DOWN);
      hasVerifiedRef.current = false;
    } finally {
      setIsResending(false);
    }
  }, [resendTimer, isResending, onResend]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-display font-semibold text-foreground mb-2">
          Verify your email
        </h1>
        <p className="text-muted-foreground">
          We&apos;ve sent a 6-digit verification code to
        </p>
        <p className="font-medium text-foreground mt-1">{email}</p>
      </div>

      <div className="flex flex-col items-center gap-4">
        <InputOTP
          value={otp}
          onChange={(val) => {
            setOtp(val);
            hasVerifiedRef.current = false;
          }}
          maxLength={6}
          disabled={isLoading}
          containerClassName="justify-center"
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} className={cn(error && 'border-destructive')} />
            <InputOTPSlot index={1} className={cn(error && 'border-destructive')} />
            <InputOTPSlot index={2} className={cn(error && 'border-destructive')} />
          </InputOTPGroup>
          <div className="w-3" />
          <InputOTPGroup>
            <InputOTPSlot index={3} className={cn(error && 'border-destructive')} />
            <InputOTPSlot index={4} className={cn(error && 'border-destructive')} />
            <InputOTPSlot index={5} className={cn(error && 'border-destructive')} />
          </InputOTPGroup>
        </InputOTP>

        {error && (
          <p className="text-sm text-destructive animate-fade-in text-center">
            {error}
          </p>
        )}

        {isLoading && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Verifying...</span>
          </div>
        )}
      </div>

      <div className="text-center">
        {resendTimer > 0 ? (
          <p className="text-sm text-muted-foreground">
            Resend code in{' '}
            <span className="font-medium text-foreground">
              {formatTime(resendTimer)}
            </span>
          </p>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending}
            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors disabled:opacity-50"
          >
            {isResending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-3 h-3 animate-spin" />
                Sending...
              </span>
            ) : !isLoading && (
              'Resend code'
            )}
          </button>
        )}
      </div>

      <Button
        type="button"
        variant="ghost"
        onClick={onBack}
        disabled={isLoading}
        className="w-full"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Use a different email
      </Button>
    </div>
  );
}
