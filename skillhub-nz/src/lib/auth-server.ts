import { cookies } from 'next/headers';
import { adminAuth } from '@/firebase/admin';
import { doc, getDoc } from 'firebase/firestore';
import { adminFirestore } from '@/firebase/admin';
import type { UserDoc } from '@/types/domain';

export interface ServerUser {
  uid: string;
  email: string;
  role: 'user' | 'coach' | 'admin';
  displayName: string;
}

export async function getServerUser(): Promise<ServerUser | null> {
  // 在开发模式下，始终返回null（未登录状态）
  // 这样可以避免Firebase相关的错误
  return null;
}

export async function requireAuth(): Promise<ServerUser> {
  const user = await getServerUser();
  
  if (!user) {
    throw new Error('Authentication required');
  }
  
  return user;
}

export async function requireRole(requiredRole: 'user' | 'coach' | 'admin'): Promise<ServerUser> {
  const user = await requireAuth();
  
  if (user.role !== requiredRole && user.role !== 'admin') {
    throw new Error(`Role ${requiredRole} required`);
  }
  
  return user;
}

