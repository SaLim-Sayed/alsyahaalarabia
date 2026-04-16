import { useAppStore } from "@/store/useAppStore";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ArrowLeftIcon, ArrowRightIcon } from "react-native-heroicons/outline";
import { WebView, WebViewNavigation } from "react-native-webview";

export default function AuthWebViewScreen() {
  const { url, mode } = useLocalSearchParams();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const router = useRouter();
  const { setUser, logout } = useAppStore();
  const webViewRef = useRef<WebView>(null);
  const [loading, setLoading] = useState(true);

  // Script to handle post-login redirection and detailed extraction
  const extractionScript = `
    (function() {
      function extract() {
        const url = window.location.href;
        const isProfilePage = url.includes('/user/');
        const isSuccessPage = url === 'https://alsyahaalarabia.com/' || url === 'https://alsyahaalarabia.com' || url.includes('/my-account/') || isProfilePage;
        
        if (!isSuccessPage) return;

        // PHASE 1: Redirect to profile if we are logged in but on the wrong page
        if (!isProfilePage) {
          const adminBarLink = document.querySelector('#wp-admin-bar-my-account a.ab-item');
          if (adminBarLink && adminBarLink.href.includes('/user/')) {
            window.location.href = adminBarLink.href;
            return;
          }
          const anyUserLink = document.querySelector('a[href*="/user/"]');
          if (anyUserLink) {
            window.location.href = anyUserLink.href;
            return;
          }
        }

        // PHASE 2: On profile page, extract all details with precision
        if (isProfilePage) {
          const getVal = (selector) => {
            const el = document.querySelector(selector);
            return el ? el.innerText.trim() : null;
          };

          const firstName = getVal('.um-field-first_name .um-field-value');
          const lastName = getVal('.um-field-last_name .um-field-value');
          const username = getVal('.um-field-user_login .um-field-value');
          const regDate = getVal('.um-field-user_registered .um-field-value');
          
          const nameElement = document.querySelector('.um-name') || document.querySelector('h1.user-nicename') || document.querySelector('.profile-name');
          let nickname = (firstName && lastName) ? firstName + ' ' + lastName : (nameElement ? nameElement.innerText.trim() : 'User');
          
          const emailMatch = document.body.innerText.match(/[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+/);

          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'AUTH_SUCCESS',
            user: {
              id: Date.now().toString(),
              name: nickname,
              email: emailMatch ? emailMatch[0] : 'user@alsyahaalarabia.com',
              username: username || url.split('/user/')[1]?.split('/')[0],
              firstName,
              lastName,
              registrationDate: regDate?.replace('تم الانضمام في', '')?.trim()
            }
          }));
        }
      }
      setTimeout(extract, 2000); // 2s delay for safer DOM availability
    })();
  `;

  const handleNavigationStateChange = (navState: WebViewNavigation) => {
    console.log("[AuthWebView] Navigated to:", navState.url);

    // If we detect a logout action or landing on logout success page
    if (
      navState.url.includes("action=logout") ||
      navState.url.includes("loggedout=true")
    ) {
      console.log("[AuthWebView] Logout detected from web");
      logout();
      router.replace("/(auth)/login");
      return;
    }

    // If we land on a "success" page (home, my-account, or /user/profile)
    if (
      (navState.url === "https://alsyahaalarabia.com/" ||
        navState.url === "https://alsyahaalarabia.com" ||
        navState.url.includes("/my-account/") ||
        navState.url.includes("/user/")) &&
      !navState.url.includes("wp-login.php")
    ) {
      // Trigger extraction
      webViewRef.current?.injectJavaScript(extractionScript);
    }
  };

  const onMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === "AUTH_SUCCESS") {
        console.log("[AuthWebView] Login Success Detected:", data.user);
        setUser(data.user, "web-session-active");
        router.replace("/(tabs)");
      }
    } catch (e) {
      console.error("[AuthWebView] Message Error:", e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.closeButton}
        >
          {isRTL ? (
            <ArrowRightIcon size={24} color="#1a3c34" />
          ) : (
            <ArrowLeftIcon size={24} color="#1a3c34" />
          )}
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {mode === "register" ? t("auth.signUp") : t("auth.login")}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={{ flex: 1 }}>
        <WebView
          ref={webViewRef}
          source={{
            uri: (url as string) || "https://alsyahaalarabia.com/wp-login.php",
          }}
          onNavigationStateChange={handleNavigationStateChange}
          onMessage={onMessage}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          scalesPageToFit={true}
        />
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#fbbf24" />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 50,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "Cairo_700Bold",
    color: "#1a3c34",
  },
  closeButton: {
    padding: 5,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
});
