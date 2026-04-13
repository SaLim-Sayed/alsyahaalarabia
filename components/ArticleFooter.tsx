import React from 'react';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { useTranslation } from 'react-i18next';
import { FontAwesome } from '@expo/vector-icons';

export const ArticleFooter = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const socialLinks = [
    { name: 'instagram', icon: 'instagram', color: '#E4405F' },
    { name: 'facebook', icon: 'facebook-official', color: '#1877F2' },
    { name: 'twitter', icon: 'twitter', color: '#1DA1F2' },
    { name: 'youtube', icon: 'youtube-play', color: '#FF0000' },
  ];

  return (
    <View className="bg-primary px-8 pt-16 pb-20 rounded-t-[48px] -mt-10">
      <View className="items-center">
        <Text className="text-white text-3xl font-[Cairo_700Bold]">
          {t('common.magazineName')}
        </Text>
        
        <View className="flex-row my-8">
          {socialLinks.map((social) => (
            <TouchableOpacity 
              key={social.name}
              className="w-12 h-12 rounded-full bg-white/10 items-center justify-center mx-2"
            >
              <FontAwesome name={social.icon as any} size={20} color="white" />
            </TouchableOpacity>
          ))}
        </View>

        <View className="w-full h-[1px] bg-white/10 mb-8" />
        
        <Text className="text-white/40 font-[Cairo_400Regular] text-[10px] text-center">
          {isRTL 
            ? '© 2026 مجلة السياحة العربية. جميع الحقوق محفوظة.' 
            : '© 2026 Arab Tourism Magazine. All rights reserved.'}
        </Text>
      </View>
    </View>
  );
};
