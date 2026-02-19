// app/_layout.js
import store from '@/features/store/store';
import { useAuthBootstrap } from '@/hooks/useAuthBootstrap';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';

function Bootstrapper() {
  useAuthBootstrap();
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <Bootstrapper />
      </Provider>
    </SafeAreaProvider>
  );
}
