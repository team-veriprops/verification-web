import { Receipt, Info } from 'lucide-react';
import { cn, convertMoney, formatMoney, formatMoneyFxAware } from '@lib/utils';
import { TransactionCurrency } from 'types/models';
import { QueryPaymentCheckoutDto } from '@components/portal/payments/models';

interface PaymentSummaryCardProps {
  currency: TransactionCurrency;
  summary: QueryPaymentCheckoutDto | null;
  tierName: string;
  animate?: boolean;
}

export function PaymentSummaryCard({ currency, summary, tierName, animate }: PaymentSummaryCardProps) {
  const vatPercent = (summary?.vatRate ?? 0) * 100;

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
            {formatMoneyFxAware(currency, summary?.cost ?? null)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-muted-foreground flex items-center gap-1">
            {`VAT (${vatPercent}%)`}
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
            {formatMoneyFxAware(currency, summary?.tax ?? null)}
          </span>
        </div>

        <div className="section-divider my-3!" />

        <div className="flex justify-between items-center">
          <span className="font-semibold text-foreground">Total Payable</span>
          <span className={cn(
            'text-2xl font-bold text-primary transition-all duration-200',
            animate && 'animate-price-update'
          )}>
            {formatMoneyFxAware(currency, summary?.total ?? null)}
          </span>
        </div>

        {currency !== TransactionCurrency.NGN && (
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>NGN equivalent</span>
            <span>{formatMoney(summary?.total ?? null)}</span>
          </div>
        )}
      </div>

      {currency !== TransactionCurrency.NGN && (
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
