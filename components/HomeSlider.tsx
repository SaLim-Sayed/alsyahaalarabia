import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dimensions,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ChevronLeftIcon } from "react-native-heroicons/outline";
import { Article } from "../types/Article";
import { ArticleCard } from "./ArticleCard";

const { width } = Dimensions.get("window");
const SLIDER_WIDTH = width;

interface HomeSliderProps {
  articles: Article[];
  autoPlay?: boolean;
}

export const HomeSlider: React.FC<HomeSliderProps> = ({
  articles,
  autoPlay = true,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  useEffect(() => {
    if (!autoPlay || articles.length <= 1) return;

    const interval = setInterval(() => {
      let nextIndex = activeIndex + 1;
      if (nextIndex >= articles.length) {
        nextIndex = 0;
      }

      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
      setActiveIndex(nextIndex);
    }, 5000);

    return () => clearInterval(interval);
  }, [activeIndex, autoPlay, articles.length]);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const scrollToItem = (index: number) => {
    flatListRef.current?.scrollToIndex({
      index,
      animated: true,
    });
    setActiveIndex(index);
  };

  return (
    <View className="mb-10 bg-white">
      {/* Section Header */}
      <View className="flex-row items-center justify-between px-6 mb-6 mt-4">
        <View className="flex-row items-center flex-1">
          <Text className="text-2xl  font-medium text-black ">
            {t("common.latestNews")}
          </Text>
          <View className="w-2.5 h-2.5 bg-accent rounded-full" />
          <View className="flex flex-col  gap-1  flex-1">
            <View className="h-[1px] bg-gray-200  " />

            <View className="h-[1px] bg-gray-200  " />
          </View>
        </View>
        <TouchableOpacity className="flex-row items-center">
          <Text className="text-black text-base font-[Cairo_700Bold] ml-1">
            {t("common.viewAll")}
          </Text>{" "}
          <ChevronLeftIcon size={16} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Main Slider */}
      <View className="relative">
        <FlatList
          ref={flatListRef}
          data={articles}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          inverted={isRTL}
          renderItem={({ item }) => (
            <View style={{ width: SLIDER_WIDTH }}>
              <ArticleCard article={item} variant="hero" />
            </View>
          )}
        />

        {/* Pagination Bars (As seen in UI) */}
        <View className="absolute bottom-4 left-0 right-0 flex-row justify-center space-x-2 px-10">
          {articles.map((_, index) => (
            <View
              key={index}
              className={`h-1 flex-1 rounded-full ${
                activeIndex === index ? "bg-accent" : "bg-white/40"
              }`}
            />
          ))}
        </View>
      </View>

      {/* Thumbnails */}
      <View className="flex-row justify-center mt-6 space-x-4 px-6">
        {articles.slice(0, 4).map((item, index) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => scrollToItem(index)}
            className={`rounded-full p-1 ${
              activeIndex === index
                ? "border-2 border-accent"
                : "border-2 border-transparent"
            }`}
          >
            <Image
              source={{ uri: item.image }}
              className="w-14 h-14 rounded-full"
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
