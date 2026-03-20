import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { httpClient } from "containers";
import { UserService } from "./user-service";
import { ActiveAuditor } from "../../../website/auth/models";
import { CreateUserDto, QueryUserDto, SearchInvitedUserDto, SearchUserDto } from "@components/admin/user/models";
import { UserCategory } from "../UserComponentPage";
const defaultFilters: Partial<SearchUserDto> = {
  page: 0,
  pageSize: 6,
};
const invitedUserFilters: Partial<SearchInvitedUserDto> = {
  page: 0,
  pageSize: 6,
};
const defaultCreateUserPayload: Partial<CreateUserDto> = {

};
const cloneDefaultFiltersCreateUserPayload = (): Partial<CreateUserDto> => ({
  ...defaultCreateUserPayload,
});
const cloneDefaultFilters = (): Partial<SearchUserDto> => ({
  ...defaultFilters,
});
const cloneInvitedUserFilters = (): Partial<SearchInvitedUserDto> => ({
  ...invitedUserFilters,
});
interface UserStore {
  service: UserService; // runtime only (not persisted)
  activeAuditor: ActiveAuditor | null; // persisted only
  createUserPayload: Partial<CreateUserDto>;
  filters: Partial<SearchUserDto>;
  invitedUserFilters: Partial<SearchInvitedUserDto>;
  currentUser: QueryUserDto | null;
  viewUserDetail: boolean;
  activeTab: UserCategory;
  setActiveAuditor: (activeAuditor: ActiveAuditor | null) => void;
  resetActiveAuditor: () => void;
  updateCreateUserPayload:(updates: Partial<CreateUserDto>) => void; // <—
  resetCreateUserPayload: () => void;
  updateFilters: (updates: Partial<SearchUserDto>) => void;
  updateInvitedUserFilters: (updates: Partial<SearchInvitedUserDto>) => void;
  setCurrentUser: (currentUser: QueryUserDto) => void;
  setViewUserDetail: (viewUserDetail: boolean) => void;
  setActiveTab: (activeTab: UserCategory) => void;
}

// runtime service instance (not persisted)
const service = new UserService(httpClient);

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      service,
      activeAuditor: null,
      createUserPayload: cloneDefaultFiltersCreateUserPayload(),
      filters: cloneDefaultFilters(),
      invitedUserFilters: cloneInvitedUserFilters(),
      currentUser: null,
      viewUserDetail: false,
      activeTab: UserCategory.ALL,

      setActiveAuditor: (activeAuditor) => set({ activeAuditor }),
      resetActiveAuditor: () => set({ activeAuditor: null }),
      updateCreateUserPayload: (updates) =>
        set((state) => ({
          createUserPayload: { ...state.createUserPayload, ...updates },
        })),
      resetCreateUserPayload: () => set({ createUserPayload: cloneDefaultFiltersCreateUserPayload() }),
      updateFilters: (updates) =>
        set((state) => ({
          filters: { ...state.filters, ...updates },
        })),
      updateInvitedUserFilters: (updates) =>
        set((state) => ({
          invitedUserFilters: { ...state.invitedUserFilters, ...updates },
        })),
      setCurrentUser: (currentUser) => set({ currentUser }),
      setViewUserDetail: (viewUserDetail) => set({ viewUserDetail }),
      setActiveTab: (activeTab) => set({ activeTab }),
    }),

    {
      name: "veriprops-user", // localStorage key
      storage: createJSONStorage(() => localStorage),
      partialize: (
        state: { 
          activeAuditor: ActiveAuditor, 
          createUserPayload: CreateUserDto, 
          filters: SearchUserDto,
          invitedUserFilters: SearchInvitedUserDto,
          currentUser: QueryUserDto,
          viewUserDetail: boolean,
          activeTab: UserCategory
         }) => ({
        activeAuditor: state.activeAuditor,
        createUserPayload: state.createUserPayload,
        filters: state.filters,
        invitedUserFilters: state.invitedUserFilters,
        currentUser: state.currentUser,
        viewUserDetail: state.viewUserDetail,
        activeTab: state.activeTab
      }),
    }
  )
);
