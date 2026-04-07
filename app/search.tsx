import React, { useState } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity } from 'react-native';
import { Search as SearchIcon, X, ArrowRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { ARTICLES } from '@/constants/MockData';
import { ArticleCard } from '@/components/ArticleCard';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const results = query 
    ? ARTICLES.filter(a => 
        a.title.includes(query) || 
        a.excerpt.includes(query) || 
        a.category.includes(query)
      )
    : [];

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
            placeholder="ابحث عن وجهتك القادمة..."
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

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 24 }}
        renderItem={({ item }) => <ArticleCard article={item} variant="list" />}
        ListEmptyComponent={
          <View className="items-center justify-center pt-20">
            <Text className="text-gray-400 font-[Cairo_400Regular]">
              {query ? 'لا توجد نتائج تطابق بحثك' : 'ابدأ البحث الآن'}
            </Text>
          </View>
        }
      />
    </View>
  );
}
