'use client';

import { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { CourseListServer } from './CourseListServer';
import { CourseFilters } from './CourseFilters';
import { CourseListSkeleton } from './CourseListSkeleton';
import { CourseErrorBoundary } from './CourseErrorBoundary';
import type { CourseListItem } from '@/types/domain';

// 序列化后的课程数据类型
interface SerializedCourseListItem extends Omit<CourseListItem, 'createdAt'> {
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
}

interface CoursesPageClientProps {
  courses: SerializedCourseListItem[];
  hasMore: boolean;
  lastDocId?: string;
  categories: Array<{
    id: string;
    name: string;
    color?: string;
  }>;
  currentParams: Record<string, string | undefined>;
}

export function CoursesPageClient({ 
  courses, 
  hasMore, 
  lastDocId, 
  categories, 
  currentParams 
}: CoursesPageClientProps) {
  const { t } = useTranslation('pages');

  return (
    <CourseErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* 页面标题 */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">{t('courses.title')}</h1>
            <p className="mt-2 text-gray-600">
              {t('courses.subtitle')}
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* 侧边栏筛选器 */}
            <div className="lg:w-64 flex-shrink-0">
              <CourseFilters 
                categories={categories}
                currentParams={currentParams}
              />
            </div>

            {/* 主要内容区域 */}
            <div className="flex-1">
              <Suspense fallback={<CourseListSkeleton />}>
                <CourseListServer 
                  courses={courses}
                  hasMore={hasMore}
                  lastDocId={lastDocId}
                  currentParams={currentParams}
                />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </CourseErrorBoundary>
  );
}
