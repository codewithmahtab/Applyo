import { getAuth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
  try {
    const user = await getAuth();
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, industry, location, description, logo } = await req.json();

    if (!name || !industry || !location) {
      return NextResponse.json(
        { message: 'Name, industry and location are required' },
        { status: 400 }
      );
    }

    const existing = await prisma.company.findFirst({
      where: {
        name,
        ownerId: user.id,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'You already created a company with this name' },
        { status: 409 }
      );
    }

    const company = await prisma.company.create({
      data: {
        name,
        industry,
        location,
        description,
        logo,
        ownerId: user.id,
      },
    });

    return NextResponse.json(
      {
        message: 'Company created successfully',
        company: {
          id: company.id,
          name: company.name,
          industry: company.industry,
          location: company.location,
          description: company.description,
          logo: company.logo,
          createdAt: company.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating company:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
};
