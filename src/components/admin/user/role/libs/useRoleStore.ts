import { create } from "zustand";
import { QueryRoleDto, SearchRoleDto} from "../models";
import { RoleService } from "./role-service";
import { createJSONStorage, persist } from "zustand/middleware";
import { httpClient } from "containers";

const defaultFilters: Partial<SearchRoleDto> = {
  page: 0,
  page_size: 6,
};

const cloneDefaultFilters = (): Partial<SearchRoleDto> => ({
  ...defaultFilters,
});

interface RoleStore {
  service: RoleService; // runtime only (not persisted)
  filters: Partial<SearchRoleDto>; // persisted + synced with query params
  currentRole: QueryRoleDto | null; // persisted only
  viewRoleDetail: boolean;
  setFilters: (
    updater:
      | Partial<SearchRoleDto>
      | ((prev: Partial<SearchRoleDto>) => Partial<SearchRoleDto>)
  ) => void;
  resetFilters: () => void;
  updateFilter: <K extends keyof SearchRoleDto>(
    key: K,
    value: SearchRoleDto[K]
  ) => void;
  updateFilters: (updates: Partial<SearchRoleDto>) => void; // <—
  setCurrentRole: (currentRole: QueryRoleDto | null) => void;
  setViewRoleDetail: (viewRoleDetail: boolean) => void;
}

// runtime service instance (not persisted)
const service = new RoleService(httpClient);

export const useRoleStore = create<RoleStore>()(
  persist(
    (set) => ({
      service,
      filters: cloneDefaultFilters(),
      currentRole: null,
      viewRoleDetail: false,

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

      // update the currently selected role
      setCurrentRole: (currentRole) => set({ currentRole }),
      setViewRoleDetail: (viewRoleDetail) => set({ viewRoleDetail }),
    }),
    {
      name: "veriprops-role", // localStorage key
      storage: createJSONStorage(() => localStorage), // hydration-safe
      // Persist only filters + currentRole, skip service
      partialize: (state: { filters: any; currentRole: any; viewRoleDetail: boolean }) => ({
        filters: state.filters,
        currentRole: state.currentRole,
        viewRoleDetail: state.viewRoleDetail,
      }),
    }
  )
);
