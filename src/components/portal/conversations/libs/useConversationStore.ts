import { create } from "zustand";
import { QueryConversationDto, SearchConversationDto } from "../models";
import { ConversationService } from "./conversation-service";
import { createJSONStorage, persist } from "zustand/middleware";
import { httpClient } from "containers";

const defaultFilters: Partial<SearchConversationDto> = {
  page: 0,
  page_size: 6,
};

const cloneDefaultFilters = (): Partial<SearchConversationDto> => ({
  ...defaultFilters,
});

interface ConversationStore {
  service: ConversationService; // runtime only (not persisted)
  filters: Partial<SearchConversationDto>; // persisted + synced with query params
  currentConversation: QueryConversationDto | null; // persisted only
  setFilters: (
    updater:
      | Partial<SearchConversationDto>
      | ((prev: Partial<SearchConversationDto>) => Partial<SearchConversationDto>)
  ) => void;
  resetFilters: () => void;
  updateFilter: <K extends keyof SearchConversationDto>(
    key: K,
    value: SearchConversationDto[K]
  ) => void;
  updateFilters: (updates: Partial<SearchConversationDto>) => void; // <—
  setCurrentConversation: (currentConversation: QueryConversationDto | null) => void;
}

// runtime service instance (not persisted)
const service = new ConversationService(httpClient);

export const useConversationStore = create<ConversationStore>()(
  persist(
    (set) => ({
      service,
      filters: cloneDefaultFilters(),
      currentConversation: null,

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

      // update the currently selected conversation
      setCurrentConversation: (currentConversation) => set({ currentConversation }),
    }),
    {
      name: "veriprops-conversation", // localStorage key
      storage: createJSONStorage(() => localStorage), // hydration-safe
      // Persist only filters + currentConversation, skip service
      partialize: (state: { filters: any; currentConversation: any; }) => ({
        filters: state.filters,
        currentConversation: state.currentConversation,
      }),
    }
  )
);
