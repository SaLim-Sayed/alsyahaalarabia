import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCurrentUser, getUserById, updateCurrentUser } from '../services/api';
import { useAppStore } from '../store/useAppStore';
import { mapWPUserToAppUser } from '../utils/mapper';
import { WPUser } from '../types/wp-types';

/**
 * Hook to fetch the current logged-in user's WordPress profile
 */
export const useCurrentUser = () => {
  const { setUser, token } = useAppStore();

  return useQuery({
    queryKey: ['user', 'me'],
    queryFn: async () => {
      if (!token) return null;
      const wpUser = await getCurrentUser();
      const appUser = mapWPUserToAppUser(wpUser);
      
      // Sync with local store
      setUser(appUser as any, token);
      
      return wpUser as WPUser;
    },
    enabled: !!token,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook to fetch any author/user by their ID
 */
export const useAuthor = (id: number) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: async () => {
      const wpUser = await getUserById(id);
      return wpUser as WPUser;
    },
    enabled: !!id,
  });
};

/**
 * Hook to update the current user's profile
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { setUser, token } = useAppStore();

  return useMutation({
    mutationFn: (data: Record<string, unknown>) => updateCurrentUser(data),
    onSuccess: (updatedWpUser) => {
      const appUser = mapWPUserToAppUser(updatedWpUser);
      
      // Update local store
      setUser(appUser as any, token);
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['user', 'me'] });
    },
  });
};
