'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useAddToFavourite } from '@/hooks/useAddToFavourite';
import { useApplyJob } from '@/hooks/useApplyJob';
import { useUser } from '@/hooks/getUser';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Bookmark,
  Briefcase,
  Building2,
  Check,
  CheckCircle2,
  Clock8,
  DollarSign,
  ExternalLink,
  History,
  Loader2,
  MapPin
} from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';

interface Company {
  id: string;
  name: string;
  logo?: string;
  location?: string;
}

interface PostedBy {
  id: string;
  name: string;
  email: string;
}

export interface Job {
  id: string;
  job_title: string;
  employer_name?: string | null;
  job_description?: string | null;
  job_location?: string | null;
  job_employment_type_text?: string | null;
  job_posted_human_readable?: string | null;
  salary_min?: number | null;
  salary_max?: number | null;
  skills?: string[];
  experience_level?: string | null;
  createdAt: string;
  hasApplied?: boolean;
  isSaved?: boolean;
  company?: Company | null;
  postedBy?: PostedBy | null;
}

interface JobCardProps {
  job: Job;
}

function formatSalary(min?: number | null, max?: number | null) {
  if (!min && !max) return null;
  if (min && max) return `₹${min.toLocaleString()} – ₹${max.toLocaleString()}`;
  if (min) return `From ₹${min.toLocaleString()}`;
  if (max) return `Up to ₹${max.toLocaleString()}`;
  return null;
}

function formatDate(createdAt: string, humanReadable?: string | null) {
  if (humanReadable) return humanReadable;
  const diff = Date.now() - new Date(createdAt).getTime();
  const days = Math.ceil(diff / 86400000);
  if (days <= 1) return 'Today';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.ceil(days / 7)} weeks ago`;
  return `${Math.ceil(days / 30)} months ago`;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const {
    id,
    job_title,
    job_employment_type_text,
    job_location,
    job_description,
    job_posted_human_readable,
    salary_min,
    salary_max,
    skills,
    createdAt,
    company,
    hasApplied,
    isSaved,
  } = job;

  const companyName = company?.name || job.employer_name || 'Unknown Company';
  const companyInitial = companyName.charAt(0).toUpperCase();
  const salaryRange = formatSalary(salary_min, salary_max);

  const [resume, setResume] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [localHasApplied, setLocalHasApplied] = useState(hasApplied);
  const [localIsSaved, setLocalIsSaved] = useState(isSaved);

  const { data: user } = useUser();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate: applyJob, isPending: isApplying } = useApplyJob();
  const { mutate: toggleFavourite, isPending: isFavouriting } =
    useAddToFavourite();

  const handleLoginRedirect = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // Capture the button's center position for the modal animation
    const rect = e?.currentTarget?.getBoundingClientRect();
    const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const y = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;

    sessionStorage.setItem(
      'loginBtnOrigin',
      JSON.stringify({ x, y })
    );

    router.push(`/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
  };

  const isApplied = localHasApplied || hasApplied;
  const isBookmarked = localIsSaved ?? isSaved;

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      handleLoginRedirect(e);
      return;
    }

    toggleFavourite(id, {
      onSuccess: (res) => setLocalIsSaved(res.isFavourited),
    });
  };

  const handleApply = () => {
    applyJob(
      { resume, coverLetter, jobId: id, userId: '' },
      {
        onSuccess: () => {
          setLocalHasApplied(true);
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
    <Card className="w-full shadow-none transition-all duration-200 p-0 overflow-hidden group border-border">
      <CardContent className="p-5">
        <div className="flex justify-between items-start gap-3">
          {/* Company Logo / Initial Badge */}
          <Avatar className="w-11 h-11 rounded-sm shrink-0 border border-border/50 shadow-sm">
            <AvatarImage src={company?.logo} alt={companyName} className="object-cover" />
            <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg rounded-sm">
              {companyInitial}
            </AvatarFallback>
          </Avatar>

          {/* Main Content */}
          <div className="flex-1 min-w-0 space-y-2">
            <div>
              <CardTitle>
                <Link href={`/jobs/${job.id}`} className="text-base font-semibold line-clamp-1 hover:cursor-pointer hover:underline underline-offset-2 hover:text-primary transition-colors">
                  {job_title}
                </Link>
              </CardTitle>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-0.5">
                <Building2 size={13} />
                <span className="font-medium">{companyName}</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-2">
              {job_employment_type_text && (
                <Badge variant="secondary" className="text-xs">
                  <Briefcase size={10} className="mr-1" />
                  {job_employment_type_text}
                </Badge>
              )}
              {job_location && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin size={11} />
                  {job_location}
                </span>
              )}
              {salaryRange && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
                  <DollarSign size={11} />
                  {salaryRange}
                </span>
              )}
            </div>

            {/* Description */}
            {job_description && (
              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {job_description}
              </p>
            )}

            {/* Skills */}
            {skills && skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {skills.slice(0, 4).map((skill) => (
                  <span
                    key={skill}
                    className="text-xs bg-primary/8 text-primary px-2 py-0.5 rounded-full border border-primary/20"
                  >
                    {skill}
                  </span>
                ))}
                {skills.length > 4 && (
                  <span className="text-xs text-muted-foreground">
                    +{skills.length - 4} more
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Bookmark Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBookmark}
            disabled={isFavouriting}
            className={`h-8 w-8 rounded-full shrink-0 transition-colors cursor-pointer  ${isBookmarked
              ? 'text-primary hover:text-primary'
              : 'text-muted-foreground'
              }`}
          >
            {isFavouriting ? (
              <Loader2 size={18} className="size-6 animate-spin" />
            ) : isBookmarked ? (
              <Bookmark size={18} fill="currentColor" className="size-6" />
            ) : (
              <Bookmark size={18} className="size-6" />
            )}
          </Button>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/60">
          <span className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
            <Clock8 size={15} />
            {formatDate(createdAt, job_posted_human_readable)}
          </span>

          <div className="flex gap-2" >
            {/* Apply Button / Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                {isApplied ? (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled
                    className="h-8 text-xs text-emerald-600 border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20 dark:border-emerald-800"
                  >
                    <Check size={12} className="mr-1" />
                    Applied
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    className="h-8 text-xs"
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
                <DialogContent className="max-w-md">
                  <DialogTitle className="text-xl font-semibold">
                    Apply to {job_title}
                  </DialogTitle>
                  <p className="text-sm text-muted-foreground -mt-1">
                    at {companyName}
                  </p>

                  <div className="space-y-4 mt-2">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium">
                        Resume URL <span className="text-destructive">*</span>
                      </label>
                      <input
                        type="url"
                        className="w-full p-2.5 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="https://drive.google.com/your-resume"
                        value={resume}
                        onChange={(e) => setResume(e.target.value)}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium">
                        Cover Letter
                      </label>
                      <textarea
                        className="w-full p-2.5 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                        rows={5}
                        placeholder="Tell us why you're a great fit..."
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                      />
                    </div>

                    <Button
                      className="w-full"
                      onClick={handleApply}
                      disabled={!resume || isApplying}
                    >
                      {isApplying ? 'Submitting...' : 'Submit Application'}
                    </Button>
                  </div>
                </DialogContent>
              )}
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobCard;
