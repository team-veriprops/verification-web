import { Clock, AlertTriangle } from "lucide-react";
import { Badge } from "@components/3rdparty/ui/badge";
import { Progress } from "@components/3rdparty/ui/progress";

export function computeSLAProgress(
  now: Date | string,
  assigned: Date | string,
  due: Date | string
): number {
  const nowDate = new Date(now).getTime();
  const assignedDate = new Date(assigned).getTime();
  const dueDate = new Date(due).getTime();

  const elapsed = nowDate - assignedDate;
  const total = dueDate - assignedDate;

  return Math.max(0, Math.min(1, elapsed / total));
}

export function formatSLATimeRemaining(
  now: Date | string,
  due: Date | string
): string {
  const nowDate = new Date(now).getTime();
  const dueDate = new Date(due).getTime();
  const diff = dueDate - nowDate;

  if (diff < 0) return "Overdue";

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ${hours % 24}h`;
  return `${hours}h`;
}

export function getSLAColor(
  progress: number
): "success" | "warning" | "overdue" {
  if (progress >= 1.0) return "overdue";
  if (progress >= 0.5) return "warning";
  return "success";
}

interface SLAProgressBarProps {
  start_date: Date | string;
  due_date: Date | string;
  current_date: Date | string;
  showLabel?: boolean;
}

export function SLAProgressBar({
  start_date,
  due_date,
  current_date,
  showLabel = true,
}: SLAProgressBarProps) {
  const progress = computeSLAProgress(
    current_date,
    start_date,
    due_date
  );
  const progressPercent = Math.round(progress * 100);
  const timeRemaining = formatSLATimeRemaining(
    current_date,
    due_date
  );
  const colorState = getSLAColor(progress);

  const colorClasses = {
    success: "bg-success",
    warning: "bg-warning",
    overdue: "bg-overdue",
  };

  const badgeVariants = {
    success: "bg-success/10 text-success border-success/20",
    warning: "bg-warning/10 text-warning border-warning/20",
    overdue: "bg-overdue/10 text-overdue border-overdue/20",
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        {showLabel && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>SLA Progress</span>
          </div>
        )}
        <Badge variant="outline" className={badgeVariants[colorState]}>
          {colorState === "overdue" && (
            <AlertTriangle className="mr-1 h-3 w-3" />
          )}
          {timeRemaining}
        </Badge>
      </div>

      <div className="relative">
        <Progress value={progressPercent} className="h-2" />
        <div
          className={`absolute top-0 left-0 h-2 rounded-full transition-all duration-500 ${colorClasses[colorState]}`}
          style={{ width: `${Math.min(progressPercent, 100)}%` }}
        />
      </div>
    </div>
  );
}
