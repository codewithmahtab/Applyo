'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCompanyById } from '@/hooks/useCompanyByID';
import JobCard from '@/components/JobCard'; // adjust path as needed
import { Loader2, Plus, Pencil, Eye, Trash2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useDeleteCompany } from '@/hooks/useDeleteCompany';
import { useUser } from '@/hooks/getUser';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const CompanyDetail = () => {
  const params = useParams();
  const router = useRouter();
  const companyId = params?.id as string;
  const { data: company, isLoading: isCompanyLoading, isError } = useCompanyById(companyId);
  const { mutate: deleteCompany } = useDeleteCompany();
  const { data: user, isLoading: isUserLoading } = useUser();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this company?')) {
      setDeletingId(companyId);
      deleteCompany(companyId, {
        onSuccess: () => {
          router.push('/company');
        },
        onSettled: () => setDeletingId(null),
      });
    }
  };

  if (isCompanyLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="size-8 text-primary animate-spin flex-shrink-0" />
      </div>
    );
  }

  if (isError || !company)
    return <p className="text-center text-destructive p-6">Something went wrong while fetching the company details.</p>;

  const isOwner = user?.id === company.owner?.id;

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto animate-fade-in">
      <div className="mb-5">
        <Link
          href="/company"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Companies
        </Link>
      </div>  

      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
        <div className="flex gap-5 items-start">
          <Avatar className="w-20 h-20 rounded-xl border shadow-sm">
            <AvatarImage src={company.logo} alt={company.name} className="object-cover" />
            <AvatarFallback className="bg-primary/10 text-primary font-bold text-3xl rounded-xl">
              {company.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div>
            <h1 className="text-3xl font-bold">{company.name}</h1>
            <p className="text-muted-foreground mt-1">
              {company.industry} · {company.location}
            </p>
            <p className="mt-4 text-sm text-foreground/80 leading-relaxed max-w-3xl">{company.description}</p>
            <p className="mt-3 text-xs text-muted-foreground/70">
              Created on: {new Date(company.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        {isOwner && (
          <div className="flex flex-wrap items-center gap-2 shrink-0 p-2 rounded-xl">
            <Button
              size="sm"
              className="h-9 gap-1.5"
              onClick={() => router.push(`/company/${company.id}/job/create`)}
            >
              <Plus className="w-4 h-4" /> Post Job
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-9 gap-1.5"
              onClick={() => router.push(`/company/${company.id}/edit`)}
            >
              <Pencil className="w-4 h-4" /> Edit
            </Button>
            <Link href={`/company/${company.id}/applications`}>
              <Button
                variant="outline"
                size="sm"
                className="h-9 gap-1.5"
              >
                <Eye className="w-4 h-4" /> Applicants
              </Button>
            </Link>
            <Button
              variant="destructive"
              size="sm"
              className="h-9 w-9 p-0 ml-1"
              disabled={deletingId === company.id}
              onClick={handleDelete}
              title="Delete Company"
            >
              {deletingId === company.id ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-semibold mb-4">Job Openings</h2>
          {company.jobs && company.jobs.length > 0 ? (
            <div className="grid gap-4">
              {company.jobs.map((job: any) => (
                <JobCard
                  key={job.id}
                  job={{
                    ...job,
                    company: {
                      id: company.id,
                      name: company.name,
                      logo: company.logo,
                      location: company.location
                    }
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 border border-dashed border-border rounded-xl bg-muted/10">
              <p className="text-muted-foreground">No job openings available.</p>
              {isOwner && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4 gap-2"
                  onClick={() => router.push(`/company/${company.id}/job/create`)}
                >
                  <Plus className="w-4 h-4" /> Post the first job
                </Button>
              )}
            </div>
          )}
        </div>

        <div className="md:col-span-1">
          <div className="bg-muted/10 border border-border/60 rounded-xl p-5 sticky top-24">
            <h2 className="text-lg font-semibold mb-3 border-b border-border/60 pb-2">Owner Profile</h2>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-muted-foreground block text-xs mb-1">Name</span>
                <span className="font-medium">{company.owner?.name || 'N/A'}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-xs mb-1">Email Contact</span>
                <span className="font-medium break-all">{company.owner?.email || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetail;
