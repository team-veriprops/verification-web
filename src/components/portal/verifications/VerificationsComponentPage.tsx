"use client";

import { PageDetails } from "types/models";
import { ClipboardClock, Plus, Rows4, Shield, ShieldAlert } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@components/3rdparty/ui/tabs";
import { motion } from "framer-motion";
import { useVerificationStore } from "./libs/useVerificationStore";
import { useGlobalSettings } from "@stores/useGlobalSettings";
import PageHeader from "@components/ui/PageHeader";
import { Button } from "@components/3rdparty/ui/button";
import { toast } from "@components/3rdparty/ui/use-toast";
import VerificationsTable from "./VerificationsTable";
import { VerificationStatus } from "./models";
import { useDashboardQueries } from "../dashboard/libs/useDashboardQueries";

export default function VerificationsComponentPage({
  title,
  description,
}: PageDetails) {
  const { filters, updateFilters } = useVerificationStore();
  const { settings } = useGlobalSettings();
  const { useGetDashboardStats } = useDashboardQueries();
  
    const {
      data: dashboardStats,
    } = useGetDashboardStats();

  const verificationTabs: Array<{
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
    label: string;
  }> = [
    { value: VerificationStatus.PENDING, icon: ClipboardClock, label: `Pending (${dashboardStats?.pending_verifications ?? 0})` },
    { value: VerificationStatus.FLAGGED, icon: ShieldAlert, label: `Flagged (${dashboardStats?.flagged_verifications ?? 0})` },
    { value: VerificationStatus.VERIFIED, icon: Shield, label: `Verified (${dashboardStats?.successful_verifications ?? 0})` },
    { value: "all", icon: Rows4 ,  label: `All Verifications (${dashboardStats?.total_verifications ?? 0})` },
  ] as const;
  
  const handleMakeVerification = () => {
      toast({
        title: "Verification",
        description: "Redirecting to verification gateway...",
      });
    };
  return (
    <>
       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader title={title} description={description} />

        <Button onClick={handleMakeVerification}>
          <Plus className="h-4 w-4 mr-2" />
          Request New Verification
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Tabs
          value={filters.status}
          onValueChange={(value) =>
            updateFilters({
              status: value as VerificationStatus,
              page: settings.firstPage,
            })
          }
          className="space-y-6 mt-14"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <TabsList className="bg-muted/50 p-1">
              {verificationTabs.map(({ value, icon: Icon, label }) => (
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

          {verificationTabs.map(({ value }) => (
            <TabsContent key={value} value={value} className="space-y-6">
              <VerificationsTable />
            </TabsContent>
          ))}
        </Tabs>
      </motion.div>
    </>
  );
}
