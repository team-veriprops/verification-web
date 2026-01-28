import { Receipt, Info } from 'lucide-react';
import { PaymentSummary } from './models';
import { currencySymbols } from '@data/verificationTiers';
import { cn } from '@lib/utils';

interface PaymentSummaryCardProps {
  summary: PaymentSummary;
  tierName: string;
  animate?: boolean;
}

export function PaymentSummaryCard({ summary, tierName, animate }: PaymentSummaryCardProps) {
  const symbol = currencySymbols[summary.currency];

  const formatAmount = (amount: number) => {
    if (summary.currency === 'NGN') {
      return `${symbol}${amount.toLocaleString()}`;
    }
    return `${symbol}${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className={cn(
      'checkout-card',
      animate && 'animate-fade-in'
    )}>
      <div className="flex items-center gap-2 mb-4">
        <Receipt className="w-5 h-5 text-primary" />
        <h3 className="font-display font-semibold text-foreground">Payment Summary</h3>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">
            {tierName}
          </span>
          <span className={cn(
            'font-medium text-foreground transition-all duration-200',
            animate && 'animate-price-update'
          )}>
            {formatAmount(summary.verificationFee)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-muted-foreground flex items-center gap-1">
            VAT (7.5%)
            <span className="group relative">
              <Info className="w-3.5 h-3.5 cursor-help" />
              <span className="invisible group-hover:visible absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-foreground text-background rounded whitespace-nowrap">
                Nigerian tax regulation
              </span>
            </span>
          </span>
          <span className={cn(
            'font-medium text-foreground transition-all duration-200',
            animate && 'animate-price-update'
          )}>
            {formatAmount(summary.vat)}
          </span>
        </div>

        <div className="section-divider !my-3" />

        <div className="flex justify-between items-center">
          <span className="font-semibold text-foreground">Total Payable</span>
          <span className={cn(
            'text-2xl font-bold text-primary transition-all duration-200',
            animate && 'animate-price-update'
          )}>
            {formatAmount(summary.total)}
          </span>
        </div>

        {summary.currency !== 'NGN' && summary.ngnEquivalent && (
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>NGN equivalent</span>
            <span>₦{summary.ngnEquivalent.toLocaleString()}</span>
          </div>
        )}
      </div>

      {summary.currency !== 'NGN' && (
        <p className="mt-4 text-xs text-muted-foreground bg-secondary/50 rounded-lg py-2 px-3">
          Converted from Nigerian Naira (₦). VAT is charged in compliance with Nigerian tax regulations.
        </p>
      )}

      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-sm text-center text-muted-foreground">
          🔒 You will be charged exactly the amount shown above.
        </p>
      </div>
    </div>
  );
}
