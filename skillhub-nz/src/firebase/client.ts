import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Firebase配置信息
const firebaseConfig = {
  apiKey: "AIzaSyBEXwf9SCerk1XUSeWBlduL7nU-VbMxWu8",
  authDomain: "kiwispark-80e5d.firebaseapp.com",
  projectId: "kiwispark-80e5d",
  storageBucket: "kiwispark-80e5d.firebasestorage.app",
  messagingSenderId: "287274562407",
  appId: "1:287274562407:web:1fac7d76f212e3843035c2",
  measurementId: "G-933NXHTVY4"
};

// 初始化Firebase应用（避免重复初始化）
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// 导出认证、Firestore和Analytics实例
export const auth = getAuth(app);
export const firestore = getFirestore(app);

// 初始化Analytics（仅在浏览器环境中）
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// 导出getter函数
export const getAuthInstance = () => auth;
export const getFirestoreInstance = () => firestore;
export const getAnalyticsInstance = () => analytics;
