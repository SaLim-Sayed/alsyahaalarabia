import type { TFunction } from "i18next";
import { z } from "zod";

export function createLoginFormSchema(t: TFunction) {
  return z.object({
    username: z
      .string()
      .trim()
      .min(1, t("auth.validation.usernameRequired")),
    password: z
      .string()
      .min(1, t("auth.validation.passwordRequired")),
  });
}

export type LoginFormValues = z.infer<
  ReturnType<typeof createLoginFormSchema>
>;

export function createProfileFormSchema(t: TFunction) {
  return z.object({
    name: z
      .string()
      .trim()
      .min(1, t("auth.validation.displayNameRequired")),
    firstName: z.string(),
    lastName: z.string(),
    description: z.string(),
    email: z
      .string()
      .trim()
      .min(1, t("auth.validation.emailRequired"))
      .email(t("auth.validation.emailInvalid")),
  });
}

export type ProfileFormValues = z.infer<
  ReturnType<typeof createProfileFormSchema>
>;

export function createForgotPasswordSchema(t: TFunction) {
  return z.object({
    userLogin: z
      .string()
      .trim()
      .min(1, t("auth.validation.resetIdentifierRequired")),
  });
}

export type ForgotPasswordFormValues = z.infer<
  ReturnType<typeof createForgotPasswordSchema>
>;

export function createRegisterFormSchema(t: TFunction) {
  return z.object({
    userLogin: z
      .string()
      .trim()
      .min(1, t("auth.validation.usernameRequired")),
    userEmail: z
      .string()
      .trim()
      .min(1, t("auth.validation.emailRequired"))
      .email(t("auth.validation.emailInvalid")),
  });
}

export type RegisterFormValues = z.infer<
  ReturnType<typeof createRegisterFormSchema>
>;

export function createChangePasswordSchema(t: TFunction) {
  return z
    .object({
      currentPassword: z
        .string()
        .min(1, t("auth.validation.passwordRequired")),
      newPassword: z
        .string()
        .min(8, t("auth.validation.newPasswordMinLength")),
      confirmPassword: z
        .string()
        .min(1, t("auth.validation.confirmPasswordRequired")),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t("auth.validation.passwordsMustMatch"),
      path: ["confirmPassword"],
    });
}

export type ChangePasswordFormValues = z.infer<
  ReturnType<typeof createChangePasswordSchema>
>;
