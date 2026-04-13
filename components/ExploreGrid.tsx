import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { 
  BuildingLibraryIcon, 
  GlobeAltIcon, 
  SparklesIcon, 
  ShoppingBagIcon,
  NewspaperIcon,
  TagIcon
} from 'react-native-heroicons/outline';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { useAppCategories } from '@/hooks/useCategories';

const ICON_MAP: Record<string, any> = {
  'Culture': BuildingLibraryIcon,
  'سياحة ثقافية': BuildingLibraryIcon,
  'Nature': GlobeAltIcon,
  'طبيعة': GlobeAltIcon,
  'Hotels': SparklesIcon,
  'فنادق': SparklesIcon,
  'Shopping': ShoppingBagIcon,
  'تسوق': ShoppingBagIcon,
  'News': NewspaperIcon,
  'أخبار': NewspaperIcon,
  'أخبار الطيران': GlobeAltIcon,
  'أخبار الرياضة': SparklesIcon,
  'السعودية اليوم': BuildingLibraryIcon,
  'السياحة العربية': BuildingLibraryIcon,
  'Global Tourism': GlobeAltIcon,
  'Default': TagIcon
};

const COLOR_PALETTE = ['#fef3c7', '#dcfce7', '#f3e8ff', '#fee2e2'];

export const ExploreGrid = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const router = useRouter();
  const { data: categories, isLoading } = useAppCategories();

  const handleCategoryPress = (id: string, name: string) => {
    router.push({
      pathname: '/category/[id]',
      params: { id, name }
    });
  };

  if (isLoading) {
    return (
      <View className="px-6 mb-8 h-40 justify-center items-center">
        <ActivityIndicator color="#1a3c34" />
      </View>
    );
  }

  // Filter out uncategorized and sort by post count
  const displayCategories = (categories || [])
    .filter(c => !c.name.toLowerCase().includes('uncategorized'))
    .sort((a, b) => (b.count || 0) - (a.count || 0))
    .slice(0, 4);

  if (displayCategories.length === 0) return null;

  return (
    <View className="px-6 mb-8">
      <View className={`flex-row items-center mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <View className="w-1.5 h-6 bg-accent rounded-full mx-3" />
        <Text 
          className="text-xl font-[Cairo_700Bold] text-primary flex-1"
          style={{ textAlign: isRTL ? 'right' : 'left' }}
        >
          {isRTL ? 'استكشف الأقسام' : 'Explore Sections'}
        </Text>
      </View>

      <View className={`flex-row flex-wrap justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
        {displayCategories.map((cat, index) => {
          const Icon = ICON_MAP[cat.name] || ICON_MAP['Default'];
          const bgColor = COLOR_PALETTE[index % COLOR_PALETTE.length];
          
          return (
            <TouchableOpacity 
              key={cat.id}
              onPress={() => handleCategoryPress(cat.id, cat.name)}
              className="w-[48%] bg-white rounded-3xl p-6 mb-4 items-center shadow-sm border border-secondary/50"
              activeOpacity={0.7}
            >
              <View 
                style={{ backgroundColor: bgColor }}
                className="w-14 h-14 rounded-2xl items-center justify-center mb-3 shadow-sm"
              >
                <Icon size={26} color="#1a3c34" strokeWidth={1.5} />
              </View>
              <Text 
                className="text-sm font-[Cairo_700Bold] text-primary text-center"
                numberOfLines={1}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};
