// "use client";

// import { useEffect, useState } from "react";
// import { Button } from "@3rdparty/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@3rdparty/ui/dialog";
// import { Input } from "@3rdparty/ui/input";
// import { Label } from "@3rdparty/ui/label";
// import { MultiSelect } from "@3rdparty/ui/multi-select";
// import { Plus, Settings } from "lucide-react";
// import { CreateRoleDto } from "./models";
// import { AsyncStateComponent } from "@components/ui/AsyncStateComponent";
// import { useRoleQueries } from "./libs/useRoleQueries";
// import { useRoleStore } from "./libs/useRoleStore";
// import { useCompanyStore } from "../../libs/useCompanyStore";

// export default function CreateRoleDialog() {
//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");
//   const [systemRoles, setSystemRoles] = useState<string[]>([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const role_page_size = 100;

//   const {currentCompany} = useCompanyStore()
//   const { updateFilters } = useRoleStore();

//   const { useSearchRolePage } = useRoleQueries();
//   const { data: dataPage, isLoading, isError } = useSearchRolePage(currentCompany?.id!);

//   useEffect(() => {
//     updateFilters({ page_size: role_page_size});
//   }, [role_page_size, updateFilters]);

//   const { useCreateRole } = useRoleQueries();
//   const createRole = useCreateRole(currentCompany?.id!);

//   const newRole: CreateRoleDto = {
//     name,
//     description,
//     system_roles: systemRoles,
//   };

//   const handleCreate = () => {
//     createRole.mutate(newRole, {
//       onSuccess: () => {
//         setName("");
//         setDescription("");
//         setSystemRoles([]);

//         // toast({
//         //   title: "Role Sent",
//         //   description: "Your role has been delivered.",
//         // });
//       },
//     });
//   };

//   return (
//     <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
//       <DialogTrigger asChild>
//         <Button>
//           <Plus className="h-4 w-4 mr-2" />
//           Create Role
//         </Button>
//       </DialogTrigger>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Create New Role</DialogTitle>
//           <DialogDescription>
//             Create a custom role and assign system permissions to it.
//           </DialogDescription>
//         </DialogHeader>
//         <div className="space-y-4">
//           <div className="space-y-2">
//             <Label>Role Name</Label>
//             <Input
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               placeholder="e.g. Manager"
//             />
//           </div>
//           <div className="space-y-2">
//             <Label>Description</Label>
//             <Input
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               placeholder="Role description"
//             />
//           </div>
//           <div className="space-y-2">
//             <Label>System Role Permissions</Label>
//             <AsyncStateComponent
//               isLoading={isLoading}
//               isError={isError}
//               data={dataPage}
//               loadingText="Loading system roles..."
//               errorText="Failed to load roles, please try again later."
//               emptyText="No system roles found."
//             >
//               {(data) => {
//                 const allSystemRoles = data.items.filter((role) => role.is_system_role === true).map((role) => role.name);

//                 return (
//                   <MultiSelect
//                     options={allSystemRoles}
//                     value={systemRoles}
//                     onChange={setSystemRoles}
//                     placeholder="Select permissions"
//                   />
//                 );
//               }}
//             </AsyncStateComponent>
//           </div>
//         </div>
//         <DialogFooter>
//           <Button variant="outline" onClick={() => setIsModalOpen(false)}>
//             Cancel
//           </Button>
//           <Button onClick={handleCreate}>
//             <Settings className="h-4 w-4 mr-2" />
//             Create Role
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }
