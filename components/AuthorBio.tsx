import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { useTranslation } from "react-i18next";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface AuthorBioProps {
  name: string;
  avatar?: string;
  bio?: string;
}

export const AuthorBio: React.FC<AuthorBioProps> = ({ name, avatar, bio }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  return (
    <View className="mt-12 mb-16 bg-secondary rounded-[32px] p-8 border border-gray-100 flex-row items-center">
      <View className={`flex-1`}>
        <Text className="text-accent text-xs font-[Cairo_700Bold] mb-2">
          {t("article.aboutAuthor")}
        </Text>
        <Text className="text-xl font-[Cairo_700Bold] text-primary mb-3">
          {name || (isRTL ? "عباس البراهيم" : "Abbas Al-Ibrahim")}
        </Text>
        <Text className="text-gray-500 font-[Cairo_400Regular] leading-6 mb-4">
          {bio ||
            (isRTL
              ? "رئيس تحرير مجلة السياحة العربية، خبير في الإعلام السياحي والتنمية السياحية. المجلة هي أول مطبوعة سعودية متخصصة في قطاع السياحة، تهدف لإبراز الكنوز العربية والمعالم السياحية العالمية."
              : "Editor-in-Chief of Arab Tourism Magazine, expert in tourism media and development. The magazine is the first Saudi publication specializing in the tourism sector, aiming to highlight Arab treasures and global tourist attractions.")}
        </Text>

        <View className="flex-row">
          <TouchableOpacity className="bg-primary/5 p-2 rounded-full mx-1">
            <FontAwesome name="twitter" size={18} color="#1a3c34" />
          </TouchableOpacity>
          <TouchableOpacity className="bg-primary/5 p-2 rounded-full mx-1">
            <FontAwesome name="linkedin" size={18} color="#1a3c34" />
          </TouchableOpacity>
        </View>
      </View>

      <Image
        source={{
          uri:
            avatar ||
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop",
        }}
        className="w-28 h-28 rounded-3xl ms-6"
      />
    </View>
  );
};
