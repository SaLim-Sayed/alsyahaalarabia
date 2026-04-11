import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';

interface SectionHeaderProps {
  title: string;
  onSeeAll?: () => void;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, onSeeAll }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <View className={`px-6 mb-6 flex-row items-center ${isRTL ? 'justify-end' : 'justify-start'}`}>
      {onSeeAll && (
        <TouchableOpacity onPress={onSeeAll} className={isRTL ? 'mr-auto' : 'ml-auto'}>
          <Text className="text-accent text-[12px] font-[Cairo_700Bold]">
            {isRTL ? 'عرض الكل' : 'View All'}
          </Text>
        </TouchableOpacity>
      )}
      <View className={`w-1.5 h-6 bg-accent rounded-full ${isRTL ? 'ml-3' : 'mr-3'}`} />
      <Text className="text-xl font-[Cairo_700Bold] text-primary">{title}</Text>
    </View>
  );
};
