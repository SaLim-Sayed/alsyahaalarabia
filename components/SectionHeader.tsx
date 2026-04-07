import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';

interface SectionHeaderProps {
  title: string;
  onSeeAll?: () => void;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, onSeeAll }) => {
  return (
    <View className="flex-row items-center justify-between px-6 mb-4">
      <TouchableOpacity 
        onPress={onSeeAll}
        className="flex-row items-center"
      >
        <ChevronLeft size={16} color="#ca8a04" />
        <Text className="text-accent text-sm font-[Cairo_700Bold] ml-1">مشاهدة الكل</Text>
      </TouchableOpacity>
      <Text className="text-lg font-[Cairo_700Bold] text-gray-900 border-r-4 border-primary pr-3 text-right">
        {title}
      </Text>
    </View>
  );
};
