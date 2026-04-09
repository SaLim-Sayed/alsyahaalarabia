import React, { useState } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Search as SearchIcon, X, ArrowRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { ArticleCard } from '@/components/ArticleCard';
import { useSearchPosts } from '@/hooks/usePosts';

export default function SearchScreen() {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const router = useRouter();

  const { data: results, isLoading, isError } = useSearchPosts(query);

  return (
    <View className="flex-1 bg-white">
      <View className="pt-16 px-6 pb-6 border-b border-gray-100 flex-row items-center">
        <TouchableOpacity 
          onPress={() => router.back()}
          className="mr-4 p-2"
        >
          <ArrowRight size={24} color="#14532d" />
        </TouchableOpacity>
        
        <View className="flex-1 bg-gray-100 rounded-2xl flex-row items-center px-4 py-2">
          <SearchIcon size={20} color="#9ca3af" />
          <TextInput
            placeholder={t('search.placeholder')}
            className="flex-1 ml-3 h-10 text-right font-[Cairo_400Regular] text-gray-900"
            value={query}
            onChangeText={setQuery}
            autoFocus
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <X size={20} color="#9ca3af" />
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
