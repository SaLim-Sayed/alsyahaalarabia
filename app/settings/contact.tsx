import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { ArrowLeftIcon, ArrowRightIcon, EnvelopeIcon, PhoneIcon, UserIcon, WrenchScrewdriverIcon } from 'react-native-heroicons/outline';

export default function ContactScreen() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const router = useRouter();

  const handleEmail = (email: string) => {
    Linking.openURL(`mailto:${email}`);
  };

  const handlePhone = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const contactSections = [
    {
      title: isRTL ? 'الإدارة والتحرير' : 'Management & Editorial',
      person: isRTL ? 'الأستاذ: عباس الإبراهيم' : 'Mr. Abbas Al-Ibrahim',
      email: 'info@alsyahaalarabia.com',
      icon: UserIcon,
      color: '#1a3c34'
    },
    {
      title: isRTL ? 'الدعم الفني والتقني' : 'Technical Support',
      person: isRTL ? 'علي محمد الشغب – Beedco' : 'Ali Mohammed Al-Shaghab – Beedco',
      email: 'Support@alsyahaalarabia.com',
      phone: '0550442290',
      icon: WrenchScrewdriverIcon,
      color: '#fbbf24'
    },
    {
      title: isRTL ? 'سياسات الخصوصية' : 'Privacy Policies',
      email: 'privacy@alsyahaalarabia.com',
      icon: EnvelopeIcon,
      color: '#1a3c34'
    }
  ];

  return (
    <View className="flex-1 bg-secondary">
      {/* Header */}
      <View className="bg-primary pt-14 pb-10 px-6 rounded-b-[40px] shadow-lg">
        <TouchableOpacity 
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center rounded-full bg-white/10 mb-6"
        >
          {isRTL ? <ArrowRightIcon size={22} color="white" /> : <ArrowLeftIcon size={22} color="white" />}
        </TouchableOpacity>
        <Text className="text-white text-3xl font-[Cairo_700Bold]">
          {isRTL ? 'اتصل بنا' : 'Contact Us'}
        </Text>
        <Text className="text-accent text-sm font-[Cairo_400Regular] mt-2">
          {isRTL ? 'نحن هنا للإجابة على استفساراتكم' : 'We are here to answer your inquiries'}
        </Text>
      </View>

      <ScrollView className="flex-1 px-6 pt-8" showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => Linking.openURL('https://alsyahaalarabia.com/contact-us')}>
            <Text className="text-accent/60 text-[10px] font-[Cairo_400Regular] mb-6 text-center underline">
              Source: https://alsyahaalarabia.com/contact-us
            </Text>
        </TouchableOpacity>
        {contactSections.map((section, index) => (
          <View key={index} className="mb-8">
            <Text className="text-gray-400 font-[Cairo_700Bold] text-xs uppercase tracking-widest mb-4 px-2">
              {section.title}
            </Text>
            
            <View className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100">
              <View className="flex-row items-center mb-6">
                <View className="w-12 h-12 rounded-2xl bg-secondary items-center justify-center me-4">
                  <section.icon size={26} color={section.color} strokeWidth={1.5} />
                </View>
                <View className="flex-1">
                  {section.person && (
                    <Text className="text-gray-800 font-[Cairo_700Bold] text-base mb-1">
                      {section.person}
                    </Text>
                  )}
                  <Text className="text-gray-400 font-[Cairo_400Regular] text-xs">
                    {section.title}
                  </Text>
                </View>
              </View>

              {/* Actions */}
              <View className="space-y-3">
                <TouchableOpacity 
                  onPress={() => handleEmail(section.email)}
                  className="flex-row items-center bg-secondary/50 p-4 rounded-2xl"
                >
                  <EnvelopeIcon size={20} color="#1a3c34" />
                  <Text className="text-primary font-[Cairo_700Bold] text-sm ms-3">
                    {section.email}
                  </Text>
                </TouchableOpacity>

                {section.phone && (
                  <TouchableOpacity 
                    onPress={() => handlePhone(section.phone!)}
                    className="flex-row items-center bg-secondary/50 p-4 rounded-2xl mt-3"
                  >
                    <PhoneIcon size={20} color="#1a3c34" />
                    <Text className="text-primary font-[Cairo_700Bold] text-sm ms-3">
                      {section.phone}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        ))}

        <View className="py-10 items-center">
          <Text className="text-gray-400 font-[Cairo_400Regular] text-xs text-center px-10 leading-5">
            {isRTL 
              ? 'ساعات العمل: الأحد - الخميس\n9:00 صباحاً - 5:00 مساءً' 
              : 'Working Hours: Sunday - Thursday\n9:00 AM - 5:00 PM'}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
