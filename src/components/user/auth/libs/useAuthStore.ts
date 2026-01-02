import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { httpClient } from "containers";
import { LoginSuccessDto } from "@components/user/models";
import { AuthService } from "./auth-service";

interface AuthStore {
  service: AuthService; // runtime only (not persisted)
  activeAuditor: LoginSuccessDto | null; // persisted only
  setActiveAuditor: (activeAuditor: LoginSuccessDto | null) => void;
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
      partialize: (state: { activeAuditor: any }) => ({
        activeAuditor: state.activeAuditor,
      }),
    }
  )
);
