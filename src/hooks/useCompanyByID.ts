import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';

export const CompanyByID = async (companyId: string) => {
  const res = await axiosInstance.get(`/company/${companyId}`);
  return res.data;
};

export const useCompanyById = (id: string) => {
  return useQuery({
    queryKey: ['company', id],
    queryFn: () => CompanyByID(id),
    enabled: !!id, // only run if id is available
  });
};
