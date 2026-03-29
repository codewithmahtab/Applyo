import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuth } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Access id directly from params without destructuring
    const company = await prisma.company.findUnique({
      where: { id: id },
      include: {
        jobs: true,
        reviews: true,
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    let userId: string | undefined;
    try {
      const auth = await getAuth();
      userId = auth?.id;
    } catch (e) {
      // User is not authenticated, continue without userId
    }

    let favouriteJobIds = new Set<string>();

    if (userId) {
      const favourites = await prisma.favorite.findMany({
        where: { userId },
        select: { jobId: true },
      });
      favouriteJobIds = new Set(favourites.map((fav) => fav.jobId));
    }

    const jobsWithSavedStatus = company.jobs.map((job) => ({
      ...job,
      isSaved: favouriteJobIds.has(job.id),
      company: {
        id: company.id,
        name: company.name,
      }
    }));

    return NextResponse.json(
      { ...company, jobs: jobsWithSavedStatus },
      { status: 200 }
    );
  } catch (error) {
    console.error('GET /api/company/[id] error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    let userId: string;
    try {
      const auth = await getAuth();
      userId = auth?.id as string;
    } catch (e) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    
    const company = await prisma.company.findUnique({ where: { id } });
    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }
    if (company.ownerId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();

    const updatedCompany = await prisma.company.update({
      where: { id: id },
      data: {
        name: body.name,
        industry: body.industry,
        location: body.location,
        description: body.description,
        logo: body.logo,
      },
    });

    return NextResponse.json(updatedCompany, { status: 200 });
  } catch (error) {
    console.error('PUT /api/company/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to update company' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    let userId: string;
    try {
      const auth = await getAuth();
      userId = auth?.id as string;
    } catch (e) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    
    const company = await prisma.company.findUnique({ where: { id } });
    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }
    if (company.ownerId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const deletedCompany = await prisma.company.delete({
      where: { id: id },
    });

    return NextResponse.json(
      { company: deletedCompany, message: 'Company deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
