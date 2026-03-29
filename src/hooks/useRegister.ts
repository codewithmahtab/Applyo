import axiosInstance from '@/lib/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const registerUser = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  const res = await axiosInstance.post('/auth/register', data);
  return res.data;
};

export const userRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      // Invalidate user queries to fetch fresh auth state
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (err: any) => {
      console.error('Registration failed:', err.response?.data || err.message);
    },
  });
};
