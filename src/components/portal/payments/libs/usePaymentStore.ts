import { create } from "zustand";
import { QueryPaymentDto, SearchPaymentDto, PaymentStatus, SearchAvailablePaymentMethodDto } from "../models";
import { PaymentService } from "./payment-service";
import { createJSONStorage, persist } from "zustand/middleware";
import { httpClient } from "containers";
import { Money } from "types/models";

const defaultFilters: Partial<SearchPaymentDto> = {
  page: 0,
  pageSize: 6,
  status: PaymentStatus.PENDING
};
const availablePaymentMethodFilters: Partial<SearchAvailablePaymentMethodDto> = {
  page: 0,
  pageSize: 6,
};

const cloneDefaultFilters = (): Partial<SearchPaymentDto> => ({
  ...defaultFilters,
});
const cloneAvailablePaymentMethodFilters = (): Partial<SearchAvailablePaymentMethodDto> => ({
  ...availablePaymentMethodFilters,
});

interface PaymentStore {
  service: PaymentService; // runtime only (not persisted)
  filters: Partial<SearchPaymentDto>; // persisted + synced with query params
  paymentMethodFilters: Partial<SearchAvailablePaymentMethodDto>;
  currentPayment: QueryPaymentDto | null; // persisted only
  totalPendingPayment: Money | null;
  viewPaymentDetail: boolean;
  showReceipt: boolean;
  // setFilters: (
  //   updater:
  //     | Partial<SearchPaymentDto>
  //     | ((prev: Partial<SearchPaymentDto>) => Partial<SearchPaymentDto>)
  // ) => void;
  // resetFilters: () => void;
  // updateFilter: <K extends keyof SearchPaymentDto>(
  //   key: K,
  //   value: SearchPaymentDto[K]
  // ) => void;
  updateFilters: (updates: Partial<SearchPaymentDto>) => void; // <—
  updatePaymentMethodFilters: (updates: Partial<SearchAvailablePaymentMethodDto>) => void; // <—
  setCurrentPayment: (currentPayment: QueryPaymentDto | null) => void;
  setTotalPendingPayment: (totalPendingPayment: Money | undefined) => void;
  setViewPaymentDetail: (viewPaymentDetail: boolean) => void;
  setShowReceipt: (showReceipt: boolean) => void
}

// runtime service instance (not persisted)
const service = new PaymentService(httpClient);

export const usePaymentStore = create<PaymentStore>()(
  persist(
    (set) => ({
      service,
      filters: cloneDefaultFilters(),
      paymentMethodFilters: cloneAvailablePaymentMethodFilters(),
      currentPayment: null,
      totalPendingPayment: null,
      viewPaymentDetail: false,
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
      updatePaymentMethodFilters: (updates) =>
        set((state) => ({
          filters: { ...state.paymentMethodFilters, ...updates },
        })),

      // update the currently selected payment
      setCurrentPayment: (currentPayment) => set({ currentPayment }),
      setTotalPendingPayment: (totalPendingPayment) => set({ totalPendingPayment }),
      setViewPaymentDetail: (viewPaymentDetail) => set({ viewPaymentDetail }),
      setShowReceipt: (showReceipt: boolean) => set({ showReceipt }),
    }),
    {
      name: "veriprops-payments", // localStorage key
      storage: createJSONStorage(() => localStorage), // hydration-safe
      // Persist only filters + currentPayment, skip service
      partialize: (state: { 
        filters: SearchPaymentDto;
        paymentMethodFilters: SearchAvailablePaymentMethodDto;
        currentPayment: QueryPaymentDto; 
        totalPendingPayment: Money; 
        viewPaymentDetail: boolean; 
        showReceipt: boolean;
      }) => ({
        filters: state.filters,
        paymentMethodFilters: state.paymentMethodFilters,
        currentPayment: state.currentPayment,
        viewPaymentDetail: state.viewPaymentDetail,
        totalPendingPayment: state.totalPendingPayment,
        showReceipt: state.showReceipt,
      }),
    }
  )
);
