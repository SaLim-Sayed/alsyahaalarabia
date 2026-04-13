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
    <View className={`mt-12 mb-16 bg-secondary rounded-[32px] p-8 border border-gray-100 flex-row items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
      <View className={`flex-1 ${isRTL ? 'items-end' : 'items-start'}`}>
        <Text 
          className="text-accent text-xs font-[Cairo_700Bold] mb-2"
          style={{ textAlign: isRTL ? 'right' : 'left' }}
        >
          {t('article.aboutAuthor')}
        </Text>
        <Text 
          className="text-xl font-[Cairo_700Bold] text-primary mb-3"
          style={{ textAlign: isRTL ? 'right' : 'left' }}
        >
          {name || (isRTL ? 'عباس البراهيم' : 'Abbas Al-Ibrahim')}
        </Text>
        <Text 
          className="text-gray-500 font-[Cairo_400Regular] leading-6 mb-4"
          style={{ 
            textAlign: isRTL ? 'right' : 'left',
            writingDirection: isRTL ? 'rtl' : 'ltr'
          }}
        >
          {bio || (isRTL
            ? "رئيس تحرير مجلة السياحة العربية، خبير في الإعلام السياحي والتنمية السياحية. المجلة هي أول مطبوعة سعودية متخصصة في قطاع السياحة، تهدف لإبراز الكنوز العربية والمعالم السياحية العالمية."
            : "Editor-in-Chief of Arab Tourism Magazine, expert in tourism media and development. The magazine is the first Saudi publication specializing in the tourism sector, aiming to highlight Arab treasures and global tourist attractions.")}
        </Text>

        <View className={`flex-row ${isRTL ? 'flex-row-reverse' : ''}`}>
          <TouchableOpacity className={`bg-primary/5 p-2 rounded-full ${isRTL ? 'me-3' : 'ms-3'}`}>
            <FontAwesome name="twitter" size={18} color="#1a3c34" />
          </TouchableOpacity>
          <TouchableOpacity className="bg-primary/5 p-2 rounded-full">
            <FontAwesome name="linkedin" size={18} color="#1a3c34" />
          </TouchableOpacity>
        </View>
      </View>

      <Image
        source={{ uri: avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop' }}
        className={`w-28 h-28 rounded-3xl ${isRTL ? 'me-6' : 'ms-6'}`}
      />
    </View>
  );
};
