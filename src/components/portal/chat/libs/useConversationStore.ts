import { create } from "zustand";
import { QueryConversationDto, SearchConversationDto, SearchMessageDto } from "../models";
import { ConversationService } from "./conversation-service";
import { createJSONStorage, persist } from "zustand/middleware";
import { httpClient } from "containers";

const defaultConversationFilters: Partial<SearchConversationDto> = {
  page: 0,
  page_size: 6,
};

const cloneDefaultConversationFilters = (): Partial<SearchConversationDto> => ({
  ...defaultConversationFilters,
});

const defaultMessageFilters: Partial<SearchMessageDto> = {
  page: 0,
  page_size: 6,
};

const cloneDefaultMessageFilters = (): Partial<SearchMessageDto> => ({
  ...defaultMessageFilters,
});

interface ConversationStore {
  service: ConversationService; // runtime only (not persisted)
  conversationFilters: Partial<SearchConversationDto>; // persisted + synced with query params
  messageFilters: Partial<SearchMessageDto>; // persisted + synced with query params
  currentConversation: QueryConversationDto | null; // persisted only
  viewConversationMessages: boolean;
  updateConversationFilters: (updates: Partial<SearchConversationDto>) => void; // <—
  updateMessageFilters: (updates: Partial<SearchConversationDto>) => void; // <—
  setCurrentConversation: (currentConversation: QueryConversationDto | null) => void;
  setViewConversationMessages: (viewConversationMessages: boolean) => void;
}

// runtime service instance (not persisted)
const service = new ConversationService(httpClient);

export const useConversationStore = create<ConversationStore>()(
  persist(
    (set) => ({
      service,
      conversationFilters: cloneDefaultConversationFilters(),
      messageFilters: cloneDefaultMessageFilters(),
      currentConversation: null,
      viewConversationMessages: false,
      // update multiple filter keys at once
      updateConversationFilters: (updates) =>
        set((state) => ({
          conversationFilters: { ...state.conversationFilters, ...updates },
        })),
      updateMessageFilters: (updates) =>
        set((state) => ({
          messageFilters: { ...state.messageFilters, ...updates },
        })),

      // update the currently selected conversation
      setCurrentConversation: (currentConversation) => set({ currentConversation }),
      setViewConversationMessages: (viewConversationMessages) => set({ viewConversationMessages }),
    }),
    {
      name: "veriprops-conversations", // localStorage key
      storage: createJSONStorage(() => localStorage), // hydration-safe
      // Persist only filters + currentConversation, skip service
      partialize: (state: { 
        conversationFilters: SearchConversationDto; 
        messageFilters: SearchMessageDto; 
        currentConversation: QueryConversationDto; 
        viewConversationMessages: boolean;
      }) => ({
        conversationFilters: state.conversationFilters,
        messageFilters: state.messageFilters,
        currentConversation: state.currentConversation,
        viewConversationMessages: state.viewConversationMessages,
      }),
    }
  )
);
