import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import * as Localization from "expo-localization";
import { DevSettings, I18nManager } from "react-native";
import RNRestart from "react-native-restart";
import { Article } from "../types/Article";

/** Skip stacking RTL reloads when layout/store retries same language before native catches up. */
const RTL_RESTART_COOLDOWN_MS = 30_000;

interface User {
  id: string;
  name: string;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  registrationDate?: string;
  avatar?: string;
  role?: string;
  /** Biography / "About" (WordPress `description`) */
  description?: string;
}

interface AppState {
  savedArticles: Article[];
  theme: "light" | "dark";
  language: "ar" | "en" | "kk" | "ur";
  user: User | null;
  token: string | null;
  lastSyncTimestamp: number;
  isTabBarVisible: boolean;
  setTabBarVisible: (visible: boolean) => void;
  hasSeenIntro: boolean;
  setHasSeenIntro: (seen: boolean) => void;
  toggleSaveArticle: (article: Article) => void;
  isArticleSaved: (id: string) => boolean;
  setTheme: (theme: "light" | "dark") => void;
  setLanguage: (lang: "ar" | "en" | "kk" | "ur") => void;
  updateSyncTimestamp: () => void;
  setUser: (user: User | null, token: string | null) => void;
  updateUser: (data: Partial<User>) => void;
  logout: () => void;
  hasHydrated: boolean;
  setHasHydrated: (hydrated: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      savedArticles: [],
      theme: "light",
      language: (() => {
        const lang = Localization.getLocales()[0]?.languageCode || "ar";
        const supported = ["ar", "en", "kk", "ur"];
        return (supported.includes(lang) ? lang : "ar") as
          | "ar"
          | "en"
          | "kk"
          | "ur";
      })(),
      user: null,
      token: null,
      lastSyncTimestamp: 0,
      isTabBarVisible: true,
      setTabBarVisible: (visible) => set({ isTabBarVisible: visible }),
      hasSeenIntro: false,
      setHasSeenIntro: (seen) => set({ hasSeenIntro: seen }),
      setUser: (user, token) => set({ user, token }),
      updateUser: (data) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, ...data } });
        }
      },
      logout: () => set({ user: null, token: null }),
      updateSyncTimestamp: () => set({ lastSyncTimestamp: Date.now() }),
      toggleSaveArticle: (article) => {
        const { savedArticles } = get();
        const isSaved = savedArticles.some((a) => a.id === article.id);
        if (isSaved) {
          set({
            savedArticles: savedArticles.filter((a) => a.id !== article.id),
          });
        } else {
          set({ savedArticles: [...savedArticles, article] });
        }
      },
      isArticleSaved: (id) => {
        return get().savedArticles.some((a) => a.id === id);
      },
      setTheme: (theme) => set({ theme }),
      hasHydrated: false,
      setHasHydrated: (hydrated) => set({ hasHydrated: hydrated }),
      setLanguage: async (lang) => {
        const isRTL = lang === "ar" || lang === "ur";
        const { language: currentLang } = get();

        console.log(
          `[Store] setLanguage called with: ${lang} (Current: ${currentLang})`,
        );

        const directionMismatch = I18nManager.isRTL !== isRTL;

        if (currentLang === lang && !directionMismatch) return;

        // After forceRTL, native may still report the old direction until reload; layout may call
        // setLanguage again after JS reload — without this we restart in a tight loop.
        if (currentLang === lang && directionMismatch) {
          const { lastSyncTimestamp } = get();
          if (
            lastSyncTimestamp > 0 &&
            Date.now() - lastSyncTimestamp < RTL_RESTART_COOLDOWN_MS
          ) {
            console.log(
              `[Store] Skipping RTL restart for ${lang} (cooldown, native RTL may lag)`,
            );
            return;
          }
        }

        console.trace(`[Store] Trace for setLanguage(${lang})`);

        console.log(`[Store] Switching language to ${lang}, RTL: ${isRTL}`);

        // Only bump lastSyncTimestamp when a native RTL reload will run —otherwise RootLayout
        // treats every language change like a reboot and unmounts the whole tree (multi "reload").
        set({
          language: lang,
          ...(directionMismatch ? { lastSyncTimestamp: Date.now() } : {}),
        });

        // Manually flush to AsyncStorage to be absolutely sure it's saved before restart
        try {
          const state = get();
          const {
            isTabBarVisible,
            setTabBarVisible,
            hasHydrated,
            setHasHydrated,
            ...rest
          } = state;
          await AsyncStorage.setItem(
            "app-storage",
            JSON.stringify({ state: rest, version: 0 }),
          );
          console.log("[Store] Manual persistence flush complete");
        } catch (e) {
          console.warn("[Store] Manual flush failed", e);
        }

        if (directionMismatch) {
          I18nManager.allowRTL(isRTL);
          I18nManager.forceRTL(isRTL);

          // Give AsyncStorage more time to flush before the process restarts
          setTimeout(() => {
            console.log(`[Store] Restarting now for ${lang}`);
            try {
              // Priority 1: Native Restart (Best for RTL)
              if (RNRestart && I18nManager.isRTL) {
                const restartFunc =
                  (RNRestart as any).Restart || (RNRestart as any).restart;
                if (typeof restartFunc === "function") {
                  console.log("[Store] Calling RNRestart.Restart()");
                  restartFunc();
                  return;
                }
              }

              // Priority 2: DevSettings (JS reload)
              if (DevSettings && typeof DevSettings.reload === "function") {
                console.log("[Store] Calling DevSettings.reload()");
                DevSettings.reload();
                return;
              }

              console.warn("[Store] No restart method found");
            } catch (error) {
              console.error("[Store] Restart error:", error);
            }
          }, 2000);
        }
      },
    }),
    {
      name: "app-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => {
        const {
          isTabBarVisible,
          setTabBarVisible,
          hasHydrated,
          setHasHydrated,
          ...rest
        } = state;
        return rest;
      },
      onRehydrateStorage: (state) => {
        console.log("[Store] Rehydration started...");
        return (rehydratedState, error) => {
          if (error) {
            console.error("[Store] Rehydration error:", error);
          } else {
            console.log(
              "[Store] Rehydration complete. Language:",
              rehydratedState?.language,
            );
            rehydratedState?.setHasHydrated(true);
          }
        };
      },
    },
  ),
);
