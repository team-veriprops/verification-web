import {
  useInfiniteQuery,
  InfiniteData,
  useQuery,
  useMutation,
} from "@tanstack/react-query";
import {
  CreateVerificationDto,
  QueryVerificationDto,
  QueryVerificationTierDto,
  SearchVerificationDto,
  SearchVerificationTierDto,
  UpdateVerificationDto,
} from "@components/portal/verifications/models";
import { Page } from "types/models";
import { useShallow } from "zustand/react/shallow";
import { stringifyFilters } from "@lib/utils";
import { QueryVerificationDetailDto } from "../details/models";
import { useVerificationStore } from "./useVerificationStore";
import { SuccessResponse } from "@components/admin/user/models";

/**
 * React Query hooks wrapping VerificationService
 */
export const useVerificationQueries = () => {
  const service = useVerificationStore((state) => state.service);
  const filters = useVerificationStore(useShallow((state) => state.filters));
  const verificationTierFilters = useVerificationStore(useShallow((state) => state.verificationTierFilters));

  const normalizedFilters = stringifyFilters(filters);
  const normalizedVerificationTierFilters = stringifyFilters(verificationTierFilters);

  const useCreateVerification = () =>
    useMutation({
      mutationFn: (payload: FormData) =>
        service.createVerification(payload),
  });

  const useUpdateVerification = (verificationId: string) =>
    useMutation({
      mutationFn: (payload: FormData) =>
        service.updateVerification(verificationId, payload),
  });

  // Search verification list (paged)
  const useSearchVerificationPage = () =>
    useQuery<Page<QueryVerificationDto>>({
      queryKey: ["verifications", normalizedFilters],
      queryFn: async (): Promise<Page<QueryVerificationDto>> =>
        service.searchVerificationPage(filters as SearchVerificationDto),
      placeholderData: (prev) => prev,
    });

  // Infinite scroll version of verification list
  const useSearchVerificationInfinite = () =>
    useInfiniteQuery<
      Page<QueryVerificationDto>, // TData
      Error, // TError
      InfiniteData<Page<QueryVerificationDto>>, // TQueryFnData
      readonly unknown[] // TQueryKey
    >({
      queryKey: ["verifications", normalizedFilters] as const,
      queryFn: async ({ pageParam = 0 }): Promise<Page<QueryVerificationDto>> =>
        service.searchVerificationPage({
          ...filters,
          page: pageParam,
        } as SearchVerificationDto),
      getNextPageParam: (lastPage) => lastPage.nextPage, // next page number
      getPreviousPageParam: (firstPage) => firstPage.prevPage, // previous page number
      initialPageParam: 0,
    });

  // Search verification tiers (paged)
  const useGetVerificationTierPage = () =>
    useQuery<Page<QueryVerificationTierDto>>({
      queryKey: ["verification tiers", normalizedVerificationTierFilters],
      queryFn: async (): Promise<Page<QueryVerificationTierDto>> =>
        service.getVerificationTierPage(verificationTierFilters as SearchVerificationTierDto),
      placeholderData: (prev) => prev,
    });

  const useGetVerificationDetail = (verificationId: string) =>
      useQuery<SuccessResponse<QueryVerificationDetailDto>>({
        queryKey: ["verification detail", verificationId] as const,
        queryFn: async (): Promise<SuccessResponse<QueryVerificationDetailDto>> =>
          service.getVerificationDetail(verificationId),
        enabled: !!verificationId, // only fetch if id exists
        placeholderData: (prev) => prev,
      });

  return {
    useCreateVerification,
    useUpdateVerification,
    useSearchVerificationPage,
    useSearchVerificationInfinite,
    useGetVerificationTierPage,
    useGetVerificationDetail
  };
};
