import { useRouter } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  Dimensions,
  Image,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
  SparklesIcon,
  TrophyIcon,
} from "react-native-heroicons/outline";

const { width } = Dimensions.get("window");

export default function AboutScreen() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const router = useRouter();

  const achievements = [
    {
      title: t("about.achievements.oscarsTitle"),
      desc: t("about.achievements.oscarsDesc"),
      icon: TrophyIcon,
    },
    {
      title: t("about.achievements.licensedTitle"),
      desc: t("about.achievements.licensedDesc"),
      icon: ShieldCheckIcon,
    },
    {
      title: t("about.achievements.leadershipTitle"),
      desc: t("about.achievements.leadershipDesc"),
      icon: SparklesIcon,
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
        <Text className="text-white text-3xl font-[Cairo_700Bold]">
          {t("settings.about")}
        </Text>
        <Text className="text-accent text-sm font-[Cairo_400Regular] mt-2">
          {t("about.gatewaySubtitle")}
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-6 pt-8"
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          onPress={() => Linking.openURL("https://alsyahaalarabia.com/about")}
        >
          <Text className="text-accent/60 text-[10px] font-[Cairo_400Regular] mb-6 text-center underline">
            {t("privacy.source")}: https://alsyahaalarabia.com/about
          </Text>
        </TouchableOpacity>
        {/* Content Card */}
        <View className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 mb-8">
          <Text className="text-gray-800 font-[Cairo_700Bold] text-2xl mb-6">
            {t("about.visionTitle")}
          </Text>
          <Text className="text-gray-500 font-[Cairo_400Regular] leading-7 text-base">
            {t("about.visionContent")}
          </Text>
        </View>

        {/* Achievements Section */}
        <Text className="text-primary font-[Cairo_700Bold] text-xl mb-6 px-2">
          {t("about.whyTitle")}
        </Text>

        {achievements.map((item, index) => (
          <View
            key={index}
            className="flex-row items-center bg-white p-6 rounded-[28px] mb-4 shadow-sm border border-gray-100"
          >
            <View className="w-12 h-12 rounded-2xl bg-accent/10 items-center justify-center me-4">
              <item.icon size={26} color="#fbbf24" strokeWidth={1.5} />
            </View>
            <View className="flex-1">
              <Text className="text-gray-800 font-[Cairo_700Bold] text-base mb-1">
                {item.title}
              </Text>
              <Text className="text-gray-400 font-[Cairo_400Regular] text-xs leading-5">
                {item.desc}
              </Text>
            </View>
          </View>
        ))}

        <View className="py-12 items-center">
          <Image
            source={require("@/assets/images/Al-Syaha-Updated-2.png")}
            style={{ width: 150, height: 40, opacity: 0.3 }}
            resizeMode="contain"
          />
          <Text className="text-gray-300 font-[Cairo_400Regular] text-[10px] mt-4">
            Version 1.0.2 • Saudi Arabia
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
