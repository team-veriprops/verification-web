import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { httpClient } from "containers";
import { AuthService } from "./auth-service";
import { ActiveAuditor } from "../models";

interface AuthStore {
  service: AuthService; // runtime only (not persisted)
  activeAuditor: ActiveAuditor | null; // persisted only
  setActiveAuditor: (activeAuditor: ActiveAuditor | null) => void;
  resetActiveAuditor: () => void;
}

// runtime service instance (not persisted)
const service = new AuthService(httpClient);

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      service,
      activeAuditor: null,

      setActiveAuditor: (activeAuditor) => set({ activeAuditor }),
      resetActiveAuditor: () => set({ activeAuditor: null }),
    }),

    {
      name: "veriprops-active_auditor", // localStorage key
      storage: createJSONStorage(() => localStorage),
      partialize: (state: { activeAuditor: ActiveAuditor }) => ({
        activeAuditor: state.activeAuditor,
      }),
    }
  )
);
