import {
  useMutation,
  useQueryClient,
  useInfiniteQuery,
  InfiniteData,
} from "@tanstack/react-query";
import {
  CreateMessageDto,
  QueryMessageDto,
  SearchMessageDto,
} from "@components/portal/conversations/messages/models";
import { Page } from "types/models";
import { useMessageStore } from "./useMessageStore";
import { useShallow } from "zustand/react/shallow";
import { stringifyFilters } from "@lib/utils";

/**
 * React Query hooks wrapping MessageService
 */
export const useMessageQueries = () => {
  const service = useMessageStore((state) => state.service);
  const filters = useMessageStore(useShallow((state) => state.filters));

  const queryClient = useQueryClient();

  const normalizedFilters = stringifyFilters(filters);

  // Create message
  const useCreateMessage = (conversation_id: string) =>
    useMutation({
      mutationFn: (payload: CreateMessageDto) =>
        service.createMessage(conversation_id, payload),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["messages", conversation_id],
        });
      },
    });

  // Infinite scroll version of message list
  const useSearchMessageInfinite = (conversation_id: string) =>
    useInfiniteQuery<
      Page<QueryMessageDto>, // TData
      Error, // TError
      InfiniteData<Page<QueryMessageDto>>, // TQueryFnData
      readonly unknown[] // TQueryKey
    >({
      queryKey: ["messages", normalizedFilters, conversation_id] as const,
      queryFn: async ({ pageParam = 0 }): Promise<Page<QueryMessageDto>> =>
        service.searchMessagePage(conversation_id, {
          ...filters,
          page: pageParam,
        } as SearchMessageDto),
      getNextPageParam: (lastPage) => lastPage.next_page, // next page number
      getPreviousPageParam: (firstPage) => firstPage.prev_page, // previous page number
      initialPageParam: 0,
      enabled: !!conversation_id, // only fetch if conversation_id exists
    });

  return {
    useCreateMessage,
    useSearchMessageInfinite,
  };
};
