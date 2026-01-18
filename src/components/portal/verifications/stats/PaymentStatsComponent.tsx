"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, CreditCard, Loader2 } from "lucide-react";
import { useEffect } from "react";
import StatsCard from "@components/portal/StatsCard";
import { convertMoney, formatMoney } from "@lib/utils";
import { formatDate } from "@lib/time";
import { usePaymentQueries } from "@components/portal/payments/libs/usePaymentQueries";
import { usePaymentStore } from "@components/portal/payments/libs/usePaymentStore";

export default function PaymentStatsComponent() {
  const { useGetPaymentStats } = usePaymentQueries();
  const { setTotalPendingPayment } = usePaymentStore();

  const {
    data: paymentStats,
    isLoading,
    isError,
  } = useGetPaymentStats();

  useEffect(() => {
    if (!isError) {
      setTotalPendingPayment(paymentStats?.total_pending_amount);
    }
  }, [setTotalPendingPayment, paymentStats?.total_pending_amount, isError]);

  if (isLoading) {
    return (
      <section
        aria-live="polite"
        className="flex items-center justify-center p-6 text-muted-foreground"
      >
        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
        <span className="text-sm font-medium">Loading payment insights...</span>
      </section>
    );
  }

  if (isError) {
    return (
      <section aria-live="assertive" className="p-6 text-red-500 text-sm font-medium">
        Unable to load payment insights right now. Please try again later.
      </section>
    );
  }

  if (!paymentStats) {
    return (
      <section aria-live="polite" className="p-6 text-muted-foreground text-sm">
        No payment records available yet.
      </section>
    );
  }

  return (
    <section className="my-8">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="grid sm:grid-cols-3 gap-4 my-8"
    >
      <StatsCard
          title="Total Spent"
          value={formatMoney(paymentStats?.total_spent_amount)!}
          icon={CreditCard}
          variant="primary"
        />
        <StatsCard
          title="Last Payment"
          value={paymentStats?.last_payment_date ? formatDate(paymentStats?.last_payment_date) : "N/A"}
          icon={Calendar}
        />
        <StatsCard
          title="Pending Payments"
          value={formatMoney(paymentStats?.total_pending_amount)!}
          icon={Clock}
          variant={convertMoney(paymentStats?.total_pending_amount).getValue() > 0 ? "warning" : "default"}
        />

    </motion.div>
    </section>
  );
}
