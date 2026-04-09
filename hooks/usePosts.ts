import { useQuery } from '@tanstack/react-query';
import { fetchFromWP } from '../services/api';
import { WPPost } from '../types/wp-types';
import { mapWPPostToArticle } from '../utils/mapper';

export const useLatestPosts = (perPage = 10) => {
  return useQuery({
    queryKey: ['posts', 'latest', perPage],
    queryFn: async () => {
      const data = await fetchFromWP('/posts', { per_page: perPage });
      return (data as WPPost[]).map(mapWPPostToArticle);
    },
  });
};

export const usePostsByCategory = (categoryId: string | null, perPage = 10) => {
  return useQuery({
    queryKey: ['posts', 'category', categoryId, perPage],
    queryFn: async () => {
      if (!categoryId || categoryId === 'all') {
        const data = await fetchFromWP('/posts', { per_page: perPage });
        return (data as WPPost[]).map(mapWPPostToArticle);
      }
      const data = await fetchFromWP('/posts', { 
        per_page: perPage,
        categories: categoryId 
      });
      return (data as WPPost[]).map(mapWPPostToArticle);
    },
  });
};

export const useSearchPosts = (query: string) => {
  return useQuery({
    queryKey: ['posts', 'search', query],
    queryFn: async () => {
      if (!query) return [];
      const data = await fetchFromWP('/posts', { search: query, per_page: 20 });
      return (data as WPPost[]).map(mapWPPostToArticle);
    },
    enabled: query.length > 2,
  });
};

export const usePostDetail = (id: string) => {
  return useQuery({
    queryKey: ['posts', id],
    queryFn: async () => {
      const data = await fetchFromWP(`/posts/${id}`);
      return mapWPPostToArticle(data as WPPost);
    },
    enabled: !!id,
  });
};
