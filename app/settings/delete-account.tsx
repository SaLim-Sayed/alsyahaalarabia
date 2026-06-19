import { AuthWebViewScreen } from "@/components/AuthWebViewScreen";
import { useRouter } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { useAppStore } from "@/store/useAppStore";

export default function DeleteAccountScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const logout = useAppStore((state) => state.logout);

  const handleDone = () => {
    // We assume the user might have deleted their account, so it's safer to log them out
    // and let them log back in if they cancelled.
    logout();
    router.replace("/(auth)/login");
  };

  return (
    <AuthWebViewScreen
      uri="https://alsyahaalarabia.com/account/delete/"
      title={t("auth.deleteAccount")}
      subtitle={t("auth.deleteAccountHint")}
      bottomButtonText={t("auth.backToLogin")}
      onBottomButtonPress={handleDone}
    />
  );
}
