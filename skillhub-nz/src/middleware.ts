import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/firebase/admin';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // i18n路由处理 - 只处理根路径
  if (pathname === '/') {
    const locale = request.cookies.get('NEXT_LOCALE')?.value || 'zh';
    return NextResponse.redirect(
      new URL(`/${locale}`, request.url)
    );
  }

  // 保护dashboard路由
  if (pathname.startsWith('/dashboard')) {
    const sessionCookie = request.cookies.get('session');

    if (!sessionCookie?.value) {
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }

    try {
      // 验证token
      await adminAuth().verifyIdToken(sessionCookie.value);
    } catch (error) {
      // Token无效，重定向到登录页
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }
  }

  // 保护POST API路由（除了session API）
  if (request.method === 'POST' && !pathname.startsWith('/api/session')) {
    const sessionCookie = request.cookies.get('session');

    if (!sessionCookie?.value) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    try {
      // 验证token
      await adminAuth().verifyIdToken(sessionCookie.value);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

