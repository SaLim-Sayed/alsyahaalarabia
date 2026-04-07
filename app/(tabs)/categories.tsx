import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { AppHeader } from '@/components/AppHeader';
import { CATEGORIES } from '@/constants/MockData';
import { ChevronRight } from 'lucide-react-native';

export default function CategoriesScreen() {
  return (
    <View className="flex-1 bg-white">
      <AppHeader />
      <ScrollView className="flex-1 px-6 pt-6">
        <Text className="text-2xl font-[Cairo_700Bold] text-gray-900 mb-6 text-right">
          اكتشف الأقسام
        </Text>
        
        <View className="flex-row flex-wrap justify-between">
          {CATEGORIES.map((cat) => (
            <TouchableOpacity 
              key={cat.id}
              className="w-[48%] bg-gray-50 rounded-3xl p-6 mb-4 items-center justify-center border border-gray-100"
            >
              <View className="bg-primary/10 p-4 rounded-2xl mb-4">
                <Text className="text-2xl">🌍</Text> 
                {/* Simplified for now, can use Lucide icons dynamically */}
              </View>
              <Text className="text-base font-[Cairo_700Bold] text-gray-800 text-center">
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
