import { useAppStore } from "@/store/useAppStore";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ImageBackground, Text, TouchableOpacity, View } from "react-native";
import { ArrowLeftIcon, ArrowRightIcon } from "react-native-heroicons/outline";

export default function LoginScreen() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const router = useRouter();
  const { setUser } = useAppStore();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = () => {
    router.push({
      pathname: "/(auth)/webview",
      params: {
        url: "https://alsyahaalarabia.com/login",
        mode: "login",
      },
    });
  };

  const handleRegister = () => {
    router.push({
      pathname: "/(auth)/webview",
      params: {
        url: "https://alsyahaalarabia.com/wp-login.php?action=register",
        mode: "register",
      },
    });
  };

  return (
    <View className="flex-1 bg-primary">
      <ImageBackground
        source={{
          uri: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=1000&auto=format&fit=crop",
        }}
        className="flex-1"
        resizeMode="cover"
      >
        <LinearGradient
          colors={["rgba(26,60,52,0.6)", "rgba(26,60,52,0.9)"]}
          className="flex-1"
        >
          <View className="flex-1 px-8 justify-center">
            {/* Back Button */}
            <TouchableOpacity
              onPress={() => router.back()}
              className="absolute top-14 left-6 w-10 h-10 rounded-full bg-white/10 items-center justify-center"
            >
              {isRTL ? (
                <ArrowRightIcon size={20} color="white" />
              ) : (
                <ArrowLeftIcon size={20} color="white" />
              )}
            </TouchableOpacity>

            <View className="mb-12">
              <Text className="text-white text-4xl font-[Cairo_700Bold] text-start mb-2">
                {t("auth.welcomeBack")}
              </Text>
              <Text className="text-accent text-lg font-[Cairo_400Regular] text-start">
                {t("auth.signInToContinue")}
              </Text>
            </View>

            <View className="space-y-6">
              <TouchableOpacity
                onPress={handleLogin}
                className="bg-accent h-16 rounded-2xl items-center justify-center shadow-lg"
              >
                <Text className="text-primary text-lg font-[Cairo_700Bold]">
                  {t("auth.login")}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleRegister}
                className="bg-white/10 h-16 rounded-2xl items-center justify-center mt-4 border border-white/20"
              >
                <Text className="text-white text-lg font-[Cairo_700Bold]">
                  {t("auth.signUp")}
                </Text>
              </TouchableOpacity>

              <View className="mt-10 p-6 bg-white/5 rounded-[32px] border border-white/5">
                <Text className="text-gray-300 text-center font-[Cairo_400Regular] leading-6">
                  {isRTL
                    ? "سيتم توجيهك إلى الموقع الرسمي لإتمام عملية تسجيل الدخول بأمان."
                    : "You will be redirected to our official website to complete your login securely."}
                </Text>
              </View>
            </View>

            <View className="absolute bottom-12 left-0 right-0 items-center">
              <Text className="text-white/40 font-[Cairo_400Regular] text-xs">
                © 2024 Alsyaha Alarabiya
              </Text>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}
