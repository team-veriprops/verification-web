import { Check } from 'lucide-react';
import { cn, formatMoneyFxAware } from '@lib/utils';
import { QueryVerificationTierDto, VerificationCategory } from '../models';
import { TransactionCurrency } from 'types/models';

interface CategorySelectorProps {
  tiers: QueryVerificationTierDto[];
  selectedCategory: VerificationCategory;
  onCategoryChange: (category: VerificationCategory) => void;
  currency: TransactionCurrency;
}

export function CategorySelector({
  tiers,
  selectedCategory,
  onCategoryChange,
  currency,
}: CategorySelectorProps) {

  return (
    <div className="space-y-4">
     <div className='flex justify-between'>
      <div>
        <h2 className="font-display font-semibold text-xl text-foreground mb-1">
          Choose Verification Category
        </h2>
        <p className="text-sm text-muted-foreground">
          Select the level of verification that suits your needs
        </p>
      </div>
     </div>

      <div className="grid gap-4 md:grid-cols-3">
        {tiers.map((tier) => {
          const isSelected = selectedCategory === tier.category;
          
          return (
            <button
              type='button'
              key={tier.category}
              onClick={() => onCategoryChange(tier.category)}
              className={cn(
                'category-card text-left transition-all duration-200',
                isSelected && 'selected'
              )}
            >
              {tier.recommended && (
                <div className="absolute top-2 left-0 right-0">
                  <div className="badge-recommended mx-auto -translate-y-1/2 w-fit">
                    Most chosen
                  </div>
                </div>
              )}
              
              <div className={cn(
                'check-indicator',
                isSelected && 'bg-primary border-primary'
              )}>
                {isSelected && <Check className="w-3.5 h-3.5 text-primary-foreground" />}
              </div>

              <div className={cn('pt-2', tier.recommended && 'pt-4')}>
                <h3 className="font-display font-semibold text-foreground mb-1 pr-8">
                  {tier.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {tier.description}
                </p>

                <ul className="space-y-2 mb-4">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      {!feature.includes('plus:') ? (
                        <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      ) : (
                        <span className="w-4" />
                      )}
                      <span className={cn(
                        feature.includes('plus:') ? 'text-muted-foreground italic' : 'text-foreground'
                      )}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="pt-3 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-1">{tier.label}</p>
                  <p className={cn(
                    'price-display transition-all duration-200',
                    isSelected && 'animate-price-update'
                  )}>
                    {formatMoneyFxAware(currency, tier.priceNgn)}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <p className="text-sm text-muted-foreground text-center bg-secondary/50 rounded-lg py-2 px-4">
        ⚠️ Verification category cannot be changed after payment.
      </p>
    </div>
  );
}
