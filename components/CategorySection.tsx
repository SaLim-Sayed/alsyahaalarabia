import { ArticleCard } from "./ArticleCard";
import { usePostsByCategory } from "@/hooks/usePosts";
import { Article } from "@/types/Article";
import { Link } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { Image, Text, TouchableOpacity, View } from "react-native";
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  TagIcon,
  UserIcon,
} from "react-native-heroicons/solid";

interface CategorySectionProps {
  title: string;
  categoryId: string;
  accentColor?: string;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  title,
  categoryId,
  accentColor = "#fbbf24",
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const { data: articles, isLoading } = usePostsByCategory(categoryId, 5);

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
    <View className="mb-12 px-6">
      {/* Redesigned Section Header */}
      <View className="flex-row items-center justify-between mb-6">
        {/* Left: See More */}
        <View className="flex-row items-center">
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
    </View>
  );
};
