import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { useTranslation } from "react-i18next";
import { Linking, Text, TouchableOpacity, View } from "react-native";

export const ArticleFooter = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const socialLinks = [
    {
      name: "instagram",
      icon: "instagram",
      color: "white",
      url: "https://www.instagram.com/alsyahaalarabia/",
    },
    {
      name: "tiktok",
      icon: "music",
      color: "white",
      url: "https://www.tiktok.com/@user2936811969632",
    },
    {
      name: "twitter",
      icon: "twitter",
      color: "white",
      url: "https://twitter.com/alsyahaalarabia",
    },
    {
      name: "youtube",
      icon: "youtube-play",
      color: "white",
      url: "https://youtube.com/channel/UC86ZrmgUQseKpQTInuAPx7Q",
    },
  ];

  return (
    <View className="bg-primary px-8 pt-16 pb-20 rounded-t-[48px] -mt-10">
      <View className="items-center">
        <Text className="text-white text-3xl font-[Cairo_700Bold]">
          {t("common.magazineName")}
        </Text>

        <View className="flex-row my-8">
          {socialLinks.map((social) => (
            <TouchableOpacity
              key={social.name}
              onPress={() => Linking.openURL(social.url)}
              className="w-12 h-12 rounded-full bg-white/10 items-center justify-center mx-2"
            >
              <FontAwesome name={social.icon as any} size={20} color="white" />
            </TouchableOpacity>
          ))}
        </View>

        <View className="w-full h-[1px] bg-white/10 mb-8" />

        <Text className="text-white/40 font-[Cairo_400Regular] text-[10px] text-center">
          {t("common.copyright")}
        </Text>
      </View>
    </View>
  );
};
