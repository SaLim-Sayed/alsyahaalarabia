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
  language: 'ar' | 'en' | 'kk' | 'ur';
  user: User | null;
  token: string | null;
  lastSyncTimestamp: number;
  toggleSaveArticle: (article: Article) => void;
  isArticleSaved: (id: string) => boolean;
  setTheme: (theme: 'light' | 'dark') => void;
  setLanguage: (lang: 'ar' | 'en' | 'kk' | 'ur') => void;
  updateSyncTimestamp: () => void;
  setUser: (user: User | null, token: string | null) => void;
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
        const isRTL = lang === 'ar' || lang === 'ur';
        const { lastSyncTimestamp, language: currentLang } = get();
        const now = Date.now();
        
        // Safety: If it's a simple language toggle without direction change (or recently synced), 
        // just update state.
        const directionMismatch = I18nManager.isRTL !== isRTL;
        
        if (directionMismatch) {
          console.log('[Store] Direction mismatch, forcing RTL:', isRTL);
          I18nManager.allowRTL(isRTL);
          I18nManager.forceRTL(isRTL);
          
          set({ language: lang, lastSyncTimestamp: now });
          
          // Delay to ensure persistence finishes before restart
          setTimeout(async () => {
            try {
              if (RNRestart && typeof (RNRestart as any).Restart === 'function') {
                return (RNRestart as any).Restart();
              }
              if (RNRestart && typeof (RNRestart as any).restart === 'function') {
                return (RNRestart as any).restart();
              }
              if (Updates && typeof Updates.reloadAsync === 'function') {
                return await Updates.reloadAsync();
              }
              DevSettings.reload();
            } catch (error) {
              console.warn('[Store] Restart failed, falling back to reload', error);
              DevSettings.reload();
            }
          }, 300);
        } else {
          // If native direction is already correct (or no change), just swap i18n
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
