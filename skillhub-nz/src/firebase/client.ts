import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Firebase 前端配置信息（从 NEXT_PUBLIC 环境变量读取）
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  // storageBucket 推荐使用 appspot.com 域名
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
      ? `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.appspot.com`
      : undefined),
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// 初始化Firebase应用（避免重复初始化）
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// 导出认证、Firestore和Analytics实例
export const auth = getAuth(app);
export const firestore = getFirestore(app);

// 初始化Analytics（仅在浏览器环境中）
export const analytics = typeof window !== 'undefined' && !!firebaseConfig.measurementId ? getAnalytics(app) : null;

// 导出getter函数
export const getAuthInstance = () => auth;
export const getFirestoreInstance = () => firestore;
export const getAnalyticsInstance = () => analytics;
