import { cache } from "@/utils/cache";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { fetchFromWP } from "../services/api";
import { translateCategory } from "../services/translationService";
import { useAppStore } from "../store/useAppStore";
import { WPCategory } from "../types/wp-types";
import { mapWPCategoryToAppCategory } from "../utils/mapper";

const CACHE_KEY_CATEGORIES = "cached_categories";

export const useAppCategories = () => {
  const { language } = useAppStore();
  const queryClient = useQueryClient();
  const queryKey = ["categories", language];

  // Pre-seed cache
  useEffect(() => {
    const seedCache = async () => {
      const cachedData = await cache.get(`${CACHE_KEY_CATEGORIES}_${language}`);
      if (cachedData) {
        queryClient.setQueryData(queryKey, cachedData);
      }
    };
    seedCache();
  }, [language]);

  return useQuery({
    queryKey,
    queryFn: async () => {
      try {
        const data = await fetchFromWP("/categories", { per_page: 50 });
        const categories = (data as WPCategory[]).map(
          mapWPCategoryToAppCategory,
        );

        const translatedCategories = await Promise.all(
          categories.map((cat) => translateCategory(cat, language)),
        );

        // Update cache
        await cache.set(
          `${CACHE_KEY_CATEGORIES}_${language}`,
          translatedCategories,
        );
        return translatedCategories;
      } catch (error) {
        // If error, try to return from cache one last time
        const cachedData = await cache.get(
          `${CACHE_KEY_CATEGORIES}_${language}`,
        );
        if (cachedData) return cachedData;
        throw error;
      }
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
};
