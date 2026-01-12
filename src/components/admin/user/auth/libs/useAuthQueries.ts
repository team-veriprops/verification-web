'use client'

import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "./useAuthStore";
import { LoginSuccessDto } from "@components/admin/user/models";
import { useEffect } from "react";

/**
 * React Query hooks wrapping AuthService
 */
export const useAuthQueries = () => {
  const service = useAuthStore((state) => state.service);
  const { setActiveAuditor, activeAuditor } = useAuthStore();

  const useGetAuth = () => {
    const result = useQuery<LoginSuccessDto>({
      queryKey: ["get-active-auditor-details"] as const,
      queryFn: async (): Promise<LoginSuccessDto> => service.getProfile(),
      placeholderData: (prev) => prev,
      enabled: !activeAuditor?.id
    });

    useEffect(() => {
      if (result.data) {
        setActiveAuditor(result.data);
      }
    }, [result.status, result.data]);

    return result;
  };

  return {
    useGetAuth,
  };
};
