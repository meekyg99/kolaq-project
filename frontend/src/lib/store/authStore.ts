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
            
            // Set cookies for middleware access
            document.cookie = `access_token=${response.accessToken}; path=/; max-age=${60 * 60 * 24 * 7}; samesite=strict`;
            if (response.refreshToken) {
              document.cookie = `refresh_token=${response.refreshToken}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=strict`;
            }
          }

          const user = {
            ...response.user,
            name: (response.user as any).name 
              || (response.user.firstName && response.user.lastName 
                ? `${response.user.firstName} ${response.user.lastName}`
                : response.user.email)
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
            
            // Set cookies for middleware access
            document.cookie = `access_token=${response.accessToken}; path=/; max-age=${60 * 60 * 24 * 7}; samesite=strict`;
            if (response.refreshToken) {
              document.cookie = `refresh_token=${response.refreshToken}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=strict`;
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
        
        // Clear cookies
        if (typeof window !== 'undefined') {
          document.cookie = 'access_token=; path=/; max-age=0';
          document.cookie = 'refresh_token=; path=/; max-age=0';
        }
        
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        });
      },

      clearError: () => set({ error: null }),

      checkAuth: async () => {
        if (typeof window === 'undefined') return;
        
        set({ isLoading: true });
        
        const token = localStorage.getItem('access_token');
        if (!token) {
          set({ isAuthenticated: false, user: null, isLoading: false });
          // Clear cookies if no token
          document.cookie = 'access_token=; path=/; max-age=0';
          document.cookie = 'refresh_token=; path=/; max-age=0';
          return;
        }

        try {
          const user = await authApi.getProfile();
          
          // Also ensure cookies are set
          document.cookie = `access_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; samesite=strict`;
          
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ isAuthenticated: false, user: null, isLoading: false });
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          document.cookie = 'access_token=; path=/; max-age=0';
          document.cookie = 'refresh_token=; path=/; max-age=0';
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
