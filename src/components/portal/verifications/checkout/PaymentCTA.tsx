import { ArrowRight } from 'lucide-react';
import { currencySymbols } from '@data/verificationTiers';
import { PaymentSummary } from './models';

interface PaymentCTAProps {
  summary: PaymentSummary;
  disabled?: boolean;
  onSubmit: () => void;
}

export function PaymentCTA({ summary, disabled, onSubmit }: PaymentCTAProps) {
  const symbol = currencySymbols[summary.currency];
  
  const formatAmount = () => {
    if (summary.currency === 'NGN') {
      return `${symbol}${summary.total.toLocaleString()}`;
    }
    return `${symbol}${summary.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="space-y-3">
      <button
        onClick={onSubmit}
        disabled={disabled}
        className="cta-button flex items-center justify-center gap-2 group"
      >
        <span>Pay {formatAmount()} & Start Verification</span>
        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
      </button>
      
      <p className="text-xs text-center text-muted-foreground">
        You will be charged exactly the amount shown above.
      </p>
    </div>
  );
}
