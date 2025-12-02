import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Helper function to decode JWT without verification (client-side only check)
function decodeJWT(token: string) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = parts[1];
    const decoded = JSON.parse(Buffer.from(payload, 'base64').toString('utf-8'));
    return decoded;
  } catch (error) {
    return null;
  }
}

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

    // Decode JWT and check if user has admin role
    const decoded = decodeJWT(accessToken);
    if (!decoded || !decoded.role) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      loginUrl.searchParams.set('error', 'unauthorized');
      return NextResponse.redirect(loginUrl);
    }

    // Check if user has admin privileges
    const adminRoles = ['admin', 'superadmin', 'super_admin', 'ADMIN', 'SUPERADMIN'];
    const userRole = decoded.role.toLowerCase();
    
    if (!adminRoles.includes(userRole) && !adminRoles.includes(decoded.role)) {
      // User is authenticated but not an admin - redirect to home with error
      const homeUrl = new URL('/', request.url);
      homeUrl.searchParams.set('error', 'access_denied');
      return NextResponse.redirect(homeUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
};
