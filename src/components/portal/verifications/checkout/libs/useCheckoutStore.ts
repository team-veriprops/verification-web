import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import {
  VerificationCategory,
  PaymentMethod,
  PaymentState,
  PaymentSummary,
  PaymentResult,
  FXRate,
} from '@components/portal/verifications/checkout/models';

import { verificationTiers, VAT_RATE, fxRates } from '@data/verificationTiers';
import { TransactionCurrency } from 'types/models';

const FX_LOCK_DURATION = 15 * 60 * 1000;

interface CheckoutStore {
  selectedCategory: VerificationCategory;
  selectedCurrency: TransactionCurrency;
  selectedPaymentMethod: PaymentMethod;
  viewVerificationCategory: boolean;

  paymentState: PaymentState;
  paymentResult: PaymentResult | null;

  fxLock: FXRate;
  fxExpired: boolean;
  fxUpdated: boolean;
  timeRemaining: number | null;

  handleCategoryChange: (c: VerificationCategory) => void;
  handleCurrencyChange: (c: TransactionCurrency) => void;
  refreshFxRate: () => void;

  processPayment: () => Promise<void>;
  resetPayment: () => void;

  setSelectedPaymentMethod: (m: PaymentMethod) => void;
  setViewVerificationCategory: (v: boolean) => void;

  selectedTier: typeof verificationTiers[number];
  paymentSummary: PaymentSummary;
}

export const useCheckoutStore = create<CheckoutStore>()(
  persist(
    (set, get) => ({
      selectedCategory: 'standard',
      selectedCurrency: TransactionCurrency.NGN,
      selectedPaymentMethod: 'paystack',
      viewVerificationCategory: false,

      paymentState: 'idle',
      paymentResult: null,

      fxLock: {
        currency: TransactionCurrency.NGN,
        rate: 1,
        lockedAt: null,
        expiresAt: null,
      },

      fxExpired: false,
      fxUpdated: false,
      timeRemaining: null,

      get selectedTier() {
        return (
          verificationTiers.find(t => t.id === get().selectedCategory) ??
          verificationTiers[0]
        );
      },

      get paymentSummary() {
        const tier = get().selectedTier;
        const currency = get().selectedCurrency;
        const fx = get().fxLock;

        const base = tier.priceNGN;
        const vat = base * VAT_RATE;
        const totalNGN = base + vat;

        if (currency === TransactionCurrency.NGN) {
          return { verificationFee: base, vat, total: totalNGN, currency: TransactionCurrency.NGN };
        }

        if (get().fxExpired || !fx.rate) {
          return {
            verificationFee: 0,
            vat: 0,
            total: 0,
            currency,
            ngnEquivalent: totalNGN,
          };
        }

        return {
          verificationFee: base * fx.rate,
          vat: vat * fx.rate,
          total: totalNGN * fx.rate,
          currency,
          fxRate: fx.rate,
          ngnEquivalent: totalNGN,
        };
      },

      handleCategoryChange: (category) => {
        set({ selectedCategory: category });
        if (get().selectedCurrency !== TransactionCurrency.NGN) {
          get().refreshFxRate();
        }
      },

      handleCurrencyChange: (currency) => {
        set({ selectedCurrency: currency });

        if (currency === TransactionCurrency.NGN) {
          set({
            fxLock: { currency: TransactionCurrency.NGN, rate: 1, lockedAt: null, expiresAt: null },
            fxExpired: false,
            timeRemaining: null,
          });
          return;
        }

        const now = new Date();
        const expiresAt = new Date(now.getTime() + FX_LOCK_DURATION);

        set({
          fxLock: {
            currency,
            rate: fxRates[currency],
            lockedAt: now,
            expiresAt,
          },
          fxExpired: false,
          fxUpdated: true,
        });

        setTimeout(() => set({ fxUpdated: false }), 2500);
      },

      refreshFxRate: () => {
        const currency = get().selectedCurrency;
        if (currency !== TransactionCurrency.NGN) {
          get().handleCurrencyChange(currency);
        }
      },

      processPayment: async () => {
        if (get().selectedCurrency !== TransactionCurrency.NGN && get().fxExpired) {
          throw new Error('FX rate expired');
        }

        set({ paymentState: 'processing' });

        await new Promise(r => setTimeout(r, 3000));

        if (Math.random() > 0.1) {
          set({
            paymentState: 'success',
            paymentResult: {
              success: true,
              reference: `VRP-${Date.now().toString(36).toUpperCase()}`,
              amount: get().paymentSummary.total,
              currency: get().selectedCurrency,
              category: get().selectedCategory,
              timestamp: new Date(),
            },
          });
        } else {
          set({ paymentState: 'failure' });
        }
      },

      resetPayment: () => set({ paymentState: 'idle', paymentResult: null }),

      setSelectedPaymentMethod: (m) => set({ selectedPaymentMethod: m }),
      setViewVerificationCategory: (v) => set({ viewVerificationCategory: v }),
    }),
    {
      name: 'veriprops-checkout',

      storage: createJSONStorage(() => localStorage),

      version: 1,

      // Prevent persisting volatile stuff
      partialize: (state: any) => ({
        selectedCategory: state.selectedCategory,
        selectedCurrency: state.selectedCurrency,
        selectedPaymentMethod: state.selectedPaymentMethod,
        viewVerificationCategory: state.viewVerificationCategory,
        fxLock: state.fxLock,
      }),

      // Auto-expire FX after reload
      onRehydrateStorage: () => (state: any) => {
        if (!state?.fxLock?.expiresAt) return;

        const expired =
          new Date(state.fxLock.expiresAt).getTime() <= Date.now();

        if (expired) {
          state.fxExpired = true;
          state.fxLock.rate = 0;
        }
      },
    }
  )
);
