import { useQuery } from "@tanstack/react-query";
import { QueryTransactionDetailDto } from "../models";
import { useTransactionDetailStore } from "./useTransactionDetailStore";

/**
 * React Query hooks wrapping TransactionService
 */
export const useTransactionDetailQueries = () => {
  const { service } = useTransactionDetailStore();

  const useGetTransactionDetail = (transaction_id: string) =>
    useQuery<QueryTransactionDetailDto>({
      queryKey: ["transaction detail", transaction_id] as const,
      queryFn: async (): Promise<QueryTransactionDetailDto> =>
        service.getTransactionDetail(transaction_id),
      enabled: !!transaction_id, // only fetch if id exists
      placeholderData: (prev) => prev,
    });

  return {
    useGetTransactionDetail,
  };
};
