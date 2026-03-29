import { useQuery } from '@tanstack/react-query';

const fetchFilteredJobs = async (searchParams: string) => {
  const res = await fetch(`/api/job/search${searchParams}`);
  if (!res.ok) throw new Error('Failed to fetch jobs');
  return res.json();
};

export const useFilterJobs = (searchParams: string) => {
  return useQuery({
    queryKey: ['jobs', 'search', searchParams],
    queryFn: () => fetchFilteredJobs(searchParams),
    staleTime: 60 * 1000,
  });
};
