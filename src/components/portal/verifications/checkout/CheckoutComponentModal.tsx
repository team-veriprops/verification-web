import { useState } from 'react';
import { PropertyContext } from './PropertyContext';
import { CategorySelector } from './CategorySelector';
import { CurrencySelector } from './CurrencySelector';
import { FXLockIndicator } from './FXLockIndicator';
import { PaymentSummaryCard } from './PaymentSummaryCard';
import { PaymentMethodSelector } from './PaymentMethodSelector';
import { WhatHappensNext } from './WhatHappensNext';
import { PaymentCTA } from './PaymentCTA';
import { PaymentStates } from './PaymentStates';
import { CheckoutFooter } from './CheckoutFooter';
import { fxRates } from '@data/verificationTiers';
import { toast } from 'sonner';
import { CheckoutHeader } from './CheckoutHeader';
import { PropertyInfo } from './models';
import { useCheckout } from '@components/portal/verifications/checkout/libs/useCheckout';
import { useVerificationStore } from '../libs/useVerificationStore';
import { useBodyOverflowHidden } from '@hooks/useBodyOverflowHidden';
import { motion } from 'framer-motion';

// Mock property data
const mockProperty: PropertyInfo = {
  name: '3 Bedroom Duplex at Lekki Phase 1',
  reference: 'VRP-2024-0847',
  location: 'Lekki Phase 1, Lagos, Nigeria',
  type: 'Residential',
};

export default function CheckoutComponentModal(){
  const { viewVerificationCheckoutModal } = useVerificationStore();
  // Lock body scroll when modal is open
  useBodyOverflowHidden(viewVerificationCheckoutModal);

  const {
    selectedCategory,
    selectedCurrency,
    selectedPaymentMethod,
    paymentState,
    paymentResult,
    fxLock,
    fxExpired,
    fxUpdated,
    timeRemaining,
    selectedTier,
    paymentSummary,
    tiers,
    handleCategoryChange,
    handleCurrencyChange,
    setSelectedPaymentMethod,
    processPayment,
    resetPayment,
    refreshFxRate,
  } = useCheckout();

  const [priceAnimating, setPriceAnimating] = useState(false);

  const onCategoryChange = (category: typeof selectedCategory) => {
    handleCategoryChange(category);
    setPriceAnimating(true);
    setTimeout(() => setPriceAnimating(false), 300);
  };

  const onCurrencyChange = (currency: typeof selectedCurrency) => {
    handleCurrencyChange(currency);
    setPriceAnimating(true);
    setTimeout(() => setPriceAnimating(false), 300);
  };

  const handlePayment = () => {
    if (fxExpired && selectedCurrency !== 'NGN') {
      toast.error('Please refresh your exchange rate before proceeding.');
      return;
    }
    processPayment();
  };

  const handleViewProgress = () => {
    toast.success('Redirecting to dashboard...', {
      description: 'This is a demo - in production, this would navigate to the verification dashboard.',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-63 bg-background min-h-screen flex flex-col"
    >
      <CheckoutHeader />

      <main className="overflow-y-auto">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 overflow-y-auto py-8">
          {/* Page Title */}
          <div className="mb-8 text-center">
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-foreground mb-2">
              Property Verification Checkout
            </h1>
            <p className="text-muted-foreground">
              Complete your payment to start the verification process
            </p>
          </div>

          <div className="space-y-8">
            {/* Property Context */}
            <PropertyContext property={mockProperty} />

            {/* Category Selection */}
            <section>
              <CategorySelector
                tiers={tiers}
                selectedCategory={selectedCategory}
                onCategoryChange={onCategoryChange}
                currency={selectedCurrency}
                fxRate={fxRates[selectedCurrency]}
              />
            </section>

            {/* Currency Selection */}
            <section className="checkout-card">
              <CurrencySelector
                selectedCurrency={selectedCurrency}
                onCurrencyChange={onCurrencyChange}
              />
            </section>

            {/* FX Lock Indicator */}
            <FXLockIndicator
              fxLock={fxLock}
              currency={selectedCurrency}
              timeRemaining={timeRemaining}
              fxExpired={fxExpired}
              fxUpdated={fxUpdated}
              onRefresh={refreshFxRate}
            />

            {/* Payment Summary */}
            <PaymentSummaryCard
              summary={paymentSummary}
              tierName={selectedTier.name}
              animate={priceAnimating}
            />

            {/* Payment Method */}
            <section className="checkout-card">
              <PaymentMethodSelector
                selectedMethod={selectedPaymentMethod}
                onMethodChange={setSelectedPaymentMethod}
                currency={selectedCurrency}
              />
            </section>

            {/* What Happens Next */}
            <WhatHappensNext />

            {/* CTA */}
            <PaymentCTA
              summary={paymentSummary}
              disabled={fxExpired && selectedCurrency !== 'NGN'}
              onSubmit={handlePayment}
            />
          </div>
        </div>
      </main>

      <CheckoutFooter />

      {/* Payment State Overlays */}
      <PaymentStates
        state={paymentState}
        result={paymentResult}
        onRetry={resetPayment}
        onViewProgress={handleViewProgress}
      />
    </motion.div>
  );
};
