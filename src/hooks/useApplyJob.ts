import { useMutation, useQueryClient } from '@tanstack/react-query';

type ApplicationData = {
  resume: string;
  coverLetter: string;
  jobId: string;
  userId?: string; // optional - API gets userId from auth cookie
};

const applyJob = async (data: ApplicationData) => {
  const res = await fetch('/api/job/apply', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jobId: data.jobId,
      resume: data.resume,
      coverLetter: data.coverLetter,
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to apply' }));
    throw new Error(err.error || 'Failed to apply');
  }
  return res.json();
};

export const useApplyJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: applyJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myApplications'] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });
};
