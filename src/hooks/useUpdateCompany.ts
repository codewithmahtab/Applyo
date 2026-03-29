// hooks/useUpdateCompany.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';

type CompanyData = {
  name: string;
  industry: string;
  location: string;
  description: string;
  logo?: string;
};

export const updateCompany = async ({
  id,
  data,
}: {
  id: string;
  data: CompanyData;
}) => {
  const res = await axiosInstance.put(`/company/${id}`, data);
  return res.data;
};

export const useUpdateCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      queryClient.invalidateQueries({ queryKey: ['myCompanies'] });
    },
  });
};
