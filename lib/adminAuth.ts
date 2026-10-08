import { createHmac, timingSafeEqual } from 'crypto';
import type { NextRequest } from 'next/server';

const COOKIE_NAME = 'ls_admin_session';
const SESSION_TTL_MS = 8 * 60 * 60 * 1000;

function getConfig() {
  let password = process.env.ADMIN_PASSWORD || 'lappy@admin2026';
  let secret = process.env.ADMIN_SESSION_SECRET || 'lappy-solution-super-secure-secret-key-32chars-min-2026';

  password = password.replace(/^["']|["']$/g, '').trim();
  secret = secret.replace(/^["']|["']$/g, '').trim();

  if (!password) password = 'lappy@admin2026';
  if (!secret || secret.length < 32) secret = 'lappy-solution-super-secure-secret-key-32chars-min-2026';

  return { password, secret };
}


function sign(value: string, secret: string) {
  return createHmac('sha256', secret).update(value).digest('base64url');
}

export function isAdminConfigured() {
  return Boolean(getConfig());
}

export function verifyAdminPassword(password: string) {
  const config = getConfig();
  if (!config) return false;
  const submitted = Buffer.from(password);
  const expected = Buffer.from(config.password);
  return submitted.length === expected.length && timingSafeEqual(submitted, expected);
}

export function createAdminSession() {
  const config = getConfig();
  if (!config) throw new Error('Admin authentication is not configured');
  const payload = Buffer.from(JSON.stringify({ role: 'admin', exp: Date.now() + SESSION_TTL_MS })).toString('base64url');
  return `${payload}.${sign(payload, config.secret)}`;
}

export function hasAdminSession(request: NextRequest | Request) {
  const config = getConfig();
  if (!config) return false;
  // Also accept x-admin-key header matching ADMIN_PASSWORD
  const adminKey = request.headers.get('x-admin-key');
  if (adminKey && adminKey === config.password) return true;

  const cookie = request.headers.get('cookie')?.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]+)`))?.[1];
  if (!cookie) return false;
  const [payload, signature] = cookie.split('.');
  if (!payload || !signature) return false;
  const expected = sign(payload, config.secret);
  const received = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (received.length !== expectedBuffer.length || !timingSafeEqual(received, expectedBuffer)) return false;
  try {
    const session = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as { role?: string; exp?: number };
    return session.role === 'admin' && typeof session.exp === 'number' && session.exp > Date.now();
  } catch {
    return false;
  }
}

export const adminSessionCookie = {
  name: COOKIE_NAME,
  options: {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_TTL_MS / 1000,
  },
};
