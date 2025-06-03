import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { PaperProvider } from 'react-native-paper';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuth } from '../hooks/useAuth';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { session, loading } = useAuth();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded || loading) {
    return null;
  }

  return (
    <PaperProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          {session ? (
            <>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
            </>
          ) : (
            <Stack.Screen name="auth" options={{ headerShown: false }} />
          )}
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </PaperProvider>
  );
}
