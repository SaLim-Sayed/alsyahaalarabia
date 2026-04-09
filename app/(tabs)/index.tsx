import { ScrollView, View, Text, ActivityIndicator, RefreshControl } from 'react-native';
import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { AppHeader } from '@/components/AppHeader';
import { CategoryChip } from '@/components/CategoryChip';
import { ArticleCard } from '@/components/ArticleCard';
import { SectionHeader } from '@/components/SectionHeader';
import { usePostsByCategory } from '@/hooks/usePosts';
import { useAppCategories } from '@/hooks/useCategories';

export default function HomeScreen() {
  const { t } = useTranslation();
  const [selectedCategoryId, setSelectedCategoryId] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  const { 
    data: categoriesData, 
  } = useAppCategories();

  const { 
    data: articles, 
    isLoading: isLoadingArticles, 
    isError, 
    refetch,
    isRefetching
  } = usePostsByCategory(selectedCategoryId === 'all' ? null : selectedCategoryId, 15);

  const categories = useMemo(() => {
    const base = [{ id: 'all', name: t('common.all') }];
    if (categoriesData) {
      return [...base, ...categoriesData];
    }
    return base;
  }, [categoriesData, t]);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  if (isLoadingArticles && !isRefetching && !refreshing) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#14532d" />
        <Text className="mt-4 text-gray-500 font-cairo">{t('home.loadingNews')}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <AppHeader />
      
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing || isRefetching} onRefresh={onRefresh} tintColor="#14532d" />
        }
      >
        <CategoryChip 
          categories={categories} 
          selectedId={selectedCategoryId} 
          onSelect={setSelectedCategoryId} 
        />

        {articles && articles.length > 0 && (
          <>
            <View className="px-6 mb-6">
              <ArticleCard article={articles[0]} variant="hero" />
            </View>

            <SectionHeader title={t('common.latestNews')} />
            
            <View className="px-6 pb-20">
              {articles.slice(1).map((article) => (
                <ArticleCard key={article.id} article={article} variant="list" />
              ))}
            </View>
          </>
        )}

        {isError && (
          <View className="px-10 py-20 items-center">
            <Text className="text-red-500 font-cairo text-center">
              {t('common.error')}... {t('common.retry')}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
