import { cn } from '@lib/utils';
import { CreditCard, Shield } from 'lucide-react';
import { Currency, PaymentMethod } from './models';

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod;
  onMethodChange: (method: PaymentMethod) => void;
  currency: Currency;
}

const paymentMethods: { id: PaymentMethod; name: string; supportedCurrencies: Currency[] }[] = [
  {
    id: 'paystack',
    name: 'Paystack',
    supportedCurrencies: ['NGN', 'USD', 'GBP'],
  },
  {
    id: 'flutterwave',
    name: 'Flutterwave',
    supportedCurrencies: ['NGN', 'USD', 'GBP', 'EUR'],
  },
];

export function PaymentMethodSelector({
  selectedMethod,
  onMethodChange,
  currency,
}: PaymentMethodSelectorProps) {
  const availableMethods = paymentMethods.filter(m => 
    m.supportedCurrencies.includes(currency)
  );

  return (
    <div className="space-y-3">
      <div>
        <h3 className="font-display font-semibold text-foreground mb-1">
          Payment Method
        </h3>
        <p className="text-sm text-muted-foreground">
          Choose how you'd like to pay
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {availableMethods.map((method) => {
          const isSelected = selectedMethod === method.id;
          
          return (
            <button
              key={method.id}
              onClick={() => onMethodChange(method.id)}
              className={cn(
                'payment-method-card',
                isSelected && 'selected'
              )}
            >
              <div className={cn(
                'w-10 h-10 rounded-lg flex items-center justify-center transition-colors',
                isSelected ? 'bg-primary' : 'bg-secondary'
              )}>
                <CreditCard className={cn(
                  'w-5 h-5',
                  isSelected ? 'text-primary-foreground' : 'text-muted-foreground'
                )} />
              </div>
              <div className="text-left">
                <p className="font-medium text-foreground">{method.name}</p>
                <p className="text-xs text-muted-foreground">
                  {method.supportedCurrencies.join(', ')}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary/50 rounded-lg py-2 px-3">
        <Shield className="w-4 h-4 flex-shrink-0" />
        <span>Your payment is processed securely. Veriprops does not store card details.</span>
      </div>
    </div>
  );
}
