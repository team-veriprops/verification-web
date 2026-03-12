import { useEffect, useState } from 'react';
import { PropertyContext } from './PropertyContext';
import { CategorySelector } from './CategorySelector';
import { CurrencySelector } from './CurrencySelector';
import { FXLockIndicator } from './FXLockIndicator';
import { PaymentSummaryCard } from './PaymentSummaryCard';
import { PaymentMethodSelector } from './PaymentMethodSelector';
import { WhatHappensNext } from './WhatHappensNext';
import { PaymentCTA } from './PaymentCTA';
import { CheckoutFooter } from './CheckoutFooter';
import { toast } from 'sonner';
import { CheckoutHeader } from './CheckoutHeader';
import { useVerificationStore } from '../libs/useVerificationStore';
import { useBodyOverflowHidden } from '@hooks/useBodyOverflowHidden';
import { motion } from 'framer-motion';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCheckoutStore } from './libs/useCheckoutStore';
import { useFxTimer } from './libs/utils';
import { TransactionCurrency } from 'types/models';
import { usePaymentQueries } from '@components/portal/payments/libs/usePaymentQueries';
import { AsyncStateComponent } from '@components/ui/AsyncStateComponent';
import { useVerificationQueries } from '../libs/useVerificationQueries';
import { QueryVerificationTierDto } from '../models';
import { usePopup } from '@hooks/use-popup';

export default function CheckoutComponentModal(){
  const { viewVerificationCheckoutModal, setViewVerificationCheckoutModal, currentVerification } = useVerificationStore();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const {useGetVerificationTierPage} = useVerificationQueries();
  const { data: verificationTiers, isLoading: isLoadingVerificationTiers, isError: isErrorVerificationTiers } = useGetVerificationTierPage();
  const [selectedTier, setSelectedTier] = useState<QueryVerificationTierDto>()
  
  const { useGetPaymentCheckout, useGetPaymentAuthorization } = usePaymentQueries();
  const {
    data: paymentCheckout,
    isLoading,
    isError,
  } = useGetPaymentCheckout(currentVerification?.invoiceId ?? "");
  const getPaymentAuthorization = useGetPaymentAuthorization(currentVerification?.invoiceId ?? "");

  useFxTimer();
  
  // Lock body scroll when modal is open
  useBodyOverflowHidden(viewVerificationCheckoutModal);
  
  const { popupRef, initPopup, updatePopupUrl, closePopup } = usePopup()

  const {
    selectedCategory,
    selectedCurrency,
    selectedPaymentMethod,
    viewVerificationCategory,
    // paymentState,
    // paymentResult,
    fxLock,
    fxExpired,
    fxUpdated,
    timeRemaining,
    // selectedTier,
    // paymentSummary,
    handleCategoryChange,
    handleCurrencyChange,
    setSelectedPaymentMethod,
    // processPayment,
    // resetPayment,
    refreshFxRate,
  } = useCheckoutStore();

  const [priceAnimating, setPriceAnimating] = useState(false);

  useEffect(()=>{

    const selected = (
          verificationTiers?.items.find(t => t.category === selectedCategory) ??
          verificationTiers?.items[0]
        );

    setSelectedTier(selected)

  }, [verificationTiers, selectedCategory])

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

  
  const handleClose = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("action")
    router.replace(`${pathname}?${params.toString()}`);

    setViewVerificationCheckoutModal(false)
  }

  const handlePayment = () => {
    if (fxExpired && selectedCurrency !== TransactionCurrency.NGN) {
      toast.error('Please refresh your exchange rate before proceeding.');
      return;
    }
    
    initPopup(selectedPaymentMethod)

    getPaymentAuthorization.mutate(selectedPaymentMethod,{
        onSuccess: (response) => {
          updatePopupUrl(response?.data?.authorizationUrl ?? "")
          // handleClose();
        },
          onError: (error) => {
            closePopup()
        }
  });
}

  // Handle Popup Events
  useEffect(() => {
  const handler = (event: MessageEvent) => {
    console.log("event: ", event)
    // Origin check (mandatory)
    if (event.origin !== window.location.origin) return;

    // Source window check (security)
    if (popupRef?.current && event.source !== popupRef.current) return;

    const { type, error } = event.data || {};

    if (type === 'PAYMENT_CANCELLED') {
      closePopup()

      router.push('/payment/redirect/cancelled');
    }

    if (type === 'PAYMENT_SUCCESS') {
      closePopup()

      router.push('/payment/redirect/success');
    }

    if (type === 'PAYMENT_ERROR') {
      closePopup()

      router.push('/payment/redirect/failure');
    }
  };

  window.addEventListener('message', handler);
  return () => window.removeEventListener('message', handler);
}, [router, popupRef, closePopup]);

