import { ArticleCard } from "@/components/ArticleCard";
import { ArticleFooter } from "@/components/ArticleFooter";
import { usePostDetail, usePostsByCategory } from "@/hooks/usePosts";
import { useAppStore } from "@/store/useAppStore";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Share,
  StatusBar,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BookmarkIcon,
  ChatBubbleBottomCenterTextIcon,
  ClockIcon,
  FolderIcon,
  ShareIcon,
} from "react-native-heroicons/outline";
import { UserCircleIcon } from "react-native-heroicons/solid";
import { ChevronUpIcon } from "react-native-heroicons/outline";
import RenderHtml from "react-native-render-html";
import React, { useRef } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

export default function ArticleDetailScreen() {
  const { t, i18n } = useTranslation();
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { toggleSaveArticle, isArticleSaved } = useAppStore();

  const { data: article, isLoading, isError } = usePostDetail(id as string);

  // Fetch related articles from same category
  const { data: relatedArticles } = usePostsByCategory(
    article?.categoryId || null,
    4,
  );

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
        <Text className="text-red-500 font-cairo text-center mb-6">
          {t("article.loadError")}
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-primary px-6 py-3 rounded-xl"
        >
          <Text className="text-white font-cairo">{t("common.goBack")}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isSaved = isArticleSaved(article.id);
  const isRTL = i18n.language === "ar";

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${article.title}\n\n${t("article.shareMessage")}\n${article.link || ""}`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const tagsStyles = {
    body: {
      fontFamily: "Cairo_400Regular",
      fontSize: 17,
      lineHeight: 30,
      color: "#4b5563",
    },
    p: {
      marginBottom: 20,
    },
    h2: {
      fontFamily: "Cairo_700Bold",
      fontSize: 22,
      color: "#1a3c34",
      marginTop: 32,
      marginBottom: 16,
      borderRightWidth: isRTL ? 4 : 0,
      borderLeftWidth: isRTL ? 0 : 4,
      borderColor: "#fbbf24",
      paddingHorizontal: 12,
    },
    blockquote: {
      backgroundColor: "#f8fdfc",
      borderRightWidth: isRTL ? 4 : 0,
      borderLeftWidth: isRTL ? 0 : 4,
      borderColor: "#fbbf24",
      paddingVertical: 16,
      paddingHorizontal: 20,
      marginVertical: 24,
      fontStyle: "italic" as const,
    },
  };

  const scrollY = useSharedValue(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: any) => {
    scrollY.value = event.nativeEvent.contentOffset.y;
  };

  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  const fabStyle = useAnimatedStyle(() => {
    const show = scrollY.value > 500;
    return {
      transform: [{ scale: withSpring(show ? 1 : 0) }],
      opacity: withSpring(show ? 1 : 0),
    };
  });

  return (
    <View className="flex-1 bg-white">
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      <Animated.ScrollView
        ref={scrollViewRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        className="flex-1"
      >
        {/* Hero Section */}
        <View className="h-[60vh] relative">
          <Image
            source={{ uri: article.image }}
            className="absolute inset-0 w-full h-full"
            resizeMode="cover"
          />
          <LinearGradient
            colors={["rgba(0,0,0,0.5)", "transparent"]}
            className="absolute inset-0 px-8 pb-20"
          >
            {/* Header Buttons */}
            <View className="absolute top-14 left-6 right-6 flex-row items-center justify-between">
              <TouchableOpacity
                onPress={() => router.back()}
                className="bg-black/30 w-12 h-12 rounded-full items-center justify-center backdrop-blur-md"
              >
                {isRTL ? (
                  <ArrowRightIcon size={22} color="white" />
                ) : (
                  <ArrowLeftIcon size={22} color="white" />
                )}
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
                  <BookmarkIcon
                    size={20}
                    color={isSaved ? "#fbbf24" : "white"}
                    fill={isSaved ? "#fbbf24" : "transparent"}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Content Section */}
        <View className="bg-white rounded-t-[40px] -mt-10 px-8 pt-10 pb-16">
          {/* Article Header (Title & Author Bar) */}
          <View className="mb-10 items-center">
            <Text className="text-2xl font-[Cairo_700Bold] text-primary text-center mb-8 leading-[42px]">
              {article.title}
            </Text>

            <View className="flex-row flex-wrap items-center justify-center px-2 py-3 bg-gray-50 rounded-2xl border border-gray-100/50">
              <View className="flex-row items-center">
                <UserCircleIcon size={20} color="#ca8a04" />
                <Text className="text-primary font-[Cairo_700Bold] text-xs ms-2">
                  {article.author}
                </Text>
              </View>

              <Text className="text-gray-300 mx-3">-</Text>

              <View className="flex-row items-center">
                <ClockIcon size={14} color="#ca8a04" />
                <Text className="text-gray-500 font-[Cairo_400Regular] text-xs ms-1 mt-0.5">
                  {article.date}
                </Text>
              </View>

              <Text className="text-gray-300 mx-3">-</Text>

              <View className="flex-row items-center">
                <FolderIcon size={14} color="#ca8a04" />
                <Text className="text-gray-500 font-[Cairo_400Regular] text-xs ms-1 mt-0.5">
                  {article.category}
                </Text>
              </View>

              <Text className="text-gray-300 mx-3">-</Text>

              <View className="flex-row items-center">
                <ChatBubbleBottomCenterTextIcon size={14} color="#ca8a04" />
                <Text className="text-gray-500 font-[Cairo_400Regular] text-xs ms-1 mt-0.5">
                  {article.commentCount}
                </Text>
              </View>
            </View>
          </View>

          <View>
            <RenderHtml
              contentWidth={width - 64}
              source={{ html: article.content || "" }}
              tagsStyles={tagsStyles}
              systemFonts={["Cairo_400Regular", "Cairo_700Bold"]}
            />
          </View>

          {/* Related Articles */}
          <View className="mt-8">
            <View className="flex-row items-center mb-8">
              <View className="w-1.5 h-6 bg-accent rounded-full mx-3" />
              <Text className="text-2xl font-[Cairo_700Bold] text-primary flex-1">
                {t("article.relatedItems")}
              </Text>
              <TouchableOpacity>
                <Text
                  className="text-accent text-xs font-[Cairo_700Bold]"
                  style={{ textAlign: isRTL ? "right" : "left" }}
                >
                  {t("article.seeMore")}
                </Text>
              </TouchableOpacity>
            </View>

            <View>
              {relatedArticles
                ?.filter((a) => a.id !== article.id)
                .slice(0, 3)
                .map((item) => (
                  <ArticleCard key={item.id} article={item} variant="compact" />
                ))}
            </View>
          </View>
        </View>

        {/* Footer */}
        <ArticleFooter />
      </Animated.ScrollView>

      {/* Scroll to Top FAB */}
      <Animated.View
        style={[
          fabStyle,
          {
            position: "absolute",
            bottom: 30,
            right: 30,
            zIndex: 100,
          },
        ]}
      >
        <TouchableOpacity
          onPress={scrollToTop}
          className="w-12 h-12 bg-green-700 items-center justify-center rounded-lg shadow-lg border border-white/20"
        >
          <ChevronUpIcon size={24} color="white" strokeWidth={2.5} />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}
