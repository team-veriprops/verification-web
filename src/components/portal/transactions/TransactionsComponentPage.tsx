"use client";

import { PageDetails } from "types/models";
import TransactionHeader from "./TransactionHeader";
import TransactionStatsComponent from "./stats/TransactionStatsComponent";
import { ArrowUpRight, ShieldCheck, Wallet } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@components/3rdparty/ui/tabs";
import { motion } from "framer-motion";
import TransactionTable from "./TransactionTable";
import { useTransactionStore } from "./libs/useTransactionStore";
import { useGlobalSettings } from "@stores/useGlobalSettings";
import { TransactionType } from "./models";

export default function TransactionsComponentPage({
  title,
  description,
}: PageDetails) {
  const { filters, updateFilters } = useTransactionStore();
  const { settings } = useGlobalSettings();

  const transactionTabs: Array<{
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
    label: string;
  }> = [
    { value: "all", label: "All Transactions" },
    { value: "deposit", icon: Wallet, label: "Deposit" },
    { value: "escrow", icon: ShieldCheck, label: "Escrow" },
    { value: "withdrawal", icon: ArrowUpRight, label: "Withdrawals" },
  ] as const;
  return (
    <>
      <TransactionHeader title={title} description={description} />
      <TransactionStatsComponent />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Tabs
          value={filters.type}
          onValueChange={(value) =>
            updateFilters({
              type: value as TransactionType,
              page: settings.firstPage,
            })
          }
          className="space-y-6 mt-14"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <TabsList className="bg-muted/50 p-1">
              {transactionTabs.map(({ value, icon: Icon, label }) => (
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

          {transactionTabs.map(({ value, label }) => (
            <TabsContent key={value} value={value} className="space-y-6">
              <TransactionTable />
            </TabsContent>
          ))}
        </Tabs>
      </motion.div>
    </>
  );
}
