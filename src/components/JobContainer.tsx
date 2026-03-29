'use client';

import JobCard from './JobCard';
import { useJobs } from '@/hooks/useJobs';
import JobCardSkeleton from './common/JobCardSkeleton';
import { Search } from 'lucide-react';

const JobContainer = () => {
  const { data: jobs, isLoading, error } = useJobs();

  if (isLoading) {
    return (
      <div className="w-full space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <JobCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full text-center py-12">
        <p className="text-muted-foreground">{error.message}</p>
      </div>
    );
  }

  if (!jobs?.length) {
    return (
      <div className="w-full text-center py-16">
        <Search className="w-10 h-10 text-muted-foreground/30 mx-auto mb-4" />
        <h3 className="font-semibold text-lg mb-1">No jobs found</h3>
        <p className="text-muted-foreground text-sm">
          Try adjusting your search or check back later.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 w-full animate-fade-in">
      {jobs.map((job: Parameters<typeof JobCard>[0]['job']) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
};

export default JobContainer;
