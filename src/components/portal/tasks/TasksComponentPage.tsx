"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@components/3rdparty/ui/tabs";
import TaskCard from "@components/portal/TaskCard";
import { mockTasks, TaskStatus } from "@data/portalMockData";

type TabValue = "all" | TaskStatus;

export default function TasksComponentPage () {
  const [activeTab, setActiveTab] = useState<TabValue>("all");

  const filteredTasks = activeTab === "all"
    ? mockTasks
    : mockTasks.filter((t) => t.status === activeTab);

  const counts = {
    all: mockTasks.length,
    pending: mockTasks.filter((t) => t.status === "pending").length,
    in_progress: mockTasks.filter((t) => t.status === "in_progress").length,
    completed: mockTasks.filter((t) => t.status === "completed").length,
    blocked: mockTasks.filter((t) => t.status === "blocked").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground">
          Tasks
        </h1>
        <p className="text-muted-foreground mt-1">
          Track verification tasks assigned to specialists
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabValue)}>
        <TabsList className="w-full sm:w-auto grid grid-cols-4 sm:flex overflow-x-auto">
          <TabsTrigger value="all" className="gap-2">
            All
            <span className="hidden sm:inline text-xs bg-muted px-1.5 py-0.5 rounded">
              {counts.all}
            </span>
          </TabsTrigger>

          <TabsTrigger value="pending" className="gap-2">
            Pending
            <span className="hidden sm:inline text-xs bg-muted px-1.5 py-0.5 rounded">
              {counts.pending}
            </span>
          </TabsTrigger>

          <TabsTrigger value="in_progress" className="gap-2 whitespace-nowrap">
            In Progress
            <span className="hidden sm:inline text-xs bg-muted px-1.5 py-0.5 rounded">
              {counts.in_progress}
            </span>
          </TabsTrigger>

          <TabsTrigger value="completed" className="gap-2">
            Completed
            <span className="hidden sm:inline text-xs bg-muted px-1.5 py-0.5 rounded">
              {counts.completed}
            </span>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Task Grid */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-12 bg-card border border-border rounded-xl">
          <p className="text-muted-foreground">
            No {activeTab === "all" ? "" : activeTab.replace("_", " ")} tasks found
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
}
