import { Shield } from 'lucide-react';

export default function TrustHeader() {
  return (
    <div className="lg:hidden trust-panel p-6 rounded-xl mb-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/10">
          <Shield className="w-5 h-5 text-accent" />
        </div>
        <div>
          <span className="text-xs font-medium text-white/70 uppercase tracking-wider">
            Veriprops
          </span>
          <h2 className="text-lg font-display text-white">
            Property Verification
          </h2>
        </div>
      </div>
      <p className="text-sm text-white/80 leading-relaxed">
        Verify property authenticity and legal standing before you commit your money.
      </p>
    </div>
  );
}
