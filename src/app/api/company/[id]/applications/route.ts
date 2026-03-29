import { getAuth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/company/[id]/applications — employer views all applications for their company's jobs
export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const user = await getAuth();
    const { id: companyId } = await params;

    // Verify the company belongs to the requesting user
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      select: { ownerId: true, name: true },
    });

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    if (company.ownerId !== user?.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get all jobs of this company with their applications
    const jobs = await prisma.job.findMany({
      where: { companyId },
      select: {
        id: true,
        job_title: true,
        createdAt: true,
        applications: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                headline: true,
                resumeUrl: true,
                skills: true,
                avatar: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const totalApplications = jobs.reduce(
      (sum, job) => sum + job.applications.length,
      0
    );

    return NextResponse.json({
      company: company.name,
      jobs,
      totalApplications,
    });
  } catch (error) {
    console.error('Company applications error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
};

// PATCH /api/company/[id]/applications — update application status
export const PATCH = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const user = await getAuth();
    const { id: companyId } = await params;
    const { applicationId, status } = await req.json();

    // Verify ownership
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      select: { ownerId: true },
    });

    if (!company || company.ownerId !== user?.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updated = await prisma.application.update({
      where: { id: applicationId },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: { status: status as any },
    });

    return NextResponse.json({ application: updated });
  } catch (error) {
    console.error('Update application status error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
};
