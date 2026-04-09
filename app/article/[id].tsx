import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Share, ActivityIndicator, useWindowDimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Bookmark, Share2, User, ArrowRight } from 'lucide-react-native';
import { useAppStore } from '@/store/useAppStore';
import { usePostDetail } from '@/hooks/usePosts';
import RenderHtml from 'react-native-render-html';

export default function ArticleDetailScreen() {
  const { t, i18n } = useTranslation();
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { toggleSaveArticle, isArticleSaved } = useAppStore();
  
  const { data: article, isLoading, isError } = usePostDetail(id as string);

  if (isLoading) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#14532d" />
      </View>
    );
  }

  if (isError || !article) {
    return (
      <View className="flex-1 bg-white justify-center items-center px-10">
        <Text className="text-red-500 font-cairo text-center mb-6">{t('article.loadError')}</Text>
        <TouchableOpacity onPress={() => router.back()} className="bg-primary px-6 py-3 rounded-xl">
          <Text className="text-white font-cairo">{t('common.goBack')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isSaved = isArticleSaved(article.id);
  const isRTL = i18n.language === 'ar';

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${article.title}\n\n${t('article.shareMessage')}\n${article.link || ''}`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const tagsStyles = {
    p: {
      textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left',
      fontFamily: 'Cairo_400Regular',
      fontSize: 18,
      lineHeight: 32,
      color: '#374151',
      marginBottom: 20,
    },
    h2: {
      textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left',
      fontFamily: 'Cairo_700Bold',
      fontSize: 22,
      color: '#111827',
      marginTop: 24,
      marginBottom: 12,
    },
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <View className="relative">
          <Image 
            source={{ uri: article.image }} 
            className="w-full h-[45vh]"
            resizeMode="cover"
          />
          <View className={`absolute top-12 left-6 right-6 flex-row items-center justify-between ${isRTL ? '' : 'flex-row-reverse'}`}>
            <TouchableOpacity 
              onPress={() => router.back()}
              className="bg-black/30 p-3 rounded-full"
            >
              <ArrowRight size={24} color="white" style={{ transform: [{ scaleX: isRTL ? 1 : -1 }] }} />
            </TouchableOpacity>
            
            <View className={`flex-row ${isRTL ? '' : 'flex-row-reverse'}`}>
              <TouchableOpacity 
                onPress={handleShare}
                className="bg-black/30 p-3 rounded-full mx-1.5"
              >
                <Share2 size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => toggleSaveArticle(article)}
                className="bg-black/30 p-3 rounded-full mx-1.5"
              >
                <Bookmark size={24} color={isSaved ? "#ca8a04" : "white"} fill={isSaved ? "#ca8a04" : "transparent"} />
              </TouchableOpacity>
            </View>
          </View>
          
          <View className={`absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/80 to-transparent p-8 justify-end ${isRTL ? '' : 'items-start'}`}>
            <View className={`bg-accent px-3 py-1 rounded-lg mb-4 ${isRTL ? 'self-end' : 'self-start'}`}>
              <Text className="text-white text-xs font-[Cairo_700Bold]">
                {article.category}
              </Text>
            </View>
          </View>
        </View>

        <View className="px-8 py-10">
          <Text className={`text-3xl font-[Cairo_700Bold] text-gray-900 leading-[45px] mb-8 ${isRTL ? 'text-right' : 'text-left'}`}>
            {article.title}
          </Text>

          <View className={`flex-row items-center justify-end mb-10 border-b border-gray-100 pb-8 ${isRTL ? '' : 'flex-row-reverse'}`}>
             <View className={`items-end mx-4 ${isRTL ? 'items-end' : 'items-start'}`}>
              <Text className="text-gray-900 font-[Cairo_700Bold]">{article.author || t('article.editor')}</Text>
              <Text className="text-gray-400 text-xs font-[Cairo_400Regular]">{article.date}</Text>
            </View>
            <View className="bg-gray-100 p-3 rounded-full">
              <User size={24} color="#14532d" />
            </View>
          </View>

          <View className={isRTL ? 'items-end' : 'items-start'}>
            <RenderHtml
              contentWidth={width - 64}
              source={{ html: article.content || '' }}
              tagsStyles={tagsStyles}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
