import { AuthWebViewScreen } from "@/components/AuthWebViewScreen";
import { WP_PASSWORD_RESET_PAGE_URL } from "@/services/api";
import React from "react";
import { useTranslation } from "react-i18next";

export default function ForgotPasswordScreen() {
  const { t } = useTranslation();

  return (
    <AuthWebViewScreen
      uri={WP_PASSWORD_RESET_PAGE_URL}
      title={t("auth.forgotPasswordTitle")}
      subtitle={t("auth.forgotPasswordWebSubtitle")}
    />
  );
}
