"use client";

import PageHeader from "@components/ui/PageHeader";
import { PageDetails } from "types/models";
import { AvailabilityToggle } from "./AvailabilityToggle";
import { TaskTable } from "./TaskTable";
import { useAuthStore } from "@components/website/auth/libs/useAuthStore";
import TaskStatsComponent from "./TaskStatsComponent";

export default function VerifierComponentPage({
  title,
  description,
}: PageDetails) {
  const { activeAuditor } = useAuthStore();
  return (
    <>
        <div className=" relative">
          <div className="flex items-center justify-between">
            <PageHeader
              title={`${title}, ${activeAuditor?.firstname ?? ""}`}
              description={description}
            />
            <AvailabilityToggle />
          </div>
        </div>

      {/* <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <PageHeader
              title={`${title}, ${activeAuditor?.firstname ?? ""}`}
              description={description}
              />
      
              <AvailabilityToggle />
      </div> */}

      <div className="relative">
        <TaskStatsComponent />

        <h2 className="text-2xl font-semibold mt-4 mb-4" id="dispute-table">
          Your Tasks
        </h2>

        <TaskTable />
      </div>
    </>
  );
}
