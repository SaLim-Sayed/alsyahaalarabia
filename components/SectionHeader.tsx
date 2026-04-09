import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

interface SectionHeaderProps {
  title: string;
  onSeeAll?: () => void;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, onSeeAll }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <View className={`flex-row items-center justify-between px-6 mb-4 ${isRTL ? '' : 'flex-row-reverse'}`}>
      <TouchableOpacity 
        onPress={onSeeAll}
        className={`flex-row items-center ${isRTL ? '' : 'flex-row-reverse'}`}
      >
        {isRTL ? (
          <ChevronLeft size={16} color="#ca8a04" />
        ) : (
          <ChevronRight size={16} color="#ca8a04" />
        )}
        <Text className={`text-accent text-sm font-[Cairo_700Bold] ${isRTL ? 'ml-1' : 'mr-1'}`}>
          {t('common.all')}
        </Text>
      </TouchableOpacity>
      <Text className={`text-lg font-[Cairo_700Bold] text-gray-900 border-r-4 border-primary pr-3 ${isRTL ? 'text-right' : 'text-left border-r-0 border-l-4 pl-3'}`}>
        {title}
      </Text>
    </View>
  );
};
