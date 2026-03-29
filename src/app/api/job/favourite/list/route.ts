import { getAuth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
  try {
    let userId: string | null = null;
    try {
      const user = await getAuth();
      userId = user?.id || null;
    } catch {
      // Not authenticated - return empty list
      return NextResponse.json([]);
    }

    if (!userId) {
      return NextResponse.json([]);
    }

    const favorites = await prisma.favorite.findMany({
      where: { userId },
      include: {
        job: {
          include: {
            company: {
              select: { id: true, name: true, logo: true, location: true },
            },
            postedBy: {
              select: { id: true, name: true, email: true },
            },
          },
        },
      },
      orderBy: { id: 'desc' },
    });

    // Return the jobs array directly with isSaved=true
    const jobs = favorites.map((fav) => ({
      ...fav.job,
      isSaved: true,
      hasApplied: false,
    }));

    return NextResponse.json(jobs);
  } catch (error) {
    console.error('Fetch favourite jobs error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
};
