import { QueryTaskDto, QueryTaskStatsDto, TaskStatus } from "@components/portal/tasks/models";
import { tasks } from "@data/mock-tasks";
import { NextRequest, NextResponse } from "next/server";

// GET one
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ verifierId: string }> }
) {
  const { verifierId } = await params;

  const filteredTasks = tasks.filter(
    (Task) => Task.verifierId === verifierId
  );
  
  const stats: QueryTaskStatsDto = getTaskStats(filteredTasks);

  return stats
    ? NextResponse.json(stats)
    : NextResponse.json({ error: "Not found" }, { status: 404 });
}

function getTaskStats(
  Tasks: QueryTaskDto[]
): QueryTaskStatsDto {
  const stats: QueryTaskStatsDto = {
    assigned: 0,
    inProgress: 0,
    submitted: 0,
    overdue: 0,
    dueSoon: 0,
    avgResolutionHours: 0,
  };

  if (Tasks.length === 0) return stats;

  let totalResolutionHours = 0;
  let completedCount = 0;
  const now = new Date();

  for (const t of Tasks) {
    switch (t.status) {
      case TaskStatus.ASSIGNED:
      case TaskStatus.ACCEPTED:
        stats.assigned++;
        break;

      case TaskStatus.IN_PROGRESS:
        stats.inProgress++;
        break;

      case TaskStatus.SUBMITTED:
        stats.submitted++;
        break;

      case TaskStatus.OVERDUE:
        stats.overdue++;
        break;

      case TaskStatus.COMPLETED:
        completedCount++;
        // estimate resolution hours if timestamps exist
        if (t.dateAssigned && t.dateDue) {
          const assigned = new Date(t.dateAssigned).getTime();
          const completed = new Date(t.dateDue).getTime();
          const hours = (completed - assigned) / (1000 * 60 * 60);
          if (hours > 0) totalResolutionHours += hours;
        }
        break;

      default:
        break;
    }

    // Count as "due soon" if within 24 hours from now and not completed/overdue
    if (
      t.dateDue &&
      t.status !== TaskStatus.COMPLETED &&
      t.status !== TaskStatus.OVERDUE
    ) {
      const due = new Date(t.dateDue);
      const hoursUntilDue = (due.getTime() - now.getTime()) / (1000 * 60 * 60);
      if (hoursUntilDue > 0 && hoursUntilDue <= 24) {
        stats.dueSoon++;
      }
    }

    // Dynamically catch overdue if due date passed but not completed
    if (
      t.dateDue &&
      new Date(t.dateDue).getTime() < now.getTime() &&
      t.status !== TaskStatus.COMPLETED
    ) {
      stats.overdue++;
    }
  }

  stats.avgResolutionHours = completedCount
    ? parseFloat((totalResolutionHours / completedCount).toFixed(2))
    : 0;

  return stats;
}
