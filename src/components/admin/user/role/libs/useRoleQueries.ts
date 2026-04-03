import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import {
  CreateRoleDto,
  QueryRoleDto,
  SearchRoleDto,
  UpdateRoleDto,
  UpdateSystemRolesDto,
} from "../models";
import { Page, SuccessResponse } from "types/models";
import { useShallow } from "zustand/react/shallow";
import { stringifyFilters } from "@lib/utils";
import { useRoleStore } from "./useRoleStore";

/**
 * React Query hooks wrapping RoleService
 */
export const useRoleQueries = () => {
  const service = useRoleStore((state) => state.service);
  const filters = useRoleStore(useShallow((state) => state.filters));
  const queryClient = useQueryClient();
  const normalizedFilters = stringifyFilters(filters);

  const useCreateRole = () =>
    useMutation({
      mutationFn: (payload: CreateRoleDto) =>
        service.createRole(payload),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["create-role"],
        });
      },
    });

  const useGetRole = (roleId: string) => 
      useQuery<SuccessResponse<QueryRoleDto>>({
        queryKey: ["get-invited_user", roleId] as const,
        queryFn: async (): Promise<SuccessResponse<QueryRoleDto>> => service.getRole(roleId),
        placeholderData: (prev) => prev,
        enabled: !roleId
  });

  const useSearchRolePage = () =>
    useQuery<Page<QueryRoleDto>>({
      queryKey: ["roles", normalizedFilters],
      queryFn: async (): Promise<Page<QueryRoleDto>> =>
        service.searchRolePage(filters as SearchRoleDto),
      placeholderData: (prev) => prev,
      // enabled: !!company_id, // only fetch if company_id exists
  });

  const useUpdateRole = () =>
    useMutation({
      mutationFn: (roleId: string, payload: UpdateRoleDto) =>
        service.updateRole(roleId, payload),
  });

  const useUpdateSystemRoles = () =>
    useMutation({
      mutationFn: (roleId: string, updateDto: UpdateSystemRolesDto) =>
        service.updateSystemRoles(roleId, updateDto),
  });

  const useDeactivateRole = () =>
    useMutation({
      mutationFn: (roleId: string) =>
        service.deactivateRole(roleId),
  });

  const useActivateRole = () =>
    useMutation({
      mutationFn: (roleId: string) =>
        service.activateRole(roleId),
  });

  const useDeleteRole = () =>
    useMutation({
      mutationFn: (roleId: string) =>
        service.deleteRole(roleId),
  });

  return {
    useCreateRole,
    useGetRole,
    useSearchRolePage,
    useUpdateRole,
    useUpdateSystemRoles,
    useDeactivateRole,
    useActivateRole,
    useDeleteRole
  };
};
