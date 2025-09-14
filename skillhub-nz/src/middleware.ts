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

  // 保护dashboard路由（仅做会话cookie存在性检查，详细校验在服务端进行）
  if (pathname.startsWith('/dashboard')) {
    const sessionCookie = request.cookies.get('session');

    if (!sessionCookie?.value) {
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

