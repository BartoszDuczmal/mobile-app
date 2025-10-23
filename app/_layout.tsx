import TabLogin from '@/components/TabLogin';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
  <Stack screenOptions={{
    headerShown: true,
    headerRight: () => TabLogin(),
  }}>
    <Stack.Screen name='(tabs)/posts/index' options={{ title: 'Strona Główna' , headerBackVisible: false }} />
    <Stack.Screen name='(tabs)/publish' options={{ title: 'Publikowanie' }} />
    <Stack.Screen name='(tabs)/posts/[id]/index' options={{ title: 'Przegląd' }} />
    <Stack.Screen name='(tabs)/posts/[id]/edit' options={{ title: 'Edytowanie'}} />
    <Stack.Screen name='(tabs)/login/index' options={{ title: 'Logowanie', headerRight: () => null }} />
    <Stack.Screen name='(tabs)/login/recovery' options={{ title: 'Odzyskiwanie', headerRight: () => null }} />
    <Stack.Screen name='(tabs)/register' options={{ title: 'Rejestracja', headerRight: () => null }} />
    <Stack.Screen name='(tabs)/login/resetPassword' options={{ title: 'Zmiana hasła', headerRight: () => null }} />
  </Stack>
  );
}
