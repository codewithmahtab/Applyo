import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const decoded = await getAuth();
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        headline: true,
        phone: true,
        location: true,
        resumeUrl: true,
        skills: true,
        avatar: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('GET /api/user/profile error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      name,
      email,
      bio,
      headline,
      phone,
      location,
      resumeUrl,
      skills,
      avatar,
    } = await req.json();

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        ...(name !== undefined && { name }),
        ...(email !== undefined && { email }),
        ...(bio !== undefined && { bio }),
        ...(headline !== undefined && { headline }),
        ...(phone !== undefined && { phone }),
        ...(location !== undefined && { location }),
        ...(resumeUrl !== undefined && { resumeUrl }),
        ...(skills !== undefined && { skills }),
        ...(avatar !== undefined && { avatar }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        headline: true,
        phone: true,
        location: true,
        resumeUrl: true,
        skills: true,
        avatar: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('PUT /api/user/profile error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
