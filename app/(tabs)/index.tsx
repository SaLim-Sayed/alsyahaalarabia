import { AppHeader } from "@/components/AppHeader";
import { ArticleCard } from "@/components/ArticleCard";
import { CulturalPulse } from "@/components/CulturalPulse";
import { ExploreGrid } from "@/components/ExploreGrid";
import { HomeSlider } from "@/components/HomeSlider";
import { NewsTicker } from "@/components/NewsTicker";
import { SectionHeader } from "@/components/SectionHeader";
import { usePostsByCategory } from "@/hooks/usePosts";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";

export default function HomeScreen() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: articles,
    isLoading: isLoadingArticles,
    isError,
    refetch,
    isRefetching,
  } = usePostsByCategory(null, 15);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  if (isLoadingArticles && !isRefetching && !refreshing) {
    return (
      <View className="flex-1 bg-primary justify-center items-center">
        <ActivityIndicator size="large" color="#fbbf24" />
        <Text className="mt-4 text-accent font-cairo">
          {t("home.loadingNews")}
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-secondary">
      <AppHeader />

      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1"
        refreshControl={
          <RefreshControl
            refreshing={refreshing || isRefetching}
            onRefresh={onRefresh}
            tintColor="#1a3c34"
          />
        }
      >
        {articles && articles.length > 0 && (
          <>
            {/* News Ticker */}
            <NewsTicker articles={articles.slice(0, 15)} />

            {/* Hero Slider Section */}
            <HomeSlider articles={articles.slice(0, 5)} />

            {/* Explore Grid */}
            <ExploreGrid />

            {/* Trending Section */}
            <SectionHeader title={isRTL ? "التريند الحالي" : "Current Trend"} />
            <View className="px-6 mb-8">
              <ArticleCard
                article={articles[5] || articles[0]}
                variant="trending"
              />
            </View>

            {/* Latest News */}
            <SectionHeader title={t("common.latestNews")} />
            <View className="px-6 mb-8">
              {articles.slice(6, 12).map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  variant="list"
                />
              ))}
            </View>

            {/* Cultural Pulse Banner */}
            <CulturalPulse />
          </>
        )}

        {isError && (
          <View className="px-10 py-20 items-center">
            <Text className="text-red-500 font-cairo text-center">
              {t("common.error")}... {t("common.retry")}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
