import { loginTextInputCaret } from "@/constants/Colors";
import {
  createLoginFormSchema,
  type LoginFormValues,
} from "@/schemas/forms";
import { getCurrentUser, loginUser } from "@/services/api";
import { useAppStore } from "@/store/useAppStore";
import { mapWPUserToAppUser } from "@/utils/mapper";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ArrowLeftIcon, ArrowRightIcon } from "react-native-heroicons/outline";

export default function LoginScreen() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";
  const router = useRouter();
  const { setUser } = useAppStore();

  const loginSchema = useMemo(
    () => createLoginFormSchema(t),
    [t, i18n.language],
  );

  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  const [isLoading, setIsLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const resolveLoginError = (err: unknown): string => {
    if (axios.isAxiosError(err)) {
      const body = err.response?.data as { message?: string | string[] };
      if (typeof body?.message === "string") return body.message;
      if (Array.isArray(body?.message)) return body.message.join(" ");
    }
    if (err instanceof Error && err.message) return err.message;
    return t("auth.invalidCredentials");
  };

  const onSubmit = async (data: LoginFormValues) => {
    clearErrors("root");
    setIsLoading(true);
    try {
      const jwt = await loginUser(data.username, data.password);
      if (!jwt?.token) {
        setError("root", {
          type: "server",
          message: t("auth.invalidCredentials"),
        });
        return;
      }

      const uid = jwt.user_id ?? jwt.id;
      setUser(
        {
          id: uid != null ? String(uid) : "",
          name: jwt.user_display_name || jwt.user_nicename || data.username,
          email: jwt.user_email || "",
          username: jwt.user_nicename || data.username,
        },
        jwt.token,
      );

      const wpUser = await getCurrentUser();
      const appUser = mapWPUserToAppUser(wpUser);
      setUser(appUser as any, jwt.token);

      router.replace("/(tabs)");
    } catch (e) {
      console.error("Login Error:", e);
      setError("root", {
        type: "server",
        message: resolveLoginError(e),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = () => {
    router.push("/(auth)/register");
  };

  const handleForgotPassword = () => {
    router.push("/(auth)/forgot-password");
  };

  const rootMsg = errors.root?.message as string | undefined;

  return (
    <View className="flex-1 bg-primary">
      <ImageBackground
        source={{
          uri: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=1000&auto=format&fit=crop",
        }}
        className="flex-1"
        resizeMode="cover"
      >
        <LinearGradient
          colors={["rgba(26,60,52,0.6)", "rgba(26,60,52,0.9)"]}
          className="flex-1"
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            className="flex-1"
          >
            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ flexGrow: 1 }}
              showsVerticalScrollIndicator={false}
            >
              <View className="flex-1 px-8 justify-center pt-24 pb-12">
                <TouchableOpacity
                  onPress={() => router.back()}
                  className="absolute top-14 left-6 w-10 h-10 rounded-full bg-white/10 items-center justify-center"
                >
                  {isRTL ? (
                    <ArrowRightIcon size={20} color="white" />
                  ) : (
                    <ArrowLeftIcon size={20} color="white" />
                  )}
                </TouchableOpacity>

                <View className="mb-10">
                  <Text className="text-white text-4xl font-[Cairo_700Bold] text-start mb-2">
                    {t("auth.welcomeBack")}
                  </Text>
                  <Text className="text-accent text-lg font-[Cairo_400Regular] text-start">
                    {t("auth.signInToContinue")}
                  </Text>
                </View>

                <View className="space-y-4 flex flex-col gap-4">
                  <Controller
                    control={control}
                    name="username"
                    render={({ field: { value, onChange, onBlur } }) => (
                      <View>
                        <TextInput
                          {...loginTextInputCaret}
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          placeholder={t("auth.usernameOrEmail")}
                          placeholderTextColor="rgba(255,255,255,0.45)"
                          autoCapitalize="none"
                          autoCorrect={false}
                          editable={!isLoading}
                          className={`bg-white/10 border my-2 border-white/20 rounded-2xl px-4 py-4 text-white font-[Cairo_400Regular] text-base ${isRTL ? "text-right" : "text-left"} ${errors.username ? "border-red-400/60" : ""}`}
                        />
                        {errors.username?.message ? (
                          <Text className="text-red-300 font-[Cairo_400Regular] text-xs mt-1 px-1">
                            {errors.username.message}
                          </Text>
                        ) : null}
                      </View>
                    )}
                  />

                  <Controller
                    control={control}
                    name="password"
                    render={({ field: { value, onChange, onBlur } }) => (
                      <View>
                        <View
                          className={`flex-row items-center my-2 bg-white/10 border border-white/20 rounded-2xl px-4 ${errors.password ? "border-red-400/60" : ""}`}
                        >
                          <TextInput
                            {...loginTextInputCaret}
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            placeholder={t("auth.password")}
                            placeholderTextColor="rgba(255,255,255,0.45)"
                            secureTextEntry={!showPassword}
                            editable={!isLoading}
                            className={`flex-1 py-4 text-white font-[Cairo_400Regular] text-base ${isRTL ? "text-right" : "text-left"}`}
                          />
                          <TouchableOpacity
                            onPress={() => setShowPassword((v) => !v)}
                            accessibilityRole="button"
                            accessibilityLabel={
                              showPassword
                                ? t("auth.hidePassword")
                                : t("auth.showPassword")
                            }
                            hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}
                            activeOpacity={0.7}
                            className="p-2 -me-1"
                          >
                            <Ionicons
                              name={
                                showPassword ? "eye-off-outline" : "eye-outline"
                              }
                              size={24}
                              color="#ffffff"
                            />
                          </TouchableOpacity>
                        </View>
                        {errors.password?.message ? (
                          <Text className="text-red-300 font-[Cairo_400Regular] text-xs mt-1 px-1">
                            {errors.password.message}
                          </Text>
                        ) : null}
                      </View>
                    )}
                  />

                  <TouchableOpacity
                    onPress={handleForgotPassword}
                    disabled={isLoading}
                    accessibilityRole="link"
                    accessibilityHint={t("auth.forgotPassword")}
                    className={`mt-1 mb-1 ${isRTL ? "self-start" : "self-end"}`}
                  >
                    <Text className="text-accent font-[Cairo_700Bold] text-sm underline decoration-accent">
                      {t("auth.forgotPassword")}
                    </Text>
                  </TouchableOpacity>

                  {rootMsg ? (
                    <Text className="text-red-300 font-[Cairo_400Regular] text-sm px-1">
                      {rootMsg}
                    </Text>
                  ) : null}

                  <TouchableOpacity
                    onPress={handleSubmit(onSubmit)}
                    disabled={isLoading}
                    className={`bg-accent h-16 rounded-2xl items-center justify-center shadow-lg mt-2 ${isLoading ? "opacity-70" : ""}`}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#1a3c34" />
                    ) : (
                      <Text className="text-primary text-lg font-[Cairo_700Bold]">
                        {t("auth.login")}
                      </Text>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleRegister}
                    disabled={isLoading}
                    className="bg-white/10 h-16 rounded-2xl items-center justify-center mt-2 border border-white/20"
                  >
                    <Text className="text-white text-lg font-[Cairo_700Bold]">
                      {t("auth.signUp")}
                    </Text>
                  </TouchableOpacity>

                  <View className="mt-8 p-6 bg-white/5 rounded-[32px] border border-white/5">
                    <Text className="text-gray-300 text-center font-[Cairo_400Regular] leading-6">
                      {t("auth.loginFooterNote")}
                    </Text>
                  </View>
                </View>

                <View className="mt-12 items-center">
                  <Text className="text-white/40 font-[Cairo_400Regular] text-xs">
                    {t("auth.copyright")}
                  </Text>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}
