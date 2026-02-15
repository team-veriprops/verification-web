import { useEffect } from 'react';
import { useCheckoutStore } from './useCheckoutStore';
import { TransactionCurrency } from 'types/models';

export function useFxTimer() {
  const { fxLock, selectedCurrency } = useCheckoutStore();
  const set = useCheckoutStore.setState;

  useEffect(() => {
    if (!fxLock.expiresAt || selectedCurrency === TransactionCurrency.NGN) return;

    const interval = setInterval(() => {
      console.log("fxLock: ", fxLock)
      const remaining = new Date(fxLock?.expiresAt ?? "").getTime() - Date.now();

      if (remaining <= 0) {
        set({ fxExpired: true, timeRemaining: 0 });
        clearInterval(interval);
        return;
      }

      set({ timeRemaining: Math.ceil(remaining / 1000) });
    }, 1000);

    return () => clearInterval(interval);
  }, [fxLock.expiresAt, selectedCurrency, set]);
}
