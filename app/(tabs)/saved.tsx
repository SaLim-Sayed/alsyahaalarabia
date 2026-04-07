import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { AppHeader } from '@/components/AppHeader';
import { ArticleCard } from '@/components/ArticleCard';
import { useAppStore } from '@/store/useAppStore';
import { Bookmark } from 'lucide-react-native';

export default function SavedScreen() {
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
            <Text className="text-2xl font-[Cairo_700Bold] text-gray-900 mb-6 text-right">
              المقالات المحفوظة
            </Text>
          }
        />
      ) : (
        <View className="flex-1 items-center justify-center px-10">
          <View className="bg-gray-50 p-10 rounded-full mb-6">
            <Bookmark size={48} color="#9ca3af" />
          </View>
          <Text className="text-xl font-[Cairo_700Bold] text-gray-900 mb-2 text-center">
            لا توجد مقالات محفوظة
          </Text>
          <Text className="text-gray-500 font-[Cairo_400Regular] text-center">
            ابدأ بحفظ مقالاتك المفضلة للرجوع إليها لاحقاً بسهولة.
          </Text>
        </View>
      )}
    </View>
  );
}
