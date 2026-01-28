import { Lock, RefreshCw, AlertCircle } from 'lucide-react';
import { currencySymbols } from '@data/verificationTiers';
import { cn } from '@lib/utils';
import { Currency, FXRate } from './models';

interface FXLockIndicatorProps {
  fxLock: FXRate;
  currency: Currency;
  timeRemaining: number | null;
  fxExpired: boolean;
  fxUpdated: boolean;
  onRefresh: () => void;
}

export function FXLockIndicator({
  fxLock,
  currency,
  timeRemaining,
  fxExpired,
  fxUpdated,
  onRefresh,
}: FXLockIndicatorProps) {
  if (currency === 'NGN') return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatRate = () => {
    const rate = 1 / fxLock.rate;
    return `₦${rate.toLocaleString(undefined, { maximumFractionDigits: 0 })} = ${currencySymbols[currency]}1`;
  };

  if (fxExpired) {
    return (
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20 animate-fade-in">
        <div className="flex items-center gap-2 text-destructive">
          <AlertCircle className="w-5 h-5" />
          <span className="font-medium">Your exchange rate has expired.</span>
        </div>
        <button
          onClick={onRefresh}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-destructive text-destructive-foreground font-medium text-sm hover:opacity-90 transition-opacity w-fit"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh Rate
        </button>
      </div>
    );
  }

  return (
    <div className={cn(
      'p-4 rounded-xl border transition-all duration-300',
      fxUpdated 
        ? 'bg-success/10 border-success/30' 
        : 'bg-accent/10 border-accent/30'
    )}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="fx-lock-indicator">
            <Lock className="w-4 h-4" />
            <span>Exchange rate locked</span>
          </div>
          <span className="text-sm font-medium text-foreground">
            {formatRate()}
          </span>
        </div>
        
        {timeRemaining !== null && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Guaranteed for</span>
            <span className={cn(
              'font-mono font-semibold px-2 py-0.5 rounded',
              timeRemaining < 60 ? 'bg-destructive/10 text-destructive' : 'bg-secondary text-foreground'
            )}>
              {formatTime(timeRemaining)}
            </span>
          </div>
        )}
      </div>

      {fxUpdated && (
        <p className="mt-2 text-sm text-success font-medium animate-fade-in">
          ✓ Your exchange rate has been updated.
        </p>
      )}
    </div>
  );
}
