import { Badge } from "@3rdparty/ui/badge";
import { XCircle, CheckCircle2, Filter, ArrowDownUp } from "lucide-react";
import { useTaskQueries } from "./libs/useTaskQueries";
import {
  QueryTaskDto,
  verifierStatuses,
  TaskStatus,
} from "./models";
import { useTaskStore } from "./libs/useTaskStore";
import { useGlobalSettings } from "@stores/useGlobalSettings";
import { useEffect } from "react";
import { Action, Column, DataTable } from "@components/ui/DataTable";
import { formatSLATimeRemaining, SLAProgressBar } from "./SLAProgressBar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/3rdparty/ui/select";

import { useAuthStore } from "@components/website/auth/libs/useAuthStore";
import { KeyValue } from "types/models";
import TaskDetailsDrawer, { verifierRoleIcons } from "./details/TaskDetailsDrawer";

export const TaskTable = () => {
  const { activeAuditor } = useAuthStore();
  const { settings } = useGlobalSettings();
  const {
    TaskFilters,
    updateTaskFilters,
    setCurrentTask,
    setViewCurrentTask,
  } = useTaskStore();

  const { useSearchTaskPage } = useTaskQueries();
  const { data, isLoading, isError, error } = useSearchTaskPage(
    activeAuditor?.verifier_id ?? ""
  );

  useEffect(() => {
    updateTaskFilters({ page_size: settings.rowsPerPage });
  }, [settings.rowsPerPage, updateTaskFilters]);

  const onViewTask = (task: QueryTaskDto) => {
    setCurrentTask(task);
    setViewCurrentTask(true);
  };

  const acceptTask = (task: QueryTaskDto) => {};

  const declineTask = (task: QueryTaskDto) => {};

  const ordersBy: KeyValue[] = [{ key: "date_due desc", value: "Due Date" }];

  const handleOrderBy = (sortBy: string) =>
    updateTaskFilters({ order_by: sortBy, page: settings.firstPage });

  const columns: Column<QueryTaskDto>[] = [
    {
      key: "property_id",
      label: "Property",
      sortable: true,
      render: (value, item) => (
        <>
          <div className="font-medium capitalize">{item?.property_title}</div>
          <div className="text-sm text-muted-foreground capitalize">
            {item?.location?.address}
          </div>
        </>
      ),
    },
    {
      key: "role_required",
      label: "Role",
      sortable: true,
      render: (value, item) => {
        const RoleIcon = verifierRoleIcons[item?.role_required ?? ""];
        return (
          <Badge
            variant="outline"
            className="bg-primary/10 text-primary border-primary/20"
          >
            <RoleIcon className="mr-1 h-3 w-3" />
            {item?.role_required}
          </Badge>
        );
      },
    },
    {
      key: "verification_focus",
      label: "Focus",
      sortable: true,
      render: (value, item) => (
        <div className="flex flex-wrap">
          {item.verification_focus.map((focus, key) => (
            <Badge key={key} variant="outline">
              {focus}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (value, item) => (
        <Badge
          variant={
            item.status === TaskStatus.OVERDUE
              ? "destructive"
              : "default"
          }
        >
          {item.status}
        </Badge>
      ),
    },
    {
      key: "trust_score",
      label: "SLA",
      sortable: true,
      render: (value, item) => (
        <div className="w-32">
          <SLAProgressBar
            start_date={item.date_assigned}
            due_date={item.date_due}
            current_date={settings.currentTime}
          />
          <div className="text-xs text-muted-foreground mt-1">
            {formatSLATimeRemaining(settings.currentTime, item.date_due)}
          </div>
        </div>
      ),
    },
    {
      key: "required_evidence",
      label: "Evidence",
      sortable: true,
      render: (value, item) => (
        <div className="text-sm text-end">
          {item.provided_response?.length ?? 0} /{" "}
          {item.required_response?.length ?? 0}
        </div>
      ),
    },
  ];

  const actions: Action<QueryTaskDto>[] = [
    {
      label: "Accept Task",
      icon: CheckCircle2,
      onClick: (task) => acceptTask(task),
    },
    {
      label: "Decline Task",
      icon: XCircle,
      onClick: (task) => declineTask(task),
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        actions={actions}
        dataPage={data!}
        isLoading={isLoading}
        isError={isError}
        error={error}
        currentPage={TaskFilters.page!}
        updateFilters={updateTaskFilters}
        isRowClickable={true}
        onRowClick={(task) => onViewTask(task)}
        searchPlaceholder={"Search property, location, status..."}
      >
        <div className="flex gap-3">
          <Select
            value={TaskFilters.status}
            onValueChange={(selectedStatus: any) =>
              updateTaskFilters({ status: selectedStatus })
            }
          >
            <SelectTrigger className="w-45">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder={"Select status"} />
            </SelectTrigger>
            <SelectContent>
              {verifierStatuses.map((status) => (
                <SelectItem key={status.key} value={status.key}>
                  {status.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={TaskFilters.order_by}
            onValueChange={(selectedSortBy: any) =>
              handleOrderBy(selectedSortBy)
            }
          >
            <SelectTrigger className="w-45">
              <ArrowDownUp className="mr-2 h-4 w-4" />
              <SelectValue placeholder={"Sort by"} />
            </SelectTrigger>
            <SelectContent>
              {ordersBy.map((orderBy) => (
                <SelectItem key={orderBy.key} value={orderBy.key}>
                  {orderBy.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <TaskDetailsDrawer />
      </DataTable>
    </>
  );
};
