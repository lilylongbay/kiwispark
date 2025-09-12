'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CourseCard } from './CourseCard';
import { CourseSortSelect } from './CourseSortSelect';
import { LoadMoreButton } from './LoadMoreButton';
import type { CourseListItem } from '@/types/domain';

interface CourseListProps {
  courses: CourseListItem[];
  hasMore: boolean;
  lastDocId?: string;
  currentParams: Record<string, string | undefined>;
}

export function CourseList({ courses, hasMore, lastDocId, currentParams }: CourseListProps) {
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    // 这里会触发客户端加载更多数据的逻辑
    // 实际实现中，您可能需要使用SWR或React Query来管理状态
    setTimeout(() => setIsLoadingMore(false), 1000);
  };

  if (courses.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-24 w-24 text-gray-400">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h3 className="mt-4 text-lg font-medium text-gray-900">暂无课程</h3>
        <p className="mt-2 text-gray-500">
          没有找到符合条件的课程，请尝试调整筛选条件。
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* 排序和结果统计 */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-sm text-gray-600">
          找到 <span className="font-medium text-gray-900">{courses.length}</span> 门课程
        </div>
        <CourseSortSelect currentSort={currentParams.sort} />
      </div>

      {/* 课程网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>

      {/* 加载更多按钮 */}
      {hasMore && (
        <div className="text-center">
          <LoadMoreButton 
            isLoading={isLoadingMore}
            onClick={handleLoadMore}
          />
        </div>
      )}
    </div>
  );
}


