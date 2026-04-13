import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { ClockIcon } from "react-native-heroicons/outline";

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
  variant?: "hero" | "list" | "trending" | "compact";
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  variant = "list",
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  if (variant === "compact") {
    return (
      <Link href={`/article/${article.id}`} asChild>
        <TouchableOpacity className="mb-8 w-full">
          <Image
            source={{ uri: article.image }}
            className="h-48 w-full rounded-[24px] mb-4"
            resizeMode="cover"
          />
          <View className={isRTL ? "items-end" : "items-start"}>
            <Text 
              className="text-accent text-[11px] font-[Cairo_700Bold] mb-1"
              style={{ textAlign: isRTL ? 'right' : 'left' }}
            >
              {article.category}
            </Text>
            <Text
              className="text-lg font-[Cairo_700Bold] text-gray-800 leading-7"
              numberOfLines={2}
              style={{ 
                textAlign: isRTL ? 'right' : 'left',
                writingDirection: isRTL ? 'rtl' : 'ltr',
              }}
            >
              {article.title}
            </Text>
          </View>
        </TouchableOpacity>
      </Link>
    );
  }

  if (variant === "hero") {
    return (
      <Link href={`/article/${article.id}`} asChild>
        <TouchableOpacity className="mb-6 overflow-hidden bg-white shadow-lg h-[450px]">
          <Image
            source={{ uri: article.image }}
            className="absolute inset-0 w-full h-full"
            resizeMode="cover"
          />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.8)"]}
            className="absolute inset-0 px-6 pb-8 justify-end"
          >
            <View className={`bg-accent/90 px-4 py-1.5 rounded-xl mb-4 ${isRTL ? 'self-end' : 'self-start'}`}>
              <Text className="text-white text-[12px] font-[Cairo_700Bold]">
                {article.category}
              </Text>
            </View>

            <Text
              className="text-2xl font-[Cairo_700Bold] text-white leading-[38px] mb-4"
              numberOfLines={3}
              style={{ 
                textAlign: isRTL ? 'right' : 'left',
                writingDirection: isRTL ? 'rtl' : 'ltr',
                width: '100%'
              }}
            >
              {article.title}
            </Text>

            <Text
              className="text-gray-300 text-[14px] font-[Cairo_400Regular] mb-6 leading-6"
              numberOfLines={2}
              style={{ 
                textAlign: isRTL ? 'right' : 'left',
                writingDirection: isRTL ? 'rtl' : 'ltr',
                width: '100%'
              }}
            >
              {article.excerpt ||
                (isRTL
                  ? "اكتشف أسرار الحضارات القديمة في قلب الصحراء العربية، حيث تلتقي الفخامة بالتاريخ في تجربة لا تنسى."
                  : "Discover the secrets of ancient civilizations in the heart of the Arabian desert, where luxury meets history in an unforgettable experience.")}
            </Text>

            <View className={`flex-row ${isRTL ? 'flex-row-reverse' : ''}`}>
              <TouchableOpacity className="bg-accent px-8 py-3 rounded-2xl shadow-lg flex-row items-center">
                <Text className="text-primary font-[Cairo_700Bold] text-base">
                  {t("article.readMore") || (isRTL ? "اقرأ المزيد" : "Read More")}
                </Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Link>
    );
  }

  if (variant === "trending") {
    return (
      <Link href={`/article/${article.id}`} asChild>
        <TouchableOpacity className="mb-6 rounded-3xl overflow-hidden bg-white shadow-md">
          <Image
            source={{ uri: article.image }}
            className="h-64 w-full"
            resizeMode="cover"
          />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.7)"]}
            className="absolute inset-0 p-5 justify-end"
          >
            <Text
              className="text-lg font-[Cairo_700Bold] text-white"
              numberOfLines={2}
              style={{ 
                textAlign: isRTL ? 'right' : 'left',
                writingDirection: isRTL ? 'rtl' : 'ltr',
                width: '100%'
              }}
            >
              {article.title}
            </Text>
            <View className={`flex-row items-center mt-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <ClockIcon size={12} color="#fbbf24" />
              <Text className={`text-accent text-[11px] font-[Cairo_400Regular] ${isRTL ? 'mr-1' : 'ml-1'}`}>
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
        className={`flex-row mb-4 bg-white rounded-3xl overflow-hidden p-3 shadow-sm border border-secondary/50 ${isRTL ? "flex-row-reverse" : ""}`}
      >
        <Image
          source={{ uri: article.image }}
          className="w-24 h-24 rounded-2xl"
          resizeMode="cover"
        />
        <View className={`flex-1 px-4 justify-center ${isRTL ? 'items-end' : 'items-start'}`}>
          <Text
            className="text-base font-[Cairo_700Bold] text-gray-800 leading-6 mb-1"
            numberOfLines={2}
            style={{ 
                textAlign: isRTL ? 'right' : 'left',
                writingDirection: isRTL ? 'rtl' : 'ltr',
                width: '100%'
              }}
          >
            {article.title}
          </Text>
          <View className={`flex-row items-center ${isRTL ? "flex-row-reverse" : ""}`}>
            <Text 
              className="text-[11px] text-gray-400 font-[Cairo_400Regular]"
              style={{ textAlign: isRTL ? 'right' : 'left' }}
            >
              {article.date}
            </Text>
            <View className="mx-2 w-1 h-1 bg-gray-200 rounded-full" />
            <Text 
              className="text-[11px] text-accent font-[Cairo_700Bold]"
              style={{ textAlign: isRTL ? 'right' : 'left' }}
            >
              {article.category}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
};
