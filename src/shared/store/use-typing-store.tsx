import { create } from 'zustand';
import type { User } from '../../features/users/types/type';

interface TypingStore {
  typingUsers: User[];
  addTypingUser: (user: User) => void;
  removeTypingUser: (user: User) => void;
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
  removeTypingUser: (user: User) =>
    set((state) => ({
      typingUsers: state.typingUsers.filter(
        (u) => !(u.id === user.id && u.chatId === user.chatId),
      ),
    })),
  clearTypingUsers: () => set({ typingUsers: [] }),
}));

