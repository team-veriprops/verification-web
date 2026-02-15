import {
  useInfiniteQuery,
  InfiniteData,
  useQuery,
  useMutation,
} from "@tanstack/react-query";
import {
  QueryPaymentDto,
  SearchPaymentDto,
  PaymentStats,
  QueryPaymentCheckoutDto,
  QueryAvailablePaymentMethodDto,
  SearchAvailablePaymentMethodDto,
  QueryPaymentAuthorizationDto,
} from "@components/portal/payments/models";
import { Page, PaymentMethod } from "types/models";
import { usePaymentStore } from "./usePaymentStore";
import { useShallow } from "zustand/react/shallow";
import { stringifyFilters } from "@lib/utils";
import { QueryPaymentDetailDto } from "../details/models";
import { SuccessResponse } from "@components/admin/user/models";

/**
 * React Query hooks wrapping PaymentService
 */
export const usePaymentQueries = () => {
  const service = usePaymentStore((state) => state.service);
  const filters = usePaymentStore(useShallow((state) => state.filters));
  const paymentMethodFilters = usePaymentStore(useShallow((state) => state.paymentMethodFilters));

  const normalizedFilters = stringifyFilters(filters);
  const normalizedPaymentMethodFilters = stringifyFilters(paymentMethodFilters);

  const useGetPaymentCheckout = (invoiceId: string) =>
    useQuery<SuccessResponse<QueryPaymentCheckoutDto>>({
      queryKey: ["payment checkout"] as const,
      queryFn: async (): Promise<SuccessResponse<QueryPaymentCheckoutDto>> =>
        service.getPaymentCheckout(invoiceId),
      placeholderData: (prev) => prev,
  });

  // const useGetPaymentAuthorization = (invoiceId: string, paymentMethod: PaymentMethod) =>
  //   useQuery<SuccessResponse<QueryPaymentAuthorizationDto>>({
  //     queryKey: ["payment authorization"] as const,
  //     queryFn: async (): Promise<SuccessResponse<QueryPaymentAuthorizationDto>> =>
  //       service.getPaymentAuthorization(invoiceId, paymentMethod),
  //     placeholderData: (prev) => prev,
  // });

   const useGetPaymentAuthorization = (invoiceId: string) =>
    useMutation({
      mutationFn: (paymentMethod: PaymentMethod) =>
        service.getPaymentAuthorization(invoiceId, paymentMethod),
  });

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
      getNextPageParam: (lastPage) => lastPage.nextPage, // next page number
      getPreviousPageParam: (firstPage) => firstPage.prevPage, // previous page number
      initialPageParam: 0,
    });

  // Search available payment methods (paged)
  const useSearchAvailablePaymentMethodPage = () =>
    useQuery<Page<QueryAvailablePaymentMethodDto>>({
      queryKey: ["available payment methods", normalizedPaymentMethodFilters],
      queryFn: async (): Promise<Page<QueryAvailablePaymentMethodDto>> =>
        service.searchAvailablePaymentMethodPage(paymentMethodFilters as SearchAvailablePaymentMethodDto),
      placeholderData: (prev) => prev,
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
    useGetPaymentCheckout,
    useGetPaymentAuthorization,
    useGetPaymentStats,
    useSearchPaymentPage,
    useSearchPaymentInfinite,
    useSearchAvailablePaymentMethodPage,
    useGetPaymentDetail
  };
};
