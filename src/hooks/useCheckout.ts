import { useState, useCallback, useEffect, useMemo } from 'react';
import {
  VerificationCategory,
  Currency,
  PaymentMethod,
  PaymentState,
  PaymentSummary,
  PaymentResult,
  FXRate,
} from '@components/portal/verifications/checkout/models';
import { verificationTiers, VAT_RATE, fxRates } from '@data/verificationTiers';

const FX_LOCK_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds

export function useCheckout() {
  const [selectedCategory, setSelectedCategory] = useState<VerificationCategory>('standard');
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('NGN');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('paystack');
  const [paymentState, setPaymentState] = useState<PaymentState>('idle');
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);
  
  const [fxLock, setFxLock] = useState<FXRate>({
    currency: 'NGN',
    rate: 1,
    lockedAt: null,
    expiresAt: null,
  });
  
  const [fxExpired, setFxExpired] = useState(false);
  const [fxUpdated, setFxUpdated] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  // Get the selected tier
  const selectedTier = useMemo(() => {
    return verificationTiers.find(t => t.id === selectedCategory)!;
  }, [selectedCategory]);

  // Lock FX rate when category is selected and currency is not NGN
  const lockFxRate = useCallback((currency: Currency) => {
    if (currency === 'NGN') {
      setFxLock({
        currency: 'NGN',
        rate: 1,
        lockedAt: null,
        expiresAt: null,
      });
      setFxExpired(false);
      return;
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + FX_LOCK_DURATION);
    
    setFxLock({
      currency,
      rate: fxRates[currency],
      lockedAt: now,
      expiresAt,
    });
    setFxExpired(false);
    setFxUpdated(true);
    setTimeout(() => setFxUpdated(false), 3000);
  }, []);

  // Handle category change
  const handleCategoryChange = useCallback((category: VerificationCategory) => {
    setSelectedCategory(category);
    if (selectedCurrency !== 'NGN') {
      lockFxRate(selectedCurrency);
    }
  }, [selectedCurrency, lockFxRate]);

  // Handle currency change
  const handleCurrencyChange = useCallback((currency: Currency) => {
    setSelectedCurrency(currency);
    lockFxRate(currency);
  }, [lockFxRate]);

  // Calculate payment summary
  const paymentSummary = useMemo((): PaymentSummary => {
    const basePrice = selectedTier.priceNGN;
    const vat = basePrice * VAT_RATE;
    const totalNGN = basePrice + vat;

    if (selectedCurrency === 'NGN') {
      return {
        verificationFee: basePrice,
        vat,
        total: totalNGN,
        currency: 'NGN',
      };
    }

    const rate = fxLock.rate;
    return {
      verificationFee: basePrice * rate,
      vat: vat * rate,
      total: totalNGN * rate,
      currency: selectedCurrency,
      fxRate: rate,
      ngnEquivalent: totalNGN,
    };
  }, [selectedTier, selectedCurrency, fxLock.rate]);

  // Timer for FX lock countdown
  useEffect(() => {
    if (!fxLock.expiresAt || selectedCurrency === 'NGN') {
      setTimeRemaining(null);
      return;
    }

    const updateTimer = () => {
      const now = new Date().getTime();
      const expires = fxLock.expiresAt!.getTime();
      const remaining = expires - now;

      if (remaining <= 0) {
        setFxExpired(true);
        setTimeRemaining(0);
        return;
      }

      setTimeRemaining(Math.ceil(remaining / 1000));
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [fxLock.expiresAt, selectedCurrency]);

  // Mock payment processing
  const processPayment = useCallback(async () => {
    setPaymentState('processing');

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Mock success (90% success rate for demo)
    const isSuccess = Math.random() > 0.1;

    if (isSuccess) {
      const result: PaymentResult = {
        success: true,
        reference: `VRP-${Date.now().toString(36).toUpperCase()}`,
        amount: paymentSummary.total,
        currency: selectedCurrency,
        category: selectedCategory,
        timestamp: new Date(),
      };
      setPaymentResult(result);
      setPaymentState('success');
    } else {
      setPaymentState('failure');
    }
  }, [paymentSummary.total, selectedCurrency, selectedCategory]);

  // Reset payment state
  const resetPayment = useCallback(() => {
    setPaymentState('idle');
    setPaymentResult(null);
  }, []);

  // Refresh FX rate
  const refreshFxRate = useCallback(() => {
    lockFxRate(selectedCurrency);
  }, [selectedCurrency, lockFxRate]);

  return {
    // State
    selectedCategory,
    selectedCurrency,
    selectedPaymentMethod,
    paymentState,
    paymentResult,
    fxLock,
    fxExpired,
    fxUpdated,
    timeRemaining,
    
    // Computed
    selectedTier,
    paymentSummary,
    tiers: verificationTiers,
    
    // Actions
    handleCategoryChange,
    handleCurrencyChange,
    setSelectedPaymentMethod,
    processPayment,
    resetPayment,
    refreshFxRate,
  };
}
