'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

type Role = 'super_admin' | 'admin' | 'coach' | 'user' | 'institution' | 'suspended' | 'student';

export default function RequireRole({
  allow,
  fallback = '/auth/signin',
  children,
}: {
  allow: Role[];
  fallback?: string;
  children: ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      const allowed = !!user && (allow.includes(user.role));
      if (!allowed) {
        router.replace(fallback);
      }
    }
  }, [user, loading, allow, fallback, router]);

  if (loading) return null;
  return <>{children}</>;
}


