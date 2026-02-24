import { create } from 'zustand';

interface User {
  id: string;
  fullName: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (fullName: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
}

// Mock user for demo
const mockUser: User = {
  id: '1',
  fullName: 'Demo User',
  email: 'demo@dilog.com',
};

const mockToken = 'mock-jwt-token-demo';

export const useAuthStore = create<AuthState>((set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          // Demo credentials
          if (email === 'demo@dilog.com' && password === 'password123') {
            set({
              user: mockUser,
              token: mockToken,
              isAuthenticated: true,
              isLoading: false,
            });
            return true;
          }

          // TODO: Replace with actual API call
          // const response = await fetch('YOUR_BACKEND_URL/api/auth/login', {
          //   method: 'POST',
          //   headers: { 'Content-Type': 'application/json' },
          //   body: JSON.stringify({ email, password }),
          // });
          // const data = await response.json();
          // if (response.ok) {
          //   set({
          //     user: data.user,
          //     token: data.token,
          //     isAuthenticated: true,
          //   });
          //   return true;
          // }

          set({
            error: 'Invalid email or password',
            isLoading: false,
          });
          return false;
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : 'Login failed',
            isLoading: false,
          });
          return false;
        }
      },

      register: async (fullName: string, email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          // TODO: Replace with actual API call
          // const response = await fetch('YOUR_BACKEND_URL/api/auth/register', {
          //   method: 'POST',
          //   headers: { 'Content-Type': 'application/json' },
          //   body: JSON.stringify({ fullName, email, password }),
          // });
          // const data = await response.json();
          // if (response.ok) {
          //   set({
          //     user: data.user,
          //     token: data.token,
          //     isAuthenticated: true,
          //   });
          //   return true;
          // }

          const newUser: User = {
            id: Math.random().toString(),
            fullName,
            email,
          };

          set({
            user: newUser,
            token: 'mock-token',
            isAuthenticated: true,
            isLoading: false,
          });
          return true;
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : 'Registration failed',
            isLoading: false,
          });
          return false;
        }
      },

      logout: async () => {
        try {
          // TODO: Replace with actual API call
          // await fetch('YOUR_BACKEND_URL/api/auth/logout', {
          //   method: 'POST',
          //   headers: { 'Authorization': `Bearer ${get().token}` },
          // });

          set({
            user: null,
            token: null,
            isAuthenticated: false,
            error: null,
          });
        } catch (err) {
          console.error('Logout error:', err);
        }
      },

  clearError: () => set({ error: null }),
}));
