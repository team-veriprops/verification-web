import {
  useInfiniteQuery,
  InfiniteData,
  useQuery,
  useMutation,
} from "@tanstack/react-query";
import {
  CreateVerificationDto,
  QueryVerificationDto,
  SearchVerificationDto,
  UpdateVerificationDto,
} from "@components/portal/verifications/models";
import { Page } from "types/models";
import { useShallow } from "zustand/react/shallow";
import { stringifyFilters } from "@lib/utils";
import { QueryVerificationDetailDto } from "../details/models";
import { useVerificationStore } from "./useVerificationStore";

/**
 * React Query hooks wrapping VerificationService
 */
export const useVerificationQueries = () => {
  const service = useVerificationStore((state) => state.service);
  const filters = useVerificationStore(useShallow((state) => state.filters));

  const normalizedFilters = stringifyFilters(filters);

  const useCreateVerification = () =>
    useMutation({
      mutationFn: (payload: CreateVerificationDto) =>
        service.createVerification(payload),
  });

  const useUpdateVerification = (verificationId: string) =>
    useMutation({
      mutationFn: (payload: UpdateVerificationDto) =>
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

  const useGetVerificationDetail = (verificationId: string) =>
      useQuery<QueryVerificationDetailDto>({
        queryKey: ["verification detail", verificationId] as const,
        queryFn: async (): Promise<QueryVerificationDetailDto> =>
          service.getVerificationDetail(verificationId),
        enabled: !!verificationId, // only fetch if id exists
        placeholderData: (prev) => prev,
      });

  return {
    useCreateVerification,
    useUpdateVerification,
    useSearchVerificationPage,
    useSearchVerificationInfinite,
    useGetVerificationDetail
  };
};
