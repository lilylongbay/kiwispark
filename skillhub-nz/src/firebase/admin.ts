import { initializeApp, getApps, cert, type App } from 'firebase-admin/app'
import { getAuth, type Auth } from 'firebase-admin/auth'
import { getFirestore, type Firestore } from 'firebase-admin/firestore'

let appInstance: App | undefined
let authInstance: Auth | undefined
let firestoreInstance: Firestore | undefined

function getEnvPrivateKey(): string | undefined {
  const raw = process.env.FIREBASE_PRIVATE_KEY
  if (!raw) return undefined
  // 兼容 Netlify / GitHub Actions 的换行转义
  const unquoted = raw.startsWith('"') && raw.endsWith('"') ? raw.slice(1, -1) : raw
  return unquoted.replace(/\\n/g, '\n')
}

function ensureAdminApp(): App {
  if (appInstance) return appInstance

  const projectId = process.env.FIREBASE_PROJECT_ID
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
  const privateKey = getEnvPrivateKey()

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error('Missing Firebase Admin credentials. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY')
  }

  appInstance = (getApps()[0]) ?? initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    })
  })
  return appInstance
}

export function adminAuth(): Auth {
  if (!authInstance) {
    authInstance = getAuth(ensureAdminApp())
  }
  return authInstance
}

export function adminFirestore(): Firestore {
  if (!firestoreInstance) {
    firestoreInstance = getFirestore(ensureAdminApp())
  }
  return firestoreInstance
}
