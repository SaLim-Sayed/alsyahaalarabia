import { AuthWebViewScreen } from "@/components/AuthWebViewScreen";
import { WP_REGISTER_PAGE_URL } from "@/services/api";
import React from "react";
import { useTranslation } from "react-i18next";

export default function RegisterScreen() {
  const { t } = useTranslation();

  return (
    <AuthWebViewScreen
      uri={WP_REGISTER_PAGE_URL}
      title={t("auth.registerTitle")}
      subtitle={t("auth.registerWebSubtitle")}
    />
  );
}
