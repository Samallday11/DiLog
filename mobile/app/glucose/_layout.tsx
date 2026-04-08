import { Stack } from 'expo-router';

export default function GlucoseLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="history" />
      <Stack.Screen name="details" />
      <Stack.Screen name="log-reading" />
    </Stack>
  );
}
