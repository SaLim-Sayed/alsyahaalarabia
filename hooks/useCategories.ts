import { useQuery } from "@tanstack/react-query";
import { fetchFromWP } from "../services/api";
import { WPCategory } from "../types/wp-types";
import { mapWPCategoryToAppCategory } from "../utils/mapper";

export const useAppCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const data = await fetchFromWP("/categories", { per_page: 50 });
      return (data as WPCategory[]).map(mapWPCategoryToAppCategory);
    },
  });
};
