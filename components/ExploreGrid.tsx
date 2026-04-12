import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { BuildingLibraryIcon, GlobeAltIcon, SparklesIcon, ShoppingBagIcon } from 'react-native-heroicons/outline';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';

export const ExploreGrid = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const router = useRouter();

  const categories = [
    { id: '1', name: isRTL ? 'سياحة ثقافية' : 'Culture', icon: BuildingLibraryIcon, color: '#fef3c7', realName: isRTL ? 'سياحة ثقافية' : 'Culture' },
    { id: '2', name: isRTL ? 'طبيعة' : 'Nature', icon: GlobeAltIcon, color: '#dcfce7', realName: isRTL ? 'سياحة طبيعية' : 'Nature' },
    { id: '3', name: isRTL ? 'فنادق' : 'Hotels', icon: SparklesIcon, color: '#f3e8ff', realName: isRTL ? 'فنادق ومنتجعات' : 'Hotels' },
    { id: '4', name: isRTL ? 'تسوق' : 'Shopping', icon: ShoppingBagIcon, color: '#fee2e2', realName: isRTL ? 'تسوق' : 'Shopping' },
  ];

  const handleCategoryPress = (id: string, name: string) => {
    router.push({
      pathname: '/category/[id]',
      params: { id, name }
    });
  };

  return (
    <View className="px-6 mb-8">
      <View className="flex-row items-center mb-6">
        <View className="w-1.5 h-6 bg-accent rounded-full mx-2" />
        <Text className="text-xl font-[Cairo_700Bold] text-primary">
          {isRTL ? 'استكشف الأقسام' : 'Explore Sections'}
        </Text>
      </View>

      <View className="flex-row flex-wrap justify-between">
        {categories.map((cat) => (
          <TouchableOpacity 
            key={cat.id}
            onPress={() => handleCategoryPress(cat.id, cat.name)}
            className="w-[48%] bg-white rounded-3xl p-6 mb-4 items-center shadow-sm border border-secondary/50"
            activeOpacity={0.7}
          >
            <View 
              style={{ backgroundColor: cat.color }}
              className="w-14 h-14 rounded-2xl items-center justify-center mb-3 shadow-sm"
            >
              <cat.icon size={26} color="#1a3c34" strokeWidth={1.5} />
            </View>
            <Text className="text-sm font-[Cairo_700Bold] text-primary text-center">
              {cat.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
