import { create } from "zustand";
import { DashboardService } from "./dashboard-service";
import { createJSONStorage, persist } from "zustand/middleware";
import { httpClient } from "containers";
import { SearchVerificationDto } from "@components/portal/verifications/models";

const defaultFilters: Partial<SearchVerificationDto> = {
  page: 0,
  page_size: 6,
};

const cloneDefaultFilters = (): Partial<SearchVerificationDto> => ({
  ...defaultFilters,
});

interface DashboardStore {
  service: DashboardService; // runtime only (not persisted)
  filters: Partial<SearchVerificationDto>; // persisted + synced with query params
  updateFilters: (updates: Partial<SearchVerificationDto>) => void; // <—
}

// runtime service instance (not persisted)
const service = new DashboardService(httpClient);

export const useDashboardStore = create<DashboardStore>()(
  persist(
    (set) => ({
      service,
      filters: cloneDefaultFilters(),
      // update multiple filter keys at once
      updateFilters: (updates) =>
        set((state) => ({
          filters: { ...state.filters, ...updates },
        })),
    }),
    {
      name: "veriprops-dashboards", // localStorage key
      storage: createJSONStorage(() => localStorage), // hydration-safe
      // Persist only filters + currentDashboard, skip service
      partialize: (state: { 
        filters: SearchVerificationDto; 
      }) => ({
        filters: state.filters,
      }),
    }
  )
);
