import { CheckCircle, Clock, LayoutDashboard, FileText } from 'lucide-react';

export function WhatHappensNext() {
  const steps = [
    {
      icon: CheckCircle,
      text: 'Payment is confirmed instantly',
    },
    {
      icon: Clock,
      text: 'Verification starts immediately',
    },
    {
      icon: LayoutDashboard,
      text: 'Updates are available in the dashboard',
    },
    {
      icon: FileText,
      text: 'Veriprops may request additional documents if needed',
    },
  ];

  return (
    <div className="checkout-card bg-secondary/30">
      <h3 className="font-display font-semibold text-foreground mb-4">
        What happens after payment?
      </h3>
      
      <ul className="space-y-3">
        {steps.map((step, idx) => (
          <li key={idx} className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <step.icon className="w-4 h-4 text-primary" />
            </div>
            <span className="text-sm text-foreground">{step.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
