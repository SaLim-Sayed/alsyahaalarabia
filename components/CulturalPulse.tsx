import React from "react";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";

export const CulturalPulse = () => {
  const { t } = useTranslation();
  return (
    <View className="mx-6 mb-20 rounded-[40px] overflow-hidden bg-primary h-[500px] shadow-2xl">
      <View className="flex-1 p-8 items-center justify-center">
        {/* Placeholder for Calligraphy Logo */}
        <View className="w-48 h-48 rounded-full border border-accent/30 items-center justify-center mb-8">
          <Text className="text-accent text-6xl font-[Cairo_700Bold]">ف</Text>
        </View>

        <Text className="text-accent text-2xl font-[Cairo_700Bold] mb-4 text-center">
          {t("cultural.title")}
        </Text>

        <Text className="text-gray-300 text-center font-[Cairo_400Regular] leading-7 mb-10">
          {t("cultural.description")}
        </Text>

        <TouchableOpacity className="border border-accent px-10 py-3 rounded-2xl">
          <Text className="text-accent font-[Cairo_700Bold] text-base">
            {t("cultural.button")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
