import {
  useQueryClient,
  useInfiniteQuery,
  InfiniteData,
  useQuery,
} from "@tanstack/react-query";
import {
  QueryTransactionDto,
  SearchTransactionDto,
  TransactionStats,
} from "@components/portal/transactions/models";
import { Page } from "types/models";
import { useTransactionStore } from "./useTransactionStore";
import { useShallow } from "zustand/react/shallow";
import { stringifyFilters } from "@lib/utils";

/**
 * React Query hooks wrapping TransactionService
 */
export const useTransactionQueries = () => {
  const service = useTransactionStore((state) => state.service);
  const filters = useTransactionStore(useShallow((state) => state.filters));

  const normalizedFilters = stringifyFilters(filters);

  const useGetTransactionStats = () =>
    useQuery<TransactionStats>({
      queryKey: ["transaction stats"] as const,
      queryFn: async (): Promise<TransactionStats> =>
        service.getTransactionStats(),
      placeholderData: (prev) => prev,
    });

  // Search transaction list (paged)
  const useSearchTransactionPage = () =>
    useQuery<Page<QueryTransactionDto>>({
      queryKey: ["transactions", normalizedFilters],
      queryFn: async (): Promise<Page<QueryTransactionDto>> =>
        service.searchTransactionPage(filters as SearchTransactionDto),
      placeholderData: (prev) => prev,
    });

  // Infinite scroll version of transaction list
  const useSearchTransactionInfinite = () =>
    useInfiniteQuery<
      Page<QueryTransactionDto>, // TData
      Error, // TError
      InfiniteData<Page<QueryTransactionDto>>, // TQueryFnData
      readonly unknown[] // TQueryKey
    >({
      queryKey: ["transactions", normalizedFilters] as const,
      queryFn: async ({ pageParam = 0 }): Promise<Page<QueryTransactionDto>> =>
        service.searchTransactionPage({
          ...filters,
          page: pageParam,
        } as SearchTransactionDto),
      getNextPageParam: (lastPage) => lastPage.next_page, // next page number
      getPreviousPageParam: (firstPage) => firstPage.prev_page, // previous page number
      initialPageParam: 0,
    });

  return {
    useGetTransactionStats,
    useSearchTransactionPage,
    useSearchTransactionInfinite,
  };
};
