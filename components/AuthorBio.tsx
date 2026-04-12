import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

interface AuthorBioProps {
  name: string;
  avatar?: string;
  bio?: string;
}

export const AuthorBio: React.FC<AuthorBioProps> = ({ name, avatar, bio }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <View className="mt-12 mb-16 bg-secondary rounded-[32px] p-8 border border-gray-100 flex-row items-center">
      <View className={`flex-1 ${isRTL ? 'items-end' : 'items-start'}`}>
        <Text className="text-accent text-xs font-[Cairo_700Bold] mb-2 text-start">
          {t('article.aboutAuthor')}
        </Text>
        <Text className="text-xl font-[Cairo_700Bold] text-primary mb-3 text-start">
          {name}
        </Text>
        <Text className="text-gray-500 font-[Cairo_400Regular] leading-6 mb-4 text-start">
          {bio || (isRTL
            ? "أستاذ التاريخ الإسلامي في جامعة القيروان، باحث متخصص في العمارة الأندلسية، له عدة مؤلفات في توثيق التراث المعماري الفني في أوروبا."
            : "Professor of Islamic History at Kairouan University, specialized researcher in Andalusian architecture, has authored several works on documenting artistic architectural heritage in Europe.")}
        </Text>

        <View className="flex-row">
          <TouchableOpacity className="bg-primary/5 p-2 rounded-full ms-3">
            <FontAwesome name="twitter" size={18} color="#1a3c34" />
          </TouchableOpacity>
          <TouchableOpacity className="bg-primary/5 p-2 rounded-full">
            <FontAwesome name="linkedin" size={18} color="#1a3c34" />
          </TouchableOpacity>
        </View>
      </View>

      <Image
        source={{ uri: avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop' }}
        className="w-28 h-28 rounded-3xl ms-6"
      />
    </View>
  );
};
