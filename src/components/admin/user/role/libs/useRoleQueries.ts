// import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
// import {
//   CreateRoleDto,
//   QueryRoleDto,
//   SearchRoleDto,
// } from "@components/portal/company/team/role/models";
// import { Page } from "types/models";
// import { useShallow } from "zustand/react/shallow";
// import { stringifyFilters } from "@lib/utils";
// import { useRoleStore } from "./useRoleStore";

// /**
//  * React Query hooks wrapping RoleService
//  */
// export const useRoleQueries = () => {
//   const service = useRoleStore((state) => state.service);
//   const filters = useRoleStore(useShallow((state) => state.filters));
//   const queryClient = useQueryClient();
//   const normalizedFilters = stringifyFilters(filters);

//   const useCreateRole = (company_id: string) =>
//     useMutation({
//       mutationFn: (payload: CreateRoleDto) =>
//         service.createRole(company_id, payload),
//       onSuccess: () => {
//         queryClient.invalidateQueries({
//           queryKey: ["roles", company_id],
//         });
//       },
//     });

//   // Search role list (paged)
//   const useSearchRolePage = (company_id: string) =>
//     useQuery<Page<QueryRoleDto>>({
//       queryKey: ["roles", normalizedFilters, company_id],
//       queryFn: async (): Promise<Page<QueryRoleDto>> =>
//         service.searchRolePage(company_id, filters as SearchRoleDto),
//       placeholderData: (prev) => prev,
//       enabled: !!company_id, // only fetch if company_id exists
//     });

//   return {
//     useCreateRole,
//     useSearchRolePage,
//   };
// };
