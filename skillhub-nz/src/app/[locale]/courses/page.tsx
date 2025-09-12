import { Suspense } from 'react';
import { getCoursesList, getCategories } from '@/lib/courses';
import { CourseList } from '@/components/courses/CourseList';
import { CourseFilters } from '@/components/courses/CourseFilters';
import { CourseListSkeleton } from '@/components/courses/CourseListSkeleton';
import type { CourseSearchParams } from '@/types/domain';

interface CoursesPageProps {
  searchParams: Promise<{
    category?: string;
    sort?: string;
    page?: string;
    search?: string;
    level?: string;
    minPrice?: string;
    maxPrice?: string;
  }>;
}

export default async function CoursesPage({ searchParams }: CoursesPageProps) {
  // 等待搜索参数
  const resolvedSearchParams = await searchParams;
  
  // 解析搜索参数
  const params: CourseSearchParams = {
    categoryId: resolvedSearchParams.category,
    sortBy: (resolvedSearchParams.sort as 'newest' | 'rating' | 'price') || 'newest',
    sortOrder: 'desc',
    level: resolvedSearchParams.level as 'beginner' | 'intermediate' | 'advanced',
    minPrice: resolvedSearchParams.minPrice ? Number(resolvedSearchParams.minPrice) : undefined,
    maxPrice: resolvedSearchParams.maxPrice ? Number(resolvedSearchParams.maxPrice) : undefined,
    search: resolvedSearchParams.search,
    limit: 12
  };

  // 并行获取数据
  const [coursesResult, categories] = await Promise.all([
    getCoursesList(params),
    getCategories()
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">课程列表</h1>
          <p className="mt-2 text-gray-600">
            发现适合您的技能提升课程
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* 侧边栏筛选器 */}
          <div className="lg:w-64 flex-shrink-0">
            <CourseFilters 
              categories={categories}
              currentParams={resolvedSearchParams}
            />
          </div>

          {/* 主要内容区域 */}
          <div className="flex-1">
            <Suspense fallback={<CourseListSkeleton />}>
              <CourseList 
                courses={coursesResult.data}
                hasMore={coursesResult.hasMore}
                lastDocId={coursesResult.lastDocId}
                currentParams={resolvedSearchParams}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}

// 生成静态参数（可选，用于SEO）
export async function generateMetadata() {
  return {
    title: '课程列表 - SkillHub NZ',
    description: '浏览我们精心挑选的技能提升课程，找到适合您的学习路径。',
  };
}
