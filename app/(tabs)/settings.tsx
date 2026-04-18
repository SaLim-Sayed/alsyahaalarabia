import { AppHeader } from "@/components/AppHeader";
import { useAppStore } from "@/store/useAppStore";
import { useRouter } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  Modal,
  ScrollView,
  Share,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import {
  CheckIcon,
  ChevronRightIcon,
  DocumentTextIcon,
  InformationCircleIcon,
  LanguageIcon,
  ShareIcon,
  ShieldCheckIcon,
  UserIcon,
  XMarkIcon
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
  const [isLangModalVisible, setLangModalVisible] = React.useState(false);

  const languages = [
    { code: "ar", name: t("settings.arabic"), nativeName: "العربية" },
    { code: "en", name: t("settings.english"), nativeName: "English" },
    { code: "kk", name: t("settings.kazakh"), nativeName: "Қазақ тілі" },
    { code: "ur", name: t("settings.urdu"), nativeName: "اردو" },
  ];

  const handleLanguageSelect = (langCode: any) => {
    setLanguage(langCode);
    setLangModalVisible(false);
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
      <TouchableOpacity
          onPress={() =>
            user ? router.push("/settings/profile") : router.push("/(auth)/login")
          }
          activeOpacity={0.7}
          className="bg-primary p-4  flex-row items-center shadow-lg border border-white/5"
        >
          <View className="w-12 h-12 rounded-3xl bg-accent items-center justify-center border-2 border-white/20">
            {user ? (
              <Text className="text-primary text-2xl font-[Cairo_700Bold]">
                {user.name.charAt(0).toUpperCase()}
              </Text>
            ) : (
              <UserIcon size={30} color="#1a3c34" />
            )}
          </View>
          <View className="ms-5 flex-1">
            <Text
              className="text-white text-xl font-[Cairo_700Bold]"
               
            >
              {user ? user.name : t("auth.guest")}
            </Text>
            <Text
              className="text-accent text-xs font-[Cairo_700Bold] mt-1"
             
            >
              {user ? (isRTL ? "عرض الملف الشخصي" : "View Profile") : t("auth.login")}
            </Text>
          </View>
          <View style={{ transform: [{ rotate: isRTL ? "180deg" : "0deg" }] }}>
            <ChevronRightIcon size={20} color="rgba(255,255,255,0.3)" />
          </View>
        </TouchableOpacity>

      <ScrollView
        className="flex-1 px-6 pt-6"
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
       
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
              languages.find((l) => l.code === language)?.name ||
              t("settings.arabic")
            }
            onPress={() => setLangModalVisible(true)}
            isRTL={isRTL}
          />
        </View>

        {/* Language Modal */}
        <Modal
          visible={isLangModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setLangModalVisible(false)}
        >
          <View className="flex-1 bg-black/50 justify-end">
            <View className="bg-white rounded-t-[40px] p-8 pb-12 shadow-2xl">
              <View className="flex-row items-center justify-between mb-8">
                <Text className="text-2xl font-[Cairo_700Bold] text-primary">
                  {t("settings.language")}
                </Text>
                <TouchableOpacity
                  onPress={() => setLangModalVisible(false)}
                  className="w-10 h-10 items-center justify-center rounded-full bg-gray-100"
                >
                  <XMarkIcon size={24} color="#1a3c34" />
                </TouchableOpacity>
              </View>

              <View className="gap-y-3">
                {languages.map((item) => (
                  <TouchableOpacity
                    key={item.code}
                    onPress={() => handleLanguageSelect(item.code)}
                    className={`flex-row items-center justify-between p-5 rounded-3xl border ${
                      language === item.code
                        ? "bg-primary/5 border-primary"
                        : "bg-gray-50 border-gray-100"
                    }`}
                  >
                    <View>
                      <Text className="text-gray-800 font-[Cairo_700Bold] text-lg">
                        {item.nativeName}
                      </Text>
                      <Text className="text-gray-400 font-[Cairo_400Regular] text-sm">
                        {item.name}
                      </Text>
                    </View>
                    {language === item.code && (
                      <View className="w-8 h-8 rounded-full bg-primary items-center justify-center">
                        <CheckIcon size={18} color="white" strokeWidth={3} />
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </Modal>

       

        {/* About Section */}
        <View className="mb-6">
          <Text
            className={`text-gray-400 font-[Cairo_700Bold] text-xs uppercase tracking-widest mb-4 `}
          >
            {t("settings.about")}
          </Text>
          <SettingItem
            icon={InformationCircleIcon}
            title={t("settings.about")}
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
