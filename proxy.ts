import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { verifyAdminSessionToken } from '@/lib/adminAuth';

export function proxy(request: NextRequest) {
  const sessionToken = request.cookies.get('ls_admin_session')?.value;
  if (!verifyAdminSessionToken(sessionToken)) {
    return NextResponse.redirect(new URL('/portal-access', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
