import { Cairo_400Regular, Cairo_700Bold } from "@expo-google-fonts/cairo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useMemo, useState } from "react";
import * as RN from "react-native";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../i18n"; // Initialize i18n

import { useColorScheme } from "@/components/useColorScheme";
import { useAppStore } from "@/store/useAppStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import i18n from "i18next";
import "../global.css";

import { CustomSplashScreen } from "@/components/CustomSplashScreen";
import { View } from "@/components/Themed";
import * as NavigationBar from "expo-navigation-bar";
import { ActivityIndicator } from "react-native";

const queryClient = new QueryClient();

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const state = useAppStore();
  const [loaded, error] = useFonts({
    Cairo_400Regular,
    Cairo_700Bold,
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  const [splashFinished, setSplashFinished] = useState(false);
  /** Bumps when `lastSyncTimestamp`-based gate may have expired (time alone doesn't re-render). */
  const [rtlGateTick, setRtlGateTick] = useState(0);

  // Configure Native Navigation Bar (Android)
  useEffect(() => {
    if (RN.Platform.OS === "android") {
      NavigationBar.setBackgroundColorAsync("#1a3c34");
      NavigationBar.setVisibilityAsync("hidden");
      NavigationBar.setBehaviorAsync("inset-touch");
    }
  }, []);

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // If native direction doesn't match persisted language, delegate once — after a reload,
  // lastSyncTimestamp is recent so we don't call setLanguage again (avoids reload loops).
  useEffect(() => {
    const checkRTL = () => {
      const language = state.language;
      const isRTL = language === "ar" || language === "ur";
      const mismatch = RN.I18nManager.isRTL !== isRTL;
      const recentlyRestartedForRtl =
        state.lastSyncTimestamp > 0 &&
        Date.now() - state.lastSyncTimestamp < 30_000;

      if (mismatch && !recentlyRestartedForRtl) {
        console.log(
          `[Layout] RTL mismatch (native ${RN.I18nManager.isRTL}). Delegating to setLanguage…`,
        );
        state.setLanguage(language);
      } else if (mismatch && recentlyRestartedForRtl) {
        console.log(
          "[Layout] RTL mismatch left as-is (recent sync; avoids reload loop).",
        );
      }
    };

    if (loaded && state.hasHydrated) {
      checkRTL();
    }
  }, [loaded, state.hasHydrated]);

  const { language, lastSyncTimestamp, hasHydrated } = state;

  useEffect(() => {
    if (lastSyncTimestamp <= 0) return;
    const elapsed = Date.now() - lastSyncTimestamp;
    if (elapsed >= 3200) return;
    const id = setTimeout(
      () => setRtlGateTick((n) => n + 1),
      3300 - elapsed,
    );
    return () => clearTimeout(id);
  }, [lastSyncTimestamp]);

  // Cover the store's 2s delay before RNRestart; rtlGateTick makes the window expire (time isn't reactive).
  const isRebooting = useMemo(
    () =>
      lastSyncTimestamp > 0 && Date.now() - lastSyncTimestamp < 3200,
    [lastSyncTimestamp, rtlGateTick],
  );

  useEffect(() => {
    if (hasHydrated && i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }, [language, hasHydrated]);

  if (!loaded || !hasHydrated || isRebooting) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#ffffff",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <StatusBar style="dark" />
        <ActivityIndicator size="large" color="#1a3c34" />
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
  const { hasSeenIntro } = useAppStore();

  return (
    <SafeAreaProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack
          screenOptions={{ headerShown: false }}
          initialRouteName={!hasSeenIntro ? "intro" : "(tabs)"}
        >
          <Stack.Screen name="intro" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="modal" options={{ presentation: "modal" }} />
        </Stack>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
