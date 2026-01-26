import { currencySymbols, currencyNames } from '@data/verificationTiers';
import { cn } from '@lib/utils';
import { Currency } from './models';

interface CurrencySelectorProps {
  selectedCurrency: Currency;
  onCurrencyChange: (currency: Currency) => void;
}

const currencies: Currency[] = ['NGN', 'USD', 'GBP', 'EUR'];

export function CurrencySelector({ selectedCurrency, onCurrencyChange }: CurrencySelectorProps) {
  return (
    <div className="space-y-3">
      <div>
        <h3 className="font-display font-semibold text-foreground mb-1">
          Payment Currency
        </h3>
        <p className="text-sm text-muted-foreground">
          Select your preferred payment currency
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {currencies.map((currency) => {
          const isSelected = selectedCurrency === currency;
          
          return (
            <button
              key={currency}
              onClick={() => onCurrencyChange(currency)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 transition-all duration-200',
                isSelected
                  ? 'border-primary bg-primary/5 text-foreground'
                  : 'border-border bg-card text-muted-foreground hover:border-muted-foreground/30'
              )}
            >
              <span className="font-semibold">{currencySymbols[currency]}</span>
              <span className="text-sm">{currency}</span>
            </button>
          );
        })}
      </div>

      {selectedCurrency !== 'NGN' && (
        <p className="text-xs text-muted-foreground">
          Prices are converted from {currencyNames['NGN']} (₦) to {currencyNames[selectedCurrency]}.
        </p>
      )}
    </div>
  );
}
