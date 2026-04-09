import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Colors } from '@/constants/theme';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme === 'light' ? 'light' : 'dark'];

  const navigationTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: palette.background,
      card: palette.surfaceStrong,
      primary: palette.tint,
      text: palette.text,
      border: palette.border,
      notification: palette.accentBlue,
    },
  };

  useEffect(() => {
    // Hide splash screen after a short delay
    const timer = setTimeout(() => {
      SplashScreen.hideAsync();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider value={navigationTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="Auth" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="glucose" />
          <Stack.Screen name="meals" />
          <Stack.Screen name="medication" />
          <Stack.Screen name="activity" />
        </Stack>
        <StatusBar style="light" />
      </ThemeProvider>
    </ErrorBoundary>
  );
}
