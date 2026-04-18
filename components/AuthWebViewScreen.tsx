import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ArrowLeftIcon, ArrowRightIcon } from "react-native-heroicons/outline";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

type AuthWebViewScreenProps = {
  uri: string;
  title: string;
  subtitle: string;
};

export function AuthWebViewScreen({
  uri,
  title,
  subtitle,
}: AuthWebViewScreenProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const handleNavChange = useCallback((navLoading: boolean) => {
    setLoading(navLoading);
  }, []);

  return (
    <SafeAreaView
      className="flex-1 bg-primary"
      edges={["top", "left", "right"]}
    >
      <View className="flex-row items-center px-4 py-3 border-b border-white/10 gap-3">
        <TouchableOpacity
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel={t("common.goBack")}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          className="w-11 h-11 rounded-full bg-white/10 items-center justify-center"
        >
          {isRTL ? (
            <ArrowRightIcon size={22} color="white" />
          ) : (
            <ArrowLeftIcon size={22} color="white" />
          )}
        </TouchableOpacity>
        <View className="flex-1 min-w-0">
          <Text
            className="text-white font-[Cairo_700Bold] text-lg"
            numberOfLines={1}
          >
            {title}
          </Text>
          <Text
            className="text-white/70 font-[Cairo_400Regular] text-xs mt-0.5"
            numberOfLines={2}
          >
            {subtitle}
          </Text>
        </View>
      </View>

      <View className="flex-1 bg-white relative">
        {loading ? (
          <View className="absolute inset-0 z-10 bg-white items-center justify-center">
            <ActivityIndicator size="large" color="#1a3c34" />
          </View>
        ) : null}

        <WebView
          source={{ uri }}
          style={{ flex: 1 }}
          onLoadStart={() => handleNavChange(true)}
          onLoadEnd={() => handleNavChange(false)}
          onError={() => handleNavChange(false)}
          originWhitelist={["https://*", "http://*"]}
          javaScriptEnabled
          domStorageEnabled
          sharedCookiesEnabled
          {...(Platform.OS === "android"
            ? { thirdPartyCookiesEnabled: true }
            : {})}
          mixedContentMode="compatibility"
          allowsBackForwardNavigationGestures
          setSupportMultipleWindows={false}
          onShouldStartLoadWithRequest={(req) => {
            const url = req.url;
            if (url.startsWith("mailto:") || url.startsWith("tel:")) {
              return false;
            }
            return true;
          }}
        />
      </View>

      <View className="px-4 py-3 border-t border-white/10 bg-primary">
        <TouchableOpacity
          onPress={() => router.replace("/(auth)/login")}
          accessibilityRole="button"
          className="bg-accent h-12 rounded-2xl items-center justify-center"
        >
          <Text className="text-primary font-[Cairo_700Bold]">
            {t("auth.backToLogin")}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
