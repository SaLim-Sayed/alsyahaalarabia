import { View, Text, Image, ScrollView, TouchableOpacity, Share, ActivityIndicator, useWindowDimensions, StatusBar } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { BookmarkIcon, ShareIcon, ArrowLeftIcon, ArrowRightIcon, ClockIcon, UserIcon } from 'react-native-heroicons/outline';
import { BookmarkIcon as BookmarkSolid } from 'react-native-heroicons/solid';
import { useAppStore } from '@/store/useAppStore';
import { usePostDetail, usePostsByCategory } from '@/hooks/usePosts';
import RenderHtml from 'react-native-render-html';
import { LinearGradient } from 'expo-linear-gradient';
import { AuthorBio } from '@/components/AuthorBio';
import { ArticleFooter } from '@/components/ArticleFooter';
import { ArticleCard } from '@/components/ArticleCard';

export default function ArticleDetailScreen() {
  const { t, i18n } = useTranslation();
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { toggleSaveArticle, isArticleSaved } = useAppStore();
  
  const { data: article, isLoading, isError } = usePostDetail(id as string);
  
  // Fetch related articles from same category
  const { data: relatedArticles } = usePostsByCategory(article?.categoryId || null, 4);

  if (isLoading) {
    return (
      <View className="flex-1 bg-primary justify-center items-center">
        <ActivityIndicator size="large" color="#fbbf24" />
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
    body: {
      textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left',
      fontFamily: 'Cairo_400Regular',
      fontSize: 17,
      lineHeight: 30,
      color: '#4b5563',
    },
    p: {
      marginBottom: 20,
    },
    h2: {
      textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left',
      fontFamily: 'Cairo_700Bold',
      fontSize: 22,
      color: '#1a3c34',
      marginTop: 32,
      marginBottom: 16,
      borderRightWidth: isRTL ? 4 : 0,
      borderLeftWidth: isRTL ? 0 : 4,
      borderColor: '#fbbf24',
      paddingHorizontal: 12,
    },
    blockquote: {
      backgroundColor: '#f8fdfc',
      borderRightWidth: isRTL ? 4 : 0,
      borderLeftWidth: isRTL ? 0 : 4,
      borderColor: '#fbbf24',
      paddingVertical: 16,
      paddingHorizontal: 20,
      marginVertical: 24,
      fontStyle: 'italic' as const,
    }
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Hero Section */}
        <View className="h-[60vh] relative">
          <Image 
            source={{ uri: article.image }} 
            className="absolute inset-0 w-full h-full"
            resizeMode="cover"
          />
          <LinearGradient
            colors={['rgba(0,0,0,0.6)', 'transparent', 'rgba(0,0,0,0.8)']}
            className="absolute inset-0 px-8 pb-20 justify-end"
          >
             {/* Header Buttons */}
            <View className="absolute top-14 left-6 right-6 flex-row items-center justify-between">
              <TouchableOpacity 
                onPress={() => router.back()}
                className="bg-black/30 w-12 h-12 rounded-full items-center justify-center backdrop-blur-md"
              >
                {isRTL ? <ArrowRightIcon size={22} color="white" /> : <ArrowLeftIcon size={22} color="white" />}
              </TouchableOpacity>
              
              <View className="flex-row">
                <TouchableOpacity 
                  onPress={handleShare}
                  className="bg-black/30 w-12 h-12 rounded-full items-center justify-center backdrop-blur-md mx-2"
                >
                  <ShareIcon size={20} color="white" />
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => toggleSaveArticle(article)}
                  className="bg-black/30 w-12 h-12 rounded-full items-center justify-center backdrop-blur-md"
                >
                  <BookmarkIcon size={20} color={isSaved ? "#fbbf24" : "white"} fill={isSaved ? "#fbbf24" : "transparent"} />
                </TouchableOpacity>
              </View>
            </View>

            <View className="flex-row mb-4">
               <View className="bg-accent px-3 py-1 rounded-lg mr-2">
                 <Text className="text-primary text-[10px] font-[Cairo_700Bold]">{article.category}</Text>
               </View>
               <View className="bg-white/20 px-3 py-1 rounded-lg backdrop-blur-md">
                 <Text className="text-white text-[10px] font-[Cairo_700Bold]">{isRTL ? 'مقال محرر' : 'Editorial'}</Text>
               </View>
            </View>

            <Text 
              className={`text-3xl font-[Cairo_700Bold] text-white leading-[48px] mb-6 text-start`}
              numberOfLines={3}
            >
              {article.title}
            </Text>

            <View className="flex-row items-center">
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop' }} 
                className="w-10 h-10 rounded-full border-2 border-accent"
              />
              <View className="mx-3 items-start">
                <Text className="text-white font-[Cairo_700Bold] text-sm">{article.author || t('article.editor')}</Text>
                <View className="flex-row items-center opacity-70">
                   <ClockIcon size={10} color="white" />
                   <Text className="text-white text-[10px] ml-1 font-[Cairo_400Regular]">{article.date}</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Content Section */}
        <View className="bg-white rounded-t-[40px] -mt-10 px-8 pt-12 pb-16">
          <View className="items-start">
            <RenderHtml
              contentWidth={width - 64}
              source={{ html: article.content || '' }}
              tagsStyles={tagsStyles}
            />
          </View>

          {/* Author Bio */}
          <AuthorBio name={article.author || t('article.editor')} />

          {/* Related Articles */}
          <View className="mt-8">
            <View className="flex-row items-center mb-8">
               <View className="w-1.5 h-6 bg-accent rounded-full mx-3" />
               <Text className="text-2xl font-[Cairo_700Bold] text-primary flex-1">
                 {t('article.relatedItems')}
               </Text>
               <TouchableOpacity>
                 <Text className="text-accent text-xs font-[Cairo_700Bold]">{t('article.seeMore')}</Text>
               </TouchableOpacity>
            </View>

            <View>
              {relatedArticles?.filter(a => a.id !== article.id).slice(0, 3).map((item) => (
                <ArticleCard key={item.id} article={item} variant="compact" />
              ))}
            </View>
          </View>
        </View>

        {/* Footer */}
        <ArticleFooter />
      </ScrollView>
    </View>
  );
}
