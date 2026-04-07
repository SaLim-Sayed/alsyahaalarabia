import { ScrollView, View, Text } from 'react-native';
import React, { useState } from 'react';
import { AppHeader } from '@/components/AppHeader';
import { CategoryChip } from '@/components/CategoryChip';
import { ArticleCard } from '@/components/ArticleCard';
import { SectionHeader } from '@/components/SectionHeader';
import { CATEGORIES, ARTICLES } from '@/constants/MockData';

export default function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredArticles = selectedCategory === 'all' 
    ? ARTICLES 
    : ARTICLES.filter(a => a.category.includes(selectedCategory) || selectedCategory === 'all');

  return (
    <View className="flex-1 bg-white">
      <AppHeader />
      
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <CategoryChip 
          categories={CATEGORIES} 
          selectedId={selectedCategory} 
          onSelect={setSelectedCategory} 
        />

        <View className="px-6 mb-6">
          <ArticleCard article={ARTICLES[0]} variant="hero" />
        </View>

        <SectionHeader title="آخر الأخبار" />
        
        <View className="px-6 pb-20">
          {filteredArticles.map((article) => (
            <ArticleCard key={article.id} article={article} variant="list" />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
