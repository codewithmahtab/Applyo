'use client';

import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { useJobs } from '@/hooks/useJobs';
import { useAddToFavourite } from '@/hooks/useAddToFavourite';
import { useApplyJob } from '@/hooks/useApplyJob';
import { useQueryClient } from '@tanstack/react-query';
import { useUser } from '@/hooks/getUser';
import { useRouter } from 'next/navigation';
import {
  Loader2,
  Bookmark,
  MapPin,
  DollarSign,
  Briefcase,
  Clock8,
  Building2,
  Check,
  ExternalLink
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

function formatSalary(min?: number | null, max?: number | null) {
  if (!min && !max) return null;
  if (min && max) return `₹${min.toLocaleString()} – ₹${max.toLocaleString()}`;
  if (min) return `From ₹${min.toLocaleString()}`;
  if (max) return `Up to ₹${max.toLocaleString()}`;
  return null;
}

function formatDate(createdAt: string, humanReadable?: string | null) {
  if (humanReadable) return humanReadable;
  if (!createdAt) return '';
  const diff = Date.now() - new Date(createdAt).getTime();
  const days = Math.ceil(diff / 86400000);
  if (days <= 1) return 'Today';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.ceil(days / 7)} weeks ago`;
  return `${Math.ceil(days / 30)} months ago`;
}

const JobDetails = ({ id }: { id: string }) => {
  const { data: jobs, isLoading } = useJobs();
  const { data: user } = useUser();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [resume, setResume] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const { mutate: applyJob, isPending: isApplying } = useApplyJob();
  const { mutate: toggleFavourite, isPending: isFavouriting } = useAddToFavourite();

  const handleLoginRedirect = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    } 
    // Capture the click position for the modal animation
    const x = e?.clientX ?? window.innerWidth / 2;
    const y = e?.clientY ?? window.innerHeight / 2;
    
    sessionStorage.setItem(
      'loginBtnOrigin',
      JSON.stringify({ x, y })
    );
    router.push(`/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
  };

  if (isLoading || !jobs || jobs.length === 0) {
    return (
      <div className="flex justify-center items-center p-12 min-h-[50vh]">
        <Loader2 className="size-8 text-primary animate-spin" />
      </div>
    );
  }

  const job = jobs.find((job: any) => String(job.id) === String(id));

  if (!job) return <div className="p-8 text-center text-muted-foreground text-lg">Job not found</div>;

  const companyName = job.company?.name || job.employer_name || 'Unknown Company';
  const salaryRange = formatSalary(job.salary_min, job.salary_max);

  const isApplied = job.hasApplied;
  const isBookmarked = job.isSaved;

  const handleBookmark = (e: React.MouseEvent) => {
    if (!user) {
      handleLoginRedirect(e);
      return;
    }

    toggleFavourite(job.id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['jobs'] });
      },
    });
  };

  const handleApply = () => {
    applyJob(
      { resume, coverLetter, jobId: job.id, userId: '' },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['jobs'] });
          queryClient.invalidateQueries({ queryKey: ['jobs', 'search'] });
          setResume('');
          setCoverLetter('');
          setDialogOpen(false);
        },
      }
    );
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto w-full">
      {/* Left Column - Details */}
      <div className="flex flex-1 space-y-6">
        <Card className="p-6 md:p-6 relative overflow-hidden border-border/60 shadow-sm w-full">
          {/* Bookmark Button Top Right */}
          <div className="absolute top-6 right-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => handleBookmark(e)}
              disabled={isFavouriting}
              className={`rounded-full shadow-sm transition-colors ${
                isBookmarked
                  ? 'text-primary hover:text-primary'
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              {isFavouriting ? (
                <Loader2 className="animate-spin size-6" />
              ) : isBookmarked ? (
                <Bookmark fill="currentColor" className="text-primary size-6" />
              ) : (
                <Bookmark className="size-6" />
              )}
            </Button>
          </div>

          <div className="pr-16">
            <h1 className="text-3xl font-bold text-foreground mb-3">{job.job_title}</h1>
            <div className="flex items-center gap-3 text-lg text-muted-foreground mb-8">
              <Avatar className="w-8 h-8 rounded-lg shadow-sm border border-border/50">
                <AvatarImage src={job.company?.logo} alt={companyName} className="object-cover" />
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm rounded-lg">
                  {companyName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium">{companyName}</span>
            </div>
          </div>

          {job.job_description && (
            <div className="mb-10">
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                Job Description
              </h2>
              <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground leading-relaxed whitespace-pre-line">
                {job.job_description}
              </div>
            </div>
          )}

          {job.job_highlights?.Responsibilities && job.job_highlights.Responsibilities.length > 0 && (
            <div className="mb-10">
              <h2 className="text-xl font-semibold text-foreground mb-5">Responsibilities</h2>
              <ul className="space-y-3">
                {job.job_highlights.Responsibilities.map((item: string, index: number) => (
                  <li key={index} className="flex gap-4 text-muted-foreground leading-relaxed">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {job.job_highlights?.Qualifications && job.job_highlights.Qualifications.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-5">Qualifications</h2>
              <ul className="space-y-3">
                {job.job_highlights.Qualifications.map((item: string, index: number) => (
                  <li key={index} className="flex gap-4 text-muted-foreground leading-relaxed">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      </div>

      {/* Right Column - Summary & Actions */}
      <div className="lg:w-1/3">
        <Card className="p-6 !sticky !top-20 border-border/60 shadow-sm">
          <h3 className="text-lg font-semibold text-foreground">
            Apply Now
          </h3>
          
          <div className="space-y-6 mb-8">
            {job.job_location && (
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 flex items-center justify-center shrink-0">
                  <MapPin size={22}/>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-0.5">Location</p>
                  <p className="font-medium text-foreground">{job.job_location}</p>
                </div>
              </div>
            )}
            
            {salaryRange && (
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 flex items-center justify-center shrink-0">
                  <DollarSign size={22}/>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-0.5">Salary</p>
                  <p className="font-medium text-foreground">{salaryRange}</p>
                </div>
              </div>
            )}

            {job.job_employment_type_text && (
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 flex items-center justify-center shrink-0">
                  <Briefcase size={22}/>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-0.5">Job Type</p>
                  <p className="font-medium text-foreground">{job.job_employment_type_text}</p>
                </div>
              </div>
            )}

            <div className="flex gap-4 items-center">
              <div className="w-12 h-12 flex items-center justify-center shrink-0">
                <Clock8 size={22}/>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-0.5">Posted</p>
                <p className="font-medium text-foreground">{formatDate(job.createdAt, job.job_posted_human_readable)}</p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-border/60">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                {isApplied ? (
                  <Button
                    variant="outline"
                    className="w-full h-12 text-base font-medium text-emerald-600 border-emerald-200 bg-emerald-50 hover:bg-emerald-50 hover:text-emerald-600 cursor-pointer dark:bg-emerald-950/20 dark:border-emerald-800 dark:text-emerald-400"  
                  >
                    <Check size={18} className="mr-2" />
                    Already Applied
                  </Button>
                ) : (
                  <Button 
                    className="cursor-pointer w-full h-12 text-base font-medium shadow-md hover:shadow-lg transition-all"
                    onClick={(e) => {
                      if (!user) {
                        e.preventDefault();
                        handleLoginRedirect(e);
                      }
                    }}
                  >
                    Apply Now
                  </Button>
                )}
              </DialogTrigger>

              {!isApplied && (
                <DialogContent className="max-w-md sm:rounded-2xl">
                  <DialogTitle className="text-2xl font-bold mb-1">
                    Apply for this Job
                  </DialogTitle>
                  <p className="text-muted-foreground mb-6">
                    {job.job_title} at {companyName}
                  </p>

                  <div className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Resume URL <span className="text-destructive">*</span>
                      </label>
                      <input
                        type="url"
                        className="w-full p-3 border border-border/60 rounded-xl text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                        placeholder="e.g. https://drive.google.com/your-resume"
                        value={resume}
                        onChange={(e) => setResume(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">Provide a link to your hosted resume.</p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Cover Letter <span className="text-muted-foreground font-normal">(Optional)</span>
                      </label>
                      <textarea
                        className="w-full p-3 border border-border/60 rounded-xl text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none shadow-sm"
                        rows={5}
                        placeholder="Tell the employer why you're a great fit for this role..."
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                      />
                    </div>

                    <div className="pt-4 border-t border-border/60 flex items-center justify-end gap-3">
                      <Button type="button" variant="ghost" onClick={() => setDialogOpen(false)} className="rounded-xl">
                        Cancel
                      </Button>
                      <Button
                        onClick={handleApply}
                        disabled={!resume || isApplying}
                        className="rounded-xl min-w-[140px]"
                      >
                        {isApplying ? (
                          <>
                            <Loader2 size={16} className="mr-2 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          'Submit Application'
                        )}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              )}
            </Dialog>

            {job.apply_options && job.apply_options.length > 0 && (
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground mb-3">Or apply via external links</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {job.apply_options.map((option: any, index: number) => (
                    <a
                      key={index}
                      href={option.apply_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
                    >
                      {option.publisher}
                      <ExternalLink size={14} />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default JobDetails;
