import { useQuery } from '@tanstack/react-query';

const fetchFavouriteJobs = async () => {
  const res = await fetch('/api/job/favourite/list');
  if (!res.ok) throw new Error('Failed to fetch favourite jobs');
  return res.json();
};

export const useFavouriteJobs = () => {
  return useQuery({
    queryKey: ['favouriteJobs'],
    queryFn: fetchFavouriteJobs,
    staleTime: 2 * 60 * 1000,
  });
};
