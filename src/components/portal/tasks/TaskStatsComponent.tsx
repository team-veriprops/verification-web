"use client";

import { motion } from "framer-motion";
import { AlertCircle, AlertTriangle, CheckCircle2, ClipboardList, Clock, Loader2 } from "lucide-react";
import StatsCard from "@components/portal/StatsCard";
import { useAuthStore } from "@components/website/auth/libs/useAuthStore";
import { useTaskQueries } from "./libs/useTaskQueries";
import { TaskStatus } from "./models";
import { useTaskStore } from "./libs/useTaskStore";

export default function TaskStatsComponent() {
  
  
    const { updateTaskFilters } = useTaskStore();
    const { activeAuditor } = useAuthStore();
    const { useGetTaskStats } = useTaskQueries();
    const {
      data: taskStats,
      isLoading,
      isError,
    } = useGetTaskStats(activeAuditor?.verifier_id ?? "");

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

    const handleOnClick = (key: string) => {
        updateTaskFilters({ status: key! as TaskStatus });
        requestAnimationFrame(() => {
          document
            .getElementById("verifier-table")
            ?.scrollIntoView({ behavior: "smooth" });
        });
    };

  return (
    <section className="my-8">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4"
    >
        <StatsCard
          title={TaskStatus.ASSIGNED}
          value={taskStats?.assigned ?? 0} 
          icon={ClipboardList} 
          variant="primary"
          onClick={() => handleOnClick(TaskStatus.ASSIGNED)}
          className="cursor-pointer hover:scale-105"
        />
        <StatsCard 
          title="In Progress" 
          value={taskStats?.in_progress ?? 0} 
          icon={Clock}
          onClick={() => handleOnClick("in-progress")}
          className="cursor-pointer hover:scale-105"
        />
        <StatsCard 
          title="Due Soon" 
          value={taskStats?.due_soon ?? 0} 
          icon={AlertCircle} variant={"warning"}
          onClick={() => handleOnClick("due-soon")}
          className="cursor-pointer hover:scale-105"
        />
        <StatsCard 
          title="Submitted" 
          value={taskStats?.submitted ?? 0} 
          icon={CheckCircle2} 
          variant="success"
          onClick={() => handleOnClick("submitted")}
          className="cursor-pointer hover:scale-105"
        />
        <StatsCard 
          title="Overdue" 
          value={taskStats?.overdue ?? 0} 
          icon={AlertTriangle} 
          variant="danger"
          onClick={() => handleOnClick("overdue")}
          className="cursor-pointer hover:scale-105"
        />
        <StatsCard 
          title="Avg Resolution" 
          trend={{isPositive: true, value: 6}} 
          value={`${(taskStats?.avg_resolution__hours ?? 0)}h`} 
          icon={Clock} 
          variant="timeless"
          onClick={() => handleOnClick("avg-resolution")}
        />
    </motion.div>
    </section>
  );
}
