import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/prisma';
import { signAccessToken, signRefreshToken } from '@/lib/jwt';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// ───────────────────────────────────────────────────────────
// Token exchange helpers
// ───────────────────────────────────────────────────────────

async function exchangeGoogleCode(code: string) {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: `${APP_URL}/api/auth/oauth/callback`,
      grant_type: 'authorization_code',
    }),
  });
  if (!res.ok) throw new Error('Google token exchange failed');
  return res.json() as Promise<{ access_token: string; id_token: string }>;
}

async function getGoogleProfile(accessToken: string) {
  const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error('Google profile fetch failed');
  return res.json() as Promise<{ id: string; email: string; name: string; picture: string }>;
}

async function exchangeGitHubCode(code: string) {
  const res = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body: new URLSearchParams({
      code,
      client_id: process.env.GITHUB_CLIENT_ID!,
      client_secret: process.env.GITHUB_CLIENT_SECRET!,
      redirect_uri: `${APP_URL}/api/auth/oauth/callback`,
    }),
  });
  if (!res.ok) throw new Error('GitHub token exchange failed');
  return res.json() as Promise<{ access_token: string }>;
}

async function getGitHubProfile(accessToken: string) {
  const [profileRes, emailsRes] = await Promise.all([
    fetch('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${accessToken}`, Accept: 'application/vnd.github+json' },
    }),
    fetch('https://api.github.com/user/emails', {
      headers: { Authorization: `Bearer ${accessToken}`, Accept: 'application/vnd.github+json' },
    }),
  ]);
  if (!profileRes.ok) throw new Error('GitHub profile fetch failed');
  const profile = await profileRes.json() as { id: number; name: string; login: string; avatar_url: string; email?: string };
  const emails = emailsRes.ok
    ? (await emailsRes.json() as { email: string; primary: boolean; verified: boolean }[])
    : [];
  const primaryEmail =
    profile.email ??
    emails.find((e) => e.primary && e.verified)?.email ??
    emails[0]?.email;
  if (!primaryEmail) throw new Error('GitHub did not return a usable email address');
  return {
    id: String(profile.id),
    email: primaryEmail,
    name: profile.name || profile.login,
    avatar: profile.avatar_url,
  };
}

// ───────────────────────────────────────────────────────────
// Shared upsert + cookie helper
// ───────────────────────────────────────────────────────────

async function upsertOAuthUser({
  provider,
  providerAccountId,
  email,
  name,
  avatar,
  callbackUrl,
}: {
  provider: string;
  providerAccountId: string;
  email: string;
  name: string;
  avatar?: string;
  callbackUrl: string;
}) {
  // 1. Find existing OAuth account
  const existing = await db.oAuthAccount.findUnique({
    where: { provider_providerAccountId: { provider, providerAccountId } },
    include: { user: true },
  });

  let user = existing?.user ?? null;

  // 2. If no linked OAuth account, find/create user by email
  if (!user) {
    user = await db.user.findUnique({ where: { email } }) ?? null;

    if (!user) {
      user = await db.user.create({
        data: { name, email, avatar: avatar ?? null, password: null },
      });
    }

    // 3. Link OAuth account to user
    await db.oAuthAccount.create({
      data: { provider, providerAccountId, userId: user.id },
    });
  }

  // 4. Mint JWT tokens (same as email/password login)
  const accessToken = signAccessToken({ id: user.id, email: user.email });
  const refreshToken = signRefreshToken({ id: user.id, email: user.email });

  const response = NextResponse.redirect(callbackUrl || APP_URL);

  const cookieOpts = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
  };

  response.cookies.set('accessToken', accessToken, { ...cookieOpts, maxAge: 60 * 15 });
  response.cookies.set('refreshToken', refreshToken, { ...cookieOpts, maxAge: 60 * 60 * 24 * 7 });

  return response;
}

// ───────────────────────────────────────────────────────────
// Route Handler
// ───────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');
    const stateRaw = searchParams.get('state');
    const error = searchParams.get('error');

    if (error || !code || !stateRaw) {
      return NextResponse.redirect(`${APP_URL}/login?error=oauth_denied`);
    }

    const state = JSON.parse(Buffer.from(stateRaw, 'base64url').toString());
    const provider: string = state.provider;
    const callbackUrl: string = state.callbackUrl || APP_URL;

    if (provider === 'google') {
      const { access_token } = await exchangeGoogleCode(code);
      const profile = await getGoogleProfile(access_token);
      return upsertOAuthUser({
        provider: 'google',
        providerAccountId: profile.id,
        email: profile.email,
        name: profile.name,
        avatar: profile.picture,
        callbackUrl,
      });
    }

    if (provider === 'github') {
      const { access_token } = await exchangeGitHubCode(code);
      const profile = await getGitHubProfile(access_token);
      return upsertOAuthUser({
        provider: 'github',
        providerAccountId: profile.id,
        email: profile.email,
        name: profile.name,
        avatar: profile.avatar,
        callbackUrl,
      });
    }

    return NextResponse.redirect(`${APP_URL}/login?error=unknown_provider`);
  } catch (err) {
    console.error('OAuth callback error:', err);
    return NextResponse.redirect(`${APP_URL}/login?error=oauth_failed`);
  }
}
