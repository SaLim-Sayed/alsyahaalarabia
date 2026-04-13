import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Dimensions, FlatList, View } from "react-native";
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
  const { i18n } = useTranslation();
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
    }, 3000);

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

  return (
    <View className="my-8">
      <FlatList
        ref={flatListRef}
        data={articles}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        inverted={isRTL} // Support RTL scrolling
        renderItem={({ item }) => (
          <View style={{ width: SLIDER_WIDTH }}>
            <ArticleCard article={item} variant="hero" />
          </View>
        )}
      />

      {/* Pagination Dots */}
      <View className="flex-row justify-center items-center -mt-10 mb-4 h-10">
        {articles.map((_, index) => (
          <View
            key={index}
            className={`h-1.5 rounded-full mx-1 transition-all duration-300 ${
              activeIndex === index ? "w-6 bg-accent" : "w-1.5 bg-white/50"
            }`}
          />
        ))}
      </View>
    </View>
  );
};
