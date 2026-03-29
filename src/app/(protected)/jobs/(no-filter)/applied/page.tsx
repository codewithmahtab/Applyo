'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import JobCardSkeleton from '@/components/common/JobCardSkeleton';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Building2,
  Calendar,
  FileText,
  Clock8,
  MapPin,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type ApplicationStatus =
  | 'PENDING'
  | 'REVIEWED'
  | 'INTERVIEW'
  | 'REJECTED'
  | 'ACCEPTED';

const STATUS_CONFIG: Record<
  ApplicationStatus,
  { label: string; color: string }
> = {
  PENDING: {
    label: 'Pending Review',
    color: 'bg-primary text-primary-foreground dark:bg-primary/10 dark:text-primary',
  },
  REVIEWED: {
    label: 'Under Review',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
  },
  INTERVIEW: {
    label: 'Interview',
    color:
      'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300',
  },
  REJECTED: {
    label: 'Not Selected',
    color: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300',
  },
  ACCEPTED: { label: "Accepted!", color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" },
};

type Application = {
  id: string;
  status: ApplicationStatus;
  coverLetter?: string;
  resume?: string;
  createdAt: string;
  job: {
    id: string;
    job_title: string;
    job_location?: string;
    company?: { id: string; name: string; logo?: string };
  };
};

const fetchApplications = async (): Promise<Application[]> => {
  const res = await fetch('/api/user/applications');
  if (!res.ok) throw new Error('Failed to fetch applications');
  return res.json();
};

export default function AppliedJobsPage() {
  const queryClient = useQueryClient();
  const {
    data: applications,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['myApplications'],
    queryFn: fetchApplications,
  });

  const [withdrawingId, setWithdrawingId] = useState<string | null>(null);

  const { mutate: withdraw } = useMutation({
    mutationFn: async (applicationId: string) => {
      const res = await fetch(`/api/user/applications?id=${applicationId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to withdraw');
    },
    onMutate: (id) => setWithdrawingId(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myApplications'] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      setWithdrawingId(null);
    },
    onError: () => setWithdrawingId(null),
  });

  const formatDate = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const days = Math.ceil(diff / 86400000);
    if (days <= 1) return 'Applied Today';
    if (days < 7) return `Applied ${days} days ago`;
    if (days < 30) return `Applied ${Math.ceil(days / 7)} weeks ago`;
    return `Applied ${Math.ceil(days / 30)} months ago`;
  };

  if (isLoading) {
    return (
      <div className="space-y-4 animate-fade-in">
        <div className='space-y-1'>
          <h1 className="text-xl font-bold">Applied Jobs</h1>
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
        Error loading applications.
      </div>
    );
  }

  const apps = Array.isArray(applications) ? applications : [];

  return (
    <div className="space-y-4 animate-fade-in">
      <div className='space-y-1'>
        <h1 className="text-xl font-bold">Applied Jobs</h1>
        <p className="text-sm text-muted-foreground">
          {apps.length} job{apps.length !== 1 ? 's' : ''} applied
        </p>
      </div>

      {apps.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {apps.map((app) => {
            const statusCfg = STATUS_CONFIG[app.status];
            const companyName = app.job.company?.name || 'Unknown Company';
            const companyInitial = companyName.charAt(0).toUpperCase();

            return (
              <Card key={app.id} className="w-full hover:shadow-md transition-all duration-200 p-0 overflow-hidden group border-border flex flex-col justify-between">
                <CardContent className="p-5 flex flex-col h-full">
                  <div className="flex justify-between items-start gap-3">
                    {/* Company Logo or Initial */}
                    <Avatar className="w-11 h-11 rounded-xl text-lg font-bold shrink-0 shadow-sm border border-border/50">
                      <AvatarImage src={app.job.company?.logo} alt={companyName} className="object-cover" />
                      <AvatarFallback className="bg-primary/10 text-primary rounded-xl">
                        {companyInitial}
                      </AvatarFallback>
                    </Avatar>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0 space-y-2">
                      <div>
                        <CardTitle>
                          <Link href={`/jobs/${app.job.id}`} className="text-base font-semibold line-clamp-1 hover:cursor-pointer hover:underline underline-offset-2 hover:text-primary transition-colors">
                            {app.job.job_title}
                          </Link>
                        </CardTitle>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-0.5">
                          <Building2 size={13} />
                          <span className="font-medium line-clamp-1">{companyName}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {app.job.job_location && (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin size={11} />
                            {app.job.job_location}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 mb-2">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusCfg.color}`}
                    >
                      {statusCfg.label}
                    </span>
                  </div>

                  <div className="mt-auto">
                    {/* Footer */}
                    <div className="flex flex-col gap-3 mt-4 pt-3 border-t border-border/60">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                          <Clock8 size={15} />
                          {formatDate(app.createdAt)}
                        </span>
                        {app.resume && (
                          <a
                            href={app.resume}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs flex items-center gap-1 text-primary hover:underline font-medium"
                          >
                            <FileText size={13} /> Resume
                          </a>
                        )}
                      </div>

                      {app.status === 'PENDING' && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full text-xs hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 transition-colors h-10"
                          disabled={withdrawingId === app.id}
                          onClick={() => withdraw(app.id)}
                        >
                          {withdrawingId === app.id ? (
                            <Loader2 size={14} className="mr-2 animate-spin" />
                          ) : null}
                          Withdraw Application
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-semibold text-lg mb-1">No applications yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Start applying to jobs to track your progress here.
          </p>
          <Link href="/jobs">
            <Button>Browse Jobs</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
