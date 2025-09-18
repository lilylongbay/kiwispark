import { NextResponse } from 'next/server'
export const dynamic = 'force-static'
import { cookies } from 'next/headers'

export async function POST() {
  const jar = await cookies()
  jar.delete('session')
  return NextResponse.json({ ok: true })
}





