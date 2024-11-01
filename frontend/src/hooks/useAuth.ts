// hooks/useAuth.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: {
    id: string;
    email: string;
    role: 'ADMIN' | 'ANALYST' | 'COMPANY';
    firstName: string;
    lastName: string;
    company?: any;
    analyst?: any;
    admin?: any;
  } | null;
  accessToken: string | null;
  refreshToken: string | null;
  setAuth: (user: AuthState['user'], accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      setAuth: (user, accessToken, refreshToken) =>
        set({ user, accessToken, refreshToken }),
      clearAuth: () => set({ user: null, accessToken: null, refreshToken: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);