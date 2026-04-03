"use client";

import { motion } from "framer-motion";
import { PageDetails } from "types/models";
import PageHeader from "@components/ui/PageHeader";
import { useGlobalSettings } from "@stores/useGlobalSettings";
import RoleTable from "./RoleTable";
import { useRoleStore } from "./libs/useRoleStore";
import { useEffect } from "react";

export default function RoleComponentPage({ title, description }: PageDetails) {

  const { settings } = useGlobalSettings();
  const { updateFilters } = useRoleStore();

  useEffect(()=>{
    updateFilters({
        companyId: "veriprops",
        page: settings.firstPage,
      })
  }, [updateFilters, settings.firstPage])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header */}
      <PageHeader title={title} description={description} />
        <RoleTable />
    </motion.div>
  );
}
