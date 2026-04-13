import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AppHeader } from '@/components/AppHeader';
import { ArticleCard } from '@/components/ArticleCard';
import { useAppStore } from '@/store/useAppStore';
import { BookmarkIcon } from 'react-native-heroicons/outline';

export default function SavedScreen() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { savedArticles } = useAppStore();

  return (
    <View className="flex-1 bg-white">
      <AppHeader />
      
      {savedArticles.length > 0 ? (
        <FlatList
          data={savedArticles}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 24 }}
          renderItem={({ item }) => (
            <ArticleCard article={item} variant="list" />
          )}
          ListHeaderComponent={
            <Text 
              className="text-2xl font-[Cairo_700Bold] text-gray-900 mb-6"
              style={{ textAlign: isRTL ? 'right' : 'left' }}
            >
              {t('saved.title')}
            </Text>
          }
        />
      ) : (
        <View className="flex-1 items-center justify-center px-10">
          <View className="bg-gray-50 p-10 rounded-full mb-6">
            <BookmarkIcon size={48} color="#9ca3af" />
          </View>
          <Text className="text-gray-500 font-[Cairo_400Regular] text-center">
            {t('saved.empty')}
          </Text>
        </View>
      )}
    </View>
  );
}
