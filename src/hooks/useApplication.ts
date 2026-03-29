import axiosInstance from '@/lib/axios';

export const useApplication = async (id: string) => {
  const res = await axiosInstance.get(`/application/${id}`);
  return res.data;
};
