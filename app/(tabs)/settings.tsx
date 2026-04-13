import { AppHeader } from "@/components/AppHeader";
import { useAppStore } from "@/store/useAppStore";
import { useRouter } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  ScrollView,
  Share,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  ArrowPathIcon,
  ChevronRightIcon,
  DocumentTextIcon,
  InformationCircleIcon,
  LanguageIcon,
  MoonIcon,
  ShareIcon,
  ShieldCheckIcon,
} from "react-native-heroicons/outline";

const SettingItem = ({
  icon: Icon,
  title,
  value,
  onPress,
  showChevron = true,
  isRTL,
}: any) => (
  <TouchableOpacity
    onPress={onPress}
    className="flex-row items-center justify-between p-5 bg-white mb-3 rounded-3xl shadow-sm border border-gray-100"
  >
    <View className="flex-row items-center">
      <View className="bg-primary/5 w-10 h-10 rounded-2xl items-center justify-center">
        <Icon size={22} color="#1a3c34" strokeWidth={1.5} />
      </View>
      <Text className="text-gray-800 font-[Cairo_700Bold] text-base ms-4">
        {title}
      </Text>
    </View>

    <View className="flex-row items-center">
      {value && (
        <Text className="text-accent font-[Cairo_700Bold] text-sm me-2">
          {value}
        </Text>
      )}
      {showChevron && (
        <View style={{ transform: [{ rotate: isRTL ? "180deg" : "0deg" }] }}>
          <ChevronRightIcon size={18} color="#9ca3af" />
        </View>
      )}
    </View>
  </TouchableOpacity>
);

export default function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const router = useRouter();
  const { language, setLanguage, theme, setTheme, user, logout } =
    useAppStore();

  const toggleLanguage = () => {
    const nextLang = language === "ar" ? "en" : "ar";
    setLanguage(nextLang);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: t("article.shareMessage"),
        url: "https://arabtourism.com",
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View className="flex-1 bg-secondary">
      <AppHeader />

      <ScrollView
        className="flex-1 px-6 pt-6"
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <View className="mb-10 bg-primary p-6 rounded-[32px] flex-row items-center shadow-lg border border-white/5">
          <View className="w-16 h-16 rounded-3xl bg-accent items-center justify-center border-2 border-white/20">
            {user ? (
              <Text className="text-primary text-2xl font-[Cairo_700Bold]">
                {user.name.charAt(0).toUpperCase()}
              </Text>
            ) : (
              <InformationCircleIcon size={30} color="#1a3c34" />
            )}
          </View>
          <View className="ms-5 flex-1">
            <Text
              className="text-white text-xl font-[Cairo_700Bold]"
              style={{ textAlign: isRTL ? "right" : "left" }}
            >
              {user ? user.name : t("auth.guest")}
            </Text>
            <TouchableOpacity
              onPress={() => (user ? logout() : router.push("/(auth)/login"))}
              className="mt-1"
            >
              <Text
                className="text-accent text-xs font-[Cairo_700Bold]"
                style={{ textAlign: isRTL ? "right" : "left" }}
              >
                {user ? t("auth.logout") : t("auth.login")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text className={`text-2xl font-[Cairo_700Bold] text-primary mb-6 `}>
          {t("settings.title")}
        </Text>

        {/* Language Section */}
        <View className="mb-6">
          <Text
            className={`text-gray-400 font-[Cairo_700Bold] text-xs uppercase tracking-widest mb-4 `}
          >
            {t("settings.language")}
          </Text>
          <SettingItem
            icon={LanguageIcon}
            title={t("settings.language")}
            value={
              language === "ar" ? t("settings.arabic") : t("settings.english")
            }
            onPress={toggleLanguage}
            isRTL={isRTL}
          />
        </View>

        {/* Appearance Section */}
        <View className="mb-6">
          <Text
            className={`text-gray-400 font-[Cairo_700Bold] text-xs uppercase tracking-widest mb-4`}
          >
            {t("settings.theme")}
          </Text>
          <View className="flex-row items-center justify-between p-5 bg-white mb-3 rounded-3xl shadow-sm border border-gray-100">
            <View className="flex-row items-center">
              <View className="bg-primary/5 w-10 h-10 rounded-2xl items-center justify-center">
                <MoonIcon size={22} color="#1a3c34" strokeWidth={1.5} />
              </View>
              <Text className="text-gray-800 font-[Cairo_700Bold] text-base ms-4">
                {t("settings.theme")}
              </Text>
            </View>
            <Switch
              value={theme === "dark"}
              onValueChange={(val) => setTheme(val ? "dark" : "light")}
              trackColor={{ false: "#f3f4f6", true: "#fbbf24" }}
              thumbColor={theme === "dark" ? "#1a3c34" : "#fff"}
            />
          </View>
        </View>

        {/* About Section */}
        <View className="mb-6">
          <Text
            className={`text-gray-400 font-[Cairo_700Bold] text-xs uppercase tracking-widest mb-4 `}
          >
            {t("settings.about")}
          </Text>
          <SettingItem
            icon={InformationCircleIcon}
            title={isRTL ? "عن المجلة" : "About Us"}
            onPress={() => router.push("/settings/about")}
            isRTL={isRTL}
          />
          <SettingItem
            icon={ShareIcon}
            title={t("settings.contact")}
            onPress={() => router.push("/settings/contact")}
            isRTL={isRTL}
          />
          <SettingItem
            icon={ShieldCheckIcon}
            title={t("settings.privacy")}
            onPress={() => router.push("/settings/privacy")}
            isRTL={isRTL}
          />
          <SettingItem
            icon={DocumentTextIcon}
            title={t("settings.terms")}
            onPress={() => router.push("/settings/privacy")}
            isRTL={isRTL}
          />
          <SettingItem
            icon={ArrowPathIcon}
            title={isRTL ? "إعادة تشغيل إجبارية" : "Force Restart"}
            onPress={() => setLanguage(language)}
            isRTL={isRTL}
          />
        </View>

        <View className="py-10 items-center">
          <Text className="text-gray-300 font-[Cairo_400Regular] text-xs">
            Made with D Arrow in Riyadh
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
