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
      title: t("privacy.licensingTitle"),
      content: t("privacy.licensingContent"),
      highlight: true,
    },
    {
      title: t("privacy.collectionTitle"),
      content: t("privacy.collectionContent"),
    },
    {
      title: t("privacy.usageTitle"),
      content: t("privacy.usageContent"),
    },
    {
      title: t("privacy.legalBasisTitle"),
      content: t("privacy.legalBasisContent"),
    },
    {
      title: t("privacy.sharingTitle"),
      content: t("privacy.sharingContent"),
    },
    {
      title: t("privacy.transferTitle"),
      content: t("privacy.transferContent"),
    },
    {
      title: t("privacy.rightsTitle"),
      content: t("privacy.rightsContent"),
    },
    {
      title: t("privacy.childrenTitle"),
      content: t("privacy.childrenContent"),
    },
    {
      title: t("privacy.appSpecificTitle"),
      content: t("privacy.appSpecificContent"),
      isAppOnly: true,
    },
    {
      title: t("privacy.translationTitle"),
      content: t("privacy.translationContent"),
    },
    {
      title: t("privacy.freeServicesTitle"),
      content: t("privacy.freeServicesContent"),
    },
    {
      title: t("privacy.contactTitle"),
      content: t("privacy.contactContent"),
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
          <View className="w-12 h-12 bg-accent/20 rounded-2xl items-center justify-center me-4">
            <LockClosedIcon size={28} color="#fbbf24" />
          </View>
          <View>
            <Text className="text-white text-3xl font-[Cairo_700Bold]">
              {t("privacy.title")}
            </Text>
            <Text className="text-white/60 text-xs font-[Cairo_400Regular]">
              {t("privacy.lastUpdate")} • {t("privacy.version")}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-6 pt-8"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <TouchableOpacity
          onPress={() =>
            Linking.openURL("https://alsyahaalarabia.com/privacy-policy")
          }
          className="mb-8 p-4 bg-accent/5 rounded-2xl border border-accent/10 items-center"
        >
          <Text className="text-accent text-[12px] font-[Cairo_700Bold] text-center">
            {t("privacy.source")}: https://alsyahaalarabia.com/privacy-policy
          </Text>
        </TouchableOpacity>

        {sections.map((section, index) => (
          <View key={index} className="mb-8">
            <View className="flex-row items-center mb-3">
              <View
                className={`w-1.5 h-6 rounded-full me-3 ${section.isAppOnly ? "bg-blue-500" : "bg-accent"}`}
              />
              <Text
                className={`font-[Cairo_700Bold] text-lg ${section.isAppOnly ? "text-blue-600" : "text-primary"}`}
              >
                {section.title}
              </Text>
            </View>
            <View
              className={`rounded-sm p-6 shadow-sm border ${
                section.highlight
                  ? "bg-primary border-primary"
                  : section.isAppOnly
                    ? "bg-blue-50 border-blue-100"
                    : "bg-white border-gray-100"
              }`}
            >
              <Text
                className={`font-[Cairo_400Regular] leading-7 text-base ${
                  section.highlight
                    ? "text-white"
                    : section.isAppOnly
                      ? "text-blue-900"
                      : "text-gray-600"
                }`}
              >
                {section.content}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
