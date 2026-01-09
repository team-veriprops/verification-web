import {
  useInfiniteQuery,
  InfiniteData,
  useQuery,
} from "@tanstack/react-query";
import {
  QueryPaymentDto,
  SearchPaymentDto,
  PaymentStats,
} from "@components/portal/payments/models";
import { Page } from "types/models";
import { usePaymentStore } from "./usePaymentStore";
import { useShallow } from "zustand/react/shallow";
import { stringifyFilters } from "@lib/utils";
import { QueryPaymentDetailDto } from "../details/models";

/**
 * React Query hooks wrapping PaymentService
 */
export const usePaymentQueries = () => {
  const service = usePaymentStore((state) => state.service);
  const filters = usePaymentStore(useShallow((state) => state.filters));

  const normalizedFilters = stringifyFilters(filters);

  const useGetPaymentStats = () =>
    useQuery<PaymentStats>({
      queryKey: ["payment stats"] as const,
      queryFn: async (): Promise<PaymentStats> =>
        service.getPaymentStats(),
      placeholderData: (prev) => prev,
    });

  // Search payment list (paged)
  const useSearchPaymentPage = () =>
    useQuery<Page<QueryPaymentDto>>({
      queryKey: ["payments", normalizedFilters],
      queryFn: async (): Promise<Page<QueryPaymentDto>> =>
        service.searchPaymentPage(filters as SearchPaymentDto),
      placeholderData: (prev) => prev,
    });

  // Infinite scroll version of payment list
  const useSearchPaymentInfinite = () =>
    useInfiniteQuery<
      Page<QueryPaymentDto>, // TData
      Error, // TError
      InfiniteData<Page<QueryPaymentDto>>, // TQueryFnData
      readonly unknown[] // TQueryKey
    >({
      queryKey: ["payments", normalizedFilters] as const,
      queryFn: async ({ pageParam = 0 }): Promise<Page<QueryPaymentDto>> =>
        service.searchPaymentPage({
          ...filters,
          page: pageParam,
        } as SearchPaymentDto),
      getNextPageParam: (lastPage) => lastPage.next_page, // next page number
      getPreviousPageParam: (firstPage) => firstPage.prev_page, // previous page number
      initialPageParam: 0,
    });

  const useGetPaymentDetail = (payment_id: string) =>
      useQuery<QueryPaymentDetailDto>({
        queryKey: ["payment detail", payment_id] as const,
        queryFn: async (): Promise<QueryPaymentDetailDto> =>
          service.getPaymentDetail(payment_id),
        enabled: !!payment_id, // only fetch if id exists
        placeholderData: (prev) => prev,
      });

  return {
    useGetPaymentStats,
    useSearchPaymentPage,
    useSearchPaymentInfinite,
    useGetPaymentDetail
  };
};
