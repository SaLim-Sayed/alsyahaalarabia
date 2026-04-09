import React from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Bookmark, Share2, Clock, User } from 'lucide-react-native';
import { useAppStore } from '../store/useAppStore';
import { Link } from 'expo-router';

const { width } = Dimensions.get('window');

import { useTranslation } from 'react-i18next';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
  author?: string;
}

interface ArticleCardProps {
  article: Article;
  variant?: 'hero' | 'list';
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, variant = 'list' }) => {
  const { i18n } = useTranslation();
  const { toggleSaveArticle, isArticleSaved } = useAppStore();
  const isSaved = isArticleSaved(article.id);
  const isRTL = i18n.language === 'ar';

  if (variant === 'hero') {
    return (
      <Link href={`/article/${article.id}`} asChild>
        <TouchableOpacity className="mb-6 rounded-3xl overflow-hidden bg-white shadow-xl">
          <Image 
            source={{ uri: article.image }} 
            className="h-64 w-full"
            resizeMode="cover"
          />
          <View className="p-5">
            <View className={`flex-row items-center mb-2 ${isRTL ? '' : 'flex-row-reverse'}`}>
              <View className="bg-accent/10 px-3 py-1 rounded-full">
                <Text className="text-accent text-[12px] font-[Cairo_700Bold]">
                  {article.category}
                </Text>
              </View>
              <View className={`flex-row items-center mx-3 ${isRTL ? '' : 'flex-row-reverse'}`}>
                <Clock size={12} color="#9ca3af" />
                <Text className={`text-gray-400 text-[12px] ${isRTL ? 'mr-1' : 'ml-1'}`}>{article.date}</Text>
              </View>
            </View>
            <Text className={`text-xl font-[Cairo_700Bold] text-gray-900 leading-8 ${isRTL ? 'text-right' : 'text-left'}`}>
              {article.title}
            </Text>
          </View>
        </TouchableOpacity>
      </Link>
    );
  }

  return (
    <Link href={`/article/${article.id}`} asChild>
      <TouchableOpacity className={`flex-row mb-5 bg-white rounded-2xl overflow-hidden border border-gray-100 p-3 shadow-sm ${isRTL ? '' : 'flex-row-reverse'}`}>
        <Image 
          source={{ uri: article.image }} 
          className="w-28 h-28 rounded-xl"
          resizeMode="cover"
        />
        <View className="flex-1 px-4 justify-between py-1">
          <View>
            <Text className={`text-accent text-[12px] font-[Cairo_700Bold] mb-1 ${isRTL ? 'text-right' : 'text-left'}`}>
              {article.category}
            </Text>
            <Text 
              className={`text-base font-[Cairo_700Bold] text-gray-900 leading-6 ${isRTL ? 'text-right' : 'text-left'}`}
              numberOfLines={2}
            >
              {article.title}
            </Text>
          </View>
          <View className={`flex-row items-center ${isRTL ? 'justify-end' : 'justify-start'}`}>
            <Text className="text-[11px] text-gray-400 font-[Cairo_400Regular]">
              {article.date}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
};
