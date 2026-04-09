import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Search, Globe } from 'lucide-react-native';
import { Link } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';

export const AppHeader = () => {
  const { t, i18n } = useTranslation();
  const { setLanguage } = useAppStore();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    setLanguage(newLang);
  };

  return (
    <SafeAreaView className="bg-white border-b border-gray-100">
      <View className="px-6 py-4 flex-row items-center justify-between">
        <TouchableOpacity 
          onPress={toggleLanguage}
          className="flex-row items-center bg-gray-100 px-3 py-1.5 rounded-full"
        >
          <Globe size={16} color="#14532d" />
          <Text className="ml-2 font-[Cairo_700Bold] text-primary uppercase text-xs">
            {i18n.language === 'en' ? 'AR' : 'EN'}
          </Text>
        </TouchableOpacity>

        <View className="items-center">
          <Text className="text-xl font-[Cairo_700Bold] text-primary">
            {t('common.magazineName')}
          </Text>
          <Text className="text-[10px] font-[Cairo_400Regular] text-gray-500 uppercase tracking-widest">
            {t('common.magazineSub')}
          </Text>
        </View>

        <View className="flex-row">
          <Link href="/search" asChild>
            <TouchableOpacity className="p-2">
              <Search size={24} color="#14532d" />
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
};
