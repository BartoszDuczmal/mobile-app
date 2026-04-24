import BottomBar from '@/components/BottomBar';
import NavigationBar from '@/components/NavigationBar';
import SearchBar from '@/components/SearchBar';
import '@/locales/config';
import { AuthProvider } from '@/providers/AuthProvider';
import { ModalProvider } from '@/providers/ModalProvider';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TextInput, View } from 'react-native';
import 'react-native-gesture-handler';
import 'react-native-reanimated';
import "../global.css";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { t } = useTranslation()

  const [loaded] = useFonts({
    'FontItalic': require('../assets/fonts/Roboto-Italic-VariableFont_wdth,wght.ttf'),
    'FontMain': require('../assets/fonts/Roboto-VariableFont_wdth,wght.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  if ((Text as any).defaultProps == null) (Text as any).defaultProps = {};
  (Text as any).defaultProps.allowFontScaling = false;

  if ((TextInput as any).defaultProps == null) (TextInput as any).defaultProps = {};
  (TextInput as any).defaultProps.allowFontScaling = false;

  return (
  <AuthProvider>
    <ModalProvider>
      <View className='flex-1 w-full bg-[#f5f6f7] dark:bg-[#07080a]' >
        <Stack screenOptions={{
          headerTransparent: true,
          headerShadowVisible: false,
          headerShown: true,
          animation: 'fade',
          contentStyle: { backgroundColor: 'transparent' },
          header: (props: any) => <NavigationBar {...props} />
        }}>
          <Stack.Screen name='(tabs)/posts/index' options={{ title: t('posts.fetch.header') , hideBack: true, header: (props: any) => <SearchBar {...props}/> }} />
          <Stack.Screen name='(tabs)/publish' options={{ title: t('posts.publish.header') }} />
          <Stack.Screen name='(tabs)/posts/[id]/index' options={{ title: t('posts.show.header') }} />
          <Stack.Screen name='(tabs)/posts/[id]/edit' options={{ title: t('posts.edit.header') }} />
          <Stack.Screen name='(tabs)/login/index' options={{ title: t('auth.login.header'), hideLogin: true }} />
          <Stack.Screen name='(tabs)/login/recovery' options={{ title: t('auth.recovery.header'), showLogin: true }} />
          <Stack.Screen name='(tabs)/register' options={{ title: t('auth.register.header'), hideLogin: true }} />
          <Stack.Screen name='(tabs)/login/resetPassword' options={{ title: t('auth.resetPass.header'), hideLogin: true }} />
          <Stack.Screen name='(tabs)/profile/[name]/index' options={{ title: t('profile.header') }} />
          <Stack.Screen name='(tabs)/profile/index' options={{ title: t('myProfile.header'), hideLogin: true }} />
          <Stack.Screen name='(tabs)/login/changePassword' options={{ title: t('auth.changePass.header'), hideLogin: true }} />
        </Stack>
        <BottomBar/>
      </View>
    </ModalProvider>
  </AuthProvider>
  );
}
