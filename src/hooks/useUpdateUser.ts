import { useMutation, useQueryClient } from '@tanstack/react-query';

type ProfileUpdateData = {
  name?: string;
  email?: string;
  bio?: string;
  headline?: string;
  phone?: string;
  location?: string;
  resumeUrl?: string;
  skills?: string[];
  avatar?: string;
};

const updateUserProfile = async (data: ProfileUpdateData) => {
  const res = await fetch('/api/user/profile', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update profile');
  return res.json();
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUserProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(['user'], data);
    },
  });
};
