import { NextRequest, NextResponse } from 'next/server';

// This function protects routes that require authentication
export function middleware(request: NextRequest) {
  // For now, we'll allow all routes
  // In a production app, you would check for the presence of an auth token
  // and redirect to login if not authenticated
  return NextResponse.next();
}

// Define which paths the middleware should run for
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};