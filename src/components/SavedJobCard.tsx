'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
  BookmarkX,
  Briefcase,
  Check,
  Clock8,
  ExternalLink,
  Loader2,
  MapPin,
} from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';
import type { Job } from '@/components/JobCard';

interface SavedJobCardProps {
  job: Job;
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

const SavedJobCard: React.FC<SavedJobCardProps> = ({ job }) => {
  const {
    id,
    job_title,
    job_employment_type_text,
    job_location,
    job_description,
    job_posted_human_readable,
    skills,
    createdAt,
    company,
    hasApplied,
    experience_level,
  } = job;

  const companyName = company?.name || job.employer_name || 'Unknown Company';
  const companyInitial = companyName.charAt(0).toUpperCase();

  const [resume, setResume] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [localHasApplied, setLocalHasApplied] = useState(hasApplied);
  const [localIsSaved, setLocalIsSaved] = useState(true);

  const { data: user } = useUser();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate: applyJob, isPending: isApplying } = useApplyJob();
  const { mutate: toggleFavourite, isPending: isRemoving } = useAddToFavourite();

  const isApplied = localHasApplied || hasApplied;

  const handleLoginRedirect = (e?: React.MouseEvent) => {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    router.push(`/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { handleLoginRedirect(e); return; }
    toggleFavourite(id, {
      onSuccess: () => {
        setLocalIsSaved(false);
        queryClient.invalidateQueries({ queryKey: ['favouriteJobs'] });
      },
    });
  };

  const handleApply = () => {
    applyJob(
      { resume, coverLetter, jobId: id, userId: '' },
      {
        onSuccess: () => {
          setLocalHasApplied(true);
          queryClient.invalidateQueries({ queryKey: ['jobs'] });
          setResume('');
          setCoverLetter('');
          setDialogOpen(false);
        },
      }
    );
  };

  if (!localIsSaved) return null;

  return (
    <Card className="flex flex-col h-full shadow-none border-border overflow-hidden transition-all duration-200 hover:border-primary/30 hover:shadow-sm group p-0">
      {/* Card Body — grows to fill height */}
      <div className="flex flex-col flex-1 p-5 gap-4">

        {/* Top row: avatar + title + remove btn */}
        <div className="flex items-start gap-3">
          <Avatar className="w-10 h-10 rounded-sm shrink-0 border border-border/50">
            <AvatarImage src={company?.logo} alt={companyName} className="object-cover" />
            <AvatarFallback className="bg-primary/10 text-primary font-bold rounded-xl">
              {companyInitial}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <Link
              href={`/jobs/${id}`}
              className="text-sm font-semibold leading-snug line-clamp-2 hover:underline hover:text-primary underline-offset-2 transition-colors"
            >
              {job_title}
            </Link>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">{companyName}</p>
          </div>

          <button
            onClick={handleRemove}
            disabled={isRemoving}
            title="Remove from saved"
            className="shrink-0 text-primary transition-colors cursor-pointer"
          >
            {isRemoving
              ? <Loader2 size={16} className="animate-spin" />
              : <Bookmark size={18} fill="currentColor" className="size-6" />
            }
          </button>
        </div>

        {/* Meta badges row — always present, uses placeholder space */}
        <div className="flex flex-wrap gap-1.5 min-h-[22px]">
          {job_employment_type_text && (
            <Badge variant="secondary" className="text-xs h-5 px-2">
              <Briefcase size={9} className="mr-1" />
              {job_employment_type_text}
            </Badge>
          )}
          {experience_level && (
            <Badge variant="outline" className="text-xs h-5 px-2">
              {experience_level}
            </Badge>
          )}
          {job_location && (
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin size={10} />
              {job_location}
            </span>
          )}
        </div>

        {/* Description — fixed 2-line clamp so all cards share same region */}
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 min-h-[32px]">
          {job_description || 'No description provided for this position.'}
        </p>

        {/* Skills — fixed height region showing up to 3 pills */}
        <div className="flex flex-wrap gap-1.5 min-h-[22px]">
          {skills && skills.length > 0 ? (
            <>
              {skills.slice(0, 3).map((skill) => (
                <span
                  key={skill}
                  className="text-xs bg-primary/8 text-primary px-2 py-0.5 rounded-full border border-primary/20"
                >
                  {skill}
                </span>
              ))}
              {skills.length > 3 && (
                <span className="text-xs text-muted-foreground">+{skills.length - 3}</span>
              )}
            </>
          ) : (
            <span className="text-xs text-muted-foreground/40 italic">No skills listed</span>
          )}
        </div>
      </div>

      {/* Footer — always pinned to bottom */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-border/60 mt-auto">
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock8 size={12} />
          {formatDate(createdAt, job_posted_human_readable)}
        </span>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-7 text-xs px-2 gap-1" asChild>
            <Link href={`/jobs/${id}`}>
              <ExternalLink size={11} />
              View
            </Link>
          </Button>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              {isApplied ? (
                <Button
                  variant="outline"
                  size="sm"
                  disabled
                  className="h-7 text-xs text-emerald-600 border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20 dark:border-emerald-800"
                >
                  <Check size={11} className="mr-1" /> Applied
                </Button>
              ) : (
                <Button
                  size="sm"
                  className="h-7 text-xs"
                  onClick={(e) => { if (!user) { e.preventDefault(); handleLoginRedirect(e); } }}
                >
                  Apply
                </Button>
              )}
            </DialogTrigger>

            {!isApplied && (
              <DialogContent className="max-w-md">
                <DialogTitle className="text-xl font-semibold">
                  Apply to {job_title}
                </DialogTitle>
                <p className="text-sm text-muted-foreground -mt-1">at {companyName}</p>
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
                    <label className="text-sm font-medium">Cover Letter</label>
                    <textarea
                      className="w-full p-2.5 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                      rows={5}
                      placeholder="Tell us why you're a great fit..."
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                    />
                  </div>
                  <Button className="w-full" onClick={handleApply} disabled={!resume || isApplying}>
                    {isApplying ? 'Submitting...' : 'Submit Application'}
                  </Button>
                </div>
              </DialogContent>
            )}
          </Dialog>
        </div>
      </div>
    </Card>
  );
};

export default SavedJobCard;
