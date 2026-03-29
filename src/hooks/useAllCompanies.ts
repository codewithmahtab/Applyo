import axiosInstance from '@/lib/axios';
import { useQuery } from '@tanstack/react-query';

export const allCompanies = async () => {
  const res = await axiosInstance.get('/company/all');
  return res.data;
};

export const useAllCompanies = () => {
  return useQuery({
    queryKey: ['companies'],
    queryFn: allCompanies,
  });
};
