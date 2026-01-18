"use client";

import { PageDetails } from "types/models";
import { Rows4, Wallet } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@components/3rdparty/ui/tabs";
import { motion } from "framer-motion";
import { usePaymentStore } from "./libs/usePaymentStore";
import { useGlobalSettings } from "@stores/useGlobalSettings";
import PageHeader from "@components/ui/PageHeader";
import { Button } from "@components/3rdparty/ui/button";
import { toast } from "@components/3rdparty/ui/use-toast";
import PaymentsTable from "./PaymentsTable";
import PaymentStatsComponent from "./stats/TransactionStatsComponent";
import { convertMoney, formatMoney } from "@lib/utils";
import { PaymentStatus } from "./models";
import { usePaymentQueries } from "./libs/usePaymentQueries";

export default function PaymentsComponentPage({
  title,
  description,
}: PageDetails) {
  const { filters, updateFilters } = usePaymentStore();
  const { settings } = useGlobalSettings();
  const { totalPendingPayment } = usePaymentStore();

  const { useGetPaymentStats } = usePaymentQueries();
  
  const {
      data: paymentStats,
    } = useGetPaymentStats();

  const paymentTabs: Array<{
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
    label: string;
  }> = [
    { value: PaymentStatus.PENDING, icon: Wallet, label: `Pending (${paymentStats?.total_pending ?? 0})` },
    { value: "all", icon: Rows4 ,  label: `All Payments (${paymentStats?.total_payment ?? 0})` },
  ] as const;
  
  const handleMakePayment = () => {
      toast({
        title: "Payment",
        description: "Redirecting to payment gateway...",
      });
    };
  return (
    <>
       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader title={title} description={description} />

        {totalPendingPayment && convertMoney(totalPendingPayment!).getValue() > 0 && (
          <Button onClick={handleMakePayment}>
            Make Payment ({formatMoney(totalPendingPayment!)})
          </Button>
        )}
      </div>
      
      <PaymentStatsComponent></PaymentStatsComponent>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Tabs
          value={filters.status}
          onValueChange={(value) =>
            updateFilters({
              status: value as PaymentStatus,
              page: settings.firstPage,
            })
          }
          className="space-y-6 mt-14"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <TabsList className="bg-muted/50 p-1">
              {paymentTabs.map(({ value, icon: Icon, label }) => (
                <TabsTrigger
                  key={value}
                  value={value}
                  className={`${value === "all" ? "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground" : ""}`}
                >
                  {Icon && <Icon className="h-4 w-4 mr-2" />}
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
            <div></div>
          </div>

          {paymentTabs.map(({ value }) => (
            <TabsContent key={value} value={value} className="space-y-6">
              <PaymentsTable />
            </TabsContent>
          ))}
        </Tabs>
      </motion.div>
    </>
  );
}
