import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { httpClient } from "containers";
import {
  SearchTaskDto,
  SearchVerifierActivityAuditDto,
  QueryTaskDto,
} from "../models";
import { VerifierService } from "./task-service";

const defaultTaskFilters: Partial<SearchTaskDto> = {
  page: 0,
  page_size: 6,
};

const cloneDefaultTaskFilters = (): Partial<SearchTaskDto> => ({
  ...defaultTaskFilters,
});

const defaultVerifierActivityAuditFilters: Partial<SearchVerifierActivityAuditDto> =
  {
    page: 0,
    page_size: 6,
  };

const cloneDefaultVerifierActivityAuditFilters =
  (): Partial<SearchVerifierActivityAuditDto> => ({
    ...defaultVerifierActivityAuditFilters,
  });

interface TaskStore {
  service: VerifierService; // runtime only (not persisted)
  TaskFilters: Partial<SearchTaskDto>;
  verifierActivityAuditFilters: Partial<SearchVerifierActivityAuditDto>;
  viewTaskDeclineDialog: boolean;
  viewTaskSignatureDialog: boolean;
  currentTask: QueryTaskDto | null; // persisted only
  viewCurrentTask: boolean;
  updateTaskFilters: (updates: Partial<SearchTaskDto>) => void; // <—
  updateVerifierActivityAuditFilters: (
    updates: Partial<SearchVerifierActivityAuditDto>
  ) => void; // <—
  setViewTaskDeclineDialog: (
    viewTaskDeclineDialog: boolean
  ) => void;
  setViewTaskSignatureDialog: (
    viewTaskSignatureDialog: boolean
  ) => void;
  setCurrentTask: (currentTask: QueryTaskDto) => void;
  setViewCurrentTask: (viewCurrentTask: boolean) => void;
}

// runtime service instance (not persisted)
const service = new VerifierService(httpClient);

export const useTaskStore = create<TaskStore>()(
  persist(
    (set) => ({
      service,
      TaskFilters: cloneDefaultTaskFilters(),
      verifierActivityAuditFilters: cloneDefaultVerifierActivityAuditFilters(),
      viewTaskDeclineDialog: false,
      viewTaskSignatureDialog: false,
      currentTask: null,
      viewCurrentTask: false,

      // update multiple filter keys at once
      updateTaskFilters: (updates) =>
        set((state) => ({
          TaskFilters: {
            ...state.TaskFilters,
            ...updates,
          },
        })),
      updateVerifierActivityAuditFilters: (updates) =>
        set((state) => ({
          verifierActivityAuditFilters: {
            ...state.verifierActivityAuditFilters,
            ...updates,
          },
        })),
      setViewTaskDeclineDialog: (
        viewTaskDeclineDialog: boolean
      ) => set({ viewTaskDeclineDialog }),
      setViewTaskSignatureDialog: (
        viewTaskSignatureDialog: boolean
      ) => set({ viewTaskSignatureDialog }),
      setCurrentTask: (currentTask: QueryTaskDto) =>
        set({ currentTask }),
      setViewCurrentTask: (viewCurrentTask: boolean) =>
        set({ viewCurrentTask }),
    }),

    {
      name: "veriprops-tasks", // localStorage key
      storage: createJSONStorage(() => localStorage), // hydration-safe
      // Persist only filters + currentVerifier, skip service
      partialize: (state: {
        TaskFilters: SearchTaskDto;
        verifierActivityAuditFilters: SearchVerifierActivityAuditDto;
        viewCurrentVerifier: boolean;
        viewTaskDeclineDialog: boolean;
        viewTaskSignatureDialog: boolean;
        currentTask: QueryTaskDto;
        viewCurrentTask: boolean;
      }) => ({
        TaskFilters: state.TaskFilters,
        verifierActivityAuditFilters: state.verifierActivityAuditFilters,
        viewCurrentVerifier: state.viewCurrentVerifier,
        viewTaskDeclineDialog: state.viewTaskDeclineDialog,
        viewTaskSignatureDialog: state.viewTaskSignatureDialog,
        currentTask: state.currentTask,
        viewCurrentTask: state.viewCurrentTask,
      }),
    }
  )
);
