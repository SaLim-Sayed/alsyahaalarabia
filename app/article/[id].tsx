import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Share, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronRight, Bookmark, Share2, Clock, User, ArrowRight } from 'lucide-react-native';
import { ARTICLES } from '@/constants/MockData';
import { useAppStore } from '@/store/useAppStore';

export default function ArticleDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { toggleSaveArticle, isArticleSaved } = useAppStore();
  
  const article = ARTICLES.find((a) => a.id === id);
  if (!article) return null;

  const isSaved = isArticleSaved(article.id);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${article.title}\n\nنقر المزيد في مجلة السياحة العربية`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <View className="relative">
          <Image 
            source={{ uri: article.image }} 
            className="w-full h-[50vh]"
            resizeMode="cover"
          />
          <View className="absolute top-12 left-6 right-6 flex-row items-center justify-between">
            <TouchableOpacity 
              onPress={() => router.back()}
              className="bg-white/20 p-3 rounded-full blur-xl"
            >
              <ArrowRight size={24} color="white" />
            </TouchableOpacity>
            
            <View className="flex-row">
              <TouchableOpacity 
                onPress={handleShare}
                className="bg-white/20 p-3 rounded-full mr-3"
              >
                <Share2 size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => toggleSaveArticle(article)}
                className="bg-white/20 p-3 rounded-full"
              >
                <Bookmark size={24} color={isSaved ? "#ca8a04" : "white"} fill={isSaved ? "#ca8a04" : "transparent"} />
              </TouchableOpacity>
            </View>
          </View>
          
          <View className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/80 to-transparent p-8 justify-end">
            <View className="bg-accent px-3 py-1 rounded-lg self-end mb-4">
              <Text className="text-white text-xs font-[Cairo_700Bold]">
                {article.category}
              </Text>
            </View>
          </View>
        </View>

        <View className="px-8 py-10">
          <Text className="text-3xl font-[Cairo_700Bold] text-gray-900 leading-[50px] mb-8 text-right">
            {article.title}
          </Text>

          <View className="flex-row items-center justify-end mb-10 border-b border-gray-100 pb-8">
             <View className="items-end mr-4">
              <Text className="text-gray-900 font-[Cairo_700Bold]">{article.author || 'المحرر'}</Text>
              <Text className="text-gray-400 text-xs font-[Cairo_400Regular]">{article.date}</Text>
            </View>
            <View className="bg-gray-100 p-3 rounded-full">
              <User size={24} color="#14532d" />
            </View>
          </View>

          <Text className="text-lg font-[Cairo_400Regular] text-gray-700 leading-10 text-right">
            {article.excerpt}
            {"\n\n"}
            تُعد السياحة في العالم العربي من أكثر القطاعات نمواً وتطوراً، حيث تجمع بين التاريخ العريق، الطبيعة الخلابة، والضيافة الأصيلة. وفي مجلة السياحة العربية، نسعى دائماً لتسليط الضوء على أفضل الوجهات والتجارب التي تجعل من رحلتكم مغامرة لا تُنسى.
            {"\n\n"}
            سواء كنت تبحث عن الهدوء في المنتجعات الفاخرة، أو المغامرة في قلب الصحراء، أو الاستكشاف في المدن التاريخية، فإننا نقدم لك الأدلة الشاملة والنصائح العملية لتخطيط رحلتك القادمة بكل ثقة ويسر.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
