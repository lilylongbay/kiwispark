import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // i18n路由处理 - 只处理根路径
  if (pathname === '/') {
    const locale = request.cookies.get('NEXT_LOCALE')?.value || 'zh';
    return NextResponse.redirect(
      new URL(`/${locale}`, request.url)
    );
  }

  // 受保护路由：/admin/** 与 /coach/**
  const isAdminArea = pathname.includes('/admin')
  const isCoachArea = pathname.includes('/coach')

  if (isAdminArea || isCoachArea) {
    const sessionCookie = request.cookies.get('session');
    if (!sessionCookie?.value) {
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }

    try {
      const resolveUrl = new URL('/api/auth/resolve', request.url)
      const res = await fetch(resolveUrl, {
        headers: { cookie: request.headers.get('cookie') ?? '' },
        cache: 'no-store',
      })
      if (!res.ok) {
        return NextResponse.redirect(new URL('/auth/signin', request.url));
      }
      const data = await res.json()
      const role = data?.role as string

      if (isAdminArea) {
        const allowed = role === 'admin' || role === 'super_admin'
        if (!allowed) {
          return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }
      }
      if (isCoachArea) {
        const allowed = role === 'coach' || role === 'admin' || role === 'super_admin'
        if (!allowed) {
          return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }
      }
    } catch {
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }
  }

  // 提示：对 API 的鉴权在各自的 Route Handler 中完成（服务端执行）

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

