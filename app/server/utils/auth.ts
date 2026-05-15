import jwt from 'jsonwebtoken';
import { createError, getCookie, getHeader } from 'h3';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

export function getTokenFromEvent(event: any): string | null {
  const authHeader = getHeader(event, 'authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }

  const cookieToken = getCookie(event, 'sanovise_token');
  return cookieToken || null;
}

export function requireUser(event: any): { id: string; email?: string } {
  const token = getTokenFromEvent(event);
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Missing token' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { id: string; email?: string };
    return { id: payload.id, email: payload.email };
  } catch {
    throw createError({ statusCode: 401, statusMessage: 'Invalid token' });
  }
}

export function signToken(payload: { id: string; email: string }) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });
}
