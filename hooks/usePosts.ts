import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { fetchFromWP } from '../services/api';
import { WPPost } from '../types/wp-types';
import { mapWPPostToArticle } from '../utils/mapper';
import { translateArticle } from '../services/translationService';
import { useAppStore } from '../store/useAppStore';
import { cache } from '../utils/cache';

export const useLatestPosts = (perPage = 10) => {
  const { language } = useAppStore();
  const queryClient = useQueryClient();
  const queryKey = ['posts', 'latest', perPage, language];

  // Try to load from persistent cache on mount to avoid white screen
  useEffect(() => {
    const loadCache = async () => {
      const existingData = queryClient.getQueryData(queryKey);
      if (!existingData) {
        const cached = await cache.get(`latest_posts_${perPage}_${language}`);
        if (cached) {
          queryClient.setQueryData(queryKey, cached);
        }
      }
    };
    loadCache();
  }, [queryKey, queryClient, perPage, language]);
  
  return useQuery({
    queryKey,
    queryFn: async () => {
      try {
        const data = await fetchFromWP('/posts', { per_page: perPage });
        const articles = (data as WPPost[]).map(mapWPPostToArticle);
        
        const translatedArticles = await Promise.all(
          articles.map(article => translateArticle(article, language))
        );
        
        // Update cache on success
        await cache.set(`latest_posts_${perPage}_${language}`, translatedArticles);
        
        return translatedArticles;
      } catch (error) {
        // Fallback to cache on error
        const cached = await cache.get(`latest_posts_${perPage}_${language}`);
        if (cached) return cached;
        throw error;
      }
    },
    // Fast initial load: try to get from cache as placeholder
    placeholderData: (previousData) => previousData,
  });
};

export const usePostsByCategory = (categoryId: string | null, perPage = 10) => {
  const { language } = useAppStore();
  const queryClient = useQueryClient();
  const queryKey = ['posts', 'category', categoryId, perPage, language];

  useEffect(() => {
    const loadCache = async () => {
      const existingData = queryClient.getQueryData(queryKey);
      if (!existingData) {
        const cached = await cache.get(`category_${categoryId}_${perPage}_${language}`);
        if (cached) {
          queryClient.setQueryData(queryKey, cached);
        }
      }
    };
    loadCache();
  }, [queryKey, queryClient, categoryId, perPage, language]);

  return useQuery({
    queryKey,
    queryFn: async () => {
      try {
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
        const translatedArticles = await Promise.all(
          articles.map(article => translateArticle(article, language))
        );

        // Update cache
        await cache.set(`category_${categoryId}_${perPage}_${language}`, translatedArticles);
        
        return translatedArticles;
      } catch (error) {
        // Fallback to cache
        const cached = await cache.get(`category_${categoryId}_${perPage}_${language}`);
        if (cached) return cached;
        throw error;
      }
    },
    placeholderData: (previousData) => previousData,
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
      try {
        const data = await fetchFromWP(`/posts/${id}`);
        const article = mapWPPostToArticle(data as WPPost);
        const translatedArticle = await translateArticle(article, language, true);

        // Update cache
        await cache.set(`post_${id}_${language}`, translatedArticle);

        return translatedArticle;
      } catch (error) {
        // Fallback to cache
        const cached = await cache.get(`post_${id}_${language}`);
        if (cached) return cached;
        throw error;
      }
    },
    enabled: !!id,
    placeholderData: (previousData) => previousData,
  });
};
