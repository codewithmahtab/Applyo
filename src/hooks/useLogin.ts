import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';

const loginUser = async (data: { email: string; password: string }) => {
  const res = await axiosInstance.post('/auth/login', data);
  return res.data;
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: () => {
      // Invalidate user queries to fetch fresh auth state
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (err: any) => {
      console.error('Login failed:', err.response?.data || err.message);
    },
  });
};
