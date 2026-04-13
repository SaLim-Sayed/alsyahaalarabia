import React, { useState } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { MagnifyingGlassIcon, XMarkIcon, ArrowRightIcon, ArrowLeftIcon } from 'react-native-heroicons/outline';
import { useRouter } from 'expo-router';
import { ArticleCard } from '@/components/ArticleCard';
import { useSearchPosts } from '@/hooks/usePosts';

export default function SearchScreen() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [query, setQuery] = useState('');
  const router = useRouter();

  const { data: results, isLoading, isError } = useSearchPosts(query);

  return (
    <View className="flex-1 bg-white">
      <View className="pt-16 px-6 pb-6 border-b border-gray-100 flex-row items-center">
        <TouchableOpacity 
          onPress={() => router.back()}
          className="me-2 p-2"
        >
          {isRTL ? <ArrowRightIcon size={24} color="#14532d" /> : <ArrowLeftIcon size={24} color="#14532d" />}
        </TouchableOpacity>
        
        <View className="flex-1 bg-gray-100 rounded-2xl flex-row items-center px-4 py-2">
          <MagnifyingGlassIcon size={20} color="#9ca3af" />
          <TextInput
            placeholder={t('search.placeholder')}
            className={`flex-1 ms-3 h-10 font-[Cairo_400Regular] text-gray-900 ${isRTL ? 'text-right' : 'text-left'}`}
            style={{ writingDirection: isRTL ? 'rtl' : 'ltr' }}
            value={query}
            onChangeText={setQuery}
            autoFocus
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <XMarkIcon size={20} color="#9ca3af" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#14532d" />
          <Text className="mt-4 text-gray-400 font-cairo">{t('search.searching')}</Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 24 }}
          renderItem={({ item }) => <ArticleCard article={item} variant="list" />}
          ListEmptyComponent={
            <View className="items-center justify-center pt-20">
              <Text className="text-gray-400 font-[Cairo_400Regular]">
                {query.length > 2 
                  ? t('search.noResults')
                  : query.length > 0 
                    ? t('search.minChars')
                    : t('search.startNow')}
              </Text>
            </View>
          }
        />
      )}

      {isError && (
        <View className="p-10 items-center">
          <Text className="text-red-500 font-cairo">{t('common.error')}</Text>
        </View>
      )}
    </View>
  );
}
