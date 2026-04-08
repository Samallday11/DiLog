import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

import { api } from '@/lib/api';

interface User {
  id: number;
  fullName: string;
  email: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isHydrated: boolean;
  error: string | null;
  hydrate: () => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  register: (fullName: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AUTH_STORAGE_KEY = 'auth-storage';

function getErrorMessage(error: unknown, fallback: string) {
  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof (error as { response?: unknown }).response === 'object' &&
    (error as { response?: { data?: { message?: string } } }).response?.data?.message
  ) {
    return (error as { response: { data: { message: string } } }).response.data.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

async function persistAuthState(user: User | null, token: string | null, isAuthenticated: boolean) {
  await AsyncStorage.setItem(
    AUTH_STORAGE_KEY,
    JSON.stringify({ user, token, isAuthenticated })
  );
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  isHydrated: false,
  error: null,

  hydrate: async () => {
    if (typeof window === 'undefined') {
      set({ isHydrated: true });
      return;
    }

    try {
      const stored = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as {
          user: User | null;
          token: string | null;
          isAuthenticated: boolean;
        };

        set({
          user: parsed.user,
          token: parsed.token,
          isAuthenticated: parsed.isAuthenticated,
          isHydrated: true,
        });
        return;
      }
    } catch {
      // Ignore corrupt persisted state and continue with a clean session.
    }

    set({ isHydrated: true });
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post<AuthResponse>('/auth/login', {
        email,
        password,
      });

      await persistAuthState(response.data.user, response.data.token, true);

      set({
        user: response.data.user,
        token: response.data.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      return true;
    } catch (error) {
      set({
        isLoading: false,
        isAuthenticated: false,
        token: null,
        user: null,
        error: getErrorMessage(error, 'Login failed'),
      });
      return false;
    }
  },

  register: async (fullName: string, email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post<AuthResponse>('/auth/register', {
        fullName,
        email,
        password,
      });

      await persistAuthState(response.data.user, response.data.token, true);

      set({
        user: response.data.user,
        token: response.data.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      return true;
    } catch (error) {
      set({
        isLoading: false,
        isAuthenticated: false,
        token: null,
        user: null,
        error: getErrorMessage(error, 'Registration failed'),
      });
      return false;
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
      isLoading: false,
    });
  },

  clearError: () => set({ error: null }),
}));
