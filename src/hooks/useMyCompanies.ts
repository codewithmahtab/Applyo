import axiosInstance from '@/lib/axios';
import { useQuery } from '@tanstack/react-query';

export const myCompanies = async () => {
  const res = await axiosInstance.get('/company/myCompanies');
  return res.data;
};

export const useMyCompanies = () => {
  return useQuery({
    queryKey: ['myCompanies'],
    queryFn: myCompanies,
  });
};
