import { useAppStore } from "@/store/useAppStore";
import { useCurrentUser, useUpdateProfile } from "@/hooks/useUser";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowRightOnRectangleIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
  UserCircleIcon,
} from "react-native-heroicons/outline";

export default function ProfileScreen() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const router = useRouter();
  const { user, logout } = useAppStore();
  const { data: wpUser, isLoading: isUserLoading } = useCurrentUser();
  const updateProfileMutation = useUpdateProfile();

  const [name, setName] = useState(user?.name || "");

  useEffect(() => {
    if (user?.name) setName(user.name);
  }, [user?.name]);

  const isSaving = updateProfileMutation.isPending;

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert(
        t("common.error"),
        isRTL ? "الاسم مطلوب" : "Name is required",
      );
      return;
    }

    updateProfileMutation.mutate(
      { name: name.trim() },
      {
        onSuccess: () => {
          Alert.alert(
            isRTL ? "تم بنجاح" : "Success",
            isRTL ? "تم تحديث الملف الشخصي" : "Profile updated successfully",
          );
        },
        onError: (error: any) => {
          Alert.alert(
            t("common.error"),
            error.message || (isRTL ? "فشل تحديث الملف" : "Failed to update profile"),
          );
        },
      },
    );
  };

  const handleLogout = () => {
    Alert.alert(
      t("auth.logout"),
      isRTL
        ? "هل أنت متأكد من تسجيل الخروج؟"
        : "Are you sure you want to log out?",
      [
        { text: t("common.goBack"), style: "cancel" },
        {
          text: t("auth.logout"),
          style: "destructive",
          onPress: () => {
            logout();
            router.replace("/(auth)/login");
          },
        },
      ],
    );
  };

  if (!user) {
    return (
      <View className="flex-1 bg-white items-center justify-center p-10">
        <Text className="text-primary text-xl font-[Cairo_700Bold] text-center mb-6">
          {t("saved.empty")}
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/(auth)/login")}
          className="bg-accent px-8 py-3 rounded-2xl"
        >
          <Text className="text-primary font-[Cairo_700Bold]">
            {t("auth.login")}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-secondary">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-12 bg-primary rounded-b-[40px] shadow-lg">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center rounded-full bg-white/10"
        >
          {isRTL ? (
            <ArrowRightIcon size={22} color="white" />
          ) : (
            <ArrowLeftIcon size={22} color="white" />
          )}
        </TouchableOpacity>
        <Text className="text-white text-xl font-[Cairo_700Bold]">
          {t("auth.profile")}
        </Text>
        <View className="w-10" />
      </View>

      <ScrollView
        className="flex-1 px-6 pt-10"
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar Section */}
        <View className="items-center mb-10">
          <View className="w-32 h-32 rounded-[48px] bg-accent items-center justify-center shadow-xl border-4 border-white">
            <Text className="text-primary text-5xl font-[Cairo_700Bold]">
              {user.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View className="bg-primary px-4 py-1.5 rounded-full -mt-4 shadow-sm">
            <Text className="text-white text-xs font-[Cairo_700Bold] uppercase tracking-widest">
              {user.role || (isRTL ? "عضو" : "Member")}
            </Text>
          </View>
        </View>

        {/* Info Form */}
        <View className="space-y-6">
          {/* Name Field */}
          <View>
            <Text className="text-gray-400 font-[Cairo_700Bold] text-xs uppercase tracking-widest mb-2 px-1">
              {isRTL ? "الاسم بالكامل" : "Full Name"}
            </Text>
            <View className="flex-row items-center bg-white border border-gray-100 rounded-3xl p-4 shadow-sm">
              <UserCircleIcon size={22} color="#1a3c34" strokeWidth={1.5} />
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder={isRTL ? "أدخل اسمك" : "Enter your name"}
                className={`flex-1 ms-3 text-primary font-[Cairo_700Bold] text-base mb-1 ${isRTL ? "text-right" : "text-left"}`}
              />
            </View>
          </View>

          {/* Username Field (Read Only) */}
          <View>
            <Text className="text-gray-400 font-[Cairo_700Bold] text-xs uppercase tracking-widest mb-2 px-1">
              {isRTL ? "اسم المستخدم" : "Username"}
            </Text>
            <View className="flex-row items-center bg-gray-50 border border-gray-100 rounded-3xl p-4 opacity-70">
              <UserCircleIcon size={22} color="#1a3c34" strokeWidth={1.5} />
              <Text
                className={`flex-1 ms-3 text-gray-500 font-[Cairo_400Regular] text-base ${isRTL ? "text-right" : "text-left"}`}
              >
                {user.username || "@user"}
              </Text>
            </View>
          </View>

          {/* Email Field (Read Only) */}
          <View>
            <Text className="text-gray-400 font-[Cairo_700Bold] text-xs uppercase tracking-widest mb-2 px-1">
              {isRTL ? "البريد الإلكتروني" : "Email Address"}
            </Text>
            <View className="flex-row items-center bg-gray-50 border border-gray-100 rounded-3xl p-4 opacity-70">
              <EnvelopeIcon size={22} color="#1a3c34" strokeWidth={1.5} />
              <Text
                className={`flex-1 ms-3 text-gray-500 font-[Cairo_400Regular] text-base ${isRTL ? "text-right" : "text-left"}`}
              >
                {user.email}
              </Text>
            </View>
          </View>

          {/* Registration Date Field (Read Only) */}
          <View>
            <Text className="text-gray-400 font-[Cairo_700Bold] text-xs uppercase tracking-widest mb-2 px-1">
              {isRTL ? "تاريخ التسجيل" : "Registration Date"}
            </Text>
            <View className="flex-row items-center bg-gray-50 border border-gray-100 rounded-3xl p-4 opacity-70">
              <ShieldCheckIcon size={22} color="#ca8a04" strokeWidth={1.5} />
              <Text
                className={`flex-1 ms-3 text-gray-500 font-[Cairo_400Regular] text-base ${isRTL ? "text-right" : "text-left"}`}
              >
                {user.registrationDate || "7 April 2026"}
              </Text>
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            onPress={handleSave}
            disabled={isSaving || name === user.name}
            className={`h-16 rounded-[24px] items-center justify-center shadow-lg mt-6 ${
              isSaving || name === user.name ? "bg-gray-300" : "bg-primary"
            }`}
          >
            <Text className="text-white text-lg font-[Cairo_700Bold]">
              {isSaving
                ? t("common.loading")
                : isRTL
                  ? "حفظ التغييرات"
                  : "Save Changes"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Dangerous Zone */}
        <View className="mt-12 mb-20 border-t border-gray-200 pt-8">
          <TouchableOpacity
            onPress={handleLogout}
            className="flex-row items-center justify-center p-5 bg-red-50 rounded-[24px] border border-red-100"
          >
            <ArrowRightOnRectangleIcon size={24} color="#dc2626" />
            <Text className="text-red-600 font-[Cairo_700Bold] text-lg ms-3">
              {t("auth.logout")}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
