"use client";

import { Badge } from "@3rdparty/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@3rdparty/ui/avatar";
import { useEffect } from "react";
import { Eye, UserMinus, UserX } from "lucide-react";
import { useGlobalSettings } from "@stores/useGlobalSettings";
import { Action, Column, DataTable } from "@components/ui/DataTable";
import { useUserQueries } from "./libs/useUserQueries";
import { useUserStore } from "./libs/useUserStore";
// import InviteMemberDialog from "./InviteAdminUserDialog";
import { QueryInvitedUserDto, QueryUserDto } from "./models";
import InviteAdminUserDialog from "./InviteAdminUserDialog";
import { formatDate } from "@lib/time";
import { toast } from "@components/3rdparty/ui/use-toast";
import { getErrorMessage } from "@lib/utils";


export default function UserInviteTable() {
  const { settings } = useGlobalSettings();
  const { invitedUserFilters, updateInvitedUserFilters } =
    useUserStore();

  const { useSearchInvitedUserPage, useReInviteUser, useDeleteInvitedUser } = useUserQueries();
  const { data, isLoading, isError, error } = useSearchInvitedUserPage();
  const reinviteUser = useReInviteUser();
  const deleteInvitedUser = useDeleteInvitedUser();

  useEffect(() => {
    updateInvitedUserFilters({ pageSize: settings.rowsPerPage });
  }, [settings.rowsPerPage, updateInvitedUserFilters]);

  const columns: Column<QueryInvitedUserDto>[] = [
    {
      key: "fullname",
      label: "Member",
      sortable: true,
      render: (value, user) => (
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={""} alt={user.fullname} />
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
      key: "dateCreated",
      label: "Date Invited",
      sortable: true,
      render: (value, item) => formatDate(value),
    },
    {
      key: "dateReinvited",
      label: "Date Re-invited",
      sortable: true,
      render: (value, item) => formatDate(value),
    },
  ];

  const actions: Action<QueryInvitedUserDto>[] = [
    {
      label: "Reinvite User",
      icon: UserX,
      onClick: (user) => {
        handleReinviteUser(user);
      },
    },
    {
      label: "Remove User",
      icon: UserMinus,
      onClick: (user) => {
        handleDeleteInvitedUser(user);
      },
    },
  ];

  const handleReinviteUser = (user: QueryInvitedUserDto) => {
    reinviteUser.mutate(user.id ?? "", {
      onSuccess: () => {
        toast({
          title: "User Reinvited",
          description: `${user.fullname} has been reinvited successfully.`,
        });
      },
      onError: (error: Error) => {
        const message = getErrorMessage(error, "Failed to reinvite user");

        toast({
          title: "Error",
          description: message,
          variant: "destructive",
        });
      },
    })
  }

  const handleDeleteInvitedUser = (user: QueryInvitedUserDto) => {
    deleteInvitedUser.mutate(user.id ?? "", {
      onSuccess: () => {
        toast({
          title: "Invited User deleted",
          description: `${user.fullname} has been deleted successfully.`,
        });
      },
      onError: (error: Error) => {
        const message = getErrorMessage(error, "Failed to delete Invited User");

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
        currentPage={invitedUserFilters.page!}
        updateFilters={updateInvitedUserFilters}
        isRowClickable={true}
        onRowClick={(user) => {}}
      >
        <InviteAdminUserDialog />
      </DataTable>
    </>
  );
}
