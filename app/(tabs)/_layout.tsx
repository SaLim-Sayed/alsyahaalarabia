import React from 'react';
import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Home, Grid, Bookmark } from 'lucide-react-native';

export default function TabLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#14532d',
        tabBarInactiveTintColor: '#9ca3af',
        headerShown: false,
        tabBarStyle: {
          height: 90,
          paddingBottom: 30,
          paddingTop: 10,
          borderTopWidth: 1,
          borderTopColor: '#f3f4f6',
        },
        tabBarLabelStyle: {
          fontFamily: 'Cairo_700Bold',
          fontSize: 10,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('common.home'),
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: t('common.categories'),
          tabBarIcon: ({ color }) => <Grid size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: t('common.saved'),
          tabBarIcon: ({ color }) => <Bookmark size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
