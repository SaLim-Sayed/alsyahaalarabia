import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { MagnifyingGlassIcon, Bars3BottomRightIcon } from 'react-native-heroicons/outline';
import { useRouter } from 'expo-router';

export const AppHeader = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const router = useRouter();

  return (
    <View className="bg-primary pt-14 pb-4 px-6 shadow-sm border-b border-white/5">
      <View className="flex-row items-center justify-between">
        <TouchableOpacity 
          onPress={() => router.push('/search')}
          className="w-10 h-10 items-center justify-center rounded-full bg-white/10"
        >
          <MagnifyingGlassIcon size={22} color="white" />
        </TouchableOpacity>

        <View className="items-center">
          <Text className="text-white text-2xl font-[Cairo_700Bold]">
            {t('common.magazineName')}
          </Text>
          <Text className="text-accent text-[10px] font-[Cairo_400Regular] tracking-[3px] uppercase -mt-1 opacity-80">
            {t('common.magazineSub')}
          </Text>
        </View>

        <TouchableOpacity className="w-10 h-10 items-center justify-center rounded-full bg-white/10">
          <Bars3BottomRightIcon size={22} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
