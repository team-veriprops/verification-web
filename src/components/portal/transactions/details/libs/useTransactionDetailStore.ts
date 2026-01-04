import { create } from "zustand";
import { TransactionDetailService } from "./transaction-detail-service";
import { httpClient } from "containers";
import { createJSONStorage, persist } from "zustand/middleware";

interface TransactionDetailStore {
  service: TransactionDetailService; // runtime only (not persisted)
  showReceipt: boolean;
  setShowReceipt: (showReceipt: boolean) => void
}

// runtime service instance (not persisted)
const service = new TransactionDetailService(httpClient);

export const useTransactionDetailStore = create<TransactionDetailStore>()(
  persist(
    (set) => ({
      service,
      showReceipt: false,
      setShowReceipt: (showReceipt: boolean) => set({ showReceipt }),
    }),
    {
      name: "veriprops-transaction_details", // localStorage key
      storage: createJSONStorage(() => localStorage), // hydration-safe
      // Persist skips service
      partialize: (state: { showReceipt: boolean }) => ({
        showReceipt: state.showReceipt,
      }),
    }
  )
);
