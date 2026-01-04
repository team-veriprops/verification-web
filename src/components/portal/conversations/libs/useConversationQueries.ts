import {
  useMutation,
  useQueryClient,
  useInfiniteQuery,
  InfiniteData,
} from "@tanstack/react-query";
import {
  CreateConversationDto,
  QueryConversationDto,
  SearchConversationDto,
} from "@components/portal/conversations/models";
import { Page } from "types/models";
import { useConversationStore } from "./useConversationStore";
import { useShallow } from "zustand/react/shallow";
import { stringifyFilters } from "@lib/utils";

/**
 * React Query hooks wrapping ConversationService
 */
export const useConversationQueries = () => {
  const service = useConversationStore((state) => state.service);
  const filters = useConversationStore(useShallow((state) => state.filters));

  const queryClient = useQueryClient();

  const normalizedFilters = stringifyFilters(filters);

  // Create conversation
  const useCreateConversation = () =>
    useMutation({
      mutationFn: (payload: CreateConversationDto) =>
        service.createConversation(payload),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["conversations"] });
      },
    });

  // Infinite scroll version of conversation list
  const useSearchConversationInfinite = () =>
    useInfiniteQuery<
      Page<QueryConversationDto>, // TData
      Error, // TError
      InfiniteData<Page<QueryConversationDto>>, // TQueryFnData
      readonly unknown[] // TQueryKey
    >({
      queryKey: ["conversations", normalizedFilters] as const,
      queryFn: async ({ pageParam = 0 }): Promise<Page<QueryConversationDto>> =>
        service.searchConversationPage({
          ...filters,
          page: pageParam,
        } as SearchConversationDto),
      getNextPageParam: (lastPage) => lastPage.next_page, // next page number
      getPreviousPageParam: (firstPage) => firstPage.prev_page, // previous page number
      initialPageParam: 0,
    });

  return {
    useCreateConversation,
    useSearchConversationInfinite,
  };
};
