import { NextRequest, NextResponse } from 'next/server'
import { adminAuth, adminFirestore, adminDb } from '@/firebase/admin'
import { cookies } from 'next/headers'

type Role = 'super_admin' | 'admin' | 'coach' | 'user' | 'suspended'

export async function GET(_request: NextRequest) {
  try {
    const jar = await cookies()
    const session = jar.get('session')?.value
    if (!session) {
      return NextResponse.json({ ok: false, error: 'NO_SESSION' }, { status: 401 })
    }

    const decoded = await adminAuth().verifyIdToken(session)
    const uid = decoded.uid

    // Prefer constant if available, fallback to function
    const db = adminDb ?? adminFirestore()
    const snap = await db.collection('users').doc(uid).get()
    const role = (snap.exists ? (snap.data()?.role as Role) : 'user') || 'user'

    return NextResponse.json({ ok: true, uid, role })
  } catch (error) {
    console.error('auth/resolve error', error)
    return NextResponse.json({ ok: false, error: 'INVALID' }, { status: 401 })
  }
}



