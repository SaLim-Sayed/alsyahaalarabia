import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground } from 'react-native';
import { useTranslation } from 'react-i18next';

export const CulturalPulse = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <View className="mx-6 mb-20 rounded-[40px] overflow-hidden bg-primary h-[500px] shadow-2xl">
      <View className="flex-1 p-8 items-center justify-center">
        {/* Placeholder for Calligraphy Logo */}
        <View className="w-48 h-48 rounded-full border border-accent/30 items-center justify-center mb-8">
           <Text className="text-accent text-6xl font-[Cairo_700Bold]">ف</Text>
        </View>

        <Text className="text-accent text-2xl font-[Cairo_700Bold] mb-4 text-center">
          {isRTL ? 'نبض الثقافة العربية' : 'Pulse of Arabic Culture'}
        </Text>

        <Text className="text-gray-300 text-center font-[Cairo_400Regular] leading-7 mb-10">
          {isRTL 
            ? 'الثقافة ليست مجرد وجهات، بل هي الروح التي تسكن كل زاوية. غص في أعماق الفن، الخط العربي، والتقاليد التي توارثتها الأجيال لآلاف السنين.' 
            : 'Culture is not just destinations, but the soul that inhabits every corner. Dive into the depths of art, calligraphy, and traditions passed down for millennia.'}
        </Text>

        <TouchableOpacity className="border border-accent px-10 py-3 rounded-2xl">
          <Text className="text-accent font-[Cairo_700Bold] text-base">
            {isRTL ? 'اكتشف التراث' : 'Discover Heritage'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
