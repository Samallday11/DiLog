import { Stack } from 'expo-router';

export default function MedicationLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="list" />
      <Stack.Screen name="add-medication" />
      <Stack.Screen name="reminders" />
    </Stack>
  );
}
