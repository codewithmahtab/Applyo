'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { use } from 'react';
import {
  Mail,
  Phone,
  FileText,
  ExternalLink,
  CheckCircle2,
  Clock,
  XCircle,
  User,
  ChevronDown,
  Briefcase,
  MessageSquare,
} from 'lucide-react';

type ApplicationStatus =
  | 'PENDING'
  | 'REVIEWED'
  | 'INTERVIEW'
  | 'REJECTED'
  | 'ACCEPTED';

const STATUS_CONFIG: Record<
  ApplicationStatus,
  { label: string; color: string; icon: React.ReactNode }
> = {
  PENDING: {
    label: 'Pending',
    color: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
    icon: <Clock className="h-3 w-3" />,
  },
  REVIEWED: {
    label: 'Reviewed',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
    icon: <CheckCircle2 className="h-3 w-3" />,
  },
  INTERVIEW: {
    label: 'Interview',
    color:
      'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300',
    icon: <User className="h-3 w-3" />,
  },
  REJECTED: {
    label: 'Rejected',
    color: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300',
    icon: <XCircle className="h-3 w-3" />,
  },
  ACCEPTED: {
    label: 'Accepted',
    color:
      'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
    icon: <CheckCircle2 className="h-3 w-3" />,
  },
};

const NEXT_STATUSES: Record<ApplicationStatus, ApplicationStatus[]> = {
  PENDING: ['REVIEWED', 'INTERVIEW', 'REJECTED'],
  REVIEWED: ['INTERVIEW', 'REJECTED'],
  INTERVIEW: ['ACCEPTED', 'REJECTED'],
  REJECTED: [],
  ACCEPTED: [],
};

type Application = {
  id: string;
  status: ApplicationStatus;
  coverLetter?: string;
  resume?: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    headline?: string;
    resumeUrl?: string;
    skills: string[];
    avatar?: string;
  };
};

type JobWithApplications = {
  id: string;
  job_title: string;
  createdAt: string;
  applications: Application[];
};

type CompanyApplicationsData = {
  company: string;
  jobs: JobWithApplications[];
  totalApplications: number;
};

