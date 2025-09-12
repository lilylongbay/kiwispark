import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// 初始化Firebase应用（避免重复初始化）
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// 导出认证和Firestore实例
export const auth = getAuth(app);
export const firestore = getFirestore(app);

// 导出getter函数
export const getAuthInstance = () => auth;
export const getFirestoreInstance = () => firestore;

