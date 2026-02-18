import TabLogin from '@/components/TabLogin';
import '@/locales/config';
import { ModalProvider } from '@/providers/ModalContext';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { t } = useTranslation()

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
  <ModalProvider>
    <Stack screenOptions={{
      headerShown: true,
      headerRight: () => TabLogin(),
    }}>
      <Stack.Screen name='(tabs)/posts/index' options={{ title: t('posts.fetch.header') , headerBackVisible: false }} />
      <Stack.Screen name='(tabs)/publish' options={{ title: t('posts.publish.header') }} />
      <Stack.Screen name='(tabs)/posts/[id]/index' options={{ title: t('posts.show.header') }} />
      <Stack.Screen name='(tabs)/posts/[id]/edit' options={{ title: t('posts.edit.header') }} />
      <Stack.Screen name='(tabs)/login/index' options={{ title: t('auth.login.header'), headerRight: () => null }} />
      <Stack.Screen name='(tabs)/login/recovery' options={{ title: t('auth.recovery.header'), headerRight: () => null }} />
      <Stack.Screen name='(tabs)/register' options={{ title: t('auth.register.header'), headerRight: () => null }} />
      <Stack.Screen name='(tabs)/login/resetPassword' options={{ title: t('auth.resetPass.header'), headerRight: () => null }} />
      <Stack.Screen name='(tabs)/profile/[name]/index' options={({ route } : ( any )) => ({ title: `${t('profile.header')} ${route.params?.name}` })} />
      <Stack.Screen name='(tabs)/profile/index' options={({ route }) => ({ title: t('myProfile.header'), headerRight: () => null })} />
      <Stack.Screen name='(tabs)/login/changePassword' options={({ route }) => ({ title: t('auth.changePass.header'), headerRight: () => null })} />
    </Stack>
  </ModalProvider>
  );
}
