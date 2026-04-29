import { useRouter } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  LockClosedIcon,
} from "react-native-heroicons/outline";

export default function PrivacyScreen() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const router = useRouter();

  const sections = [
    {
      title: t("privacy.introTitle"),
      content: t("privacy.introContent"),
    },
    {
      title: t("privacy.dataTitle"),
      content: t("privacy.dataContent"),
    },
    {
      title: t("privacy.disclaimerTitle"),
      content: t("privacy.disclaimerContent"),
    },
    {
      title: t("privacy.updatesTitle"),
      content: t("privacy.updatesContent"),
    },
  ];

  return (
    <View className="flex-1 bg-secondary">
      {/* Header */}
      <View className="bg-primary pt-14 pb-10 px-6 rounded-b-[40px] shadow-lg">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center rounded-full bg-white/10 mb-6"
        >
          {isRTL ? (
            <ArrowRightIcon size={22} color="white" />
          ) : (
            <ArrowLeftIcon size={22} color="white" />
          )}
        </TouchableOpacity>
        <View className="flex-row items-center">
          <LockClosedIcon
            size={24}
            color="#fbbf24"
            style={{ marginRight: isRTL ? 0 : 10, marginLeft: isRTL ? 10 : 0 }}
          />
          <Text className="text-white text-3xl font-[Cairo_700Bold]">
            {t("privacy.title")}
          </Text>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-6 pt-8 pb-20"
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          onPress={() =>
            Linking.openURL("https://alsyahaalarabia.com/privacy-policy")
          }
        >
          <Text className="text-accent/60 text-[10px] font-[Cairo_400Regular] mb-6 text-center underline">
            Source: https://alsyahaalarabia.com/privacy-policy
          </Text>
        </TouchableOpacity>
        {sections.map((section, index) => (
          <View key={index} className="mb-10">
            <View className="flex-row items-center mb-4">
              <View className="w-1.5 h-6 bg-accent rounded-full me-3" />
              <Text className="text-primary font-[Cairo_700Bold] text-xl">
                {section.title}
              </Text>
            </View>
            <View className="bg-white rounded-[28px] p-6 shadow-sm border border-gray-100">
              <Text className="text-gray-500 font-[Cairo_400Regular] leading-7 text-base">
                {section.content}
              </Text>
            </View>
          </View>
        ))}

        <View className="h-20" />
      </ScrollView>
    </View>
  );
}
