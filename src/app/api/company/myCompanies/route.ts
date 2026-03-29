import { getAuth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const GET = async () => {
  try {
    const user = await getAuth();

    if (!user?.id) {
      return NextResponse.json([]);
    }

    const companies = await prisma.company.findMany({
      where: {
        ownerId: user.id,
      },
    });
    return NextResponse.json(companies);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
};
