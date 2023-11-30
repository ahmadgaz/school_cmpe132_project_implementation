import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export default async function auth(request: NextRequest) {
  try {
    const isSigningOut = request.nextUrl.pathname.startsWith('/signout');
    if (isSigningOut) {
      const response = NextResponse.redirect(new URL('/', request.nextUrl));
      response.cookies.delete('_session');
      return response;
    }
    let token = request.cookies.get('_session')?.value;
    const isLoggingInToken = request.nextUrl.searchParams.get('token');
    if (isLoggingInToken) token = isLoggingInToken;
    const isOnGuestRoutes =
      request.nextUrl.pathname === '/' ||
      request.nextUrl.pathname.startsWith('/login') ||
      request.nextUrl.pathname.startsWith('/signup');
    const isOnProtectedRoute =
      request.nextUrl.pathname.startsWith('/books') ||
      request.nextUrl.pathname.startsWith('/profile') ||
      request.nextUrl.pathname.startsWith('/users') ||
      request.nextUrl.pathname.startsWith('/requests') ||
      request.nextUrl.pathname.startsWith('/logs');
    if (!token && isOnProtectedRoute)
      return Response.redirect(new URL('/login', request.nextUrl));
    if (!token && !isOnProtectedRoute) return; // Continue to next URL
    // Verify token
    const verified = (
      await jwtVerify(
        String(token),
        new TextEncoder().encode(process.env.AUTH_SECRET),
      )
    ).payload;
    if (!verified && isOnProtectedRoute)
      return Response.redirect(new URL('/login', request.nextUrl));
    if (!verified && !isOnProtectedRoute) return; // Continue to next URL
    if (verified && isLoggingInToken) {
      const response = NextResponse.next();
      response.cookies.set({
        name: '_session',
        value: isLoggingInToken,
        path: '/',
        secure: true,
        httpOnly: true,
        sameSite: 'lax',
      });
      return response;
    } else if (verified && isOnGuestRoutes)
      return Response.redirect(new URL('/books', request.nextUrl));
    return; // Continue to next URL
  } catch (error) {
    const url = new URL('/login', request.nextUrl);
    url.searchParams.set('error', 'token_error');
    return Response.redirect(url);
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
