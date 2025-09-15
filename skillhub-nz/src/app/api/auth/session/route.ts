import { NextRequest, NextResponse } from 'next/server'
import { adminAuth } from '@/firebase/admin'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json()
    if (!idToken) {
      return NextResponse.json({ error: 'ID token is required' }, { status: 400 })
    }

    const decoded = await adminAuth().verifyIdToken(idToken)

    const jar = await cookies()
    jar.set('session', idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    return NextResponse.json({ ok: true, uid: decoded.uid })
  } catch (error) {
    console.error('auth/session error', error)
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }
}




