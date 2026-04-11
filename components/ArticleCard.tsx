import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { ClockIcon } from 'react-native-heroicons/outline';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import { useTranslation } from 'react-i18next';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
}

interface ArticleCardProps {
  article: Article;
  variant?: 'hero' | 'list' | 'trending' | 'compact';
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, variant = 'list' }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  if (variant === 'compact') {
    return (
      <Link href={`/article/${article.id}`} asChild>
        <TouchableOpacity className="mb-8 w-full">
          <Image 
            source={{ uri: article.image }} 
            className="h-48 w-full rounded-[24px] mb-4"
            resizeMode="cover"
          />
          <View className={`${isRTL ? 'items-end' : 'items-start'}`}>
            <Text className="text-accent text-[11px] font-[Cairo_700Bold] mb-1">
              {article.category}
            </Text>
            <Text 
              className={`text-lg font-[Cairo_700Bold] text-gray-800 leading-7 ${isRTL ? 'text-right' : 'text-left'}`}
              numberOfLines={2}
            >
              {article.title}
            </Text>
          </View>
        </TouchableOpacity>
      </Link>
    );
  }

  if (variant === 'hero') {
    return (
      <Link href={`/article/${article.id}`} asChild>
        <TouchableOpacity className="mb-6 rounded-[32px] overflow-hidden bg-white shadow-lg h-[450px]">
          <Image 
            source={{ uri: article.image }} 
            className="absolute inset-0 w-full h-full"
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            className="absolute inset-0 px-6 pb-8 justify-end"
          >
            <View className={`bg-accent/90 self-start px-4 py-1.5 rounded-xl mb-4 ${isRTL ? 'ml-auto' : ''}`}>
              <Text className="text-white text-[12px] font-[Cairo_700Bold]">
                {article.category}
              </Text>
            </View>
            
            <Text 
              className={`text-2xl font-[Cairo_700Bold] text-white leading-[38px] mb-4 ${isRTL ? 'text-right' : 'text-left'}`}
              numberOfLines={3}
            >
              {article.title}
            </Text>

            <Text 
              className={`text-gray-300 text-[14px] font-[Cairo_400Regular] mb-6 leading-6 ${isRTL ? 'text-right' : 'text-left'}`}
              numberOfLines={2}
            >
              {article.excerpt || "اكتشف أسرار الحضارات القديمة في قلب الصحراء العربية، حيث تلتقي الفخامة بالتاريخ في تجربة لا تنسى."}
            </Text>

            <View className={`flex-row ${isRTL ? 'justify-end' : 'justify-start'}`}>
              <TouchableOpacity className="bg-accent px-8 py-3 rounded-2xl shadow-lg flex-row items-center">
                <Text className="text-primary font-[Cairo_700Bold] text-base mr-2">
                  {t('article.readMore') || 'اقرأ المزيد'}
                </Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Link>
    );
  }

  if (variant === 'trending') {
    return (
      <Link href={`/article/${article.id}`} asChild>
        <TouchableOpacity className="mb-6 rounded-3xl overflow-hidden bg-white shadow-md">
          <Image 
            source={{ uri: article.image }} 
            className="h-64 w-full"
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            className="absolute inset-0 p-5 justify-end"
          >
             <Text 
              className={`text-lg font-[Cairo_700Bold] text-white ${isRTL ? 'text-right' : 'text-left'}`}
              numberOfLines={2}
            >
              {article.title}
            </Text>
            <View className={`flex-row items-center mt-2 ${isRTL ? 'justify-end' : 'justify-start'}`}>
               <ClockIcon size={12} color="#fbbf24" />
               <Text className="text-accent text-[11px] font-[Cairo_400Regular] mx-1">
                 {article.date}
               </Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Link>
    );
  }

  return (
    <Link href={`/article/${article.id}`} asChild>
      <TouchableOpacity 
        className={`flex-row mb-4 bg-white rounded-3xl overflow-hidden p-3 shadow-sm border border-secondary/50 ${isRTL ? '' : 'flex-row-reverse'}`}
      >
        <Image 
          source={{ uri: article.image }} 
          className="w-24 h-24 rounded-2xl"
          resizeMode="cover"
        />
        <View className="flex-1 px-4 justify-center">
          <Text 
            className={`text-base font-[Cairo_700Bold] text-gray-800 leading-6 mb-1 ${isRTL ? 'text-right' : 'text-left'}`}
            numberOfLines={2}
          >
            {article.title}
          </Text>
          <View className={`flex-row items-center ${isRTL ? 'justify-end' : 'justify-start'}`}>
            <Text className="text-[11px] text-gray-400 font-[Cairo_400Regular]">
              {article.date}
            </Text>
            <View className="mx-2 w-1 h-1 bg-gray-200 rounded-full" />
            <Text className="text-[11px] text-accent font-[Cairo_700Bold]">
              {article.category}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
};
