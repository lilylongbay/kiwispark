import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/firebase/admin';
import { cookies } from 'next/headers';

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json(
        { error: 'ID token is required' },
        { status: 400 }
      );
    }

    // 验证ID token
    const decodedToken = await adminAuth().verifyIdToken(idToken);
    
    // 设置HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set('session', idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7天
      path: '/',
    });

    return NextResponse.json({
      success: true,
      uid: decodedToken.uid,
    });
  } catch (error: any) {
    console.error('Session creation error:', {
      message: error?.message,
      code: error?.code,
      stack: error?.stack,
    });
    const status = error?.message?.includes('Missing Firebase Admin credentials') ? 500 : 401
    return NextResponse.json(
      { error: 'Invalid token or server credentials missing' },
      { status }
    );
  }
}

// 处理预检请求，避免某些环境下触发 405
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Allow': 'POST, DELETE, OPTIONS',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

export async function DELETE() {
  try {
    // 清除cookie
    const cookieStore = await cookies();
    cookieStore.delete('session');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Session deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to clear session' },
      { status: 500 }
    );
  }
}

