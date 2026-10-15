import { createHash, createHmac, timingSafeEqual } from 'crypto';
import type { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';

const COOKIE_NAME = 'ls_admin_session';
const SESSION_TTL_MS = 8 * 60 * 60 * 1000;
const MIN_SECRET_LENGTH = 32;

// Runtime in-memory cache for customized admin password
let runtimeAdminPassword: string | null = null;

export function setRuntimeAdminPassword(password: string): void {
  runtimeAdminPassword = sanitizeString(password);
}

export function getRuntimeAdminPassword(): string | null {
  return runtimeAdminPassword;
}

function sanitizeString(str: string): string {
  return (str || '').replace(/[\r\n\t]/g, '').replace(/^["']+|["']+$/g, '').trim();
}

function getConfig(): { password: string; secret: string } | null {
  const rawPass = runtimeAdminPassword || process.env.ADMIN_PASSWORD;
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

export function isBcryptHash(value: string): boolean {
  return typeof value === 'string' && /^\$2[abxy]\$\d{2}\$[./A-Za-z0-9]{53}$/.test(value);
}

export async function hashPassword(plainText: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(plainText, salt);
}

export function isAdminConfigured(): boolean {
  return getConfig() !== null;
}

/**
 * Validates password policy:
 * - 8 to 14 characters in length
 * - Must contain a mix of letters and numbers/special characters
 */
export function validatePasswordPolicy(password: string): { isValid: boolean; error?: string } {
  if (!password || typeof password !== 'string') {
    return { isValid: false, error: 'Password cannot be empty.' };
  }

  const clean = password.trim();

  if (clean.length < 8 || clean.length > 14) {
    return { 
      isValid: false, 
      error: `Password length is ${clean.length} characters. It must be strictly between 8 and 14 characters.` 
    };
  }

  const hasLetters = /[a-zA-Z]/.test(clean);
  const hasNumbersOrSymbols = /[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(clean);

  if (!hasLetters || !hasNumbersOrSymbols) {
    return { 
      isValid: false, 
      error: 'Password must be mixed (must contain both letters and numbers/symbols).' 
    };
  }

  return { isValid: true };
}

/**
 * Verifies submitted admin password with dual-mode support:
 * 1. Secure Bcrypt hash comparison if stored as hash.
 * 2. Timing-safe plaintext comparison for legacy state with auto-migration flag.
 */
export async function verifyAndCheckAdminPassword(password: string): Promise<{ isValid: boolean; needsMigration?: boolean }> {
  if (typeof password !== 'string' || !password) return { isValid: false };
  const cleanSubmitted = sanitizeString(password);
  if (!cleanSubmitted) return { isValid: false };

  // 1. Check runtime cache
  if (runtimeAdminPassword) {
    if (isBcryptHash(runtimeAdminPassword)) {
      const match = await bcrypt.compare(cleanSubmitted, runtimeAdminPassword);
      if (match) return { isValid: true, needsMigration: false };
    } else if (safeCompare(cleanSubmitted, runtimeAdminPassword)) {
      return { isValid: true, needsMigration: true };
    }
  }

  // 2. Check Database SiteSettings.adminPassword if available
  try {
    const { prisma } = await import('@/lib/prisma');
    const settings = await prisma.siteSettings.findUnique({
      where: { id: 'default' },
      select: { adminPassword: true } as any
    }).catch(() => null);

    if (settings && (settings as any).adminPassword) {
      const dbPass = sanitizeString((settings as any).adminPassword);
      if (dbPass) {
        runtimeAdminPassword = dbPass;
        if (isBcryptHash(dbPass)) {
          const match = await bcrypt.compare(cleanSubmitted, dbPass);
          if (match) return { isValid: true, needsMigration: false };
        } else if (safeCompare(cleanSubmitted, dbPass)) {
          return { isValid: true, needsMigration: true };
        }
      }
    }
  } catch (err) {
    // Silently continue to fallback
  }

  // 3. Fallback to process.env.ADMIN_PASSWORD
  const config = getConfig();
  if (config) {
    if (isBcryptHash(config.password)) {
      const match = await bcrypt.compare(cleanSubmitted, config.password);
      if (match) return { isValid: true, needsMigration: false };
    } else if (safeCompare(cleanSubmitted, config.password)) {
      return { isValid: true, needsMigration: true };
    }
  }

  return { isValid: false };
}

export async function verifyAdminPassword(password: string): Promise<boolean> {
  const result = await verifyAndCheckAdminPassword(password);
  return result.isValid;
}

/**
 * Auto-migrates plaintext admin password in database to secure Bcrypt hash (Work factor 12)
 */
export async function migrateAdminPassword(plainPassword: string): Promise<boolean> {
  try {
    const { prisma } = await import('@/lib/prisma');
    const hashed = await hashPassword(plainPassword.trim());
    await prisma.siteSettings.upsert({
      where: { id: 'default' },
      update: { adminPassword: hashed },
      create: { id: 'default', adminPassword: hashed },
    });
    runtimeAdminPassword = hashed;
    console.log('[SECURITY] Admin password successfully auto-migrated to Bcrypt hash.');
    return true;
  } catch (err) {
    console.warn('[SECURITY] Failed to auto-migrate admin password to Bcrypt:', err);
    return false;
  }
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
