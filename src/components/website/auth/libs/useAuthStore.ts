import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { httpClient } from "containers";
import { AuthService } from "./auth-service";
import { ActiveAuditor } from "../models";
import { CreateUserDto } from "@components/admin/user/models";
const defaultCreateUserPayload: Partial<CreateUserDto> = {

};
const cloneDefaultFiltersCreateUserPayload = (): Partial<CreateUserDto> => ({
  ...defaultCreateUserPayload,
});
interface AuthStore {
  service: AuthService; // runtime only (not persisted)
  activeAuditor: ActiveAuditor | null; // persisted only
  createUserPayload: Partial<CreateUserDto>;
  setActiveAuditor: (activeAuditor: ActiveAuditor | null) => void;
  resetActiveAuditor: () => void;
  updateCreateUserPayload:(updates: Partial<CreateUserDto>) => void; // <—
  resetCreateUserPayload: () => void;
}

// runtime service instance (not persisted)
const service = new AuthService(httpClient);

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      service,
      activeAuditor: null,
      createUserPayload: cloneDefaultFiltersCreateUserPayload(),

      setActiveAuditor: (activeAuditor) => set({ activeAuditor }),
      resetActiveAuditor: () => set({ activeAuditor: null }),
      updateCreateUserPayload: (updates) =>
        set((state) => ({
          createUserPayload: { ...state.createUserPayload, ...updates },
        })),
      resetCreateUserPayload: () => set({ createUserPayload: cloneDefaultFiltersCreateUserPayload() }),
    }),

    {
      name: "veriprops-active_auditor", // localStorage key
      storage: createJSONStorage(() => localStorage),
      partialize: (state: { activeAuditor: ActiveAuditor, createUserPayload: CreateUserDto }) => ({
        activeAuditor: state.activeAuditor,
        createUserPayload: state.createUserPayload
      }),
    }
  )
);
