import { profileTextInputCaret } from "@/constants/Colors";
import { useCurrentUser, useUpdateProfile } from "@/hooks/useUser";
import {
  createProfileFormSchema,
  type ProfileFormValues,
} from "@/schemas/forms";
import { useAppStore } from "@/store/useAppStore";
import type { WPUser } from "@/types/wp-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
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
  DocumentTextIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
  UserCircleIcon,
} from "react-native-heroicons/outline";

/** Baseline for WP diff when `/users/me` has not loaded yet */
function baselineFromStores(
  wpUser: WPUser | null | undefined,
  user: {
    name: string;
    email: string;
    firstName?: string;
    lastName?: string;
    description?: string;
  },
) {
  return {
    name: wpUser?.name ?? user.name ?? "",
    first_name: wpUser?.first_name ?? user.firstName ?? "",
    last_name: wpUser?.last_name ?? user.lastName ?? "",
    description: wpUser?.description ?? user.description ?? "",
    email: wpUser?.email ?? user.email ?? "",
  };
}

function buildWpPatch(
  data: ProfileFormValues,
  baseline: ReturnType<typeof baselineFromStores>,
): Record<string, unknown> {
  const payload: Record<string, unknown> = {};
  if (data.name.trim() !== baseline.name.trim()) payload.name = data.name.trim();
  if (data.firstName.trim() !== baseline.first_name.trim())
    payload.first_name = data.firstName.trim();
  if (data.lastName.trim() !== baseline.last_name.trim())
    payload.last_name = data.lastName.trim();
  if (data.description.trim() !== baseline.description.trim())
    payload.description = data.description.trim();
  if (
    data.email.trim().toLowerCase() !== baseline.email.trim().toLowerCase()
  ) {
    payload.email = data.email.trim();
  }
  return payload;
}

