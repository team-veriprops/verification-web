import {
  useInfiniteQuery,
  InfiniteData,
  useQuery,
} from "@tanstack/react-query";
import { Page } from "types/models";
import { useShallow } from "zustand/react/shallow";
import { stringifyFilters } from "@lib/utils";
import { useConversationStore } from "./useConversationStore";
import { QueryConversationDto, QueryMessageDto, SearchConversationDto, SearchMessageDto } from "../models";

/**
 * React Query hooks wrapping ConversationService
 */
export const useConversationQueries = () => {
  const service = useConversationStore((state) => state.service);
  const conversationFilters = useConversationStore(useShallow((state) => state.conversationFilters));
  const messageFilters = useConversationStore(useShallow((state) => state.messageFilters));

  const normalizedConversationFilters = stringifyFilters(conversationFilters);
  const normalizedMessageFilters = stringifyFilters(messageFilters);

  // ##################################################################################################
  // Conversation
  // Search conversation list (paged)
  const useSearchConversationPage = () =>
    useQuery<Page<QueryConversationDto>>({
      queryKey: ["conversations", normalizedConversationFilters],
      queryFn: async (): Promise<Page<QueryConversationDto>> =>
        service.searchConversationPage(conversationFilters as SearchConversationDto),
      placeholderData: (prev) => prev,
    });

  // Infinite scroll version of conversation list
  const useSearchConversationInfinite = () =>
    useInfiniteQuery<
      Page<QueryConversationDto>, // TData
      Error, // TError
      InfiniteData<Page<QueryConversationDto>>, // TQueryFnData
      readonly unknown[] // TQueryKey
    >({
      queryKey: ["conversations", normalizedConversationFilters] as const,
      queryFn: async ({ pageParam = 0 }): Promise<Page<QueryConversationDto>> =>
        service.searchConversationPage({
          ...conversationFilters,
          page: pageParam,
        } as SearchConversationDto),
      getNextPageParam: (lastPage) => lastPage.next_page, // next page number
      getPreviousPageParam: (firstPage) => firstPage.prev_page, // previous page number
      initialPageParam: 0,
    });


  // ##################################################################################################
  // ConversationMessage
  // Search ConversationMessage list (paged)
  const useSearchConversationMessagePage = () =>
    useQuery<Page<QueryMessageDto>>({
      queryKey: ["conversations", normalizedMessageFilters],
      queryFn: async (): Promise<Page<QueryMessageDto>> =>
        service.searchConversationMessagePage(messageFilters as SearchMessageDto),
      placeholderData: (prev) => prev,
    });

  // Infinite scroll version of conversation list
  const useSearchConversationMessageInfinite = () =>
    useInfiniteQuery<
      Page<QueryMessageDto>, // TData
      Error, // TError
      InfiniteData<Page<QueryMessageDto>>, // TQueryFnData
      readonly unknown[] // TQueryKey
    >({
      queryKey: ["conversations", normalizedMessageFilters] as const,
      queryFn: async ({ pageParam = 0 }): Promise<Page<QueryMessageDto>> =>
        service.searchConversationMessagePage({
          ...messageFilters,
          page: pageParam,
        } as SearchMessageDto),
      getNextPageParam: (lastPage) => lastPage.next_page, // next page number
      getPreviousPageParam: (firstPage) => firstPage.prev_page, // previous page number
      initialPageParam: 0,
    });

  return {
    useSearchConversationPage,
    useSearchConversationInfinite,
    useSearchConversationMessagePage,
    useSearchConversationMessageInfinite
  };
};
