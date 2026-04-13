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
  avatar?: string;
  role?: string;
}

interface AppState {
  savedArticles: Article[];
  theme: 'light' | 'dark';
  language: 'ar' | 'en';
  user: User | null;
  token: string | null;
  lastSyncTimestamp: number;
  toggleSaveArticle: (article: Article) => void;
  isArticleSaved: (id: string) => boolean;
  setTheme: (theme: 'light' | 'dark') => void;
  setLanguage: (lang: 'ar' | 'en') => void;
  updateSyncTimestamp: () => void;
  setUser: (user: User | null, token: string | null) => void;
  logout: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      savedArticles: [],
      theme: 'light',
      language: (Localization.getLocales()[0]?.languageCode === 'en' ? 'en' : 'ar') as 'ar' | 'en',
      user: null,
      token: null,
      lastSyncTimestamp: 0,
      setUser: (user, token) => set({ user, token }),
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
        const isRTL = lang === 'ar';
        const { lastSyncTimestamp } = get();
        const now = Date.now();
        
        // Cooldown and safety checks
        const canRestart = (now - lastSyncTimestamp) > 3000;

        if (I18nManager.isRTL !== isRTL && canRestart) {
          I18nManager.allowRTL(isRTL);
          I18nManager.forceRTL(isRTL);
          
          set({ language: lang, lastSyncTimestamp: now });
          
          // Small delay to ensure state and I18nManager are ready
          setTimeout(async () => {
            try {
              // Priority 1: Native Restart (Capital R)
              if (RNRestart && typeof (RNRestart as any).Restart === 'function') {
                return (RNRestart as any).Restart();
              }
              
              // Priority 2: Standard restart if Capital R is missing
              if (RNRestart && typeof (RNRestart as any).restart === 'function') {
                return (RNRestart as any).restart();
              }
              
              // Priority 3: Expo Updates
              if (Updates && typeof Updates.reloadAsync === 'function') {
                return await Updates.reloadAsync();
              }
              
              DevSettings.reload();
            } catch (error) {
              console.warn('[Store] Restart phase 1 failed, trying fallback...', error);
              DevSettings.reload();
            }
          }, 400);
        } else {
          set({ language: lang });
        }
      },
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
