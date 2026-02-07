import { create } from "zustand";
import { CreateVerificationDto, QueryVerificationDto, SearchVerificationDto, UpdateVerificationDto, VerificationStatus } from "../models";
import { VerificationService } from "./verification-service";
import { createJSONStorage, persist } from "zustand/middleware";
import { httpClient } from "containers";

const defaultFilters: Partial<SearchVerificationDto> = {
  page: 0,
  page_size: 6,
  status: VerificationStatus.PENDING
};

const cloneDefaultFilters = (): Partial<SearchVerificationDto> => ({
  ...defaultFilters,
});

interface VerificationStore {
  service: VerificationService; // runtime only (not persisted)
  filters: Partial<SearchVerificationDto>; // persisted + synced with query params
  upsertVerificationDto: Partial<CreateVerificationDto | UpdateVerificationDto | object>;
  currentVerification: QueryVerificationDto | null; // persisted only
  viewVerificationDetail: boolean;
  viewAddVerificationModal: boolean;
  viewVerificationCheckoutModal: boolean;
  isEditing: boolean;
  showReceipt: boolean;
  // setFilters: (
  //   updater:
  //     | Partial<SearchVerificationDto>
  //     | ((prev: Partial<SearchVerificationDto>) => Partial<SearchVerificationDto>)
  // ) => void;
  // resetFilters: () => void;
  // updateFilter: <K extends keyof SearchVerificationDto>(
  //   key: K,
  //   value: SearchVerificationDto[K]
  // ) => void;
  updateFilters: (updates: Partial<SearchVerificationDto>) => void;
  updateUpsertVerificationDto: (updates: Partial<CreateVerificationDto | UpdateVerificationDto>) => void;
  setCurrentVerification: (currentVerification: QueryVerificationDto | null) => void;
  setViewVerificationDetail: (viewVerificationDetail: boolean) => void;
  setViewAddVerificationModal: (viewAddVerificationModal: boolean) => void;
  setViewVerificationCheckoutModal: (viewVerificationCheckoutModal: boolean) => void;
  setIsEditing: (isEditing: boolean) => void
  setShowReceipt: (showReceipt: boolean) => void
}

// runtime service instance (not persisted)
const service = new VerificationService(httpClient);

export const useVerificationStore = create<VerificationStore>()(
  persist(
    (set) => ({
      service,
      filters: cloneDefaultFilters(),
      upsertVerificationDto: {},
      currentVerification: null,
      viewVerificationDetail: false,
      viewAddVerificationModal: false,
      viewVerificationCheckoutModal: false,
      isEditing: false,
      showReceipt: false,

      // // merge filters (instead of replacing)
      // setFilters: (updater) =>
      //   set((state) => {
      //     const next =
      //       typeof updater === "function" ? updater(state.filters) : updater;
      //     return { filters: { ...state.filters, ...next } };
      //   }),

      // // reset to defaults
      // resetFilters: () => set({ filters: cloneDefaultFilters() }),

      // // update a single filter key
      // updateFilter: (key, value) =>
      //   set((state) => ({
      //     filters: { ...state.filters, [key]: value },
      //   })),

      // update multiple filter keys at once
      updateFilters: (updates) =>
        set((state) => ({
          filters: { ...state.filters, ...updates },
        })),

      updateUpsertVerificationDto: (updates) =>
        set((state) => ({
          upsertVerificationDto: { ...state.upsertVerificationDto, ...updates },
        })),

      // update the currently selected verification
      setCurrentVerification: (currentVerification) => set({ currentVerification }),
      setViewVerificationDetail: (viewVerificationDetail) => set({ viewVerificationDetail }),
      setViewAddVerificationModal: (viewAddVerificationModal) => set({ viewAddVerificationModal }),
      setViewVerificationCheckoutModal: (viewVerificationCheckoutModal) => set({ viewVerificationCheckoutModal }),
      setIsEditing: (isEditing: boolean) => set({ isEditing }),
      setShowReceipt: (showReceipt: boolean) => set({ showReceipt }),
    }),
    {
      name: "veriprops-verifications", // localStorage key
      storage: createJSONStorage(() => localStorage), // hydration-safe
      // Persist only filters + currentVerification, skip service
      partialize: (state: {
        filters: SearchVerificationDto;
        upsertVerificationDto: CreateVerificationDto | UpdateVerificationDto | object;
        currentVerification: QueryVerificationDto;
        viewVerificationDetail: boolean;
        viewAddVerificationModal: boolean;
        viewVerificationCheckoutModal: boolean;
        showReceipt: boolean;
      }) => ({
        filters: state.filters,
        upsertVerificationDto: state.upsertVerificationDto,
        currentVerification: state.currentVerification,
        viewVerificationDetail: state.viewVerificationDetail,
        viewAddVerificationModal: state.viewAddVerificationModal,
        viewVerificationCheckoutModal: state.viewVerificationCheckoutModal,
        showReceipt: state.showReceipt,
      }),
    }
  )
);
