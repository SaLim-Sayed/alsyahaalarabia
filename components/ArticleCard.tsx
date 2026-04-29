import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { ClockIcon, UserIcon } from "react-native-heroicons/outline";

import { Article } from "../types/Article";

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
          <View>
            <Text className="text-accent text-[11px] font-[Cairo_700Bold] mb-1">
              {article.category}
            </Text>
            <Text
              className="text-lg font-[Cairo_700Bold] text-gray-800 leading-7"
              numberOfLines={2}
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
        <TouchableOpacity className="overflow-hidden bg-white h-[300px] w-full">
          <Image
            source={{ uri: article.image }}
            className="absolute inset-0 w-full h-full"
            resizeMode="cover"
          />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.7)"]}
            className="absolute inset-0 px-6 pb-6 gap-8 justify-center items-start"
          >
            {/* Category Badge - Top Right */}
            <View className=" bg-teal-900/90 px-4 py-1.5 rounded-lg">
              <Text className="text-white text-[12px] font-[Cairo_700Bold]">
                {article.category}
              </Text>
            </View>

            {/* Title - Centered */}
            <Text
              className="text-xl font-[Cairo_700Bold] text-white leading-8  mb-4"
              numberOfLines={3}
            >
              {article.title}
            </Text>

            {/* Meta Info */}
            <Text className="text-white text-[12px] font-[Cairo_400Regular] text-center opacity-90">
              {article.author} - {article?.location || t("common.cairo")}{" "}
              {t("common.on")} {article.date}
            </Text>
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
            >
              {article.title}
            </Text>
            <View className="flex-row items-center mt-2">
              <ClockIcon size={12} color="#fbbf24" />
              <Text
                className={`text-accent text-[11px] font-[Cairo_400Regular] ${isRTL ? "mr-1" : "ml-1"}`}
              >
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
      <TouchableOpacity className="flex-row mb-4 bg-white rounded-3xl overflow-hidden p-3 shadow-sm border border-secondary/50">
        <Image
          source={{ uri: article.image }}
          className="w-24 h-24 rounded-2xl"
          resizeMode="cover"
        />
        <View
          className={`flex-1 px-4 justify-center ${isRTL ? "items-end" : "items-start"}`}
        >
          <Text
            className="text-base font-[Cairo_700Bold] text-gray-800 leading-6 mb-1"
            numberOfLines={2}
          >
            {article.title}
          </Text>
          <View className="flex-row items-center flex-wrap">
            <View className="flex-row items-center me-2">
              <UserIcon size={12} color="#9ca3af" />
              <Text
                className="text-[11px] text-gray-400 font-[Cairo_400Regular] ms-1"
                style={{ textAlign: isRTL ? "right" : "left" }}
              >
                {article.author}
              </Text>
            </View>
            <View className="flex-row items-center me-2">
              <ClockIcon size={12} color="#9ca3af" />
              <Text
                className="text-[11px] text-gray-400 font-[Cairo_400Regular] ms-1"
                style={{ textAlign: isRTL ? "right" : "left" }}
              >
                {article.date}
              </Text>
            </View>

            <View className="flex-row items-center me-2">
              <View className="mx-1 w-1 h-1 bg-gray-200 rounded-full" />
              <Text
                className="text-[11px] text-teal-900 font-[Cairo_700Bold]"
                style={{ textAlign: isRTL ? "right" : "left" }}
              >
                {article.category}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
};
