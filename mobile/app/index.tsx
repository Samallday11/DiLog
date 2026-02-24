import { Redirect } from 'expo-router';
import { useAuthStore } from '@/store/authStore';

export default function Index() {
  const { isAuthenticated } = useAuthStore();

  // Redirect based on authentication status
  if (isAuthenticated) {
    return <Redirect href="/(tabs)/home" />;  // ← Changed to specific tab
  }

  return <Redirect href="/Auth/login" />;
}