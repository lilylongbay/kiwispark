'use client';

import { useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, firestore } from '@/firebase/client';
import type { UserDoc } from '@/types/domain';

export interface AuthUser {
  uid: string;
  email: string;
  displayName: string;
  role: 'super_admin' | 'admin' | 'coach' | 'user' | 'institution' | 'suspended' | 'student';
  isVerified: boolean;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
      if (firebaseUser) {
        try {
          // 获取用户文档
          const userDocRef = doc(firestore, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const userData = userDoc.data() as UserDoc;
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: userData.displayName || firebaseUser.displayName || '',
              role: (userData.role as AuthUser['role']) || 'user',
              isVerified: userData.isVerified || false,
            });
          } else {
            // 如果用户文档不存在，使用Firebase用户信息
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || '',
              role: 'user',
              isVerified: firebaseUser.emailVerified,
            });
          }
        } catch (error) {
          console.error('获取用户信息失败:', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, loading };
}
