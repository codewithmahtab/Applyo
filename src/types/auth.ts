export type AuthPayload = {
  id: string;
  email?: string;
  role?: 'EMPLOYER' | 'CANDIDATE';
};

export interface Job {
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
  hasApplied?: boolean; // This comes from the API
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
