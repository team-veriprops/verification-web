import { MapPin, Home, FileText, Clock, ArrowDown, ChevronDown, ChevronUp } from 'lucide-react';
import { PropertyInfo } from './models';
import { cn } from '@lib/utils';
import { useCheckoutStore } from './libs/useCheckoutStore';

interface PropertyContextProps {
  property: PropertyInfo;
}

export function PropertyContext({ property }: PropertyContextProps) {
  const {viewVerificationCategory, setViewVerificationCategory} = useCheckoutStore()
  return (
    <div className="checkout-card animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center shrink-0">
          <Home className="w-6 h-6 text-muted-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold text-lg text-foreground mb-1">
            {property.name}
          </h3>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              {property.reference}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              {property.location}
            </span>
            <span className="badge-tier">{property.type}</span>
          </div>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-border">
        <div className='flex justify-between gap-3'>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>Verification has not started yet.</span>
          </div>
          
          <div className={cn('', viewVerificationCategory ? 'cursor-zoom-out' : 'cursor-zoom-in')} onClick={() => setViewVerificationCategory(!viewVerificationCategory)}>
            <div className='flex gap-3'>
              <span>Basic Verification</span>
              {
              viewVerificationCategory ? 
              <ChevronDown className='w-4 h-4' /> :
              <ChevronUp className='w-4 h-4' />
              }
            </div>
            { viewVerificationCategory && <span className='text-xs text-muted-foreground'>choose category below</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
