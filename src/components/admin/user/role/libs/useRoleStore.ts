import { create } from "zustand";
import { QueryRoleDto, SearchRoleDto} from "../models";
import { RoleService } from "./role-service";
import { createJSONStorage, persist } from "zustand/middleware";
import { httpClient } from "containers";

const defaultFilters: Partial<SearchRoleDto> = {
  page: 0,
  pageSize: 6,
};

const cloneDefaultFilters = (): Partial<SearchRoleDto> => ({
  ...defaultFilters,
});

interface RoleStore {
  service: RoleService; // runtime only (not persisted)
  filters: Partial<SearchRoleDto>; // persisted + synced with query params
  currentRole: QueryRoleDto | null; // persisted only
  viewRoleDetail: boolean;
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
      partialize: (state: { filters: SearchRoleDto; currentRole: QueryRoleDto; viewRoleDetail: boolean }) => ({
        filters: state.filters,
        currentRole: state.currentRole,
        viewRoleDetail: state.viewRoleDetail,
      }),
    }
  )
);
