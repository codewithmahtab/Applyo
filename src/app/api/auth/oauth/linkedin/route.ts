import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const clientId = process.env.LINKEDIN_CLIENT_ID!;
  const redirectUri = `${appUrl}/api/auth/oauth/callback`;

  const state = Buffer.from(JSON.stringify({ provider: 'linkedin' })).toString('base64url');

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: 'openid profile email',
    state,
  });

  return NextResponse.redirect(
    `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`
  );
}
