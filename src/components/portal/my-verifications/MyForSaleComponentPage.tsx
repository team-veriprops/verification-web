"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@3rdparty/ui/tabs";
import { MyForSaleTable } from "./MyForSaleTable";
import { motion } from "framer-motion";
import { PageDetails, productsTableTabs } from "types/models";
import PageHeader from "@components/ui/PageHeader";
import { PropertyType } from "@components/website/property/models";
import { useGlobalSettings } from "@stores/useGlobalSettings";
import { useForSaleStore } from "./libs/useForSaleStore";

export function MyForSaleComponentPage({ title, description }: PageDetails) {
  const { filters, updateFilters } = useForSaleStore();
  const { settings } = useGlobalSettings();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header */}
      <PageHeader title={title} description={description} />

      {/* Stats Section */}
      {/* <StatsSection /> */}

      {/* Tabs Section */}
      <Tabs
        value={filters.type}
        onValueChange={(value) =>
          updateFilters({
            type: value as PropertyType,
            page: settings.firstPage,
          })
        }
        className="space-y-6"
      >
        <TabsList>
          {productsTableTabs.map(({ value, label }) => (
            <TabsTrigger
              key={value}
              value={value}
              className="data-[state=active]:bg-primary"
            >
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        {productsTableTabs.map(({ value, label }) => (
          <TabsContent key={value} value={value} className="space-y-6">
            <MyForSaleTable />
          </TabsContent>
        ))}
      </Tabs>
    </motion.div>
  );
}
