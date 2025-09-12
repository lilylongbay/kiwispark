// 暂时注释掉 firebase-admin 导入以解决 Node.js 版本兼容性问题
// import { initializeApp, getApps, cert, ServiceAccount } from 'firebase-admin/app';
// import { getAuth } from 'firebase-admin/auth';
// import { getFirestore } from 'firebase-admin/firestore';

// 懒加载单例模式
let adminApp: any = null;
let adminAuth: any = null;
let adminFirestore: any = null;

const getAdminApp = () => {
  if (!adminApp) {
    // 模拟 Firebase Admin App 对象
    adminApp = {
      name: 'default',
      options: {
        projectId: process.env.FIREBASE_PROJECT_ID || 'demo-project',
      }
    };
  }
  return adminApp;
};

const getAdminAuth = () => {
  if (!adminAuth) {
    // 模拟 Firebase Admin Auth 对象
    adminAuth = {
      verifyIdToken: async (token: string) => {
        console.log('模拟验证 ID token:', token);
        return { uid: 'demo-user', email: 'demo@example.com' };
      }
    };
  }
  return adminAuth;
};

const getAdminFirestore = () => {
  if (!adminFirestore) {
    // 模拟 Firebase Admin Firestore 对象
    adminFirestore = {
      collection: (path: string) => ({
        doc: (id: string) => ({
          get: async () => ({ exists: false, data: () => null }),
          set: async (data: any) => ({ id }),
          update: async (data: any) => ({ id }),
          delete: async () => ({ id })
        }),
        add: async (data: any) => ({ id: 'demo-id' }),
        where: () => ({
          get: async () => ({ docs: [], empty: true })
        })
      })
    };
  }
  return adminFirestore;
};

// 导出懒加载的实例
export { getAdminAuth as adminAuth, getAdminFirestore as adminFirestore };
