import { useQuery, useQueryClient } from '@tanstack/react-query';

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  bio?: string;
  headline?: string;
  phone?: string;
  location?: string;
  resumeUrl?: string;
  skills: string[];
  avatar?: string;
  role: string;
  createdAt: string;
};

const fetchUser = async (): Promise<UserProfile> => {
  const res = await fetch('/api/user/profile');
  if (!res.ok) throw new Error('Failed to fetch user');
  return res.json();
};

export const useUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: fetchUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};
