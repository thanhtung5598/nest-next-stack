import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const nextRequest = new Headers(request.headers);

  const response = NextResponse.next({ request: { headers: nextRequest } });

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|static|admin|favicon.ico|icon.png|apple-icon.png|robots.txt|sw.js|sw.js.map|workbox-*.js|workbox-*.js.map).*)',
  ],
};
