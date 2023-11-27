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

    const isOnDashboard = request.nextUrl.pathname.startsWith('/dashboard');

    if (!token && isOnDashboard)
      return Response.redirect(new URL('/login', request.nextUrl));
    if (!token && !isOnDashboard) return; // Continue to next URL

    // Verify token
    const verified = (
      await jwtVerify(
        String(token),
        new TextEncoder().encode(process.env.AUTH_SECRET),
      )
    ).payload;

    if (!verified && isOnDashboard)
      return Response.redirect(new URL('/login', request.nextUrl));
    if (!verified && !isOnDashboard) return; // Continue to next URL
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
    } else if (verified && !isOnDashboard)
      return Response.redirect(new URL('/dashboard', request.nextUrl));

    return; // Continue to next URL
  } catch (error) {
    const url = new URL('/login', request.nextUrl);
    url.searchParams.set('error', 'token_error');
    return Response.redirect(url);
  }
}

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
