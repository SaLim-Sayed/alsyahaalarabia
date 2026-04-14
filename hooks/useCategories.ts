import { useQuery } from '@tanstack/react-query';
import { fetchFromWP } from '../services/api';
import { WPCategory } from '../types/wp-types';
import { mapWPCategoryToAppCategory } from '../utils/mapper';
import { useAppStore } from '../store/useAppStore';
import { translateCategory } from '../services/translationService';

export const useAppCategories = () => {
  const { language } = useAppStore();

  return useQuery({
    queryKey: ["categories", language],
    queryFn: async () => {
      const data = await fetchFromWP("/categories", { per_page: 50 });
      const categories = (data as WPCategory[]).map(mapWPCategoryToAppCategory);

      return await Promise.all(
        categories.map((cat) => translateCategory(cat, language))
      );
    },
  });
};
