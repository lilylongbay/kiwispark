import { initializeApp, getApps, cert, ServiceAccount } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// 懒加载单例模式
let adminApp: any = null;
let adminAuth: any = null;
let adminFirestore: any = null;

const getAdminApp = () => {
  if (!adminApp) {
    // 检查是否已经初始化
    if (getApps().length === 0) {
      const serviceAccount: ServiceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      };

      adminApp = initializeApp({
        credential: cert(serviceAccount),
        projectId: process.env.FIREBASE_PROJECT_ID,
      });
    } else {
      adminApp = getApps()[0];
    }
  }
  return adminApp;
};

const getAdminAuth = () => {
  if (!adminAuth) {
    adminAuth = getAuth(getAdminApp());
  }
  return adminAuth;
};

const getAdminFirestore = () => {
  if (!adminFirestore) {
    adminFirestore = getFirestore(getAdminApp());
  }
  return adminFirestore;
};

// 导出懒加载的实例
export { getAdminAuth as adminAuth, getAdminFirestore as adminFirestore };

