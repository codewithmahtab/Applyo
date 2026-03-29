import { getAuth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
  try {
    const user = await getAuth();

    const jobs = await prisma.job.findMany({
      include: {
        company: {
          select: { id: true, name: true, location: true, logo: true },
        },
        postedBy: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!user?.id) {
      return NextResponse.json(
        jobs.map((job) => ({
          ...job,
          hasApplied: false,
          isSaved: false,
        }))
      );
    }

    const [favorites, applications] = await Promise.all([
      prisma.favorite.findMany({
        where: { userId: user.id },
        select: { jobId: true },
      }),
      prisma.application.findMany({
        where: { userId: user.id },
        select: { jobId: true },
      }),
    ]);

    const savedJobIds = new Set(favorites.map((f) => f.jobId));
    const appliedJobIds = new Set(applications.map((a) => a.jobId));

    const jobsWithStatus = jobs.map((job) => ({
      ...job,
      hasApplied: appliedJobIds.has(job.id),
      isSaved: savedJobIds.has(job.id),
    }));

    return NextResponse.json(jobsWithStatus);
  } catch (error) {
    console.error('Fetch All Jobs Error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
};
