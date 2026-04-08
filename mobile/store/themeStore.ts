import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

interface ThemeState {
  isDarkMode: boolean;
  isHydrated: boolean;
  hydrate: () => Promise<void>;
  setDarkMode: (value: boolean) => Promise<void>;
  toggleDarkMode: () => Promise<void>;
}

const THEME_STORAGE_KEY = 'theme-storage';

export const useThemeStore = create<ThemeState>((set, get) => ({
  isDarkMode: false,
  isHydrated: false,

  hydrate: async () => {
    if (typeof window === 'undefined') {
      set({ isHydrated: true });
      return;
    }

    try {
      const stored = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (stored !== null) {
        set({ isDarkMode: JSON.parse(stored), isHydrated: true });
        return;
      }
    } catch {
      // Ignore persisted theme read errors and use the default theme.
    }

    set({ isHydrated: true });
  },

  setDarkMode: async (value) => {
    set({ isDarkMode: value });
    await AsyncStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(value));
  },

  toggleDarkMode: async () => {
    const nextValue = !get().isDarkMode;
    set({ isDarkMode: nextValue });
    await AsyncStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(nextValue));
  },
}));
