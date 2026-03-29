import { getAuth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const GET = async () => {
  try {
    const user = await getAuth();

    if (!user) {
      const allCompanies = await prisma.company.findMany();
      return NextResponse.json(allCompanies);
    }

    const companies = await prisma.company.findMany({
      where: {
        ownerId: {
          not: user.id,
        },
      },
    });

    return NextResponse.json(companies);
  } catch (error) {
    console.error('Error fetching companies:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
};
