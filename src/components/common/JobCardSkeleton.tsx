'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

const JobCardSkeleton = () => {
  return (
    <Card className="w-full p-0 overflow-hidden">
      <CardContent className="p-6 space-y-6">
        {/* Top section */}
        <div className="flex justify-between items-start gap-4">
          {/* Left section */}
          <div className="flex-1 space-y-3">
            <Skeleton className="h-6 w-3/4" /> {/* Job Title */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-6" />
              <Skeleton className="h-4 w-24" /> {/* Company Name */}
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              <Skeleton className="h-5 w-20 rounded-full" /> {/* Badge */}
              <Skeleton className="h-4 w-20" /> {/* Location */}
              <Skeleton className="h-4 w-24" /> {/* Salary */}
            </div>
            <div className="flex items-center gap-4 text-xs">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>

          {/* Right section */}
          <div className="flex flex-col items-center gap-4">
            <Skeleton className="w-12 h-12 rounded-xl" /> {/* Company icon */}
            <Skeleton className="w-8 h-8 rounded-full" />{' '}
            {/* Bookmark button */}
          </div>
        </div>

        {/* Bottom section */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex gap-2">
            <Skeleton className="h-8 w-24 rounded-md" /> {/* Apply Now */}
            <Skeleton className="h-8 w-28 rounded-md" /> {/* View Details */}
          </div>
          <Skeleton className="h-3 w-20" /> {/* Job ID */}
        </div>
      </CardContent>
    </Card>
  );
};

export default JobCardSkeleton;
