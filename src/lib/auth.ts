import { cookies } from 'next/headers';
import { verifyRefreshToken } from './jwt';
import { AuthPayload } from '@/types/auth';

export async function getAuth(): Promise<{ id: string } | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('refreshToken')?.value;

    if (!token) return null;

    const payload = verifyRefreshToken(token) as AuthPayload;

    return { id: payload.id };
  } catch (error) {
    return null;
  }
}
