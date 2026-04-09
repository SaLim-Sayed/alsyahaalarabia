import React from 'react';
import { TouchableOpacity, Text, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';

interface CategoryChipProps {
  categories: { id: string; name: string }[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export const CategoryChip: React.FC<CategoryChipProps> = ({ categories, selectedId, onSelect }) => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false} 
      className="py-4"
      contentContainerStyle={{ 
        paddingHorizontal: 24, 
        flexDirection: isRTL ? 'row-reverse' : 'row' 
      }}
    >
      {categories.map((cat) => (
        <TouchableOpacity
          key={cat.id}
          onPress={() => onSelect(cat.id)}
          className={`px-6 py-2.5 rounded-2xl ${isRTL ? 'ml-3' : 'mr-3'} ${
            selectedId === cat.id ? 'bg-primary shadow-lg' : 'bg-gray-100'
          }`}
        >
          <Text
            className={`text-sm font-[Cairo_700Bold] ${
              selectedId === cat.id ? 'text-white' : 'text-gray-500'
            }`}
          >
            {cat.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};
