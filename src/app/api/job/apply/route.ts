import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@/lib/auth';

export const POST = async (req: NextRequest) => {
  try {
    const user = await getAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { jobId, coverLetter, resume } = await req.json();

    if (!jobId) {
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400 }
      );
    }

    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    const existingApplication = await prisma.application.findFirst({
      where: { jobId, userId: user.id },
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: 'You have already applied to this job' },
        { status: 400 }
      );
    }

    const application = await prisma.application.create({
      data: {
        jobId,
        userId: user.id,
        coverLetter: coverLetter || null,
        resume: resume || null,
        status: 'PENDING',
      },
    });

    return NextResponse.json(
      { message: 'Application submitted successfully', application },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Something went wrong';
    const isAuth = message.includes('Unauthenticated');
    return NextResponse.json(
      { error: message },
      { status: isAuth ? 401 : 500 }
    );
  }
};
