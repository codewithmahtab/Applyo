import { NextRequest, NextResponse } from 'next/server';

export const POST = (req: NextRequest) => {
  try {
    const response = NextResponse.json(
      {
        message: 'Logout Successfully',
      },
      { status: 200 }
    );

    response.cookies.set('accesstoken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
    });
    response.cookies.set('refreshToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      message: 'Internal Server Error',
    });
  }
};
