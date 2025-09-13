'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

interface EnrollmentButtonProps {
  courseId: string;
  price: number;
}

export function EnrollmentButton({ courseId, price }: EnrollmentButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const handleEnrollment = async () => {
    if (!user) {
      router.push('/auth/signin');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/enrollments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseId }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsEnrolled(true);
        // 简单的成功提示
        alert('报名成功！');
      } else {
        alert(data.error || '报名失败');
      }
    } catch (error) {
      console.error('报名错误:', error);
      alert('网络错误，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  if (isEnrolled) {
    return (
      <button 
        disabled
        className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium cursor-not-allowed"
      >
        已报名
      </button>
    );
  }

  return (
    <button
      onClick={handleEnrollment}
      disabled={isLoading}
      className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? '报名中...' : `立即报名 - ¥${price}`}
    </button>
  );
}
