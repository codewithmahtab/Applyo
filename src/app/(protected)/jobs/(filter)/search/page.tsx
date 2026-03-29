'use client';

import { useSearchParams } from 'next/navigation';
import { useFilterJobs } from '@/hooks/filterJobs';
import JobCard from '@/components/JobCard';
import { SearchX } from "lucide-react";
import JobCardSkeleton from '@/components/common/JobCardSkeleton';
import { Suspense } from 'react';
import { Job } from '@/components/JobCard';

export default function SearchPageWrapper() {
  return (
    <Suspense fallback={
      <div className="w-full space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <JobCardSkeleton key={i} />
        ))}
      </div>
    }>
      <SearchPage />
    </Suspense>
  );
}

function SearchPage() {
  const searchParams = useSearchParams();
  const queryString = searchParams.toString()
    ? `?${searchParams.toString()}`
    : '';

  const { data: jobs, isLoading, error } = useFilterJobs(queryString);
  const query = searchParams.get('q');

  if (isLoading) {
    return (
      <div className="w-full space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <JobCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          Error loading results. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 animate-fade-in">
      {jobs && jobs.length > 0 ? (
        <div className="space-y-3 w-full animate-fade-in">
          {jobs.map((job: Job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-card rounded-xl border">
          <SearchX className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No jobs found</h2>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search terms or filters.
          </p>
        </div>
      )}
    </div>
  );
}
