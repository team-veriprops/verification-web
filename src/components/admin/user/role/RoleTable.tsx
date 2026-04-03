"use client";

import { BadgeMinus } from "lucide-react";
import { useEffect } from "react";
import { Badge } from "@components/3rdparty/ui/badge";
import { useGlobalSettings } from "@stores/useGlobalSettings";
import CreateRoleDialog from "./CreateRoleDialog";
import { Action, Column, DataTable } from "@components/ui/DataTable";
import { QueryRoleDto } from "./models";
import { useRoleStore } from "./libs/useRoleStore";
import { useRoleQueries } from "./libs/useRoleQueries";
import { getErrorMessage } from "@lib/utils";
import { toast } from "@components/3rdparty/ui/use-toast";

export default function RoleTable() {
  // const { settings } = useGlobalSettings();
  const { filters, updateFilters, setCurrentRole, setViewRoleDetail } =
    useRoleStore();

  const { useSearchRolePage, useDeleteRole } = useRoleQueries();
  const { data, isLoading, isError, error } = useSearchRolePage();
  const deleteRole = useDeleteRole()

  // useEffect(() => {
  //   updateFilters({ pageSize: settings.rowsPerPage, isSystemRole: undefined});
  // }, [settings.rowsPerPage, updateFilters]);

  const columns: Column<QueryRoleDto>[] = [
    {
      key: "name",
      label: "Role Name",
      sortable: true,
      render: (value, role) => <div className="font-medium">{role.name}</div>,
    },
    {
      key: "description",
      label: "Description",
      sortable: true,
      render: (value, role) => (
        <div className="text-sm text-muted-foreground">{role.description}</div>
      ),
    },
    {
      key: "system_roles",
      label: "System Roles",
      sortable: true,
      render: (value, role) => (
        <div className="flex gap-1 flex-wrap">
          {role.systemRoles.map((systemRole) => (
            <Badge key={systemRole} variant="outline" className="text-xs">
              {systemRole}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      key: "isSystemRole",
      label: "Type",
      sortable: true,
      render: (value, role) => (
        <Badge variant={role.isSystemRole ? "default" : "secondary"}>
          {role.isSystemRole ? "System" : "Custom"}
        </Badge>
      ),
    },
  ];

  const actions: Action<QueryRoleDto>[] = [
    {
      label: "Remove Role",
      icon: BadgeMinus,
      onClick: (role) => {
        handleDeleteRole(role)
      },
    },
  ];

  const handleViewDetails = (role: QueryRoleDto) => {
    setCurrentRole(role);
    setViewRoleDetail(true);
  };

  const handleDeleteRole = (role: QueryRoleDto) => {
    deleteRole.mutate(role.id ?? "", {
      onSuccess: () => {
        toast({
          title: "Role deleted",
          description: `${role.name} has been deleted successfully.`,
        });
      },
      onError: (error: Error) => {
        const message = getErrorMessage(error, "Failed to delete role");

        toast({
          title: "Error",
          description: message,
          variant: "destructive",
        });
      },
    })
  }

  return (
    <>
      <DataTable
        columns={columns}
        actions={actions}
        dataPage={data!}
        isLoading={isLoading}
        isError={isError}
        error={error}
        currentPage={filters.page!}
        updateFilters={updateFilters}
        isRowClickable={true}
        onRowClick={(role) => handleViewDetails(role)}
      >
        <CreateRoleDialog />
      </DataTable>
    </>
  );
}
