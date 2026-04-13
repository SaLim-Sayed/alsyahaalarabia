import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Animated,
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Article } from "../types/Article";

const { width } = Dimensions.get("window");

interface NewsTickerProps {
  articles: Article[];
}

export const NewsTicker: React.FC<NewsTickerProps> = ({ articles }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const [currentIndex, setCurrentIndex] = useState(0);

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!articles || articles.length <= 1) return;

    const interval = setInterval(() => {
      // 1. Transition Out
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: isRTL ? -30 : 30, // Move towards the exit
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // 2. Change Item
        setCurrentIndex((prev) => (prev + 1) % articles.length);

        // 3. Reset position for entry
        slideAnim.setValue(isRTL ? 30 : -30); // Start from the other side

        // 4. Transition In
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ]).start();
      });
    }, 4500); // 4.5 seconds per item

    return () => clearInterval(interval);
  }, [articles, isRTL, fadeAnim, slideAnim]);

  if (!articles || articles.length === 0) return null;

  const currentArticle = articles[currentIndex];

  return (
    <View className="mb-6 bg-white overflow-hidden border-y-[1.5px] border-[#c5a059] shadow-sm">
      <View
        className={`flex-row items-center h-12 ${isRTL ? "flex-row-reverse" : ""}`}
      >
        {/* Fixed Title Label */}
        <LinearGradient
          colors={["#1a3c34", "#122a24"]}
          className="px-5 h-full justify-center z-10 shadow-lg border-r border-[#c5a059]/30"
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text className="text-accent font-[Cairo_700Bold] text-[13px] ">
            {t("common.latestNews")}
          </Text>
        </LinearGradient>

        {/* Carousel Content */}
        <View className="flex-1 overflow-hidden bg-[#fdfaf4] justify-center px-4">
          <Link href={`/article/${currentArticle.id}`} asChild>
            <TouchableOpacity activeOpacity={0.7} className="w-full">
              <Animated.View
                style={{
                  opacity: fadeAnim,
                  transform: [{ translateX: slideAnim }],
                }}
                className={`flex-row items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}
              >
                <View
                  className={`flex-1 flex-row items-center ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  <Text className="text-[#c5a059] text-[10px] font-[Cairo_700Bold]">
                    {currentArticle.date}
                  </Text>
                  <View className="w-1 h-1 rounded-full bg-[#c5a059] opacity-40 mx-2" />
                  <Text
                    className={`flex-1 text-gray-800 font-[Cairo_700Bold] text-[13px] ${isRTL ? "text-right" : "text-left"}`}
                    numberOfLines={1}
                  >
                    {currentArticle.title}
                  </Text>
                </View>

                {currentArticle.image && (
                  <Image
                    source={{ uri: currentArticle.image }}
                    className={`${isRTL ? "mr-3" : "ml-3"} w-8 h-8 rounded-full border-[1.5px] border-[#c5a059]/30`}
                    resizeMode="cover"
                  />
                )}
              </Animated.View>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </View>
  );
};
