import { NextRequest, NextResponse } from 'next/server';
import { adminSessionCookie, createAdminSession, isAdminConfigured, verifyAdminPassword } from '@/lib/adminAuth';

export async function POST(request: NextRequest) {
  if (!isAdminConfigured()) {
    return NextResponse.json({ error: 'Admin authentication is not configured on the server.' }, { status: 503 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body.password !== 'string' || !verifyAdminPassword(body.password)) {
    return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(adminSessionCookie.name, createAdminSession(), adminSessionCookie.options);
  return response;
}
