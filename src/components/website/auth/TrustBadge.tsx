import { Lock, ShieldCheck } from 'lucide-react';
import { cn } from '@lib/utils';

interface TrustBadgeProps {
  variant?: 'security' | 'documents';
  className?: string;
  icon?: React.ComponentType;
  text?: string;
}

export function TrustBadge({ variant = 'security', className, icon, text }: TrustBadgeProps) {
  const content = {
    security: {
      icon: Lock,
      text: 'Your documents, reports, and verification data are encrypted and securely protected.',
    },
    documents: {
      icon: ShieldCheck,
      text: 'All submitted documents are handled confidentially and used strictly for verification purposes.',
    },
  };

  const { icon: defaultIcon, text: defaultText } = content[variant];
  const Icon = icon ?? defaultIcon;
  const resolvedText = text ?? defaultText;

  return (
    <div className={cn('flex items-start gap-3 p-4 rounded-lg bg-muted/50 border border-border/50', className)}>
      <Icon className="w-4 h-4 text-primary mt-0.5 shrink-0" />
      <p className="text-sm text-muted-foreground leading-relaxed">{resolvedText}</p>
    </div>
  );
}
