import { Stack } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { useEffect } from 'react';
import { router } from 'expo-router';

export default function AuthLayout() {
  const { session } = useAuth();

  useEffect(() => {
    if (session) {
      router.replace('/(tabs)');
    }
  }, [session]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#fff' },
      }}
    />
  );
}
