import { Tabs } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  BookmarkIcon as BookmarkOutline,
  Squares2X2Icon as CategoriesOutline,
  HomeIcon as HomeOutline,
  Cog6ToothIcon as SettingsOutline,
} from "react-native-heroicons/outline";
import {
  BookmarkIcon as BookmarkSolid,
  Squares2X2Icon as CategoriesSolid,
  HomeIcon as HomeSolid,
  Cog6ToothIcon as SettingsSolid,
} from "react-native-heroicons/solid";
import { useAppStore } from "@/store/useAppStore";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { BottomTabBar } from "@react-navigation/bottom-tabs";

export default function TabLayout() {
  const { t, i18n } = useTranslation();
  const { isTabBarVisible } = useAppStore();

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withTiming(isTabBarVisible ? 0 : 100, { duration: 300 }),
        },
      ],
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
    };
  });

  return (
    <Tabs
      tabBar={(props) => (
        <Animated.View style={animatedStyle}>
          <BottomTabBar {...props} />
        </Animated.View>
      )}
      screenOptions={{
        tabBarActiveTintColor: "#fbbf24",
        tabBarInactiveTintColor: "#6b7280",
        headerShown: false,
        tabBarStyle: {
          height: 90,
          backgroundColor: "#1a3c34",
          borderTopWidth: 0,
          paddingBottom: 20,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontFamily: "Cairo_700Bold",
          fontSize: 11,
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("common.home"),
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <HomeSolid size={24} color={color} />
            ) : (
              <HomeOutline size={24} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: t("common.categories"),
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <CategoriesSolid size={24} color={color} />
            ) : (
              <CategoriesOutline size={24} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: t("common.saved"),
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <BookmarkSolid size={24} color={color} />
            ) : (
              <BookmarkOutline size={24} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t("common.settings"),
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <SettingsSolid size={24} color={color} />
            ) : (
              <SettingsOutline size={24} color={color} />
            ),
        }}
      />
    </Tabs>
  );
}
