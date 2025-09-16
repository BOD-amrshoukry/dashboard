import { create } from 'zustand';

interface TypingStore {
  typingUsers: TypingUser[];
  addTypingUser: (user: TypingUser) => void;
  removeTypingUser: (userId: number) => void;
  clearTypingUsers: () => void;
}

export const useTypingStore = create<TypingStore>((set) => ({
  typingUsers: [],
  addTypingUser: (user) =>
    set((state) => ({
      typingUsers: state.typingUsers.some((u) => u.id === user.id)
        ? state.typingUsers
        : [...state.typingUsers, user],
    })),
  removeTypingUser: (user: TypingUser) =>
    set((state) => ({
      typingUsers: state.typingUsers.filter(
        (u) => !(u.id === user.id && u.chatId === user.chatId),
      ),
    })),
  clearTypingUsers: () => set({ typingUsers: [] }),
}));

