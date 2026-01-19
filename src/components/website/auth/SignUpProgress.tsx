import { Check } from 'lucide-react';
import { cn } from '@lib/utils';

type Step = 'email' | 'otp' | 'details';

interface SignUpProgressProps {
  currentStep: Step;
}

const steps = [
  { id: 'email', label: 'Email' },
  { id: 'otp', label: 'Verify' },
  { id: 'details', label: 'Details' },
] as const;

export function SignUpProgress({ currentStep }: SignUpProgressProps) {
  const currentIndex = steps.findIndex(s => s.id === currentStep);

  return (
    <div className="flex items-center justify-center gap-2 mb-20">
      {steps.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = step.id === currentStep;
        
        return (
          <div key={step.id} className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300',
                  isCompleted && 'bg-success text-success-foreground',
                  isCurrent && 'bg-primary text-primary-foreground',
                  !isCompleted && !isCurrent && 'bg-muted text-muted-foreground'
                )}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={cn(
                  'text-sm font-medium transition-colors duration-300 hidden sm:block',
                  isCurrent && 'text-foreground',
                  !isCurrent && 'text-muted-foreground'
                )}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  'w-8 h-0.5 transition-colors duration-300',
                  index < currentIndex ? 'bg-success' : 'bg-muted'
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
