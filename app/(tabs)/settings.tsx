import { AppHeader } from '@/components/AppHeader';
import { useAppStore } from '@/store/useAppStore';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Share, Switch, Text, TouchableOpacity, View } from 'react-native';
import {
  ArrowPathIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DocumentTextIcon,
  InformationCircleIcon,
  LanguageIcon,
  MoonIcon,
  ShareIcon,
  ShieldCheckIcon
} from 'react-native-heroicons/outline';

const SettingItem = ({ icon: Icon, title, value, onPress, showChevron = true, isRTL }: any) => (
  <TouchableOpacity
    onPress={onPress}
    className="flex-row items-center justify-between p-5 bg-white mb-3 rounded-3xl shadow-sm border border-gray-100"
  >
    <View className="flex-row items-center">
      <View className="bg-primary/5 w-10 h-10 rounded-2xl items-center justify-center">
        <Icon size={22} color="#1a3c34" strokeWidth={1.5} />
      </View>
      <Text className="text-gray-800 font-[Cairo_700Bold] text-base mx-4">
        {title}
      </Text>
    </View>

    <View className="flex-row items-center">
      {value && (
        <Text className="text-accent font-[Cairo_700Bold] text-sm mx-2">
          {value}
        </Text>
      )}
      {showChevron && (
        <View className={isRTL ? 'rotate-180' : ''}>
           <ChevronRightIcon size={18} color="#9ca3af" />
        </View>
      )}
    </View>
  </TouchableOpacity>
);

export default function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { language, setLanguage, theme, setTheme } = useAppStore();

  const toggleLanguage = () => {
    const nextLang = language === 'ar' ? 'en' : 'ar';
    setLanguage(nextLang);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: t('article.shareMessage'),
        url: 'https://arabtourism.com',
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View className="flex-1 bg-secondary">
      <AppHeader />

      <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
        <Text className={`text-2xl font-[Cairo_700Bold] text-primary mb-6 ${isRTL ? 'text-right' : 'text-left'}`}>
          {t('settings.title')}
        </Text>

        {/* Language Section */}
        <View className="mb-6">
          <Text className={`text-gray-400 font-[Cairo_700Bold] text-xs uppercase tracking-widest mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
            {t('settings.language')}
          </Text>
          <SettingItem
            icon={LanguageIcon}
            title={t('settings.language')}
            value={language === 'ar' ? t('settings.arabic') : t('settings.english')}
            onPress={toggleLanguage}
            isRTL={isRTL}
          />
        </View>

        {/* Appearance Section */}
        <View className="mb-6">
          <Text className={`text-gray-400 font-[Cairo_700Bold] text-xs uppercase tracking-widest mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
            {t('settings.theme')}
          </Text>
          <View className="flex-row items-center justify-between p-5 bg-white mb-3 rounded-3xl shadow-sm border border-gray-100">
            <View className="flex-row items-center">
              <View className="bg-primary/5 w-10 h-10 rounded-2xl items-center justify-center">
                <MoonIcon size={22} color="#1a3c34" strokeWidth={1.5} />
              </View>
              <Text className="text-gray-800 font-[Cairo_700Bold] text-base mx-4">
                {t('settings.theme')}
              </Text>
            </View>
            <Switch
              value={theme === 'dark'}
              onValueChange={(val) => setTheme(val ? 'dark' : 'light')}
              trackColor={{ false: '#f3f4f6', true: '#fbbf24' }}
              thumbColor={theme === 'dark' ? '#1a3c34' : '#fff'}
            />
          </View>
        </View>

        {/* About Section */}
        <View className="mb-6">
          <Text className={`text-gray-400 font-[Cairo_700Bold] text-xs uppercase tracking-widest mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
            {t('settings.about')}
          </Text>
          <SettingItem icon={ShareIcon} title={t('settings.contact')} onPress={handleShare} isRTL={isRTL} />
          <SettingItem icon={ShieldCheckIcon} title={t('settings.privacy')} isRTL={isRTL} />
          <SettingItem icon={DocumentTextIcon} title={t('settings.terms')} isRTL={isRTL} />
          <SettingItem icon={InformationCircleIcon} title={t('settings.version')} value="1.0.2" showChevron={false} isRTL={isRTL} />
          <SettingItem
            icon={ArrowPathIcon}
            title={isRTL ? 'إعادة تشغيل إجبارية' : 'Force Restart'}
            onPress={() => setLanguage(language)}
            isRTL={isRTL}
          />
        </View>

        <View className="py-10 items-center">
          <Text className="text-gray-300 font-[Cairo_400Regular] text-xs">
            Made with D Arrow in Riyadh
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
