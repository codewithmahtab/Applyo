// components/ApplicationCard.tsx
'use client';

import React from 'react';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import {
  Briefcase,
  MapPin,
  DollarSign,
  Calendar,
  Building2,
  User,
} from 'lucide-react';
import { Button } from './ui/button';

interface Job {
  id: string;
  job_title: string;
  employer_name?: string | null;
  job_description: string;
  job_location?: string;
  job_employment_type_text?: string | null;
  job_posted_human_readable?: string | null;
  salary_min?: number;
  salary_max?: number;
  createdAt: string;
  postedByUserId: string;
  companyId: string;
  hasApplied?: boolean;
  company?: {
    id: string;
    name: string;
    email: string;
    createdAt: string;
    ownerId: string;
  };
  postedBy?: {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
  };
}

interface Props {
  job: Job;
}

const ApplicationCard: React.FC<Props> = ({ job }) => {
  const {
    id,
    job_title,
    job_employment_type_text,
    job_location,
    job_description,
    job_posted_human_readable,
    salary_min,
    salary_max,
    createdAt,
    company,
    postedBy,
  } = job;

  const companyName =
    company?.name || job.employer_name || postedBy?.name || 'Unknown Company';

  const salaryRange = (() => {
    if (!salary_min && !salary_max) return null;
    if (salary_min && salary_max) return `$${salary_min} - $${salary_max}`;
    if (salary_min) return `From $${salary_min}`;
    if (salary_max) return `Up to $${salary_max}`;
    return null;
  })();

  const postedDate = (() => {
    if (job_posted_human_readable) return job_posted_human_readable;
    const date = new Date(createdAt);
    return date.toDateString();
  })();

  return (
    <Card className="w-full p-4 hover:shadow-md transition-all duration-300">
      <CardContent className="p-0 space-y-2">
        <CardTitle className="text-lg font-semibold line-clamp-2">
          {job_title}
        </CardTitle>

        <div className="flex items-center gap-2 text-muted-foreground">
          <Building2 size={16} />
          <span className="font-medium">{companyName}</span>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          {job_employment_type_text && (
            <div className="flex items-center gap-1">
              <Briefcase size={14} />
              {job_employment_type_text}
            </div>
          )}
          {job_location && (
            <div className="flex items-center gap-1">
              <MapPin size={14} />
              {job_location}
            </div>
          )}
          {salaryRange && (
            <div className="flex items-center gap-1">
              <DollarSign size={14} />
              {salaryRange}
            </div>
          )}
        </div>

        <p className="text-sm text-muted-foreground line-clamp-3">
          {job_description}
        </p>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar size={12} />
            <span>{postedDate}</span>
          </div>
          {postedBy && (
            <div className="flex items-center gap-1">
              <User size={12} />
              <span>Posted by {postedBy.name}</span>
            </div>
          )}
        </div>
        <Button variant={'outline'}>View Datails</Button>
      </CardContent>
    </Card>
  );
};

export default ApplicationCard;
