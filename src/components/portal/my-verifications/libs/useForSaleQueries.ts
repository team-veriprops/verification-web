import {
  useInfiniteQuery,
  InfiniteData,
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Page } from "types/models";
import { useShallow } from "zustand/react/shallow";
import { stringifyFilters } from "@lib/utils";
import { CreateForSaleDto, QueryForSaleDto, SearchForSaleDto } from "../models";
import { useForSaleStore } from "./useForSaleStore";

/**
 * React Query hooks wrapping ForSaleService
 */
export const useForSaleQueries = () => {
  const service = useForSaleStore((state) => state.service);
  const filters = useForSaleStore(useShallow((state) => state.filters));
  const queryClient = useQueryClient();
  const normalizedFilters = stringifyFilters(filters);

  const useCreateForSale = () =>
    useMutation({
      mutationFn: (payload: CreateForSaleDto) => service.createForSale(payload),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["for_sales"],
        });
      },
    });

  // Search for_sale list (paged)
  const useSearchForSalePage = () =>
    useQuery<Page<QueryForSaleDto>>({
      queryKey: ["for_sales", normalizedFilters],
      queryFn: async (): Promise<Page<QueryForSaleDto>> =>
        service.searchForSalePage(filters as SearchForSaleDto),
      placeholderData: (prev) => prev,
    });

  // Infinite scroll version of for_sale list
  const useSearchForSaleInfinite = () =>
    useInfiniteQuery<
      Page<QueryForSaleDto>, // TData
      Error, // TError
      InfiniteData<Page<QueryForSaleDto>>, // TQueryFnData
      readonly unknown[] // TQueryKey
    >({
      queryKey: ["for_sales", normalizedFilters] as const,
      queryFn: async ({ pageParam = 0 }): Promise<Page<QueryForSaleDto>> =>
        service.searchForSalePage({
          ...filters,
          page: pageParam,
        } as SearchForSaleDto),
      getNextPageParam: (lastPage) => lastPage.next_page, // next page number
      getPreviousPageParam: (firstPage) => firstPage.prev_page, // previous page number
      initialPageParam: 0,
    });

  return {
    useCreateForSale,
    useSearchForSalePage,
    useSearchForSaleInfinite,
  };
};
