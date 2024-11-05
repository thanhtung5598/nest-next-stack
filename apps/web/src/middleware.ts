import { NextRequest, NextResponse } from 'next/server';
import { COOKIE_KEYS, ROUTE } from './libs/enum';
import { authService } from './data/auth';
import { isDevEnv, routeType } from './libs/constant';
import { jwtDecode } from 'jwt-decode';

function clearCookies(response: NextResponse) {
  response.cookies.set(COOKIE_KEYS.TOKEN, '', {
    expires: new Date(0),
  });
}

export async function middleware(request: NextRequest) {
  const nextRequest = new Headers(request.headers);

  const hasToken = request.cookies.has(COOKIE_KEYS.TOKEN);

  const { searchParams, pathname } = request.nextUrl;

  const loggedIn = hasToken;

  nextRequest.set('x-logged', loggedIn ? 'true' : '');
  nextRequest.set('x-pathname', pathname);

  if (pathname.startsWith(ROUTE.LOGOUT)) {
    const redirect = NextResponse.redirect(new URL(ROUTE.LOGIN, request.url), {
      headers: nextRequest,
    });

    clearCookies(redirect);

    return redirect;
  }

  if (pathname.startsWith(ROUTE.AUTH)) {
    const response = await authService.login({ code: searchParams.get('code') ?? '' });

    if (!response?.accessToken) {
      return NextResponse.redirect(new URL(ROUTE.LOGIN, request.url));
    }

    const { role } = jwtDecode<{ role: string }>(response.accessToken.token);
    const redirectUrl = role === 'admin' ? ROUTE.DASHBOARD : ROUTE.PROFILE;

    const redirect = NextResponse.redirect(new URL(redirectUrl, request.url), {
      headers: nextRequest,
    });

    if (response?.accessToken) {
      redirect.cookies.set(COOKIE_KEYS.TOKEN, response.accessToken.token, {
        expires: Date.now() + Number(response.accessToken.expiresIn) * 1000,
        httpOnly: !isDevEnv(),
        secure: true,
      });
    }

    return redirect;
  }

  if (routeType.protected?.includes(pathname) && !!loggedIn) {
    return NextResponse.redirect(new URL(ROUTE.DASHBOARD, request.url), { headers: nextRequest });
  }

  if (!Object.values(routeType).flat().includes(pathname) && !loggedIn) {
    return NextResponse.redirect(new URL(ROUTE.LOGIN, request.url), { headers: nextRequest });
  }

  const response = NextResponse.next({ request: { headers: nextRequest } });

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|static|admin|favicon.ico|icon.png|apple-icon.png|robots.txt|sw.js|sw.js.map|workbox-*.js|workbox-*.js.map).*)',
  ],
};
