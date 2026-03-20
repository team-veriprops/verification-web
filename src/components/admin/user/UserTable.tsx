"use client";

import { Badge } from "@3rdparty/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@3rdparty/ui/avatar";
import { useEffect } from "react";
import { Eye, UserMinus, UserX } from "lucide-react";
import { useGlobalSettings } from "@stores/useGlobalSettings";
import { Action, Column, DataTable } from "@components/ui/DataTable";
import { format } from "date-fns";
import { useUserQueries } from "./libs/useUserQueries";
import { useUserStore } from "./libs/useUserStore";
// import InviteMemberDialog from "./InviteAdminUserDialog";
import { QueryUserDto } from "./models";
import InviteAdminUserDialog from "./InviteAdminUserDialog";


export default function UsersTable() {
  const { settings } = useGlobalSettings();
  const { filters, updateFilters, setCurrentUser, setViewUserDetail } =
    useUserStore();

  const { useSearchUserPage } = useUserQueries();
  const { data, isLoading, isError, error } = useSearchUserPage();

  useEffect(() => {
    updateFilters({ pageSize: settings.rowsPerPage });
  }, [settings.rowsPerPage, updateFilters]);

  const columns: Column<QueryUserDto>[] = [
    {
      key: "fullname",
      label: "Member",
      sortable: true,
      render: (value, user) => (
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar} alt={user.fullname} />
            <AvatarFallback>
              {user.fullname
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{user.fullname}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      label: "Role",
      sortable: true,
      render: (value, item) => value,
    },
    // {
    //   key: "status",
    //   label: "Status",
    //   sortable: true,
    //   render: (value) => (
    //     <Badge
    //       variant={
    //         value === UserStatus.ACTIVE
    //           ? "default"
    //           : value === UserStatus.PENDING
    //             ? "secondary"
    //             : "destructive"
    //       }
    //     >
    //       {value}
    //     </Badge>
    //   ),
    // },
    {
      key: "date_created",
      label: "Date Joined",
      sortable: true,
      render: (value, item) => format(new Date(value), "PPP"),
    },
  ];

  const actions: Action<QueryUserDto>[] = [
    {
      label: "View Details",
      icon: Eye,
      onClick: (user) => handleViewDetails(user),
    },
    {
      label: "Disable User",
      icon: UserX,
      onClick: (user) => {
        console.log("Receipt", user.id);
      },
    },
    {
      label: "Remove User",
      icon: UserMinus,
      onClick: (user) => {
        console.log("Removed", user.id);
      },
    },
  ];

  const handleViewDetails = (user: QueryUserDto) => {
    setCurrentUser(user);
    setViewUserDetail(true);
  };

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
        onRowClick={(user) => handleViewDetails(user)}
      >
        <InviteAdminUserDialog />
      </DataTable>
    </>
  );
}
