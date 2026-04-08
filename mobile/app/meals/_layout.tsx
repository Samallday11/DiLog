import { Stack } from 'expo-router';

export default function MealsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="history" />
      <Stack.Screen name="meal-details" />
      <Stack.Screen name="add-meal" />
    </Stack>
  );
}
