import { getAuth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
  try {
    const user = await getAuth();
    if (!user?.id)
      return NextResponse.json({ message: 'User not found' }, { status: 401 });

    const { coverLetter, resume, jobId, userId } = await req.json();

    if (!coverLetter || !resume || !jobId) {
      return NextResponse.json(
        { error: 'Cover letter, resume, and jobId are required' },
        { status: 400 }
      );
    }

    // Check if user already applied for this job
    const existingApplication = await prisma.application.findFirst({
      where: {
        jobId: jobId,
        userId: user.id, // Use authenticated user's ID instead of passed userId
      },
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: 'You have already applied for this job' },
        { status: 400 }
      );
    }

    console.log('🔍 Creating application with data:', {
      coverLetter,
      resume,
      jobId,
      userId: user.id,
    });

    const application = await prisma.application.create({
      data: {
        coverLetter,
        resume,
        jobId,
        userId: user.id, // Use authenticated user's ID
      },
    });

    console.log('✅ Application created successfully:', application);

    return NextResponse.json(application);
  } catch (error) {
    console.log('Apply Job Error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
};
