import { getAuth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
  try {
    const user = await getAuth();
    if (!user?.id)
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    const { rating, review, jobId, companyId } = await req.json();
    if (!rating || !review || !jobId || !companyId)
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );

    const newReview = await prisma.reviews.create({
      data: {
        rating,
        review,
        jobId,
        companyId,
        userId: user.id,
      },
    });

    return NextResponse.json({
      message: 'Review created successfully',
      data: newReview,
    });
  } catch (error) {}
};
