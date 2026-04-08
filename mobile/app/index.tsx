import { useEffect } from 'react';
import { Redirect } from 'expo-router';

import { useAuthStore } from '@/store/authStore';

export default function Index() {
  const { isAuthenticated, isHydrated, hydrate } = useAuthStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  if (!isHydrated) {
    return null;
  }

  if (isAuthenticated) {
    return <Redirect href="/(tabs)/home" />;
  }

  return <Redirect href="/Auth/login" />;
}
