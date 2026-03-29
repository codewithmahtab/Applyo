import { getAuth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
  try {
    const user = await getAuth();
    if (!user || !user.id) {
       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { job_title, job_description, job_location, salary_max, salary_min, companyId } =
      await req.json();
    if (
      !job_title ||
      !job_description ||
      !job_location ||
      !salary_max ||
      !salary_min ||
      !companyId
    ) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const company = await prisma.company.findUnique({
      where: {
        id: companyId,
      },
    });

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    if (company.ownerId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const job = await prisma.job.create({
      data: {
        job_title,
        job_description,
        job_location,
        salary_max,
        salary_min,
        companyId: company.id,
        postedByUserId: user.id,
      },
    });

    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
};
