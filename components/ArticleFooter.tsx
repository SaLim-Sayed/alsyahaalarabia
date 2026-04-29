import { FontAwesome } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { Image, Linking, Text, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export const ArticleFooter = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const socialLinks = [
    {
      name: "instagram",
      icon: "instagram",
      url: "https://www.instagram.com/alsyahaalarabia/",
    },
    {
      name: "tiktok",
      icon: "music",
      url: "https://www.tiktok.com/@user2936811969632",
    },
    {
      name: "twitter",
      icon: "twitter",
      url: "https://twitter.com/alsyahaalarabia",
    },
    {
      name: "youtube",
      icon: "youtube-play",
      url: "https://youtube.com/channel/UC86ZrmgUQseKpQTInuAPx7Q",
    },
  ];

  return (
    <View className="bg-primary pt-16 pb-0 -mt-10">
      <View className="items-center px-8">
        {/* Logo Section */}
        <Image
          source={require("@/assets/images/Al-Syaha-Updated-2.png")}
          style={{ width: 280, height: 80 }}
          resizeMode="contain"
          className="mb-8"
        />

        {/* Navigation Links */}
        <View className="flex-row items-center justify-center mb-8">
          <Link href="/settings/about" asChild>
            <TouchableOpacity>
              <Text className="text-white font-[Cairo_700Bold] text-xs px-3">
                {t("settings.about")}
              </Text>
            </TouchableOpacity>
          </Link>
          <View className="w-[1px] h-3 bg-white/20" />
          <Link href="/settings/contact" asChild>
            <TouchableOpacity>
              <Text className="text-white font-[Cairo_700Bold] text-xs px-3">
                {t("settings.contact")}
              </Text>
            </TouchableOpacity>
          </Link>
          <View className="w-[1px] h-3 bg-white/20" />
          <Link href="/settings/privacy" asChild>
            <TouchableOpacity>
              <Text className="text-white font-[Cairo_700Bold] text-xs px-3">
                {t("settings.privacy")}
              </Text>
            </TouchableOpacity>
          </Link>
        </View>

        {/* Description */}
        <Text className="text-white/80 font-[Cairo_400Regular] text-xs text-center mb-6 leading-6">
          {isRTL 
            ? "مجلة سعودية متخصصة في مجال السياحة والترفيه"
            : "A Saudi magazine specialized in tourism and entertainment"}
        </Text>

        {/* License Info */}
        <View className="items-center mb-10">
          <Text className="text-white/40 font-[Cairo_400Regular] text-[10px] mb-2">
            {isRTL ? "ترخيص إعلامي سعودي رقم: 160495" : "Saudi Media License: 160495"}
          </Text>
          <Text className="text-white/40 font-[Cairo_400Regular] text-[10px]">
            {isRTL ? "ترخيص إعلامي من لندن رقم: 16321584" : "London Media License: 16321584"}
          </Text>
        </View>

        {/* Social Icons */}
        <View className="flex-row mb-12">
          {socialLinks.map((social) => (
            <TouchableOpacity
              key={social.name}
              onPress={() => Linking.openURL(social.url)}
              className="w-11 h-11 rounded-full bg-white/10 items-center justify-center mx-2 border border-white/5"
            >
              <FontAwesome name={social.icon as any} size={18} color="white" />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Bottom Bar with Copyright */}
      <View className="bg-black pt-1">
        <LinearGradient
          colors={["#ca8a04", "#fbbf24", "#ca8a04"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ height: 2, width: "100%" }}
        />
        <View className="py-6 px-8 items-center bg-black/95">
          <Text className="text-white/90 font-[Cairo_700Bold] text-[13px] mb-2">
            {isRTL ? "© 2026 د. آرو الرقمي" : "© 2026 D Arrow Digital"}
          </Text>
          <Text className="text-white/50 font-[Cairo_400Regular] text-[11px]">
            {isRTL ? "جميع الحقوق محفوظة." : "All rights reserved."}
          </Text>
        </View>
      </View>
    </View>
  );
};
