import { AppHeader } from "@/components/AppHeader";
import { ArticleFooter } from "@/components/ArticleFooter";
import { CategorySection } from "@/components/CategorySection";
import { ExploreGrid } from "@/components/ExploreGrid";
import { HomeSlider } from "@/components/HomeSlider";
import { NewsTicker } from "@/components/NewsTicker";
import { SectionHeader } from "@/components/SectionHeader";
import { usePostsByCategory } from "@/hooks/usePosts";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppStore } from "@/store/useAppStore";
import { useScrollToHideTabBar } from "@/hooks/useScrollToHideTabBar";
import Animated, {
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import {
  ActivityIndicator,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ChevronUpIcon } from "react-native-heroicons/outline";

export default function HomeScreen() {
  const { t, i18n } = useTranslation();
  const [refreshing, setRefreshing] = useState(false);
  const {
    lastSyncTimestamp,
  } = useAppStore();
  const { scrollHandler, scrollY } = useScrollToHideTabBar();
  const scrollViewRef = useRef<Animated.ScrollView>(null);

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
        ref={scrollViewRef}
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

            <ArticleFooter />
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
