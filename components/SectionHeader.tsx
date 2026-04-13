import React from "react";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";

interface SectionHeaderProps {
  title: string;
  onSeeAll?: () => void;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  onSeeAll,
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  return (
    <View className={`px-6 mb-6 flex-row items-center`}>
      <View className="w-1.5 h-6 bg-accent rounded-full mx-3" />
      <Text className="text-xl font-[Cairo_700Bold] text-primary flex-1">
        {title}
      </Text>
      {onSeeAll && (
        <TouchableOpacity onPress={onSeeAll}>
          <Text
            className="text-accent text-[12px] font-[Cairo_700Bold]"
            style={{ textAlign: isRTL ? "right" : "left" }}
          >
            {isRTL ? "عرض الكل" : "View All"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
