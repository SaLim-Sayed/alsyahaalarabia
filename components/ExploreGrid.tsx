import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { BuildingLibraryIcon, GlobeAltIcon, SparklesIcon, ShoppingBagIcon } from 'react-native-heroicons/outline';
import { useTranslation } from 'react-i18next';

export const ExploreGrid = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const categories = [
    { id: 'heritage', name: isRTL ? 'تراث' : 'Heritage', icon: BuildingLibraryIcon, color: '#fef3c7' },
    { id: 'nature', name: isRTL ? 'طبيعة' : 'Nature', icon: GlobeAltIcon, color: '#dcfce7' },
    { id: 'parks', name: isRTL ? 'حدائق' : 'Parks', icon: SparklesIcon, color: '#f3e8ff' },
    { id: 'shopping', name: isRTL ? 'تسوق' : 'Shopping', icon: ShoppingBagIcon, color: '#fee2e2' },
  ];


  return (
    <View className="px-6 mb-8">
      <View className={`flex-row items-center mb-6 ${isRTL ? 'justify-end' : 'justify-start'}`}>
        <View className="w-1.5 h-6 bg-accent rounded-full mx-2" />
        <Text className="text-xl font-[Cairo_700Bold] text-primary">
          {isRTL ? 'استكشف الوجهات' : 'Explore Destinations'}
        </Text>
      </View>

      <View className="flex-row flex-wrap justify-between">
        {categories.map((cat) => (
          <TouchableOpacity 
            key={cat.id}
            className="w-[48%] bg-white rounded-3xl p-6 mb-4 items-center shadow-sm border border-secondary/50"
          >
            <View 
              style={{ backgroundColor: cat.color }}
              className="w-12 h-12 rounded-2xl items-center justify-center mb-3"
            >
              <cat.icon size={24} color="#1a3c34" />
            </View>
            <Text className="text-sm font-[Cairo_700Bold] text-primary">
              {cat.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