const handleViewProgress = () => {
    toast.success('Redirecting to dashboard...', {
      description: 'This is a demo - in production, this would navigate to the verification dashboard.',
    });
};

  return (
    <AsyncStateComponent
        isLoading={isLoading && isLoadingVerificationTiers}
        isError={isError && isErrorVerificationTiers}
        data={paymentCheckout && verificationTiers}
        loadingText="Loading checkout details..."
        errorText="Failed to load checkout details, please try again later."
        emptyText="No checkout details found."
      >
        {() => (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-3 bg-background min-h-screen flex flex-col"
          >
            <CheckoutHeader handleClose={handleClose} />

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
                  <PropertyContext property={
                    {
                      name: paymentCheckout?.data?.title ?? "",
                      type: paymentCheckout?.data?.propertyType ?? "",
                      reference: paymentCheckout?.data?.invoiceId ?? "",
                      location: paymentCheckout?.data?.address ?? ""
                    }
                  } />

                  {/* Category Selection */}
                  {  viewVerificationCategory &&
                  <section>
                    <CategorySelector
                      tiers={verificationTiers?.items ?? []}
                      selectedCategory={selectedCategory}
                      onCategoryChange={onCategoryChange}
                      currency={selectedCurrency}
                    />
                  </section>}

                  {/* Currency Selection */}
                  <section className="checkout-card">
                    <CurrencySelector
                      selectedCurrency={selectedCurrency}
                      onCurrencyChange={onCurrencyChange}
                    />
                  </section>

                  {/* FX Lock Indicator */}
                  <FXLockIndicator
                    currency={selectedCurrency}
                    timeRemaining={timeRemaining}
                    fxExpired={fxExpired}
                    fxUpdated={fxUpdated}
                    onRefresh={refreshFxRate}
                  />

                  {/* Payment Summary */}
                  <PaymentSummaryCard
                    currency={selectedCurrency}
                    summary={paymentCheckout?.data ?? null}
                    tierName={selectedTier?.name ?? ""}
                    animate={priceAnimating}
                  />

                  {/* Payment Method */}
                  <section className="checkout-card">
                    <PaymentMethodSelector
                      summary={paymentCheckout?.data ?? null}
                      selectedMethod={selectedPaymentMethod}
                      onMethodChange={setSelectedPaymentMethod}
                      currency={selectedCurrency}
                    />
                  </section>

                  {/* What Happens Next */}
                  <WhatHappensNext />

                  {/* CTA */}
                  <PaymentCTA
                    currency={selectedCurrency}
                    summary={paymentCheckout?.data ?? null}
                    disabled={fxExpired && selectedCurrency !== TransactionCurrency.NGN}
                    onSubmit={handlePayment}
                  />
                </div>
              </div>
            </main>

            <CheckoutFooter />

            {/* Payment State Overlays */}
            {/* <PaymentStates
              state={paymentState}
              result={paymentResult}
              onRetry={resetPayment}
              onViewProgress={handleViewProgress}
            /> */}
          </motion.div>
        )}
      </AsyncStateComponent>
  );
};