export default function CompanyApplicationsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: companyId } = use(params);
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<CompanyApplicationsData>({
    queryKey: ['companyApplications', companyId],
    queryFn: async () => {
      const res = await fetch(`/api/company/${companyId}/applications`);
      if (!res.ok) throw new Error('Failed to fetch applications');
      return res.json();
    },
  });

  const { mutate: updateStatus, isPending: isUpdating } = useMutation({
    mutationFn: async ({
      applicationId,
      status,
    }: {
      applicationId: string;
      status: string;
    }) => {
      const res = await fetch(`/api/company/${companyId}/applications`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId, status }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['companyApplications', companyId],
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Unable to load applications.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-4 md:p-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <span className="text-primary">{data?.company}</span> Applications
          </h1>
          <p className="text-muted-foreground mt-1.5 flex items-center gap-2">
            <User className="h-4 w-4" />
            {data?.totalApplications ?? 0} Total Applicant{(data?.totalApplications ?? 0) !== 1 ? 's' : ''}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => window.history.back()}>
          Back to Company
        </Button>
      </div>

      {/* Jobs List */}
      <div className="space-y-10">
        {data?.jobs.map((job) => (
          <section key={job.id} className="space-y-4">
            <div className="flex items-center justify-between bg-muted/30 p-3 rounded-lg border border-border/50">
              <h2 className="font-semibold text-lg flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-muted-foreground" />
                {job.job_title}
              </h2>
              <Badge variant="secondary" className="px-3 py-1 font-medium text-sm rounded-full">
                {job.applications.length} Applicant{job.applications.length !== 1 ? 's' : ''}
              </Badge>
            </div>

            {job.applications.length === 0 ? (
              <Card className="p-10 text-center border-dashed border-2 bg-transparent shadow-none">
                <div className="flex flex-col items-center justify-center text-muted-foreground">
                  <User className="h-10 w-10 mb-3 opacity-20" />
                  <p className="font-medium text-foreground">No applications yet</p>
                  <p className="text-sm">When candidates apply, they will appear here.</p>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {job.applications.map((app) => {
                  const status = STATUS_CONFIG[app.status];
                  const nextStatuses = NEXT_STATUSES[app.status];

                  return (
                    <Card key={app.id} className="p-0 overflow-hidden border-border/60 shadow-sm transition-all hover:shadow-md group">
                      <div className="p-5 sm:p-6">
                        {/* Applicant Header */}
                        <div className="flex flex-col sm:flex-row gap-5 items-start">
                          <Avatar className="h-16 w-16 border-2 border-background shadow-sm shrink-0">
                            <AvatarImage src={app.user.avatar} className="object-cover" />
                            <AvatarFallback className="bg-primary/10 text-primary font-bold text-xl">
                              {app.user.name?.charAt(0)?.toUpperCase()}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1 min-w-0 w-full space-y-4">
                            {/* Name & Status */}
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                              <div>
                                <h3 className="text-xl font-bold truncate group-hover:text-primary transition-colors">
                                  {app.user.name}
                                </h3>
                                {app.user.headline && (
                                  <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
                                    {app.user.headline}
                                  </p>
                                )}
                              </div>
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 ${status.color}`}>
                                {status.icon} {status.label}
                              </span>
                            </div>

                            {/* Contact Links */}
                            <div className="flex flex-wrap items-center gap-2 text-sm">
                              <a href={`mailto:${app.user.email}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors">
                                <Mail className="h-3.5 w-3.5" /> 
                                <span className="truncate max-w-[150px]">{app.user.email}</span>
                              </a>
                              
                              {app.user.phone && (
                                <a href={`tel:${app.user.phone}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors">
                                  <Phone className="h-3.5 w-3.5" /> {app.user.phone}
                                </a>
                              )}
                              
                              {(app.user.resumeUrl || app.resume) && (
                                <a 
                                  href={app.resume || app.user.resumeUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-medium"
                                >
                                  <FileText className="h-3.5 w-3.5" /> Resume
                                  <ExternalLink className="h-3 w-3 ml-0.5 opacity-70" />
                                </a>
                              )}
                            </div>

                            {/* Skills */}
                            {app.user.skills?.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 pt-1">
                                {app.user.skills.map((s) => (
                                  <span key={s} className="text-xs border border-border/50 bg-background text-muted-foreground px-2.5 py-1 rounded-md">
                                    {s}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Cover Letter */}
                            {app.coverLetter && (
                              <div className="mt-4 p-4 rounded-xl bg-muted/40 border border-border/30 relative">
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/20 rounded-l-xl"></div>
                                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                  <MessageSquare className="h-3.5 w-3.5" /> Cover Letter
                                </h4>
                                <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">
                                  {app.coverLetter}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action Footer */}
                      {nextStatuses.length > 0 && (
                        <div className="bg-muted/30 border-t border-border/50 px-5 sm:px-6 py-3 flex flex-wrap items-center justify-end gap-2">
                          <span className="text-xs text-muted-foreground mr-auto hidden sm:inline-block">Update Status:</span>
                          {nextStatuses.map((s) => (
                            <Button
                              key={s}
                              size="sm"
                              variant={s === 'REJECTED' ? 'ghost' : s === 'ACCEPTED' ? 'default' : 'outline'}
                              className={`h-8 font-medium ${s === 'REJECTED' ? 'text-destructive hover:text-destructive hover:bg-destructive/10' : ''}`}
                              disabled={isUpdating}
                              onClick={() => updateStatus({ applicationId: app.id, status: s })}
                            >
                              {s === 'ACCEPTED' && <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />}
                              {s === 'REJECTED' && <XCircle className="h-3.5 w-3.5 mr-1.5" />}
                              {s === 'INTERVIEW' && <User className="h-3.5 w-3.5 mr-1.5" />}
                              {s === 'REVIEWED' && <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />}
                              {STATUS_CONFIG[s].label}
                            </Button>
                          ))}
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            )}
          </section>
        ))}
      </div>

      {data?.jobs.length === 0 && (
        <div className="text-center py-24 border-2 border-dashed rounded-2xl">
          <Briefcase className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-medium">No Jobs Posted</h3>
          <p className="text-muted-foreground mt-1">
            Post a job to start receiving applications.
          </p>
        </div>
      )}
    </div>
  );
}
