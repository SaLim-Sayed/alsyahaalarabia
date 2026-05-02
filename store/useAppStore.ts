import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { I18nManager, DevSettings } from 'react-native';
import RNRestart from 'react-native-restart';
import * as Updates from 'expo-updates';
import * as Localization from 'expo-localization';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
  author?: string;
  content?: string;
}

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
  theme: 'light' | 'dark';
  language: 'ar' | 'en' | 'kk' | 'ur';
  user: User | null;
  token: string | null;
  lastSyncTimestamp: number;
  isTabBarVisible: boolean;
  setTabBarVisible: (visible: boolean) => void;
  hasSeenIntro: boolean;
  setHasSeenIntro: (seen: boolean) => void;
  toggleSaveArticle: (article: Article) => void;
  isArticleSaved: (id: string) => boolean;
  setTheme: (theme: 'light' | 'dark') => void;
  setLanguage: (lang: 'ar' | 'en' | 'kk' | 'ur') => void;
  updateSyncTimestamp: () => void;
  setUser: (user: User | null, token: string | null) => void;
  updateUser: (data: Partial<User>) => void;
  logout: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      savedArticles: [],
      theme: 'light',
      language: (() => {
        const lang = Localization.getLocales()[0]?.languageCode || 'ar';
        const supported = ['ar', 'en', 'kk', 'ur'];
        return (supported.includes(lang) ? lang : 'ar') as 'ar' | 'en' | 'kk' | 'ur';
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
          set({ savedArticles: savedArticles.filter((a) => a.id !== article.id) });
        } else {
          set({ savedArticles: [...savedArticles, article] });
        }
      },
      isArticleSaved: (id) => {
        return get().savedArticles.some((a) => a.id === id);
      },
      setTheme: (theme) => set({ theme }),
      setLanguage: async (lang) => {
        const isRTL = lang === 'ar' || lang === 'ur';
        const { language: currentLang } = get();
        
        // If language hasn't changed, do nothing
        if (currentLang === lang && I18nManager.isRTL === isRTL) return;

        console.log(`[Store] Switching language to ${lang}, RTL: ${isRTL}`);
        
        // Update state first
        set({ language: lang, lastSyncTimestamp: Date.now() });

        const directionMismatch = I18nManager.isRTL !== isRTL;
        
        if (directionMismatch) {
          I18nManager.allowRTL(isRTL);
          I18nManager.forceRTL(isRTL);
          
          // Delay to ensure persistence finishes before restart
          setTimeout(async () => {
            try {
              if (Updates && Updates.reloadAsync) {
                await Updates.reloadAsync();
              } else if (RNRestart && (RNRestart as any).Restart) {
                (RNRestart as any).Restart();
              } else if (RNRestart && (RNRestart as any).restart) {
                (RNRestart as any).restart();
              } else {
                DevSettings.reload();
              }
            } catch (error) {
              console.warn('[Store] Restart failed, falling back to reload', error);
              DevSettings.reload();
            }
          }, 300);
        }
      },
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => {
        const { isTabBarVisible, setTabBarVisible, ...rest } = state;
        return rest;
      },
    }
  )
);
