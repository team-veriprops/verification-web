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
import { useConversationStore } from "./useConversationStore";
import { CreateMessageDto, QueryConversationDto, QueryMessageDto, SearchConversationDto, SearchMessageDto, UpdateMessageDto } from "../models";

/**
 * React Query hooks wrapping ConversationService
 */
export const useConversationQueries = () => {
  const service = useConversationStore((state) => state.service);
  const conversationFilters = useConversationStore(useShallow((state) => state.conversationFilters));
  const messageFilters = useConversationStore(useShallow((state) => state.messageFilters));
  const queryClient = useQueryClient();

  const normalizedConversationFilters = stringifyFilters(conversationFilters);
  const normalizedMessageFilters = stringifyFilters(messageFilters);

  // ##################################################################################################
  // Conversation
  // Search conversation list (paged)
  const useSearchConversationPage = () =>
    useQuery<Page<QueryConversationDto>>({
      queryKey: ["conversation page", normalizedConversationFilters],
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
      queryKey: ["conversation page", normalizedConversationFilters] as const,
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
  const useSearchConversationMessagePage = (conversation_id: string) =>
    useQuery<Page<QueryMessageDto>>({
      queryKey: ["conversation message page", normalizedMessageFilters, conversation_id],
      queryFn: async (): Promise<Page<QueryMessageDto>> =>
        service.searchConversationMessagePage(conversation_id, messageFilters as SearchMessageDto),
      placeholderData: (prev) => prev,
    });

  // Infinite scroll version of conversation list
  const useSearchConversationMessageInfinite = (conversation_id: string) =>
    useInfiniteQuery<
      Page<QueryMessageDto>, // TData
      Error, // TError
      InfiniteData<Page<QueryMessageDto>>, // TQueryFnData
      readonly unknown[] // TQueryKey
    >({
      queryKey: ["conversation message page", normalizedMessageFilters, conversation_id] as const,
      queryFn: async ({ pageParam = 0 }): Promise<Page<QueryMessageDto>> =>
        service.searchConversationMessagePage(conversation_id, {
          ...messageFilters,
          page: pageParam,
        } as SearchMessageDto),
      getNextPageParam: (lastPage) => lastPage.next_page, // next page number
      getPreviousPageParam: (firstPage) => firstPage.prev_page, // previous page number
      initialPageParam: 0,
    });

  
    const useCreateConversationMessage = (conversation_id: string) =>
    useMutation({
      mutationFn: (payload: CreateMessageDto) =>
        service.createConversationMessage(conversation_id, payload),
      onSuccess: () => {
        queryClient.invalidateQueries({ 
          queryKey: ["conversation message page", normalizedMessageFilters, conversation_id] as const 
        });
      },
    });


  const useUpdateConversationMessage = (
        conversation_id: string,
      ) =>
    useMutation({
      mutationFn: ({
        message_id,
        new_message,
      }: {
        message_id: string;
        new_message: UpdateMessageDto;
      }) =>
        service.updateConversationMessage(conversation_id, message_id, new_message),
        onSuccess: (_, variables) => {
          queryClient.invalidateQueries({
            queryKey: ["conversation message", conversation_id, variables.message_id],
          });
        },
    });

  const useDeleteConversationMessage = (
    conversation_id: string,
  ) =>
    useMutation({
      mutationFn: ({
        message_id,
      }: {
        message_id: string;
      }) => service.deleteConversationMessage(conversation_id, message_id),
      onSuccess: (_, variables) => {
          queryClient.invalidateQueries({
            queryKey: ["conversation message", conversation_id, variables.message_id],
          });
        },
    });

  return {
    useSearchConversationPage,
    useSearchConversationInfinite,
    useSearchConversationMessagePage,
    useSearchConversationMessageInfinite,
    useCreateConversationMessage,
    useUpdateConversationMessage,
    useDeleteConversationMessage
  };
};
