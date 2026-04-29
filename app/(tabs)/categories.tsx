import { AppHeader } from "@/components/AppHeader";
import { useAppCategories } from "@/hooks/useCategories";
import { useScrollToHideTabBar } from "@/hooks/useScrollToHideTabBar";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated from "react-native-reanimated";

export default function CategoriesScreen() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const { data: categories, isLoading, isError } = useAppCategories();
  const { scrollHandler } = useScrollToHideTabBar();

  if (isLoading) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#14532d" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <AppHeader />
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        className="flex-1 px-6 pt-6"
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-2xl font-[Cairo_700Bold] text-gray-900 mb-6">
          {t("common.categories")}
        </Text>

        <View className="flex-row flex-wrap justify-between">
          {categories?.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              className="w-[48%] h-40 mb-6 rounded-3xl overflow-hidden shadow-lg"
              activeOpacity={0.9}
              onPress={() => {
                router.push({
                  pathname: "/category/[id]",
                  params: { id: cat.id, name: cat.name },
                });
              }}
            >
              <ImageBackground
                source={cat.image}
                className="w-full h-full"
                resizeMode="contain"
              >
                {/* Subtle gradient overlay instead of full black */}
                <View className="absolute inset-0 bg-gray-600/50" />

                <View className="absolute bottom-0 left-0 right-0 p-4">
                  <View className="overflow-hidden rounded-2xl">
                    <BlurView intensity={25} tint="dark" className="px-3 py-2">
                      <Text
                        className="text-white font-[Cairo_700Bold] text-center text-sm"
                        numberOfLines={1}
                      >
                        {cat.name}
                      </Text>
                      <Text className="text-white/80 font-[Cairo_400Regular] text-center text-[10px] mt-0.5">
                        {t("categories.articlesCount", { count: cat.count })}
                      </Text>
                    </BlurView>
                  </View>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          ))}
        </View>

        {isError && (
          <View className="py-20 items-center">
            <Text className="text-red-500 font-cairo text-center">
              {t("categories.loadError")}
            </Text>
          </View>
        )}
        <View className="h-10" />
      </Animated.ScrollView>
    </View>
  );
}
