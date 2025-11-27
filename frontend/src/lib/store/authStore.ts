import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi, AuthResponse, RegisterRequest } from '../api/auth';

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  name: string;
  role: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, passcode: string) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, passcode: string) => {
        set({ isLoading: true, error: null });
        try {
          const response: AuthResponse = await authApi.login({ email, password: passcode });
          
          if (typeof window !== 'undefined') {
            localStorage.setItem('access_token', response.accessToken);
            if (response.refreshToken) {
              localStorage.setItem('refresh_token', response.refreshToken);
            } else {
              localStorage.removeItem('refresh_token');
            }
          }

          const user = {
            ...response.user,
            name: response.user.firstName && response.user.lastName 
              ? `${response.user.firstName} ${response.user.lastName}`
              : response.user.email
          };

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Login failed',
            isLoading: false,
          });
          throw error;
        }
      },

      register: async (data: RegisterRequest) => {
        set({ isLoading: true, error: null });
        try {
          const response: AuthResponse = await authApi.register(data);
          
          if (typeof window !== 'undefined') {
            localStorage.setItem('access_token', response.accessToken);
            if (response.refreshToken) {
              localStorage.setItem('refresh_token', response.refreshToken);
            } else {
              localStorage.removeItem('refresh_token');
            }
          }

          const user = {
            ...response.user,
            name: response.user.firstName && response.user.lastName 
              ? `${response.user.firstName} ${response.user.lastName}`
              : response.user.email
          };

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Registration failed',
            isLoading: false,
          });
          throw error;
        }
      },

      logout: () => {
        authApi.logout();
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        });
      },

      clearError: () => set({ error: null }),

      checkAuth: async () => {
        if (typeof window === 'undefined') return;
        
        const token = localStorage.getItem('access_token');
        if (!token) {
          set({ isAuthenticated: false, user: null });
          return;
        }

        try {
          const user = await authApi.getProfile();
          set({ user, isAuthenticated: true });
        } catch (error) {
          set({ isAuthenticated: false, user: null });
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
