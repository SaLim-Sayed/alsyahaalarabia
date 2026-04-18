import { profileTextInputCaret } from "@/constants/Colors";
import {
  createChangePasswordSchema,
  type ChangePasswordFormValues,
} from "@/schemas/forms";
import { loginUser, updateCurrentUserPassword } from "@/services/api";
import { useAppStore } from "@/store/useAppStore";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
} from "react-native-heroicons/outline";

export default function AccountPasswordScreen() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";
  const router = useRouter();
  const { user, setUser, token } = useAppStore();

  const schema = useMemo(
    () => createChangePasswordSchema(t),
    [t, i18n.language],
  );

  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const [saving, setSaving] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const loginIdentifier =
    user?.email?.trim() || user?.username?.trim() || "";

  const resolveApiError = (err: unknown): string => {
    if (axios.isAxiosError(err)) {
      const body = err.response?.data as { message?: string | string[] };
      if (typeof body?.message === "string") return body.message;
      if (Array.isArray(body?.message)) return body.message.join(" ");
    }
    if (err instanceof Error && err.message) return err.message;
    return t("auth.changePasswordFailed");
  };

  const onSubmit = async (data: ChangePasswordFormValues) => {
    clearErrors("root");
    if (!loginIdentifier) {
      setError("root", {
        type: "server",
        message: t("auth.changePasswordNoIdentifier"),
      });
      return;
    }
    if (!token || !user) {
      setError("root", {
        type: "server",
        message: t("auth.changePasswordFailed"),
      });
      return;
    }

    setSaving(true);
    try {
      let newToken = token;
      try {
        const jwt = await loginUser(loginIdentifier, data.currentPassword);
        if (jwt?.token) {
          newToken = jwt.token;
          setUser(user, jwt.token);
        }
      } catch {
        setError("root", {
          type: "server",
          message: t("auth.changePasswordWrongCurrent"),
        });
        return;
      }

      try {
        await updateCurrentUserPassword(data.newPassword);
      } catch (e) {
        console.error("Update password:", e);
        if (newToken !== token) setUser(user, token);
        setError("root", {
          type: "server",
          message: resolveApiError(e),
        });
        return;
      }

      Alert.alert(t("auth.profileUpdatedTitle"), t("auth.passwordChangedBody"), [
        { text: t("common.goBack"), onPress: () => router.back() },
      ]);
    } finally {
      setSaving(false);
    }
  };

  const rootMsg = errors.root?.message as string | undefined;

  return (
  
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <View className="flex-row items-center justify-between px-6 py-10 bg-primary rounded-b-[40px] shadow-lg">
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
          <Text className="text-white text-xl font-[Cairo_700Bold] flex-1 text-center px-4">
            {t("auth.accountPasswordTitle")}
          </Text>
          <View className="w-10" />
        </View>

        <ScrollView
          className="flex-1 px-6 pt-8"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text className="text-gray-600 font-[Cairo_400Regular] text-sm mb-6 leading-6">
            {t("auth.accountPasswordSubtitle")}
          </Text>

          <Controller
            control={control}
            name="currentPassword"
            render={({ field: { value, onChange, onBlur } }) => (
              <View className="mb-4">
                <Text className="text-gray-400 font-[Cairo_700Bold] text-xs uppercase tracking-widest mb-2 px-1">
                  {t("auth.currentPassword")}
                </Text>
                <View
                  className={`flex-row items-center bg-white border border-gray-100 rounded-3xl px-4 ${errors.currentPassword ? "border-red-300" : ""}`}
                >
                  <TextInput
                    {...profileTextInputCaret}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    secureTextEntry={!showCurrent}
                    editable={!saving}
                    placeholder={t("auth.password")}
                    className={`flex-1 py-4 text-primary font-[Cairo_400Regular] text-base ${isRTL ? "text-right" : "text-left"}`}
                  />
                  <TouchableOpacity
                    onPress={() => setShowCurrent((v) => !v)}
                    className="p-2"
                    accessibilityLabel={
                      showCurrent ? t("auth.hidePassword") : t("auth.showPassword")
                    }
                  >
                    <Ionicons
                      name={showCurrent ? "eye-off-outline" : "eye-outline"}
                      size={22}
                      color="#1a3c34"
                    />
                  </TouchableOpacity>
                </View>
                {errors.currentPassword?.message ? (
                  <Text className="text-red-500 text-xs mt-1 px-1">
                    {errors.currentPassword.message}
                  </Text>
                ) : null}
              </View>
            )}
          />

          <Controller
            control={control}
            name="newPassword"
            render={({ field: { value, onChange, onBlur } }) => (
              <View className="mb-4">
                <Text className="text-gray-400 font-[Cairo_700Bold] text-xs uppercase tracking-widest mb-2 px-1">
                  {t("auth.newPassword")}
                </Text>
                <View
                  className={`flex-row items-center bg-white border border-gray-100 rounded-3xl px-4 ${errors.newPassword ? "border-red-300" : ""}`}
                >
                  <TextInput
                    {...profileTextInputCaret}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    secureTextEntry={!showNew}
                    editable={!saving}
                    placeholder={t("auth.newPassword")}
                    className={`flex-1 py-4 text-primary font-[Cairo_400Regular] text-base ${isRTL ? "text-right" : "text-left"}`}
                  />
                  <TouchableOpacity
                    onPress={() => setShowNew((v) => !v)}
                    className="p-2"
                  >
                    <Ionicons
                      name={showNew ? "eye-off-outline" : "eye-outline"}
                      size={22}
                      color="#1a3c34"
                    />
                  </TouchableOpacity>
                </View>
                {errors.newPassword?.message ? (
                  <Text className="text-red-500 text-xs mt-1 px-1">
                    {errors.newPassword.message}
                  </Text>
                ) : null}
              </View>
            )}
          />

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { value, onChange, onBlur } }) => (
              <View className="mb-4">
                <Text className="text-gray-400 font-[Cairo_700Bold] text-xs uppercase tracking-widest mb-2 px-1">
                  {t("auth.confirmNewPassword")}
                </Text>
                <View
                  className={`flex-row items-center bg-white border border-gray-100 rounded-3xl px-4 ${errors.confirmPassword ? "border-red-300" : ""}`}
                >
                  <TextInput
                    {...profileTextInputCaret}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    secureTextEntry={!showConfirm}
                    editable={!saving}
                    placeholder={t("auth.confirmNewPassword")}
                    className={`flex-1 py-4 text-primary font-[Cairo_400Regular] text-base ${isRTL ? "text-right" : "text-left"}`}
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirm((v) => !v)}
                    className="p-2"
                  >
                    <Ionicons
                      name={showConfirm ? "eye-off-outline" : "eye-outline"}
                      size={22}
                      color="#1a3c34"
                    />
                  </TouchableOpacity>
                </View>
                {errors.confirmPassword?.message ? (
                  <Text className="text-red-500 text-xs mt-1 px-1">
                    {errors.confirmPassword.message}
                  </Text>
                ) : null}
              </View>
            )}
          />

          {rootMsg ? (
            <Text className="text-red-600 font-[Cairo_400Regular] text-sm mb-4 px-1">
              {rootMsg}
            </Text>
          ) : null}

       
        </ScrollView>   <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={saving}
            className={`h-14 rounded-2xl items-center justify-center m-10 ${saving ? "bg-gray-300" : "bg-primary"}`}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-[Cairo_700Bold] text-base">
                {t("auth.saveNewPassword")}
              </Text>
            )}
          </TouchableOpacity>
      </KeyboardAvoidingView>
   );
}
