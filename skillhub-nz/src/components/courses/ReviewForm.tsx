'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { reviewSchema, type ReviewFormData } from '@/lib/validations';
import { toast } from 'react-hot-toast';

interface ReviewFormProps {
  courseId: string;
  onReviewSubmitted?: () => void;
}

export default function ReviewForm({ courseId, onReviewSubmitted }: ReviewFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      courseId,
      rating: 0,
      content: '',
    },
  });

  const onSubmit = async (data: ReviewFormData) => {
    if (rating === 0) {
      toast.error('请选择评分');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          rating,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || '提交评论失败');
      }

      toast.success('评论提交成功！');
      reset();
      setRating(0);
      setHoveredRating(0);
      onReviewSubmitted?.();
    } catch (error) {
      console.error('提交评论错误:', error);
      toast.error(error instanceof Error ? error.message : '提交评论失败');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRatingClick = (selectedRating: number) => {
    setRating(selectedRating);
    setValue('rating', selectedRating);
  };

  const StarIcon = ({ filled, onClick, onMouseEnter, onMouseLeave }: {
    filled: boolean;
    onClick: () => void;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
  }) => (
    <svg
      className={`w-8 h-8 cursor-pointer transition-colors ${
        filled ? 'text-yellow-400' : 'text-gray-300'
      }`}
      fill="currentColor"
      viewBox="0 0 20 20"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">发表评论</h3>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* 评分选择 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            评分 <span className="text-red-500">*</span>
          </label>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <StarIcon
                key={star}
                filled={star <= (hoveredRating || rating)}
                onClick={() => handleRatingClick(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
              />
            ))}
          </div>
          {rating > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              {rating === 1 && '很差'}
              {rating === 2 && '较差'}
              {rating === 3 && '一般'}
              {rating === 4 && '很好'}
              {rating === 5 && '非常好'}
            </p>
          )}
        </div>

        {/* 评论内容 */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
            评论内容 <span className="text-red-500">*</span>
          </label>
          <textarea
            id="content"
            {...register('content')}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请分享您对这门课程的看法..."
          />
          {errors.content && (
            <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            评论内容需要10-800个字符
          </p>
        </div>

        {/* 提交按钮 */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || rating === 0}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? '提交中...' : '提交评论'}
          </button>
        </div>
      </form>
    </div>
  );
}
