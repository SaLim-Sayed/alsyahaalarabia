import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StatusBar } from 'react-native';
import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { usePostsByCategory } from '@/hooks/usePosts';
import { ArticleCard } from '@/components/ArticleCard';
import { ArrowLeftIcon, ArrowRightIcon } from 'react-native-heroicons/outline';

export default function CategoryDetailScreen() {
  const { id, name } = useLocalSearchParams();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const router = useRouter();

  const { data: articles, isLoading, isError, refetch, isRefetching } = usePostsByCategory(id as string, 20);

  return (
    <View className="flex-1 bg-secondary">
      <StatusBar barStyle="dark-content" />
      <View className="bg-primary pt-14 pb-6 px-6 rounded-b-[40px] shadow-lg">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity 
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center rounded-full bg-white/10"
          >
            {isRTL ? <ArrowRightIcon size={20} color="white" /> : <ArrowLeftIcon size={20} color="white" />}
          </TouchableOpacity>

          <View className="items-center flex-1 mx-4">
            <Text className="text-white text-xl font-[Cairo_700Bold]" numberOfLines={1}>
              {name || t('common.categories')}
            </Text>
            <View className="w-8 h-[2px] bg-accent mt-1" />
          </View>

          <View className="w-10" /> {/* Spacer */}
        </View>
      </View>

      {isLoading && !isRefetching ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#1a3c34" />
          <Text className="mt-4 text-primary/40 font-cairo">{t('search.searching')}</Text>
        </View>
      ) : (
        <FlatList
          data={articles}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
          renderItem={({ item }) => <ArticleCard article={item} variant="list" />}
          onRefresh={refetch}
          refreshing={isRefetching}
          ListEmptyComponent={
            <View className="items-center justify-center pt-20">
              <Text className="text-gray-400 font-[Cairo_400Regular]">
                {t('search.noResults')}
              </Text>
            </View>
          }
        />
      )}

      {isError && (
        <View className="p-10 items-center">
          <Text className="text-red-500 font-cairo">{t('common.error')}</Text>
          <TouchableOpacity onPress={() => refetch()} className="mt-4 bg-primary px-6 py-2 rounded-full">
            <Text className="text-white font-cairo">{t('common.retry')}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
