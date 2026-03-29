import { getAuth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
  try {
    const user = await getAuth();

    if (!user)
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

    const { jobId } = await req.json();

    if (!jobId)
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400 }
      );

    const existing = await prisma.favorite.findFirst({
      where: {
        userId: user.id,
        jobId,
      },
    });

    if (existing) {
      await prisma.favorite.delete({
        where: {
          id: existing.id,
        },
      });

      return NextResponse.json({
        message: 'Job unfavourited successfully',
        isFavourited: false, // 🔁 Added boolean field
        jobId,
      });
    } else {
      await prisma.favorite.create({
        data: {
          userId: user.id,
          jobId,
        },
      });

      return NextResponse.json({
        message: 'Job favourited successfully',
        isFavourited: true, // 🔁 Added boolean field
        jobId,
      });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
};
