import { getAuth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
  try {
    const user = await getAuth();
    if (!user) {
      return NextResponse.json([]);
    }

    const applications = await prisma.application.findMany({
      where: { userId: user.id },
      include: {
        job: {
          include: {
            company: {
              select: { id: true, name: true, logo: true, location: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(applications);
  } catch (error) {
    console.error('User applications error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
};

export const DELETE = async (req: NextRequest) => {
  try {
    const user = await getAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { searchParams } = new URL(req.url);
    const applicationId = searchParams.get('id');

    if (!applicationId) {
      return NextResponse.json(
        { error: 'Application ID required' },
        { status: 400 }
      );
    }

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
    });

    if (!application || application.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (application.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Can only withdraw pending applications' },
        { status: 400 }
      );
    }

    await prisma.application.delete({ where: { id: applicationId } });
    return NextResponse.json({ message: 'Application withdrawn' });
  } catch (error) {
    console.error('Delete application error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
};
