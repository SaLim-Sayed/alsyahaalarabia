import { AppHeader } from "@/components/AppHeader";
import { CategorySection } from "@/components/CategorySection";
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
            <SectionHeader title={t("home.exploreSections")} />
            <ExploreGrid />

            {/* Magazine Sections */}
            <CategorySection 
              title="السياحة السعودية" 
              categoryId="52" 
              accentColor="#1a3c34" 
            />

            <CategorySection 
              title="السياحة العالمية" 
              categoryId="13" 
              accentColor="#fbbf24" 
            />

            <CategorySection 
              title="السياحة الميسرة (الدامجة)" 
              categoryId="9898" 
              accentColor="#10b981" 
            />

            <CategorySection 
              title="أخبار الرياضة" 
              categoryId="4857" 
              accentColor="#ef4444" 
            />

            <CategorySection 
              title="فنادق ومنتجعات" 
              categoryId="50" 
              accentColor="#8b5cf6" 
            />

            <CategorySection 
              title="Global Tourism" 
              categoryId="9896" 
              accentColor="#3b82f6" 
            />

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
