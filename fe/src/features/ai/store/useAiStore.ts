import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AiMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  type: 'text' | 'action';
  actionType?: string;
  payload?: any;
  needsUserConfirmation?: boolean;
};

interface AiStore {
  isOpen: boolean;
  messages: AiMessage[];
  pendingActions: Record<string, any>; // Store actions awaiting confirmation
  toggleChat: () => void;
  openChat: () => void;
  closeChat: () => void;
  addMessage: (msg: AiMessage) => void;
  updateMessage: (id: string, updates: Partial<AiMessage>) => void;
  clearMessages: () => void;
  addPendingAction: (actionId: string, payload: any) => void;
  removePendingAction: (actionId: string) => void;
}

export const useAiStore = create<AiStore>()(
  persist(
    (set) => ({
      isOpen: false,
      messages: [],
      pendingActions: {},
      toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),
      openChat: () => set({ isOpen: true }),
      closeChat: () => set({ isOpen: false }),
      addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
      updateMessage: (id, updates) =>
        set((state) => ({
          messages: state.messages.map((m) => (m.id === id ? { ...m, ...updates } : m)),
        })),
      clearMessages: () => set({ messages: [], pendingActions: {} }),
      addPendingAction: (actionId, payload) =>
        set((state) => ({
          pendingActions: { ...state.pendingActions, [actionId]: payload },
        })),
      removePendingAction: (actionId) =>
        set((state) => {
          const newActions = { ...state.pendingActions };
          delete newActions[actionId];
          return { pendingActions: newActions };
        }),
    }),
    {
      name: 'ai-chat-store', // key for localStorage
    }
  )
);
