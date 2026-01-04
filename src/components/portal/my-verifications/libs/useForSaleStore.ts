import { create } from "zustand";
import { ForSaleService } from "./for-sale-service";
import { createJSONStorage, persist } from "zustand/middleware";
import { httpClient } from "containers";
import { PropertyType } from "@components/website/property/models";
import { QueryForSaleDto, SearchForSaleDto } from "../models";

const defaultFilters: Partial<SearchForSaleDto> = {
  page: 0,
  page_size: 6,
  type: PropertyType.LAND
};

const cloneDefaultFilters = (): Partial<SearchForSaleDto> => ({
  ...defaultFilters,
});

interface ForSaleStore {
  service: ForSaleService; // runtime only (not persisted)
  filters: Partial<SearchForSaleDto>; // persisted + synced with query params
  currentForSale: QueryForSaleDto | null; // persisted only
  viewForSaleDetail: boolean;
  setFilters: (
    updater:
      | Partial<SearchForSaleDto>
      | ((prev: Partial<SearchForSaleDto>) => Partial<SearchForSaleDto>)
  ) => void;
  resetFilters: () => void;
  updateFilter: <K extends keyof SearchForSaleDto>(
    key: K,
    value: SearchForSaleDto[K]
  ) => void;
  updateFilters: (updates: Partial<SearchForSaleDto>) => void; // <—
  setCurrentForSale: (currentForSale: QueryForSaleDto | null) => void;
  setViewForSaleDetail: (viewForSaleDetail: boolean) => void;
}

// runtime service instance (not persisted)
const service = new ForSaleService(httpClient);

export const useForSaleStore = create<ForSaleStore>()(
  persist(
    (set) => ({
      service,
      filters: cloneDefaultFilters(),
      currentForSale: null,
      viewForSaleDetail: false,

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

      // update the currently selected for_sale
      setCurrentForSale: (currentForSale) => set({ currentForSale }),
      setViewForSaleDetail: (viewForSaleDetail) => set({ viewForSaleDetail }),
    }),
    {
      name: "veriprops-for_sale", // localStorage key
      storage: createJSONStorage(() => localStorage), // hydration-safe
      // Persist only filters + currentForSale, skip service
      partialize: (state: { filters: any; currentForSale: any; viewForSaleDetail: boolean }) => ({
        filters: state.filters,
        currentForSale: state.currentForSale,
        viewForSaleDetail: state.viewForSaleDetail,
      }),
    }
  )
);
