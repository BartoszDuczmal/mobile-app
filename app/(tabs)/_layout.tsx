import { Stack } from 'expo-router';

export default function StackLayout() {
  return (
  <Stack>
    <Stack.Screen name='tabsik' options={{ headerShown: false }} />
  </Stack>
  );
}
