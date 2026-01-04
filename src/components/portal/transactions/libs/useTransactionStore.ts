import { create } from "zustand";
import { QueryTransactionDto, SearchTransactionDto, TransactionType } from "../models";
import { TransactionService } from "./transaction-service";
import { createJSONStorage, persist } from "zustand/middleware";
import { httpClient } from "containers";
import { Money } from "@components/website/property/models";

const defaultFilters: Partial<SearchTransactionDto> = {
  page: 0,
  page_size: 6,
  type: TransactionType.ALL
};

const cloneDefaultFilters = (): Partial<SearchTransactionDto> => ({
  ...defaultFilters,
});

interface TransactionStore {
  service: TransactionService; // runtime only (not persisted)
  filters: Partial<SearchTransactionDto>; // persisted + synced with query params
  currentTransaction: QueryTransactionDto | null; // persisted only
  walletBalance: Money | null;
  viewTransactionDetail: boolean;
  setFilters: (
    updater:
      | Partial<SearchTransactionDto>
      | ((prev: Partial<SearchTransactionDto>) => Partial<SearchTransactionDto>)
  ) => void;
  resetFilters: () => void;
  updateFilter: <K extends keyof SearchTransactionDto>(
    key: K,
    value: SearchTransactionDto[K]
  ) => void;
  updateFilters: (updates: Partial<SearchTransactionDto>) => void; // <—
  setCurrentTransaction: (currentTransaction: QueryTransactionDto | null) => void;
  setWalletBalance: (walletBalance: Money | null) => void;
  setViewTransactionDetail: (viewTransactionDetail: boolean) => void;
}

// runtime service instance (not persisted)
const service = new TransactionService(httpClient);

export const useTransactionStore = create<TransactionStore>()(
  persist(
    (set) => ({
      service,
      filters: cloneDefaultFilters(),
      currentTransaction: null,
      walletBalance: null,
      viewTransactionDetail: false,

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

      // update the currently selected transaction
      setCurrentTransaction: (currentTransaction) => set({ currentTransaction }),
      setWalletBalance: (walletBalance) => set({ walletBalance }),
      setViewTransactionDetail: (viewTransactionDetail) => set({ viewTransactionDetail }),
    }),
    {
      name: "veriprops-transaction", // localStorage key
      storage: createJSONStorage(() => localStorage), // hydration-safe
      // Persist only filters + currentTransaction, skip service
      partialize: (state: { filters: any; currentTransaction: any; walletBalance: Money; viewTransactionDetail: boolean }) => ({
        filters: state.filters,
        currentTransaction: state.currentTransaction,
        viewTransactionDetail: state.viewTransactionDetail,
        walletBalance: state.walletBalance,
      }),
    }
  )
);
