import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Define the structure of AuthState
interface AuthState {
  user: {
    id: string;
    email: string;
    role: 'ADMIN' | 'ANALYST' | 'COMPANY';
    firstName: string;
    lastName: string;
    company?: any; // You might want to define the structure if known
    analyst?: any;
    admin?: any;
  } | null;
  accessToken: string | null;
  refreshToken: string | null;
  
  // Actions to set and clear auth data
  setAuth: (user: AuthState['user'], accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
}

// Zustand store with `persist` middleware to store auth data locally
export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      accessToken: null,
      refreshToken: null,
      
      // Function to set the authentication state
      setAuth: (user, accessToken, refreshToken) =>
        set({ user, accessToken, refreshToken }),

      // Function to clear the authentication state
      clearAuth: () =>
        set({ user: null, accessToken: null, refreshToken: null }),
    }),
    {
      name: 'auth-storage', // Key to use in local storage
    }
  )
);
