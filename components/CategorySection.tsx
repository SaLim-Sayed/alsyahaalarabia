import { usePostsByCategory } from "@/hooks/usePosts";
import { Article } from "@/types/Article";
import { Link } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  TagIcon,
  UserIcon,
} from "react-native-heroicons/solid";
import Animated, {
  Extrapolate,
  SharedValue,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { ArticleCard } from "./ArticleCard";

interface CategorySectionProps {
  title: string;
  categoryId: string;
  accentColor?: string;
  scrollY?: SharedValue<number>;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  title,
  categoryId,
  accentColor = "#fbbf24",
  scrollY,
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const { height: screenHeight } = useWindowDimensions();
  const [yOffset, setYOffset] = useState(0);

  const { data: articles, isLoading } = usePostsByCategory(categoryId, 5);

  const animatedStyle = useAnimatedStyle(() => {
    if (!scrollY || yOffset === 0)
      return { opacity: 1, transform: [{ translateY: 0 }, { scale: 1 }] };

    // Start animating when the section is just below the visible screen
    const startPoint = yOffset - screenHeight;
    const endPoint = yOffset - screenHeight * 0.3; // Finish animation when it's 30% into the screen

    const opacity = interpolate(
      scrollY.value,
      [startPoint, endPoint],
      [0, 1],
      Extrapolate.CLAMP,
    );

    const translateY = interpolate(
      scrollY.value,
      [startPoint, endPoint],
      [100, 0],
      Extrapolate.CLAMP,
    );

    const scale = interpolate(
      scrollY.value,
      [startPoint, endPoint],
      [0.9, 1],
      Extrapolate.CLAMP,
    );

    return {
      opacity,
      transform: [{ translateY }, { scale }],
    };
  }, [yOffset, screenHeight]);

  if (isLoading || !articles || articles.length === 0) return null;

  const mainArticle = articles[0];
  const listArticles = articles.slice(1, 5);

  const MetadataRow = ({
    article,
    centered = false,
  }: {
    article: Article;
    centered?: boolean;
  }) => (
    <View
      className={`flex-row items-center flex-wrap mt-2 ${centered ? "justify-center" : ""}`}
    >
      <View className="flex-row items-center me-4">
        <UserIcon size={14} color="#4b5563" />
        <Text className="text-gray-500 font-[Cairo_400Regular] text-[11px] ms-1 mt-0.5">
          {article.author}
        </Text>
      </View>
      <View className="flex-row items-center me-4">
        <CalendarIcon size={14} color="#4b5563" />
        <Text className="text-gray-500 font-[Cairo_400Regular] text-[11px] ms-1 mt-0.5">
          {article.date}
        </Text>
      </View>
      <View className="flex-row items-center">
        <TagIcon size={14} color="#4b5563" />
        <Text className="text-gray-500 font-[Cairo_400Regular] text-[11px] ms-1 mt-0.5">
          {article.category}
        </Text>
      </View>
    </View>
  );

  return (
    <Animated.View
      onLayout={(event) => {
        setYOffset(event.nativeEvent.layout.y);
      }}
      style={animatedStyle}
      className="mb-12 px-6"
    >
      {/* Redesigned Section Header */}
      <View className="flex-row items-center justify-between mb-6">
        {/* Left: See More */}
        <View className="flex-row gap-2 items-center">
          <View
            style={{ backgroundColor: accentColor }}
            className="w-2.5 h-2.5 rounded-full"
          />
          <Text className="text-xl font-[Cairo_700Bold] text-primary me-2">
            {title}
          </Text>
        </View>

        {/* Center: Line */}
        <View className="flex-1 h-[1px] bg-gray-200 mx-4" />

        {/* Right: Title */}

        <Link href={`/category/${categoryId}`} asChild>
          <TouchableOpacity className="flex-row items-center">
            <Text className="text-gray-600 text-sm font-[Cairo_700Bold] mx-1">
              {t("article.seeMore")}
            </Text>
            {isRTL ? (
              <ChevronLeftIcon size={16} color="#4b5563" />
            ) : (
              <ChevronRightIcon size={16} color="#4b5563" />
            )}
          </TouchableOpacity>
        </Link>
      </View>

      {/* Featured Article (Top) */}
      <View className="mb-10">
        <Link href={`/article/${mainArticle.id}`} asChild>
          <TouchableOpacity>
            <Image
              source={{ uri: mainArticle.image }}
              className="w-full h-64 rounded-2xl mb-4"
              resizeMode="cover"
            />
            <Text
              className="text-xl font-[Cairo_700Bold] text-primary text-center leading-8"
              numberOfLines={2}
            >
              {mainArticle.title}
            </Text>

            <MetadataRow article={mainArticle} centered />

            <Text
              className="text-gray-600 text-sm font-[Cairo_400Regular] text-center mt-4 leading-6"
              numberOfLines={3}
            >
              {mainArticle.excerpt}
            </Text>
          </TouchableOpacity>
        </Link>
      </View>

      {/* List Articles (Bottom Stack) */}
      <View>
        {listArticles.map((article) => (
          <ArticleCard key={article.id} article={article} variant="list" />
        ))}
      </View>
    </Animated.View>
  );
};
