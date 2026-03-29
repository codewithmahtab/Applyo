import axiosInstance from '@/lib/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export const logout = async () => {
  const res = await axiosInstance.post('/auth/logout');
  return res.data;
};

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear();
      window.location.href = '/';
    },
    onError: (error) => {
      console.error('Logout failed:', error);
    },
  });
};
