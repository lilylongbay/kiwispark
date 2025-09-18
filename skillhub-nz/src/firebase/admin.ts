import { initializeApp, getApps, cert, applicationDefault, type App } from 'firebase-admin/app'
import { readFileSync, existsSync } from 'node:fs'
import { getAuth, type Auth } from 'firebase-admin/auth'
import { getFirestore, type Firestore } from 'firebase-admin/firestore'

let appInstance: App | undefined
let authInstance: Auth | undefined
let firestoreInstance: Firestore | undefined

function getEnvPrivateKey(): string | undefined {
  const raw = process.env.FIREBASE_PRIVATE_KEY
  if (!raw) return undefined
  const unquoted = raw.startsWith('"') && raw.endsWith('"') ? raw.slice(1, -1) : raw
  return unquoted.replace(/\\n/g, '\n')
}

function ensureAdminApp(): App {
  if (appInstance) return appInstance

  const projectId = process.env.FIREBASE_PROJECT_ID
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
  const privateKey = getEnvPrivateKey()
  const rawGac = process.env.GOOGLE_APPLICATION_CREDENTIALS || ''
  let gacPath = rawGac.startsWith('"') && rawGac.endsWith('"') ? rawGac.slice(1, -1) : rawGac
  if (!gacPath && process.env.NODE_ENV !== 'production') {
    const devGuess = '/Users/brinny/Downloads/kiwispark-80e5d-firebase-adminsdk-fbsvc-90062c3fbd.json'
    if (existsSync(devGuess)) {
      gacPath = devGuess
    }
  }

  const hasProj = !!projectId
  const hasEmail = !!clientEmail && clientEmail.includes('iam.gserviceaccount.com')
  const hasKey = !!privateKey && privateKey.includes('BEGIN PRIVATE KEY')

  if (!hasProj || !hasEmail || !hasKey) {
    if (gacPath) {
      try {
        const jsonRaw = readFileSync(gacPath, 'utf8')
        const svc = JSON.parse(jsonRaw)
        appInstance = (getApps()[0]) ?? initializeApp({
          credential: cert({
            projectId: svc.project_id,
            clientEmail: svc.client_email,
            privateKey: svc.private_key,
          }),
        })
      } catch (err) {
        try {
          appInstance = (getApps()[0]) ?? initializeApp({
            credential: applicationDefault(),
          })
        } catch (err2) {
          throw new Error(`Failed to initialize Firebase Admin from GOOGLE_APPLICATION_CREDENTIALS at ${gacPath}. ${String(err2)}`)
        }
      }
    } else {
      // 不在此处抛出硬错误，延迟到调用方处理，以避免构建时失败
      throw new Error('MISSING_ADMIN_CREDENTIALS')
    }
  } else {
    appInstance = (getApps()[0]) ?? initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      })
    })
  }
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
