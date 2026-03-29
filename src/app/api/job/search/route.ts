import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@/lib/auth';

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || '';
    const location = searchParams.getAll('location');
    const employmentTypes = searchParams.getAll('job_employment_type_text');
    const minSalaryStr = searchParams.get('minSalary') || '';
    const maxSalaryStr = searchParams.get('maxSalary') || '';
    const experienceLevel = searchParams.get('experience_level') || '';

    const minSalary = minSalaryStr ? parseInt(minSalaryStr, 10) : undefined;
    const maxSalary = maxSalaryStr ? parseInt(maxSalaryStr, 10) : undefined;

    // Build where clause dynamically
    const where: Record<string, unknown> = {};

    if (query) {
      where.OR = [
        { job_title: { contains: query, mode: 'insensitive' } },
        { job_description: { contains: query, mode: 'insensitive' } },
        { employer_name: { contains: query, mode: 'insensitive' } },
      ];
    }

    if (location.length > 0) {
      where.job_location = {
        in: location,
        mode: 'insensitive',
      };
    }

    if (employmentTypes.length > 0) {
      where.job_employment_type_text = {
        in: employmentTypes,
        mode: 'insensitive',
      };
    }

    if (minSalary !== undefined) {
      where.salary_min = { gte: minSalary };
    }

    if (maxSalary !== undefined) {
      where.salary_max = { lte: maxSalary };
    }

    if (experienceLevel) {
      where.experience_level = { equals: experienceLevel, mode: 'insensitive' };
    }

    // Try to get current user for hasApplied status
    let userId: string | null = null;
    const user = await getAuth();
    userId = user?.id || null;

    const jobs = await prisma.job.findMany({
      where,
      include: {
        company: {
          select: { id: true, name: true, logo: true, location: true },
        },
        postedBy: {
          select: { id: true, name: true, email: true },
        },
        ...(userId && {
          applications: {
            where: { userId },
            select: { id: true },
          },
        }),
        favorites: userId ? { where: { userId }, select: { id: true } } : false,
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    const jobsWithStatus = jobs.map((job) => ({
      ...job,
      hasApplied: userId ? (job.applications?.length ?? 0) > 0 : false,
      isSaved: userId ? (job.favorites?.length ?? 0) > 0 : false,
      applications: undefined,
      favorites: undefined,
    }));

    return NextResponse.json(jobsWithStatus);
  } catch (error) {
    console.error('Search jobs error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
};
