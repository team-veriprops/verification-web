import { QueryTaskDto, QueryTaskStatsDto, TaskStatus } from "@components/portal/tasks/models";
import { tasks } from "@data/mock-tasks";
import { NextRequest, NextResponse } from "next/server";

// GET one
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ verifier_id: string }> }
) {
  const { verifier_id } = await params;

  const filteredTasks = tasks.filter(
    (Task) => Task.verifier_id === verifier_id
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
    in_progress: 0,
    submitted: 0,
    overdue: 0,
    due_soon: 0,
    avg_resolution__hours: 0,
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
        stats.in_progress++;
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
        if (t.date_assigned && t.date_due) {
          const assigned = new Date(t.date_assigned).getTime();
          const completed = new Date(t.date_due).getTime();
          const hours = (completed - assigned) / (1000 * 60 * 60);
          if (hours > 0) totalResolutionHours += hours;
        }
        break;

      default:
        break;
    }

    // Count as "due soon" if within 24 hours from now and not completed/overdue
    if (
      t.date_due &&
      t.status !== TaskStatus.COMPLETED &&
      t.status !== TaskStatus.OVERDUE
    ) {
      const due = new Date(t.date_due);
      const hoursUntilDue = (due.getTime() - now.getTime()) / (1000 * 60 * 60);
      if (hoursUntilDue > 0 && hoursUntilDue <= 24) {
        stats.due_soon++;
      }
    }

    // Dynamically catch overdue if due date passed but not completed
    if (
      t.date_due &&
      new Date(t.date_due).getTime() < now.getTime() &&
      t.status !== TaskStatus.COMPLETED
    ) {
      stats.overdue++;
    }
  }

  stats.avg_resolution__hours = completedCount
    ? parseFloat((totalResolutionHours / completedCount).toFixed(2))
    : 0;

  return stats;
}
