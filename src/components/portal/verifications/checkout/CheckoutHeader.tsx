import { Shield, X } from 'lucide-react';

type props = {
  handleClose: ()=> void
}

export function CheckoutHeader({handleClose}: props) {
  return (
    <header className="bg-card border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl text-foreground">Veriprops</span>
          </div>

          <div className='flex gap-3'>
            <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="w-4 h-4" />
              <span>Secure Checkout</span>
            </div>
            <button onClick={handleClose} className="text-gray-600 hover:text-black">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
