import { create } from "zustand";
import { SearchMessageDto } from "../models";
import { MessageService } from "./message-service";
import { createJSONStorage, persist } from "zustand/middleware";
import { httpClient } from "containers";

const defaultFilters: Partial<SearchMessageDto> = {
  page: 0,
  page_size: 3,
};

const cloneDefaultFilters = (): Partial<SearchMessageDto> => ({
  ...defaultFilters,
});

interface MessageStore {
  service: MessageService; // runtime only (not persisted)
  filters: Partial<SearchMessageDto>; // persisted + synced with query params
  setFilters: (
    updater:
      | Partial<SearchMessageDto>
      | ((prev: Partial<SearchMessageDto>) => Partial<SearchMessageDto>)
  ) => void;
  resetFilters: () => void;
  updateFilter: <K extends keyof SearchMessageDto>(
    key: K,
    value: SearchMessageDto[K]
  ) => void;
  updateFilters: (updates: Partial<SearchMessageDto>) => void;
}

// runtime service instance (not persisted)
const service = new MessageService(httpClient);

export const useMessageStore = create<MessageStore>()(
  persist(
    (set) => ({
      service,
      filters: cloneDefaultFilters(),

      // merge filters (instead of replacing)
      setFilters: (updater) =>
        set((state) => {
          const next =
            typeof updater === "function" ? updater(state.filters) : updater;
          return { filters: { ...state.filters, ...next } };
        }),

      // reset to defaults
      resetFilters: () => set({ filters: cloneDefaultFilters() }),

      // update a single filter key
      updateFilter: (key, value) =>
        set((state) => ({
          filters: { ...state.filters, [key]: value },
        })),

      // update multiple filter keys at once
      updateFilters: (updates) =>
        set((state) => ({
          filters: { ...state.filters, ...updates },
        })),
    }),
    {
      name: "veriprops-message", // localStorage key
      storage: createJSONStorage(() => localStorage), // hydration-safe
      // Persist only filters + currentMessage, skip service
      partialize: (state: { filters: any; }) => ({
        filters: state.filters,
      }),
    }
  )
);
