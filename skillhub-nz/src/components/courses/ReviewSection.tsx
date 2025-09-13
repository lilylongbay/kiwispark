'use client';

import { useState } from 'react';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';

interface ReviewSectionProps {
  courseId: string;
  userCanReview?: boolean;
  courseCoachId?: string; // 课程教练ID，用于判断是否显示回复按钮
}

export default function ReviewSection({ courseId, userCanReview = true, courseCoachId }: ReviewSectionProps) {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleReviewSubmitted = () => {
    // 刷新评论列表
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="space-y-8">
      {/* 评论表单 */}
      {userCanReview && (
        <ReviewForm 
          courseId={courseId} 
          onReviewSubmitted={handleReviewSubmitted}
        />
      )}
      
      {/* 评论列表 */}
      <ReviewList key={refreshKey} courseId={courseId} courseCoachId={courseCoachId} />
    </div>
  );
}
