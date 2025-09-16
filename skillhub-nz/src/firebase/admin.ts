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
  // 兼容 Netlify / GitHub Actions 的换行转义
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
  // 本地开发容错：如果未显式设置且默认下载路径存在，则使用该 JSON
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
        // 优先直接读取 JSON 文件并用 cert 初始化，避免某些环境下 applicationDefault 未识别
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
        // 退回到 applicationDefault；若失败，抛出更明确的错误信息
        try {
          appInstance = (getApps()[0]) ?? initializeApp({
            credential: applicationDefault(),
          })
        } catch (err2) {
          throw new Error(`Failed to initialize Firebase Admin from GOOGLE_APPLICATION_CREDENTIALS at ${gacPath}. ${String(err2)}`)
        }
      }
    } else {
      throw new Error('Missing Firebase Admin credentials. Provide GOOGLE_APPLICATION_CREDENTIALS or set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY')
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

// Also export constants for convenience (do not break existing call-sites)
export const adminDb: Firestore = getFirestore(ensureAdminApp())
export const adminAuthConst: Auth = getAuth(ensureAdminApp())
