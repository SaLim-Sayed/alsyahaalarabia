import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { I18nManager, DevSettings } from 'react-native';
import RNRestart from 'react-native-restart';
import * as Updates from 'expo-updates';

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

interface AppState {
  savedArticles: Article[];
  theme: 'light' | 'dark';
  language: 'ar' | 'en';
  toggleSaveArticle: (article: Article) => void;
  isArticleSaved: (id: string) => boolean;
  setTheme: (theme: 'light' | 'dark') => void;
  setLanguage: (lang: 'ar' | 'en') => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      savedArticles: [],
      theme: 'light',
      language: 'ar',
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
        if (I18nManager.isRTL !== isRTL) {
          I18nManager.allowRTL(isRTL);
          I18nManager.forceRTL(isRTL);
          set({ language: lang });
          // Force reload to apply RTL/LTR switch
          setTimeout(() => {
            const reload = async () => {
              try {
                if (__DEV__) {
                  DevSettings.reload();
                } else if (RNRestart && typeof RNRestart.restart === 'function') {
                  RNRestart.restart();
                } else if (Updates && typeof Updates.reloadAsync === 'function') {
                  await Updates.reloadAsync();
                } else {
                  DevSettings.reload();
                }
              } catch (error) {
                console.error('Failed to restart app:', error);
                // Last ditch effort
                try { DevSettings.reload(); } catch (e) {}
              }
            };
            reload();
          }, 100);
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
