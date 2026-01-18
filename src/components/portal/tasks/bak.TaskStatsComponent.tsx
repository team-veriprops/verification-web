import { motion } from "framer-motion";
import { AlertCircle, Clock, CheckCircle2, TrendingUp, ClipboardList } from "lucide-react";
import { Card, CardContent } from "@3rdparty/ui/card";
import { useTaskQueries } from "./libs/useTaskQueries";
import { useEffect, useState } from "react";
import { AsyncStateComponent } from "@components/ui/AsyncStateComponent";
import { useTaskStore } from "./libs/useTaskStore";
import { cn } from "@lib/utils";
import { TaskStatus, TaskStatusDetail } from "./models";
import { useAuthStore } from "@components/website/auth/libs/useAuthStore";

export const TaskStatsComponent = () => {

  const { updateTaskFilters } = useTaskStore();
  const [assigned, setAssigned] = useState<number>();
  const [inProgress, setInProgress] = useState<number>();
  const [dueSoon, setDueSoon] = useState<number>();
  const [submitted, setSubmitted] = useState<number>();
  const [overdue, setOverdue] = useState<number>();
  const [avgResolutionTimeHours, setAvgResolutionTimeHours] =
    useState<number>();

  const { activeAuditor } = useAuthStore();
  const { useGetTaskStats } = useTaskQueries();
  const {
    data: userVerifierStats,
    isLoading,
    isError,
  } = useGetTaskStats(activeAuditor?.verifier_id ?? "");

  useEffect(() => {
    setAssigned(userVerifierStats?.assigned);
    setInProgress(userVerifierStats?.in_progress);
    setDueSoon(userVerifierStats?.due_soon);
    setSubmitted(userVerifierStats?.submitted);
    setOverdue(userVerifierStats?.overdue);
    setAvgResolutionTimeHours(userVerifierStats?.avg_resolution__hours);
  }, [userVerifierStats]);

  const verifierStatusesDetails: TaskStatusDetail[] = [

    {
      key: "assigned",
      title: 'Assigned',
      value: assigned,
      icon: ClipboardList,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      key: "in_progress",
      title: 'In Progress',
      value: inProgress,
      icon: Clock,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      key: "due_soon",
      title: 'Due Soon',
      value: dueSoon,
      icon: AlertCircle,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      key: "submitted",
      title: 'Submitted',
      value: submitted,
      icon: CheckCircle2,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      key: "overdue",
      title: "Overdue",
      value: overdue,
      icon: TrendingUp,
      color: "text-destructive-500",
      bgColor: "bg-destructive-500/10",
    },
    {
      key: "avg_resolution",
      title: "Avg Resolution",
      value: `${avgResolutionTimeHours}h`,
      icon: Clock,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      subtitle: "average time",
    },
  ];

  const isClickable = (key: string) => key !== "avg_resolution";

  const handleOnClick = (key: string) => {
    if (isClickable(key)) {
      updateTaskFilters({ status: key! as TaskStatus });
      requestAnimationFrame(() => {
        document
          .getElementById("verifier-table")
          ?.scrollIntoView({ behavior: "smooth" });
      });
    }
  };

  return (
    <section className="my-8">
    <div className={"grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"}>
      {verifierStatusesDetails.map((verifierStatusesDetail, index) => {
        const Icon = verifierStatusesDetail.icon;
        return (
          <motion.div
            key={verifierStatusesDetail.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card
              className={cn(
                "p-6 transition-all hover:shadow-card",
                isClickable(verifierStatusesDetail.key)
                  ? "cursor-pointer hover:scale-105"
                  : ""
              )}
              onClick={handleOnClick.bind(null, verifierStatusesDetail.key)}
            >
              <CardContent className="p-2">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {verifierStatusesDetail.title}
                    </p>
                    <AsyncStateComponent
                      isLoading={isLoading}
                      isError={isError}
                      data={userVerifierStats}
                      loadingText={"Loading stats..."}
                      errorText={`Failed to load ${verifierStatusesDetail.title} verifiers, please try again later.`}
                      emptyText="No stats found."
                    >
                      {() => (
                        <p className="text-2xl font-bold text-foreground">
                          {verifierStatusesDetail.value}
                        </p>
                      )}
                    </AsyncStateComponent>

                    {verifierStatusesDetail.subtitle && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {verifierStatusesDetail.subtitle}
                      </p>
                    )}
                  </div>
                  <div
                    className={`p-2 rounded-lg ${verifierStatusesDetail.bgColor}`}
                  >
                    {Icon && (
                      <Icon
                        className={`h-5 w-5 ${verifierStatusesDetail.color}`}
                      />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
    </section>
  );
};
