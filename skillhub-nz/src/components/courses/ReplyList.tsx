'use client';

import { useState, useEffect } from 'react';
import type { ReplyDoc } from '@/types/domain';

interface ReplyListProps {
  reviewId: string;
}

interface ReplyWithUser extends ReplyDoc {
  user: {
    displayName: string;
    photoURL?: string;
    role?: string;
  };
}

export default function ReplyList({ reviewId }: ReplyListProps) {
  const [replies, setReplies] = useState<ReplyWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReplies();
  }, [reviewId]);

  const fetchReplies = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/replies/${reviewId}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || '获取回复失败');
      }

      setReplies(result.replies || []);
    } catch (err) {
      console.error('获取回复失败:', err);
      setError('获取回复失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="ml-12 mt-4">
        <div className="bg-gray-50 rounded-lg p-4 animate-pulse">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
            <div className="h-4 bg-gray-300 rounded w-20"></div>
            <div className="h-3 bg-gray-300 rounded w-16"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded w-full"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ml-12 mt-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-600 text-sm">{error}</p>
          <button
            onClick={fetchReplies}
            className="mt-2 text-xs text-red-600 hover:text-red-800 underline"
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  if (replies.length === 0) {
    return null;
  }

  return (
    <div className="ml-12 mt-4 space-y-3">
      {replies.map((reply) => (
        <div key={reply.id} className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
          <div className="flex items-center space-x-2 mb-2">
            {/* 教练头像 */}
            <div className="flex-shrink-0">
              {reply.user.photoURL ? (
                <img
                  src={reply.user.photoURL}
                  alt={reply.user.displayName}
                  className="w-6 h-6 rounded-full"
                />
              ) : (
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-medium">
                    {reply.user.displayName.charAt(0)}
                  </span>
                </div>
              )}
            </div>
            
            {/* 教练信息和徽章 */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-900">
                {reply.user.displayName}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                教练
              </span>
              <span className="text-xs text-gray-500">
                {formatDate(reply.createdAt)}
              </span>
            </div>
          </div>
          
          {/* 回复内容 */}
          <div className="text-gray-700 text-sm leading-relaxed">
            {reply.content}
          </div>
        </div>
      ))}
    </div>
  );
}
