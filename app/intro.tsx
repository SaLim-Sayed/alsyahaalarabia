import { useAppStore } from "@/store/useAppStore";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dimensions,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

import {
  BellIcon,
  MapIcon,
  NewspaperIcon,
} from "react-native-heroicons/outline";

const slides = [
  {
    id: "1",
    titleKey: "intro.slide1Title",
    descKey: "intro.slide1Desc",
    icon: MapIcon,
  },
  {
    id: "2",
    titleKey: "intro.slide2Title",
    descKey: "intro.slide2Desc",
    icon: NewspaperIcon,
  },
  {
    id: "3",
    titleKey: "intro.slide3Title",
    descKey: "intro.slide3Desc",
    icon: BellIcon,
  },
];

export default function IntroScreen() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const router = useRouter();
  const { setHasSeenIntro } = useAppStore();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  
  const finishIntro = () => {
    setHasSeenIntro(true);
    router.replace("/(tabs)");
  };

  const nextSlide = () => {
    if (activeIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: activeIndex + 1 });
    } else {
      finishIntro();
    }
  };

  const renderItem = ({ item, index }: any) => {
    const Icon = item.icon;
    return (
      <View style={{ width, height }} className="items-center justify-center px-8">
        <Animated.View 
          entering={FadeInUp.delay(200).duration(800)}
          className="w-full h-[40vh] mb-10 rounded-[40px] overflow-hidden border border-white/10 items-center justify-center bg-white/5"
        >
          <Icon size={120} color="#fbbf24" strokeWidth={1} />
          <LinearGradient
            colors={["transparent", "rgba(26, 60, 52, 0.4)"]}
            className="absolute inset-0"
          />
        </Animated.View>

        <Animated.View 
          entering={FadeInDown.delay(400).duration(800)}
          className="items-center"
        >
          <Text className="text-accent text-3xl font-[Cairo_700Bold] text-center mb-4">
            {t(item.titleKey)}
          </Text>
          <Text className="text-white/60 text-base font-[Cairo_400Regular] text-center leading-7">
            {t(item.descKey)}
          </Text>
        </Animated.View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-primary">
      <LinearGradient
        colors={["#1a3c34", "#0a1a16"]}
        className="absolute inset-0"
      />

      {/* Top Logo */}
      <View className="absolute top-16 left-0 right-0 items-center z-10">
        <Image 
          source={require("@/assets/images/ATـLogo.png")}
          className="w-16 h-16"
          resizeMode="contain"
        />
      </View>

      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          setActiveIndex(Math.round(e.nativeEvent.contentOffset.x / width));
        }}
        inverted={isRTL}
      />

      {/* Pagination & Buttons */}
      <View className="absolute bottom-12 left-8 right-8 flex-row items-center justify-between">
        <TouchableOpacity onPress={finishIntro}>
          <Text className="text-white/40 font-[Cairo_700Bold] text-base">
            {t("intro.skip")}
          </Text>
        </TouchableOpacity>

        <View className="flex-row gap-2">
          {slides.map((_, i) => (
            <View
              key={i}
              className={`h-1.5 rounded-full ${
                activeIndex === i ? "w-8 bg-accent" : "w-2 bg-white/20"
              }`}
            />
          ))}
        </View>

        <TouchableOpacity
          onPress={nextSlide}
          className="bg-accent px-6 py-3 rounded-2xl shadow-xl shadow-accent/20"
        >
          <Text className="text-primary font-[Cairo_700Bold] text-base">
            {activeIndex === slides.length - 1 ? t("intro.getStarted") : "→"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
