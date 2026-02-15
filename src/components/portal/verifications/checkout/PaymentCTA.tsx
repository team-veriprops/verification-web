import { ArrowRight } from 'lucide-react';
import { QueryPaymentCheckoutDto } from '@components/portal/payments/models';
import { formatMoneyFxAware } from '@lib/utils';
import { TransactionCurrency } from 'types/models';

interface PaymentCTAProps {
  currency: TransactionCurrency;
  summary: QueryPaymentCheckoutDto | null;
  disabled?: boolean;
  onSubmit: () => void;
}

export function PaymentCTA({ currency, summary, disabled, onSubmit }: PaymentCTAProps) {

  return (
    <div className="space-y-3">
      <button
        onClick={onSubmit}
        disabled={disabled}
        className="cta-button flex items-center justify-center gap-2 group"
      >
        <span>Pay {formatMoneyFxAware(currency, summary?.total ?? null)} & Start Verification</span>
        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
      </button>
      
      <p className="text-xs text-center text-muted-foreground">
        You will be charged exactly the amount shown above.
      </p>
    </div>
  );
}
