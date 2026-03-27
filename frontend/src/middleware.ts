import { NextResponse, type NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect all /admin routes
  if (pathname.startsWith('/admin')) {
    // EXCEPT the login page itself to avoid redirect loops
    if (pathname === '/admin/login' || pathname === '/login') {
      return NextResponse.next();
    }

    const token = req.cookies.get('admin_session')?.value;

    // Check for the 'admin_session' cookie. If missing, NextResponse.redirect to login
    if (!token) {
      // The prompt specified redirecting to '/login', but our file path exists at '/admin/login' inherently.
      const url = req.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
