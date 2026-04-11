import React from 'react';
import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { HomeIcon as HomeSolid } from 'react-native-heroicons/solid';
import { HomeIcon as HomeOutline, Squares2X2Icon as CategoriesOutline, PhotoIcon as PhotoOutline, Cog6ToothIcon as SettingsOutline } from 'react-native-heroicons/outline';
import { Squares2X2Icon as CategoriesSolid, PhotoIcon as PhotoSolid, Cog6ToothIcon as SettingsSolid } from 'react-native-heroicons/solid';

export default function TabLayout() {
  const { t, i18n } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#fbbf24',
        tabBarInactiveTintColor: '#6b7280',
        headerShown: false,
        tabBarStyle: {
          height: 90,
          backgroundColor: '#1a3c34',
          borderTopWidth: 0,
          paddingBottom: 30,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontFamily: 'Cairo_700Bold',
          fontSize: 11,
          marginTop: 2,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('common.home'),
          tabBarIcon: ({ color, focused }) => 
            focused ? <HomeSolid size={24} color={color} /> : <HomeOutline size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: t('common.categories'),
          tabBarIcon: ({ color, focused }) => 
            focused ? <CategoriesSolid size={24} color={color} /> : <CategoriesOutline size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="gallery"
        options={{
          title: t('common.gallery'),
          tabBarIcon: ({ color, focused }) => 
            focused ? <PhotoSolid size={24} color={color} /> : <PhotoOutline size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('common.settings'),
          tabBarIcon: ({ color, focused }) => 
            focused ? <SettingsSolid size={24} color={color} /> : <SettingsOutline size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
