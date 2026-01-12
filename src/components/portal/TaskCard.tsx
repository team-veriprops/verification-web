import Link from "next/link";
import { MapPin, Calendar, User, AlertCircle } from "lucide-react";
import { Badge } from "@components/3rdparty/ui/badge";
import { Button } from "@components/3rdparty/ui/button";
import { cn } from "@lib/utils";
import { Task, formatDate, getStatusBadgeColor, getRoleBadgeColor, getRoleLabel } from "@data/portalMockData";

interface TaskCardProps {
  task: Task;
}

const TaskCard = ({ task }: TaskCardProps) => {
  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      high: "bg-danger/10 text-danger dark:bg-danger/20",
      medium: "bg-warning/10 text-warning dark:bg-warning/20",
      low: "bg-muted text-muted-foreground"
    };
    return colors[priority] || colors.low;
  };

  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== "completed";
  
  const completedItems = task.checklist.filter(item => item.completed).length;
  const totalItems = task.checklist.length;
  const progress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  return (
    <div className="bg-card border border-border rounded-xl p-4 lg:p-5 hover:shadow-soft transition-shadow">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs text-muted-foreground">{task.id}</span>
              <Badge className={cn("capitalize text-xs", getPriorityColor(task.priority))}>
                {task.priority}
              </Badge>
            </div>
            <h3 className="font-display font-semibold text-foreground">
              {task.title}
            </h3>
          </div>
          <Badge className={cn("capitalize", getStatusBadgeColor(task.status))}>
            {task.status === "in_progress" ? "In Progress" : task.status}
          </Badge>
        </div>

        {/* Role & Assignee */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge className={cn("text-xs", getRoleBadgeColor(task.role))}>
            {getRoleLabel(task.role)}
          </Badge>
          {task.assignee && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <User className="h-3.5 w-3.5" />
              <span>{task.assignee.name}</span>
            </div>
          )}
        </div>

        {/* Location */}
        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{task.propertyLocation}</span>
        </div>

        {/* Linked Verification */}
        <Link 
          href={`/portal/verifications/${task.verificationId}`}
          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
        >
          {task.verificationId}
        </Link>

        {/* Progress & Due Date */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-border">
          {/* Progress */}
          <div className="flex items-center gap-2">
            <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground">
              {completedItems}/{totalItems}
            </span>
          </div>

          {/* Due Date */}
          <div className={cn(
            "flex items-center gap-1.5 text-sm",
            isOverdue ? "text-danger" : "text-muted-foreground"
          )}>
            {isOverdue && <AlertCircle className="h-3.5 w-3.5" />}
            <Calendar className="h-3.5 w-3.5" />
            <span>Due: {formatDate(task.dueDate)}</span>
          </div>
        </div>

        {/* View Button */}
        <Button asChild size="sm" variant="outline" className="w-full mt-2">
          <Link href={`/portal/tasks/${task.id}`}>
            View Details
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default TaskCard;
