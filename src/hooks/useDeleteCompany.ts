// hooks/useDeleteCompany.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';

export const deleteCompany = async (companyId: string) => {
  const res = await axiosInstance.delete(`/company/${companyId}`);
  return res.data;
};

export const useDeleteCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCompany,
    onSuccess: () => {
      // Refresh company lists
      queryClient.invalidateQueries({ queryKey: ['myCompanies'] });
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    },
  });
};
