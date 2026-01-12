"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@components/3rdparty/ui/tabs";
import DisputeCard from "@components/portal/DisputeCard";
import { mockDisputes, DisputeStatus } from "@data/portalMockData";

type TabValue = "all" | DisputeStatus;

export default function DisputesComponentPage () {
  const [activeTab, setActiveTab] = useState<TabValue>("all");

  const filteredDisputes = activeTab === "all" 
    ? mockDisputes 
    : mockDisputes.filter(d => d.status === activeTab);

  const counts = {
    all: mockDisputes.length,
    active: mockDisputes.filter(d => d.status === "active").length,
    under_review: mockDisputes.filter(d => d.status === "under_review").length,
    resolved: mockDisputes.filter(d => d.status === "resolved").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground">
          Disputes
        </h1>
        <p className="text-muted-foreground mt-1">
          Track and manage property disputes related to your verifications
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabValue)}>
        <TabsList className="w-full sm:w-auto grid grid-cols-4 sm:flex">
          <TabsTrigger value="all" className="gap-2">
            All
            <span className="hidden sm:inline text-xs bg-muted px-1.5 py-0.5 rounded">
              {counts.all}
            </span>
          </TabsTrigger>

          <TabsTrigger value="active" className="gap-2">
            Active
            <span className="hidden sm:inline text-xs bg-muted px-1.5 py-0.5 rounded">
              {counts.active}
            </span>
          </TabsTrigger>

          <TabsTrigger value="under_review" className="gap-2 whitespace-nowrap">
            Under Review
            <span className="hidden sm:inline text-xs bg-muted px-1.5 py-0.5 rounded">
              {counts.under_review}
            </span>
          </TabsTrigger>

          <TabsTrigger value="resolved" className="gap-2">
            Resolved
            <span className="hidden sm:inline text-xs bg-muted px-1.5 py-0.5 rounded">
              {counts.resolved}
            </span>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Dispute Grid */}
      {filteredDisputes.length === 0 ? (
        <div className="text-center py-12 bg-card border border-border rounded-xl">
          <p className="text-muted-foreground">
            No {activeTab === "all" ? "" : activeTab.replace("_", " ")} disputes found
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filteredDisputes.map((dispute) => (
            <DisputeCard key={dispute.id} dispute={dispute} />
          ))}
        </div>
      )}
    </div>
  );
}
