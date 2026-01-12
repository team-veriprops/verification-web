// "use client";

// import { BadgeMinus } from "lucide-react";
// import { useEffect } from "react";
// import { Badge } from "@components/3rdparty/ui/badge";
// import { useGlobalSettings } from "@stores/useGlobalSettings";
// import CreateRoleDialog from "./CreateRoleDialog";
// import { Action, Column, DataTable } from "@components/ui/DataTable";
// import { QueryRoleDto } from "./models";
// import { useRoleStore } from "./libs/useRoleStore";
// import { useRoleQueries } from "./libs/useRoleQueries";
// import { useCompanyStore } from "../../libs/useCompanyStore";

// export default function RoleTable() {
//   const { settings } = useGlobalSettings();
//   const { filters, updateFilters, setCurrentRole, setViewRoleDetail } =
//     useRoleStore();

//   const {currentCompany} = useCompanyStore()
//   const { useSearchRolePage } = useRoleQueries();
//   const { data, isLoading, isError, error } = useSearchRolePage(currentCompany?.id!);

//   useEffect(() => {
//     updateFilters({ page_size: settings.rowsPerPage, is_system_role: undefined});
//   }, [settings.rowsPerPage, updateFilters]);

//   const columns: Column<QueryRoleDto>[] = [
//     {
//       key: "name",
//       label: "Role Name",
//       sortable: true,
//       render: (value, role) => <div className="font-medium">{role.name}</div>,
//     },
//     {
//       key: "description",
//       label: "Description",
//       sortable: true,
//       render: (value, role) => (
//         <div className="text-sm text-muted-foreground">{role.description}</div>
//       ),
//     },
//     {
//       key: "system_roles",
//       label: "System Roles",
//       sortable: true,
//       render: (value, role) => (
//         <div className="flex gap-1 flex-wrap">
//           {role.system_roles.map((systemRole) => (
//             <Badge key={systemRole} variant="outline" className="text-xs">
//               {systemRole}
//             </Badge>
//           ))}
//         </div>
//       ),
//     },
//     {
//       key: "is_system_role",
//       label: "Type",
//       sortable: true,
//       render: (value, role) => (
//         <Badge variant={role.is_system_role ? "default" : "secondary"}>
//           {role.is_system_role ? "System" : "Custom"}
//         </Badge>
//       ),
//     },
//   ];

//   const actions: Action<QueryRoleDto>[] = [
//     {
//       label: "Remove Role",
//       icon: BadgeMinus,
//       onClick: (role) => {
//         console.log("Removed", role.id);
//       },
//     },
//   ];

//   const handleViewDetails = (role: QueryRoleDto) => {
//     setCurrentRole(role);
//     setViewRoleDetail(true);
//   };

//   return (
//     <>
//       <DataTable
//         columns={columns}
//         actions={actions}
//         dataPage={data!}
//         isLoading={isLoading}
//         isError={isError}
//         error={error}
//         currentPage={filters.page!}
//         updateFilters={updateFilters}
//         isRowClickable={true}
//         onRowClick={(role) => handleViewDetails(role)}
//       >
//         <CreateRoleDialog />
//       </DataTable>
//     </>
//   );
// }
