import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  if (!request.cookies.get('ls_admin_session')?.value) {
    return NextResponse.redirect(new URL('/portal-access', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
