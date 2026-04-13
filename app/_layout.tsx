import { Cairo_400Regular, Cairo_700Bold } from '@expo-google-fonts/cairo';
import * as RN from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import '../i18n'; // Initialize i18n

import { useColorScheme } from '@/components/useColorScheme';
import { useAppStore } from '@/store/useAppStore';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import i18n from 'i18next';
import "../global.css";
import { StatusBar } from 'expo-status-bar';

import { CustomSplashScreen } from '@/components/CustomSplashScreen';
import { View } from '@/components/Themed';
import { ActivityIndicator } from 'react-native';

const queryClient = new QueryClient();

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Cairo_400Regular,
    Cairo_700Bold,
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  const [splashFinished, setSplashFinished] = useState(false);

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // Check for RTL/Language synchronization on boot
  useEffect(() => {
    if (loaded) {
      const { language, setLanguage, lastSyncTimestamp } = useAppStore.getState();
      const isRTL = language === 'ar';
      
      // Sync i18n instance
      if (i18n.language !== language) {
        i18n.changeLanguage(language);
      }
      
      // If native direction doesn't match our language, force a sync restart
      // We only do this if it's not a fresh reboot to avoid loops
      const freshReboot = (Date.now() - lastSyncTimestamp) < 5000;
      
      if (RN.I18nManager.isRTL !== isRTL && !freshReboot) {
        console.log('[Layout] Boot mismatch. Target Arabic:', isRTL, 'Current RTL:', RN.I18nManager.isRTL);
        setLanguage(language);
      }
    }
  }, [loaded]);

  const { language, lastSyncTimestamp } = useAppStore();
  const isRebooting = (Date.now() - lastSyncTimestamp) < 800;

  useEffect(() => {
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }, [language]);

  if (!loaded || isRebooting) {
    return (
      <View style={{ flex: 1, backgroundColor: '#1a3c34', justifyContent: 'center', alignItems: 'center' }}>
        <StatusBar style="light" />
        <ActivityIndicator size="large" color="#ca8a04" />
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <View style={{ flex: 1 }}>
        <StatusBar style="light" />
        <RootLayoutNav />
        {!splashFinished && (
          <CustomSplashScreen onFinish={() => setSplashFinished(true)} />
        )}
      </View>
    </QueryClientProvider>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        </Stack>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
