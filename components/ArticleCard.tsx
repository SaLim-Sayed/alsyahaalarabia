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
              className="text-lg font-[Cairo_700Bold] text-gray-800 leading-7 mb-2"
              numberOfLines={2}
            >
              {article.title}
            </Text>
            <View className="flex-row items-center">
              <Text className="text-gray-400 font-[Cairo_400Regular] text-[10px]">
                {t("article.writtenBy")}: {article.author} • {article.date}
              </Text>
            </View>
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
            colors={["transparent", "rgba(0,0,0,0.85)"]}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              padding: 24,
              flexDirection: "column",
              justifyContent: "flex-end",
              alignItems: "flex-start",
            }}
          >
            {/* Category Badge - Top Right */}
            <View className=" bg-teal-900/90 px-4 py-1.5 w-fit max-w-40 rounded-lg mb-4">
              <Text className="text-white text-[12px] font-[Cairo_700Bold]">
                {article.category}
              </Text>
            </View>

            {/* Title */}
            <Text
              className="text-xl font-[Cairo_700Bold] text-white leading-8 mb-3"
              numberOfLines={3}
            >
              {article.title}
            </Text>

            {/* Meta Info */}
            <View className="flex-row items-center">
              <UserIcon size={12} color="#fbbf24" />
              <Text className="text-white text-[12px] font-[Cairo_400Regular] ms-1 opacity-90">
                {t("article.writtenBy")}: {article.author}
              </Text>
              <View className="w-1 h-1 bg-white/40 rounded-full mx-2" />
              <ClockIcon size={12} color="#fbbf24" />
              <Text className="text-white text-[12px] font-[Cairo_400Regular] ms-1 opacity-90">
                {article.date}
              </Text>
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
            colors={["transparent", "rgba(0,0,0,0.8)"]}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              padding: 20,
              justifyContent: "flex-end",
            }}
          >
            <Text
              className="text-lg font-[Cairo_700Bold] text-white mb-2"
              numberOfLines={2}
            >
              {article.title}
            </Text>
            <View className="flex-row items-center">
              <Text className="text-accent text-[11px] font-[Cairo_700Bold]">
                {article.author}
              </Text>
              <View className="w-1 h-1 bg-white/40 rounded-full mx-2" />
              <ClockIcon size={12} color="#fbbf24" />
              <Text className="text-white text-[11px] font-[Cairo_400Regular] ms-1">
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
        <View className="flex-1 px-4 justify-center items-start">
          <Text
            className="text-base font-[Cairo_700Bold] text-gray-800 leading-6 mb-1"
            numberOfLines={2}
          >
            {article.title}
          </Text>
          <View className="flex-row items-center flex-wrap">
            <View className="flex-row items-center me-3">
              <UserIcon size={12} color="#1a3c34" />
              <Text className="text-[11px] text-primary font-[Cairo_700Bold] ms-1">
                {article.author}
              </Text>
            </View>
            <View className="flex-row items-center">
              <ClockIcon size={12} color="#9ca3af" />
              <Text className="text-[11px] text-gray-400 font-[Cairo_400Regular] ms-1">
                {article.date}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
};
