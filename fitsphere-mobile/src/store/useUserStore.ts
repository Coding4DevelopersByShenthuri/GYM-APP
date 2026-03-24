import { createStore } from 'zustand';

interface UserState {
  user: any | null;
  token: string | null;
  isAuthenticated: boolean;
  setUser: (user: any, token: string) => void;
  logout: () => void;
}

export const useUserStore = createStore<UserState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  setUser: (user, token) => set({ user, token, isAuthenticated: true }),
  logout: () => set({ user: null, token: null, isAuthenticated: false }),
}));
