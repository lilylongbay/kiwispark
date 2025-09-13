// import Link from 'next/link';
import { CourseCard } from './CourseCard';
import { CourseSortSelect } from './CourseSortSelect';
import { ServerPagination } from './ServerPagination';
import { useTranslation } from 'react-i18next';
import type { CourseListItem } from '@/types/domain';

// 序列化后的课程数据类型
interface SerializedCourseListItem extends Omit<CourseListItem, 'createdAt'> {
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
}

interface CourseListServerProps {
  courses: SerializedCourseListItem[];
  hasMore: boolean;
  lastDocId?: string;
  currentParams: Record<string, string | undefined>;
}

export function CourseListServer({ courses, hasMore, lastDocId, currentParams }: CourseListServerProps) {
  const { t } = useTranslation('pages');
  
  if (courses.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-24 w-24 text-gray-400">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h3 className="mt-4 text-lg font-medium text-gray-900">{t('courses.noCourses')}</h3>
        <p className="mt-2 text-gray-500">
          {t('courses.noCoursesDescription')}
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* 排序和结果统计 */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-sm text-gray-600">
          {t('courses.foundCourses', { count: courses.length })}
        </div>
        <CourseSortSelect currentSort={currentParams.sort} />
      </div>

      {/* 课程网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>

      {/* 服务器端分页 */}
      <ServerPagination 
        hasMore={hasMore}
        lastDocId={lastDocId}
        currentParams={currentParams}
      />
    </div>
  );
}
