import { NextResponse } from 'next/server';
import { adminSessionCookie } from '@/lib/adminAuth';

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(adminSessionCookie.name, '', { ...adminSessionCookie.options, maxAge: 0 });
  return response;
}
