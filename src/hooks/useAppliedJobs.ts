// hooks/useAppliedJobs.ts
import axiosInstance from '@/lib/axios';
import { useQuery } from '@tanstack/react-query';

export const getAppliedJobs = async () => {
  const res = await axiosInstance.get('/application/applied');
  console.log(res.data);
  return res.data;
};

export const useAppliedJobs = () => {
  return useQuery({
    queryKey: ['appliedJobs'],
    queryFn: getAppliedJobs,
  });
};
