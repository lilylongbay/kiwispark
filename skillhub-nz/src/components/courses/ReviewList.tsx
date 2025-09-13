'use client';

import { useState, useEffect } from 'react';
import type { ReviewDoc } from '@/types/domain';
import ReplyList from './ReplyList';
import ReplyModal from './ReplyModal';
import { useAuth } from '@/hooks/useAuth';

interface ReviewListProps {
  courseId: string;
  courseCoachId?: string; // 课程教练ID，用于判断是否显示回复按钮
}

interface ReviewWithUser extends ReviewDoc {
  user: {
    displayName: string;
    photoURL?: string;
  };
}

export default function ReviewList({ courseId, courseCoachId }: ReviewListProps) {
  const [reviews, setReviews] = useState<ReviewWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  
  const { user } = useAuth();

  useEffect(() => {
    fetchReviews();
  }, [courseId, refreshKey]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/reviews/${courseId}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || '获取评论失败');
      }

      setReviews(result.reviews || []);
    } catch (err) {
      console.error('获取评论失败:', err);
      setError('获取评论失败，请稍后重试');
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
    });
  };

  const handleReplyClick = (reviewId: string) => {
    setSelectedReviewId(reviewId);
    setReplyModalOpen(true);
  };

  const handleReplySubmitted = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleCloseReplyModal = () => {
    setReplyModalOpen(false);
    setSelectedReviewId(null);
  };

  // 检查当前用户是否可以回复（是教练且拥有该课程）
  const canReply = user?.role === 'coach' && courseCoachId && user.uid === courseCoachId;

  const renderStars = (rating: number) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded w-24"></div>
                <div className="h-3 bg-gray-300 rounded w-16"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded w-full"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchReviews}
          className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
        >
          重试
        </button>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <p className="text-gray-500">暂无评论，成为第一个评论的人吧！</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">
        用户评论 ({reviews.length})
      </h3>
      
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start space-x-3 mb-3">
              {/* 用户头像 */}
              <div className="flex-shrink-0">
                {review.user.photoURL ? (
                  <img
                    src={review.user.photoURL}
                    alt={review.user.displayName}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 text-sm font-medium">
                      {review.user.displayName.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              
              {/* 用户信息和评分 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {review.user.displayName}
                  </h4>
                  {review.isVerified && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                      已验证
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-2 mb-2">
                  {renderStars(review.rating)}
                  <span className="text-sm text-gray-500">
                    {formatDate(review.createdAt)}
                  </span>
                </div>
              </div>
            </div>
            
            {/* 评论内容 */}
            <div className="text-gray-700 leading-relaxed">
              {review.content}
            </div>
            
            {/* 有用按钮和回复按钮 */}
            <div className="mt-4 flex items-center justify-between">
              <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
                <span>有用 ({review.helpfulCount})</span>
              </button>
              
              {canReply && (
                <button
                  onClick={() => handleReplyClick(review.id)}
                  className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span>回复</span>
                </button>
              )}
            </div>
            
            {/* 回复列表 */}
            <ReplyList reviewId={review.id} />
          </div>
        ))}
      </div>
      
      {/* 回复模态框 */}
      {selectedReviewId && (
        <ReplyModal
          isOpen={replyModalOpen}
          onClose={handleCloseReplyModal}
          reviewId={selectedReviewId}
          onReplySubmitted={handleReplySubmitted}
        />
      )}
    </div>
  );
}
