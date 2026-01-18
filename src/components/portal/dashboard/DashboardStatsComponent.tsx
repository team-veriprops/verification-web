"use client";

import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, Clock, CreditCard, FileCheck, Loader2 } from "lucide-react";
import { useDashboardQueries } from "./libs/useDashboardQueries";
import StatsCard from "@components/portal/StatsCard";
import { formatMoney } from "@lib/utils";

export default function DashboardStatsComponent() {
  const { useGetDashboardStats } = useDashboardQueries();

  const {
    data: dashboardStats,
    isLoading,
    isError,
  } = useGetDashboardStats();

  if (isLoading) {
    return (
      <section
        aria-live="polite"
        className="flex items-center justify-center p-6 text-muted-foreground"
      >
        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
        <span className="text-sm font-medium">Loading dashboard insights...</span>
      </section>
    );
  }

  if (isError) {
    return (
      <section aria-live="assertive" className="p-6 text-red-500 text-sm font-medium">
        Unable to load dashboard insights right now. Please try again later.
      </section>
    );
  }

  if (!dashboardStats) {
    return (
      <section aria-live="polite" className="p-6 text-muted-foreground text-sm">
        No dashboard records available yet.
      </section>
    );
  }

  return (
    <section className="my-8">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4"
    >
        <StatsCard title="Total Verifications" value={dashboardStats.total_verifications} icon={FileCheck} variant="primary" />
        <StatsCard title="Pending" value={dashboardStats.pending_verifications} icon={Clock} />
        <StatsCard title="Verified" value={dashboardStats.successful_verifications} icon={CheckCircle} variant="success" />
        <StatsCard title="Flagged" value={dashboardStats.flagged_verifications} icon={AlertTriangle} variant="danger" />
        <StatsCard title="Total Spent" value={formatMoney(dashboardStats.total_spent_amount)!} icon={CreditCard} />
        {/* <StatsCard title="Active Tasks" value={activeTasks} icon={ClipboardList} variant="warning" />
        <StatsCard title="Open Disputes" value={openDisputes} icon={AlertCircle} variant={openDisputes > 0 ? "danger" : "default"} /> */}
    </motion.div>
    </section>
  );
}