export default function ProfileScreen() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";
  const router = useRouter();
  const { user, logout } = useAppStore();
  const { data: wpUser, isLoading: isUserLoading } = useCurrentUser();
  const updateProfileMutation = useUpdateProfile();

  const profileSchema = useMemo(
    () => createProfileFormSchema(t),
    [t, i18n.language],
  );

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      firstName: "",
      lastName: "",
      description: "",
      email: "",
    },
  });

  const watchedName = watch("name");

  useEffect(() => {
    if (!user) return;
    const b = baselineFromStores(wpUser ?? undefined, user);
    reset({
      name: b.name,
      firstName: b.first_name,
      lastName: b.last_name,
      description: b.description,
      email: b.email,
    });
  }, [
    user,
    wpUser?.name,
    wpUser?.first_name,
    wpUser?.last_name,
    wpUser?.description,
    wpUser?.email,
    wpUser?.id,
    reset,
  ]);

  const baseline = useMemo(() => {
    if (!user) return null;
    return baselineFromStores(wpUser ?? undefined, user);
  }, [user, wpUser]);

  const isSaving = updateProfileMutation.isPending;

  const onSubmit = (data: ProfileFormValues) => {
    if (!user || !baseline) return;

    const payload = buildWpPatch(data, baseline);
    if (Object.keys(payload).length === 0) return;

    updateProfileMutation.mutate(payload, {
      onSuccess: () => {
        Alert.alert(
          t("auth.profileUpdatedTitle"),
          t("auth.profileUpdatedBody"),
        );
      },
      onError: (error: unknown) => {
        const msg =
          error instanceof Error ? error.message : String(error);
        Alert.alert(
          t("common.error"),
          msg || t("auth.profileUpdateFailed"),
        );
      },
    });
  };

  const handleLogout = () => {
    Alert.alert(
      t("auth.logout"),
      t("auth.logoutConfirmMessage"),
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

  const fieldWrap = (
    label: string,
    children: React.ReactNode,
    hint?: string,
  ) => (
    <View>
      <Text className="text-gray-400 font-[Cairo_700Bold] text-xs uppercase tracking-widest mb-2 px-1">
        {label}
      </Text>
      {children}
      {hint ? (
        <Text className="text-red-500 font-[Cairo_400Regular] text-xs mt-1 px-1">
          {hint}
        </Text>
      ) : null}
    </View>
  );

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

  if (isUserLoading && !wpUser) {
    return (
      <View className="flex-1 bg-secondary items-center justify-center">
        <ActivityIndicator size="large" color="#1a3c34" />
        <Text className="text-gray-500 font-[Cairo_400Regular] mt-4">
          {t("common.loading")}
        </Text>
      </View>
    );
  }

  const initialLetter = (
    watchedName ||
    user.name ||
    ""
  ).charAt(0).toUpperCase();

  return (
    <SafeAreaView className="flex-1 bg-secondary">
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
        <TouchableOpacity
          onPress={handleLogout}
          accessibilityRole="button"
          accessibilityLabel={t("auth.logout")}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          className="w-10 h-10 items-center justify-center rounded-full bg-white/10"
        >
          <ArrowRightOnRectangleIcon size={22} color="#ffffff" strokeWidth={1.75} />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-[0.96] px-6 pt-10"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="items-center mb-10">
          <View className="w-32 h-32 rounded-[48px] bg-accent items-center justify-center shadow-xl border-4 border-white overflow-hidden">
            <Text className="text-primary text-5xl font-[Cairo_700Bold]">
              {initialLetter}
            </Text>
          </View>
          <View className="bg-primary px-4 py-1.5 rounded-full mt-3 shadow-sm">
            <Text className="text-white text-xs font-[Cairo_700Bold] uppercase tracking-widest">
              {user.role || t("auth.profileForm.member")}
            </Text>
          </View>
        </View>

        <View className="space-y-6 flex flex-col gap-4">
          {fieldWrap(
            t("auth.profileForm.displayName"),
            <Controller
              control={control}
              name="name"
              render={({ field: { value, onChange, onBlur } }) => (
                <View className="flex-row items-center bg-white border border-gray-100 rounded-3xl p-4 shadow-sm">
                  <UserCircleIcon size={22} color="#1a3c34" strokeWidth={1.5} />
                  <TextInput
                    {...profileTextInputCaret}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder={t("auth.profileForm.displayNamePlaceholder")}
                    editable={!isSaving}
                    className={`flex-1 ms-3 text-primary font-[Cairo_700Bold] text-base py-1 ${isRTL ? "text-right" : "text-left"}`}
                  />
                </View>
              )}
            />,
            errors.name?.message,
          )}

          {fieldWrap(
            t("auth.profileForm.firstName"),
            <Controller
              control={control}
              name="firstName"
              render={({ field: { value, onChange, onBlur } }) => (
                <View className="flex-row items-center bg-white border border-gray-100 rounded-3xl p-4 shadow-sm">
                  <UserCircleIcon size={22} color="#1a3c34" strokeWidth={1.5} />
                  <TextInput
                    {...profileTextInputCaret}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder={t("auth.profileForm.firstNamePlaceholder")}
                    editable={!isSaving}
                    autoCapitalize="words"
                    className={`flex-1 ms-3 text-primary font-[Cairo_700Bold] text-base py-1 ${isRTL ? "text-right" : "text-left"}`}
                  />
                </View>
              )}
            />,
            errors.firstName?.message,
          )}

          {fieldWrap(
            t("auth.profileForm.lastName"),
            <Controller
              control={control}
              name="lastName"
              render={({ field: { value, onChange, onBlur } }) => (
                <View className="flex-row items-center bg-white border border-gray-100 rounded-3xl p-4 shadow-sm">
                  <UserCircleIcon size={22} color="#1a3c34" strokeWidth={1.5} />
                  <TextInput
                    {...profileTextInputCaret}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder={t("auth.profileForm.lastNamePlaceholder")}
                    editable={!isSaving}
                    autoCapitalize="words"
                    className={`flex-1 ms-3 text-primary font-[Cairo_700Bold] text-base py-1 ${isRTL ? "text-right" : "text-left"}`}
                  />
                </View>
              )}
            />,
            errors.lastName?.message,
          )}

          {fieldWrap(
            t("auth.profileForm.biography"),
            <Controller
              control={control}
              name="description"
              render={({ field: { value, onChange, onBlur } }) => (
                <View className="flex-row items-start bg-white border border-gray-100 rounded-3xl p-4 shadow-sm">
                  <DocumentTextIcon
                    size={22}
                    color="#1a3c34"
                    strokeWidth={1.5}
                    style={{ marginTop: 4 }}
                  />
                  <TextInput
                    {...profileTextInputCaret}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder={t("auth.profileForm.biographyPlaceholder")}
                    editable={!isSaving}
                    multiline
                    textAlignVertical="top"
                    numberOfLines={4}
                    className={`flex-1 ms-3 text-primary font-[Cairo_400Regular] text-base min-h-[100px] py-1 ${isRTL ? "text-right" : "text-left"}`}
                  />
                </View>
              )}
            />,
            errors.description?.message,
          )}


          <View className="my-3">
            <Text className="text-gray-400 font-[Cairo_700Bold] text-xs uppercase tracking-widest mb-2 px-1">
              {t("auth.profileForm.email")}
            </Text>
            <View className="flex-row items-center bg-gray-50 border border-gray-100 rounded-3xl p-4 opacity-70">
              <EnvelopeIcon size={22} color="#1a3c34" strokeWidth={1.5} />
              <Text
                className={`flex-1 ms-3 text-gray-500 font-[Cairo_400Regular] text-base ${isRTL ? "text-right" : "text-left"}`}
              >
                {user.email || t("auth.profileForm.fallbackEmail")}
              </Text>
            </View>
          </View>

          <View>
            <Text className="text-gray-400 font-[Cairo_700Bold] text-xs uppercase tracking-widest mb-2 px-1">
              {t("auth.profileForm.usernameSlug")}
            </Text>
            <View className="flex-row items-center bg-gray-50 border border-gray-100 rounded-3xl p-4 opacity-70">
              <UserCircleIcon size={22} color="#1a3c34" strokeWidth={1.5} />
              <Text
                className={`flex-1 ms-3 text-gray-500 font-[Cairo_400Regular] text-base ${isRTL ? "text-right" : "text-left"}`}
              >
                {user.username || t("auth.profileForm.fallbackUsername")}
              </Text>
            </View>
          </View>

          <View>
            <Text className="text-gray-400 font-[Cairo_700Bold] text-xs uppercase tracking-widest mb-2 px-1">
              {t("auth.profileForm.registrationDate")}
            </Text>
            <View className="flex-row items-center bg-gray-50 border border-gray-100 rounded-3xl p-4 opacity-70">
              <ShieldCheckIcon size={22} color="#ca8a04" strokeWidth={1.5} />
              <Text
                className={`flex-1 ms-3 text-gray-500 font-[Cairo_400Regular] text-base ${isRTL ? "text-right" : "text-left"}`}
              >
                {user.registrationDate || "—"}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => router.push("/settings/account-password")}
            accessibilityRole="button"
            accessibilityHint={t("auth.accountPasswordTitle")}
            className="flex-row items-center bg-white border border-gray-100 rounded-3xl p-4 shadow-sm active:opacity-90"
          >
            <ShieldCheckIcon size={22} color="#1a3c34" strokeWidth={1.5} />
            <Text
              className={`flex-1 ms-3 text-primary font-[Cairo_700Bold] text-base ${isRTL ? "text-right" : "text-left"}`}
            >
              {t("auth.accountPasswordTitle")}
            </Text>
            {isRTL ? (
              <ArrowLeftIcon size={20} color="#1a3c34" />
            ) : (
              <ArrowRightIcon size={20} color="#1a3c34" />
            )}
          </TouchableOpacity>

        </View>
      </ScrollView> <TouchableOpacity
        onPress={handleSubmit(onSubmit)}
        disabled={isSaving || !isDirty}
        className={`h-16 rounded-[24px]  items-center justify-center shadow-lg m-6 ${isSaving || !isDirty ? "bg-gray-300" : "bg-primary"
          }`}
      >
        <Text className="text-white text-lg font-[Cairo_700Bold]">
          {isSaving ? t("common.loading") : t("auth.profileForm.saveChanges")}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
