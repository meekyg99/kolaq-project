import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    // Skip the admin login page
    if (pathname === '/admin/login') {
      return NextResponse.next();
    }

    // Check for authentication token in cookies or headers
    const accessToken = request.cookies.get('access_token')?.value || 
                       request.headers.get('authorization')?.replace('Bearer ', '');

    // If no token, redirect to admin login
    if (!accessToken) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Note: We can't verify JWT server-side in middleware without edge runtime support
    // So we rely on the client-side admin page to do role verification
    // The server-side API endpoints should also verify the role
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
};
