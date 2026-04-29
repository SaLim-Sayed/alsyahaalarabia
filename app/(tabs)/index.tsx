import { AppHeader } from "@/components/AppHeader";
import { CategorySection } from "@/components/CategorySection";
import { ExploreGrid } from "@/components/ExploreGrid";
import { HomeSlider } from "@/components/HomeSlider";
import { NewsTicker } from "@/components/NewsTicker";
import { SectionHeader } from "@/components/SectionHeader";
import { usePostsByCategory } from "@/hooks/usePosts";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, RefreshControl, Text, View } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";

export default function HomeScreen() {
  const { t, i18n } = useTranslation();
  const [refreshing, setRefreshing] = useState(false);
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

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

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
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
            <SectionHeader title={t("home.exploreSections")} />
            <ExploreGrid />

            {/* Magazine Sections */}
            <CategorySection
              title={t("common.saudiTourism")}
              categoryId="52"
              accentColor="#1a3c34"
              scrollY={scrollY}
            />

            <CategorySection
              title={t("common.globalTourism")}
              categoryId="13"
              accentColor="#fbbf24"
              scrollY={scrollY}
            />

            <CategorySection
              title={t("common.accessibleTourism")}
              categoryId="9898"
              accentColor="#10b981"
              scrollY={scrollY}
            />

            <CategorySection
              title={t("common.sportsNews")}
              categoryId="4857"
              accentColor="#ef4444"
              scrollY={scrollY}
            />

            <CategorySection
              title={t("common.hotelsResorts")}
              categoryId="50"
              accentColor="#8b5cf6"
              scrollY={scrollY}
            />

            <CategorySection
              title={t("common.globalTourism")}
              categoryId="9896"
              accentColor="#3b82f6"
              scrollY={scrollY}
            />

            {/* Cultural Pulse Banner */}
            {/* <CulturalPulse /> */}
          </>
        )}

        {isError && (
          <View className="px-10 py-20 items-center">
            <Text className="text-red-500 font-cairo text-center">
              {t("common.error")}... {t("common.retry")}
            </Text>
          </View>
        )}
      </Animated.ScrollView>
    </View>
  );
}
