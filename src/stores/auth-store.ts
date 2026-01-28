import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '@/types';

/**
 * Auth store state interface
 */
interface AuthState {
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
}

/**
 * Auth store actions interface
 */
interface AuthActions {
  setUser: (user: User | null) => void;
  setLoading: (isLoading: boolean) => void;
  setInitialized: (isInitialized: boolean) => void;
  logout: () => void;
  // Computed getters
  isAuthenticated: () => boolean;
  isMentor: () => boolean;
  isMentee: () => boolean;
  isAdmin: () => boolean;
}

type AuthStore = AuthState & AuthActions;

/**
 * Zustand auth store with persistence
 * Manages user authentication state globally
 */
export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      isLoading: true,
      isInitialized: false,

      // Actions
      setUser: (user) => set({ user }),

      setLoading: (isLoading) => set({ isLoading }),

      setInitialized: (isInitialized) => set({ isInitialized }),

      logout: () =>
        set({
          user: null,
          isLoading: false,
          isInitialized: true,
        }),

      // Computed getters
      isAuthenticated: () => get().user !== null,

      isMentor: () => get().user?.role === 'MENTOR',

      isMentee: () => get().user?.role === 'MENTEE',

      isAdmin: () => get().user?.role === 'ADMIN',
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      // Only persist user data, not loading states
      partialize: (state) => ({ user: state.user }),
    }
  )
);
