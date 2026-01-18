import { Lock, ShieldCheck } from 'lucide-react';
import { cn } from '@lib/utils';

interface TrustBadgeProps {
  variant?: 'security' | 'documents';
  className?: string;
}

export function TrustBadge({ variant = 'security', className }: TrustBadgeProps) {
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

  const { icon: Icon, text } = content[variant];

  return (
    <div className={cn('flex items-start gap-3 p-4 rounded-lg bg-muted/50 border border-border/50', className)}>
      <Icon className="w-4 h-4 text-primary mt-0.5 shrink-0" />
      <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
    </div>
  );
}
