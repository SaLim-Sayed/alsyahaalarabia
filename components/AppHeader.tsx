import { useRouter } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { Image, TouchableOpacity, View } from "react-native";
import {
  Bars3BottomRightIcon,
  MagnifyingGlassIcon,
} from "react-native-heroicons/outline";

export const AppHeader = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const router = useRouter();

  return (
    <View className="bg-primary pt-14 pb-4 px-6 shadow-sm border-b border-white/5">
      <View className={`flex-row items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
        <TouchableOpacity
          onPress={() => router.push("/search")}
          className="w-10 h-10 items-center justify-center rounded-full bg-white/10"
        >
          <MagnifyingGlassIcon size={22} color="white" />
        </TouchableOpacity>

        <View className="items-center">
          <Image
            source={require("@/assets/images/Al-Syaha-Updated-2.png")}
            style={{ width: 180, height: 45 }}
            resizeMode="contain"
          />
        </View>

        <TouchableOpacity
          onPress={() => router.push("/settings")}
          className="w-10 h-10 items-center justify-center rounded-full bg-white/10"
        >
          <Bars3BottomRightIcon size={22} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
