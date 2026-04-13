import { Cairo_400Regular, Cairo_700Bold } from '@expo-google-fonts/cairo';
import * as RN from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
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
import { useState } from 'react';

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
    if (loaded && !splashFinished) {
      const checkSync = async () => {
        const { language, setLanguage, lastSyncTimestamp } = useAppStore.getState();
        const shouldBeRTL = language === 'ar';
        const now = Date.now();
        
        // Safety: If we restarted within the last 15 seconds, assume the direction is pending or correct
        // to prevent infinite loops if I18nManager.isRTL is stale.
        const recentlySynced = (now - lastSyncTimestamp) < 15000;
        
        // Sync i18n
        if (i18n.language !== language) {
          await i18n.changeLanguage(language);
        }
        
        // Final native sync check
        if (RN.I18nManager.isRTL !== shouldBeRTL && !recentlySynced) {
          console.log('[Layout] RTL Mismatch detected on boot. Triggering sync for', language);
          setLanguage(language);
        }
      };
      
      // Small delay to allow store to hydtrate if it hasn't already
      const timer = setTimeout(checkSync, 100);
      return () => clearTimeout(timer);
    }
  }, [loaded, splashFinished]);

  // Navigation context guard: If we just triggered a restart, don't render navigation
  // components that might try to access context while the app is tearing down.
  const { language, lastSyncTimestamp } = useAppStore();
  const isRebooting = (Date.now() - lastSyncTimestamp) < 1000;

  useEffect(() => {
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }, [language]);

  if (!loaded || isRebooting) {
    return (
      <View style={{ flex: 1, backgroundColor: '#1a3c34' }}>
        <StatusBar style="light" />
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
