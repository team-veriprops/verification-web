"use client";

import { Money } from "@components/website/property/models";
import { motion } from "framer-motion";
import { Banknote, Loader2, TrendingDown, TrendingUp } from "lucide-react";
import TransactionStatCardComponent from "./TransactionStatCardComponent";
import { useTransactionQueries } from "../libs/useTransactionQueries";
import { useEffect } from "react";
import { useTransactionStore } from "../libs/useTransactionStore";

interface TransactionStat {
  totalMoney: Money;
  walletMoney: Money;
  escrowMoney: Money;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBgColor: string;
  iconColor: string;
  moneyColor?: string;
  toolTip: string;
  isTotalBalance?: boolean;
}

export default function TransactionStatsComponent() {
  const { useGetTransactionStats } = useTransactionQueries();
  const { setWalletBalance } = useTransactionStore();

  const {
    data: transactionStats,
    isLoading,
    isError,
  } = useGetTransactionStats();

  useEffect(() => {
    if (!isError) {
      setWalletBalance(transactionStats?.walletBalance!);
    }
  }, [transactionStats?.walletBalance, isError]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6 text-gray-500">
        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
        Loading transaction stats...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-red-500">
        Failed to load transaction stats, please try again later.
      </div>
    );
  }

  if (!transactionStats) {
    return <div className="p-6 text-gray-500">No records found.</div>;
  }

  const stats: TransactionStat[] = [
    {
      totalMoney: transactionStats?.totalBalance.total!,
      walletMoney: transactionStats?.totalBalance.wallet!,
      escrowMoney: transactionStats?.totalBalance.escrow!,
      label: "Total Balance",
      icon: Banknote,
      iconBgColor: "bg-primary/10",
      iconColor: "text-primary",
      toolTip: "Combined balance across your wallet and escrow accounts",
      isTotalBalance: true,
    },
    {
      totalMoney: transactionStats?.totalInflow.total!,
      walletMoney: transactionStats?.totalInflow.wallet!,
      escrowMoney: transactionStats?.totalInflow.escrow!,
      label: "Total Inflows",
      icon: TrendingUp,
      iconBgColor: "bg-success/10",
      iconColor: "text-success",
      moneyColor: "text-success",
      toolTip: "Total money received into your wallet and escrow",
    },
    {
      totalMoney: transactionStats?.totalOutflow.total!,
      walletMoney: transactionStats?.totalOutflow.wallet!,
      escrowMoney: transactionStats?.totalOutflow.escrow!,
      label: "Total Outflows",
      icon: TrendingDown,
      iconBgColor: "bg-warning/10",
      iconColor: "text-warning",
      moneyColor: "text-warning",
      toolTip: "Total money withdrawn from your wallet and escrows",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 my-8 max-w-3/5 mx-auto"
    >
      {stats.map((stat, key) => (
        <TransactionStatCardComponent
          key={key}
          totalMoney={stat.totalMoney}
          walletMoney={stat.walletMoney}
          escrowMoney={stat.escrowMoney}
          label={stat.label}
          icon={stat.icon}
          iconBgColor={stat.iconBgColor}
          iconColor={stat.iconColor}
          toolTip={stat.toolTip}
          isTotalBalance={stat.isTotalBalance}
          moneyColor={stat.moneyColor}
        />
      ))}
      {/* <Card className="p-6 bg-gradient-to-br from-card to-card/50 border-primary/20 shadow-lg hover:shadow-xl group relative  transition-shadow">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <BadgeInfo className="h-4 w-4 text-muted-foreground" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-sm">
                Combined balance across your wallet and escrow accounts
              </p>
            </TooltipContent>
          </Tooltip>

          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <Banknote className="h-6 w-6 text-primary" />
            </div>
            <Badge variant="secondary" className="text-xs">
              Total
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-1">Total Balance</p>
          <p className="text-3xl font-bold">
            ${stats.totalBalance.toLocaleString()}
          </p>

          <button
            onClick={() => toggleCard("balance")}
            className="flex items-center gap-1 text-xs text-muted-foreground mt-2 hover:text-foreground transition-colors w-full"
          >
            <span>
              Wallet: ${stats.walletBalance.toLocaleString()} • Escrow: $
              {stats.escrowBalance.toLocaleString()}
            </span>
            <ChevronDown
              className={`h-3 w-3 transition-transform ${
                expandedCards.balance ? "rotate-180" : ""
              }`}
            />
          </button>
          <AnimatePresence>
            {expandedCards.balance && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 pt-3 border-t border-border space-y-2"
              >
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Wallet</span>
                  <span className="font-medium">
                    ${stats.walletBalance.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Escrow</span>
                  <span className="font-medium">
                    ${stats.escrowBalance.toLocaleString()}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        
        <Card className="p-6 hover:shadow-md transition-shadow group relative">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <BadgeInfo className="h-4 w-4 text-muted-foreground" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-sm">
                Total money received into your wallet and escrow
              </p>
            </TooltipContent>
          </Tooltip>

          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-success/10">
              <TrendingUp className="h-6 w-6 text-success" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-1">Total Inflows</p>
          <p className="text-3xl font-bold text-success">
            ${stats.totalInflows.toLocaleString()}
          </p>

          <button
            onClick={() => toggleCard("inflows")}
            className="flex items-center gap-1 text-xs text-muted-foreground mt-2 hover:text-foreground transition-colors w-full"
          >
            <span>View breakdown</span>
            <ChevronDown
              className={`h-3 w-3 transition-transform ${
                expandedCards.inflows ? "rotate-180" : ""
              }`}
            />
          </button>

          {expandedCards.inflows && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{
                duration: 0.4,
                ease: [0.25, 0.1, 0.25, 1], // smoother cubic-bezier easing
              }}
              className="mt-3 pt-3 border-t border-border space-y-2"
            >
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="flex justify-between text-sm"
              >
                <span className="text-muted-foreground">Wallet</span>
                <span className="font-medium">
                  ${stats.walletInflows.toLocaleString()}
                </span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="flex justify-between text-sm"
              >
                <span className="text-muted-foreground">Escrow</span>
                <span className="font-medium">
                  ${stats.escrowInflows.toLocaleString()}
                </span>
              </motion.div>
            </motion.div>
          )}
        </Card>

        
        <Card className="p-6 hover:shadow-md transition-shadow group relative">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <BadgeInfo className="h-4 w-4 text-muted-foreground" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-sm">
                Total money withdrawn from your wallet and escrow
              </p>
            </TooltipContent>
          </Tooltip>

          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-warning/10">
              <TrendingDown className="h-6 w-6 text-warning" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-1">Total Outflows</p>
          <p className="text-3xl font-bold text-warning">
            ${stats.totalOutflows.toLocaleString()}
          </p>

          <button
            onClick={() => toggleCard("outflows")}
            className="flex items-center gap-1 text-xs text-muted-foreground mt-2 hover:text-foreground transition-colors w-full"
          >
            <span>View breakdown</span>
            <ChevronDown
              className={`h-3 w-3 transition-transform ${
                expandedCards.outflows ? "rotate-180" : ""
              }`}
            />
          </button>

          {expandedCards.outflows && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 pt-3 border-t border-border space-y-2"
            >
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Wallet</span>
                <span className="font-medium">
                  ${stats.walletOutflows.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Escrow</span>
                <span className="font-medium">
                  ${stats.escrowOutflows.toLocaleString()}
                </span>
              </div>
            </motion.div>
          )}
        </Card>

        
        <Card className="p-6 hover:shadow-md transition-shadow group relative">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <BadgeInfo className="h-4 w-4 text-muted-foreground" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-sm">
                Total platform fees and transaction charges
              </p>
            </TooltipContent>
          </Tooltip>

          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-destructive/10">
              <Receipt className="h-6 w-6 text-destructive" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-1">Total Fees</p>
          <p className="text-3xl font-bold text-destructive">
            ${stats.totalFees.toLocaleString()}
          </p>
        </Card> */}
    </motion.div>
  );
}
