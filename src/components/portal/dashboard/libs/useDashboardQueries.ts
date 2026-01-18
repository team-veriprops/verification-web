import {
  useInfiniteQuery,
  InfiniteData,
  useQuery,
} from "@tanstack/react-query";
import { Page } from "types/models";
import { useDashboardStore } from "./useDashboardStore";
import { useShallow } from "zustand/react/shallow";
import { stringifyFilters } from "@lib/utils";
import { DashboardStats } from "../models";
import { QueryVerificationDto, SearchVerificationDto } from "@components/portal/verifications/models";

/**
 * React Query hooks wrapping DashboardService
 */
export const useDashboardQueries = () => {
  const service = useDashboardStore((state) => state.service);
  const filters = useDashboardStore(useShallow((state) => state.filters));

  const normalizedFilters = stringifyFilters(filters);

  const useGetDashboardStats = () =>
    useQuery<DashboardStats>({
      queryKey: ["dashboard stats"] as const,
      queryFn: async (): Promise<DashboardStats> =>
        service.getDashboardStats(),
      placeholderData: (prev) => prev,
    });

  // Infinite scroll version of dashboard list
  const useGetRecentVerificationActivitiesInfinite = () =>
    useInfiniteQuery<
      Page<QueryVerificationDto>, // TData
      Error, // TError
      InfiniteData<Page<QueryVerificationDto>>, // TQueryFnData
      readonly unknown[] // TQueryKey
    >({
      queryKey: ["dashboards", normalizedFilters] as const,
      queryFn: async ({ pageParam = 0 }): Promise<Page<QueryVerificationDto>> =>
        service.getRecentVerificationActivities({
          ...filters,
          page: pageParam,
        } as SearchVerificationDto),
      getNextPageParam: (lastPage) => lastPage.next_page, // next page number
      getPreviousPageParam: (firstPage) => firstPage.prev_page, // previous page number
      initialPageParam: 0,
    });

  return {
    useGetDashboardStats,
    useGetRecentVerificationActivitiesInfinite
  };
};
