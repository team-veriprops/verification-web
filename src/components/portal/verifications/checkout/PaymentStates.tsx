import { Loader2, CheckCircle2, XCircle, ArrowRight, RefreshCw } from 'lucide-react';
import { currencySymbols } from '@data/verificationTiers';
import { verificationTiers } from '@data/verificationTiers';
import { PaymentResult, PaymentState } from './models';

interface PaymentStatesProps {
  state: PaymentState;
  result: PaymentResult | null;
  onRetry: () => void;
  onViewProgress: () => void;
}

export function PaymentStates({ state, result, onRetry, onViewProgress }: PaymentStatesProps) {
  if (state === 'processing') {
    return (
      <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="checkout-card max-w-md w-full text-center animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
          <h2 className="font-display font-bold text-xl text-foreground mb-2">
            Processing your payment…
          </h2>
          <p className="text-muted-foreground">
            Please do not refresh or close this page.
          </p>
        </div>
      </div>
    );
  }

  if (state === 'success' && result) {
    const symbol = currencySymbols[result.currency];
    const tierName = verificationTiers.find(t => t.id === result.category)?.name;
    
    const formatAmount = () => {
      if (result.currency === 'NGN') {
        return `${symbol}${result.amount.toLocaleString()}`;
      }
      return `${symbol}${result.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    return (
      <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="checkout-card max-w-md w-full text-center animate-slide-up">
          <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-success" />
          </div>
          <h2 className="font-display font-bold text-xl text-foreground mb-2">
            Payment successful!
          </h2>
          <p className="text-muted-foreground mb-6">
            Your verification has been initiated.
          </p>

          <div className="bg-secondary/50 rounded-xl p-4 mb-6 text-left space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Category</span>
              <span className="font-medium text-foreground">{tierName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Amount paid</span>
              <span className="font-medium text-foreground">{formatAmount()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Reference</span>
              <span className="font-mono text-xs text-foreground">{result.reference}</span>
            </div>
          </div>

          <button
            onClick={onViewProgress}
            className="cta-button flex items-center justify-center gap-2 group"
          >
            <span>View verification progress</span>
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    );
  }

  if (state === 'failure') {
    return (
      <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="checkout-card max-w-md w-full text-center animate-slide-up">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="font-display font-bold text-xl text-foreground mb-2">
            Payment not completed
          </h2>
          <p className="text-muted-foreground mb-6">
            No charges were made to your account.
          </p>

          <button
            onClick={onRetry}
            className="cta-button flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Try again</span>
          </button>
        </div>
      </div>
    );
  }

  return null;
}
