import { createHash, createHmac, timingSafeEqual } from 'crypto';
import type { NextRequest } from 'next/server';

const COOKIE_NAME = 'ls_admin_session';
const SESSION_TTL_MS = 8 * 60 * 60 * 1000;
const MIN_SECRET_LENGTH = 32;

function sanitizeString(str: string): string {
  return (str || '').replace(/[\r\n\t]/g, '').replace(/^["']+|["']+$/g, '').trim();
}

function getConfig(): { password: string; secret: string } | null {
  const rawPass = process.env.ADMIN_PASSWORD;
  const rawSecret = process.env.ADMIN_SESSION_SECRET;

  const password = sanitizeString(rawPass || '');
  const secret = sanitizeString(rawSecret || '');

  if (!password || secret.length < MIN_SECRET_LENGTH) {
    return null;
  }

  return { password, secret };
}

function sign(value: string, secret: string): string {
  return createHmac('sha256', secret).update(value).digest('base64url');
}

function safeCompare(a: string, b: string): boolean {
  const hashA = createHash('sha256').update(a).digest();
  const hashB = createHash('sha256').update(b).digest();
  return timingSafeEqual(hashA, hashB);
}

export function isAdminConfigured(): boolean {
  return getConfig() !== null;
}

export function verifyAdminPassword(password: string): boolean {
  if (typeof password !== 'string' || !password) return false;
  const cleanSubmitted = sanitizeString(password);
  if (!cleanSubmitted) return false;

  const config = getConfig();
  if (!config) return false;

  return safeCompare(cleanSubmitted, config.password);
}

export function createAdminSession(): string {
  const config = getConfig();
  if (!config) throw new Error('Admin authentication is not configured on the server.');
  const payload = Buffer.from(JSON.stringify({ role: 'admin', exp: Date.now() + SESSION_TTL_MS })).toString('base64url');
  return `${payload}.${sign(payload, config.secret)}`;
}

export function verifyAdminSessionToken(cookieValue?: string | null): boolean {
  if (!cookieValue || typeof cookieValue !== 'string') return false;

  const config = getConfig();
  if (!config) return false;

  const parts = cookieValue.split('.');
  if (parts.length !== 2) return false;
  const [payload, signature] = parts;
  if (!payload || !signature) return false;

  const expected = sign(payload, config.secret);
  if (!safeCompare(signature, expected)) return false;

  try {
    const session = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as { role?: string; exp?: number };
    return session.role === 'admin' && typeof session.exp === 'number' && session.exp > Date.now();
  } catch {
    return false;
  }
}

export function hasAdminSession(request: NextRequest | Request): boolean {
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) return false;

  const match = cookieHeader.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]+)`));
  const cookie = match?.[1];
  return verifyAdminSessionToken(cookie);
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

