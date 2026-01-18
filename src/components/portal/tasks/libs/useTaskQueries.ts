import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Page } from "types/models";
import { useTaskStore } from "./useTaskStore";
import { stringifyFilters } from "@lib/utils";
import {
  CreateVerifierResponseDto,
  CreateVerifierResponseUploadsDto,
  QueryVerifierActivityAuditDto,
  QueryVerifierResponseDto,
  QueryTaskDto,
  QueryTaskStatsDto,
  SearchVerifierActivityAuditDto,
  SearchTaskDto,
} from "../models";
import { useShallow } from "zustand/react/shallow";

/**
 * React Query hooks wrapping VerifierService
 */
export const useTaskQueries = () => {
  
  const service = useTaskStore((state) => state.service);
  const { TaskFilters, verifierActivityAuditFilters } =
    useTaskStore(
      useShallow((state) => ({
        TaskFilters: state.TaskFilters,
        verifierActivityAuditFilters: state.verifierActivityAuditFilters,
      }))
    );
  const normalizedTaskFilters = stringifyFilters(TaskFilters);
  const normalizedVerifierActivityAuditFilters = stringifyFilters(
    verifierActivityAuditFilters
  );
  const queryClient = useQueryClient();

  /**
   * VERIFIER TASK
   */
  const useGetTaskStats = (verifierId: string) =>
    useQuery<QueryTaskStatsDto>({
      queryKey: ["verifier-tasks-stats", verifierId] as const,
      queryFn: async (): Promise<QueryTaskStatsDto> =>
        service.getTaskStats(verifierId),
      enabled: !!verifierId,
      placeholderData: (prev) => prev,
    });

  const useSearchTaskPage = (verifierId: string) =>
    useQuery<Page<QueryTaskDto>>({
      queryKey: ["verifier-tasks", normalizedTaskFilters, verifierId],
      queryFn: async (): Promise<Page<QueryTaskDto>> =>
        service.searchTaskPage(
          verifierId,
          TaskFilters as SearchTaskDto
        ),
      enabled: !!verifierId,
      placeholderData: (prev) => prev,
    });

  /**
   * VERIFIER TASK RESPONSE
   */
  const useCreateTaskResponse = (taskId: string) =>
    useMutation({
      mutationFn: (payload: CreateVerifierResponseDto) =>
        service.createTaskResponse(taskId, payload),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["create-verifier-task-response", taskId],
        });
      },
    });

  const useCreateTaskResponseUpload = (taskId: string) =>
    useMutation({
      mutationFn: (payload: CreateVerifierResponseUploadsDto) =>
        service.createTaskResponse(taskId, payload),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["create-verifier-task-response-uploads", taskId],
        });
      },
    });

  const useGetTaskResponse = (taskId: string) =>
    useQuery<QueryVerifierResponseDto>({
      queryKey: ["get-verifier-tasks-response", taskId] as const,
      queryFn: async (): Promise<QueryVerifierResponseDto> =>
        service.getTaskResponse(taskId),
      enabled: !!taskId,
      placeholderData: (prev) => prev,
    });

  /**
   * VERIFIER ACTIVITY AUDIT
   */

  // Infinite scroll
  const useSearchVerifierActivityAuditPageInfinite = (taskId: string) =>
    useInfiniteQuery<
      Page<QueryVerifierActivityAuditDto>, // TData
      Error, // TError
      InfiniteData<Page<QueryVerifierActivityAuditDto>>, // TQueryFnData
      readonly unknown[] // TQueryKey
    >({
      queryKey: [
        "verifier-activity-audit-infinite",
        normalizedVerifierActivityAuditFilters,
        taskId,
      ] as const,
      queryFn: async ({
        pageParam = 0,
      }): Promise<Page<QueryVerifierActivityAuditDto>> =>
        service.searchVerifierActivityAuditPage(taskId, {
          ...TaskFilters,
          page: pageParam,
        } as SearchVerifierActivityAuditDto),
      getNextPageParam: (lastPage) => lastPage.next_page, // next page number
      getPreviousPageParam: (firstPage) => firstPage.prev_page, // previous page number
      initialPageParam: 0,
    });

  return {
    useGetTaskStats,
    useSearchTaskPage,
    useCreateTaskResponse,
    useCreateTaskResponseUpload,
    useGetTaskResponse,
    useSearchVerifierActivityAuditPageInfinite,
  };
};
