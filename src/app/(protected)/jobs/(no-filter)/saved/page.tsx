'use client';

import { useFavouriteJobs } from '@/hooks/useFavouriteJobs';
import JobCard, { Job } from '@/components/JobCard';
import JobCardSkeleton from '@/components/common/JobCardSkeleton';
import { Heart } from 'lucide-react';

export default function SavedJobsPage() {
  const { data: jobs, isLoading, error } = useFavouriteJobs();

  if (isLoading) {
    return (
      <div className="space-y-4 animate-fade-in">
        <div className='space-y-1'>
          <h1 className="text-xl font-bold">Saved Jobs</h1>
          <p className="text-sm text-muted-foreground invisible">Loading</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <JobCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Something went wrong loading your saved jobs.
      </div>
    );
  }

  const favouriteJobs: Job[] = Array.isArray(jobs) ? jobs : [];

  return (
    <div className="space-y-4 animate-fade-in">
      <div className='space-y-1'>
        <h1 className="text-xl font-bold">Saved Jobs</h1>
        <p className="text-sm text-muted-foreground">
          {favouriteJobs.length} job{favouriteJobs.length !== 1 ? 's' : ''}{' '}
          saved
        </p>
      </div>

      {favouriteJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {favouriteJobs.map((job) => (
            <JobCard key={job.id} job={{ ...job, isSaved: true }} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Heart className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
          <h3 className="font-semibold text-lg mb-1">No saved jobs yet</h3>
          <p className="text-sm text-muted-foreground">
            Bookmark jobs you like and they&apos;ll appear here.
          </p>
        </div>
      )}
    </div>
  );
}
