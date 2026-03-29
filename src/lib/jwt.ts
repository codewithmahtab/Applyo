import jwt, { JwtPayload } from 'jsonwebtoken';

const ACCESS_SECRET = process.env.ACCESS_SECRET as string;
const REFRESH_SECRET = process.env.REFRESH_SECRET as string;

export interface TokenPayload extends JwtPayload {
  id: string;
  email: string;
}

export const signAccessToken = (payload: TokenPayload) => {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: '1d' });
};
export const signRefreshToken = (payload: TokenPayload) => {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: '7d' });
};

export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, ACCESS_SECRET) as TokenPayload;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, REFRESH_SECRET) as TokenPayload;
};
