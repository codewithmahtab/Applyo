import { useMutation, useQueryClient } from '@tanstack/react-query';

const toggleFavourite = async (jobId: string) => {
  const res = await fetch('/api/job/favourite/toggle', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jobId }),
  });

  if (!res.ok) throw new Error('Failed to toggle favourite');

  return res.json() as Promise<{ isFavourited: boolean; jobId: string }>;
};

export const useAddToFavourite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleFavourite,

    onSuccess: (data) => {
      const { jobId, isFavourited } = data;
      queryClient.setQueryData(
        ['jobs'],
        (oldJobs: any[] | undefined) => {
          if (!oldJobs) return oldJobs;

          return oldJobs.map((job) =>
            job.id === jobId
              ? { ...job, isSaved: isFavourited }
              : job
          );
        }
      );
      queryClient.setQueriesData(
        { queryKey: ['company'] },
        (oldData: any) => {
          if (!oldData || !oldData.jobs) return oldData;

          return {
            ...oldData,
            jobs: oldData.jobs.map((job: any) =>
              job.id === jobId
                ? { ...job, isSaved: isFavourited }
                : job
            ),
          };
        }
      );

      // ✅ Refetch favourites list
      queryClient.invalidateQueries({
        queryKey: ['favouriteJobs'],
      });
    },
  });
};