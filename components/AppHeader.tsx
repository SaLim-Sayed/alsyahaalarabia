import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { Search, Menu, Bell } from 'lucide-react-native';

export const AppHeader = () => {
  return (
    <SafeAreaView className="bg-white border-b border-gray-100">
      <View className="px-6 py-4 flex-row items-center justify-between">
        <TouchableOpacity className="p-2">
          <Menu size={24} color="#14532d" />
        </TouchableOpacity>

        <View className="items-center">
          <Text className="text-xl font-[Cairo_700Bold] text-primary">
            السياحة العربية
          </Text>
          <Text className="text-[10px] font-[Cairo_400Regular] text-gray-500 uppercase tracking-widest">
            Arab Tourism Magazine
          </Text>
        </View>

        <View className="flex-row">
          <TouchableOpacity className="p-2">
            <Search size={24} color="#14532d" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};
