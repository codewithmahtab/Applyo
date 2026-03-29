import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const JobListSkeleton = ({ count = 5 }: { count?: number }) => {
  return (
    <div className="w-full space-y-4">
      {[...Array(count)].map((_, i) => (
        <Card
          key={i}
          className="w-full cursor-pointer rounded-xl hover:shadow-sm transition duration-300 p-4"
        >
          <div className="flex flex-wrap justify-between items-start">
            {/* Left Section Skeleton */}
            <div className="flex-1 min-w-0">
              <CardContent className="px-0 pt-0 space-y-2">
                <Skeleton className="h-5 w-2/3" /> {/* Title */}
                <Skeleton className="h-4 w-1/3" /> {/* Employer */}
                <div className="flex items-center gap-2 mt-2">
                  <Skeleton className="h-4 w-20" /> {/* Employment Type */}
                  <Skeleton className="h-4 w-4" /> {/* | */}
                  <Skeleton className="h-4 w-20" /> {/* Location */}
                </div>
                <Skeleton className="h-12 w-full" /> {/* Description */}
                <Skeleton className="h-3 w-24" /> {/* Posted date */}
              </CardContent>
            </div>

            {/* Right Section Skeleton */}
            <div className="flex flex-col items-center justify-between h-full ml-4 shrink-0 mt-4 sm:mt-0">
              <Skeleton className="w-10 h-10 rounded-xl" /> {/* Avatar */}
              <Skeleton className="w-5 h-5 mt-4" /> {/* Bookmark */}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default JobListSkeleton;
