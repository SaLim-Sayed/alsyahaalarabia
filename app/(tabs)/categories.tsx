import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { AppHeader } from '@/components/AppHeader';
import { useAppCategories } from '@/hooks/useCategories';
import { router } from 'expo-router';

export default function CategoriesScreen() {
  const { t } = useTranslation();
  const { data: categories, isLoading, isError } = useAppCategories();

  if (isLoading) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#14532d" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <AppHeader />
      <ScrollView className="flex-1 px-6 pt-6">
        <Text className="text-2xl font-[Cairo_700Bold] text-gray-900 mb-6 text-right">
          {t('common.categories')}
        </Text>
        
        <View className="flex-row flex-wrap justify-between">
          {categories?.map((cat) => (
            <TouchableOpacity 
              key={cat.id}
              className="w-[48%] bg-gray-50 rounded-3xl p-6 mb-4 items-center justify-center border border-gray-100"
              onPress={() => {
                router.push({ 
                  pathname: '/category/[id]', 
                  params: { id: cat.id, name: cat.name } 
                });
              }}
            >
              <View className="bg-primary/10 p-4 rounded-2xl mb-4">
                <Text className="text-2xl">📁</Text> 
              </View>
              <Text className="text-base font-[Cairo_700Bold] text-gray-800 text-center" numberOfLines={1}>
                {cat.name}
              </Text>
              <Text className="text-xs font-cairo text-gray-400 mt-1">
                {t('categories.articlesCount', { count: cat.count })}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {isError && (
          <View className="py-20 items-center">
            <Text className="text-red-500 font-cairo text-center">
              {t('categories.loadError')}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
