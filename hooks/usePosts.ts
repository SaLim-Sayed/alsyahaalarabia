import { useQuery } from '@tanstack/react-query';
import { fetchFromWP } from '../services/api';
import { WPPost } from '../types/wp-types';
import { mapWPPostToArticle } from '../utils/mapper';
import { translateArticle } from '../services/translationService';
import { useAppStore } from '../store/useAppStore';

export const useLatestPosts = (perPage = 10) => {
  const { language } = useAppStore();
  
  return useQuery({
    queryKey: ['posts', 'latest', perPage, language],
    queryFn: async () => {
      const data = await fetchFromWP('/posts', { per_page: perPage });
      const articles = (data as WPPost[]).map(mapWPPostToArticle);
      
      const translatedArticles = await Promise.all(
        articles.map(article => translateArticle(article, language))
      );
      return translatedArticles;
    },
  });
};

export const usePostsByCategory = (categoryId: string | null, perPage = 10) => {
  const { language } = useAppStore();

  return useQuery({
    queryKey: ['posts', 'category', categoryId, perPage, language],
    queryFn: async () => {
      let data;
      if (!categoryId || categoryId === 'all') {
        data = await fetchFromWP('/posts', { per_page: perPage });
      } else {
        data = await fetchFromWP('/posts', { 
          per_page: perPage,
          categories: categoryId 
        });
      }
      
      const articles = (data as WPPost[]).map(mapWPPostToArticle);
      
      return await Promise.all(
        articles.map(article => translateArticle(article, language))
      );
    },
  });
};

export const useSearchPosts = (query: string) => {
  const { language } = useAppStore();

  return useQuery({
    queryKey: ['posts', 'search', query, language],
    queryFn: async () => {
      if (!query) return [];
      const data = await fetchFromWP('/posts', { search: query, per_page: 20 });
      const articles = (data as WPPost[]).map(mapWPPostToArticle);
      
      return await Promise.all(
        articles.map(article => translateArticle(article, language))
      );
    },
    enabled: query.length > 2,
  });
};

export const usePostDetail = (id: string) => {
  const { language } = useAppStore();

  return useQuery({
    queryKey: ['posts', id, language],
    queryFn: async () => {
      const data = await fetchFromWP(`/posts/${id}`);
      const article = mapWPPostToArticle(data as WPPost);
      
      // Translate full content (sl=auto handles AR -> AR gracefully)
      return await translateArticle(article, language, true);
    },
    enabled: !!id,
  });
};
