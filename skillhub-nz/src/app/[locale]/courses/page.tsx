import { getCoursesListServer, getCategoriesServer } from '@/lib/courses-server';
import { CoursesPageClient } from '@/components/courses/CoursesPageClient';
import type { CourseSearchParams, CourseListItem } from '@/types/domain';

// 序列化课程数据，将Firestore Timestamp转换为普通对象
const serializeCourseData = (courses: CourseListItem[]) => {
  return courses.map(course => ({
    ...course,
    createdAt: {
      seconds: course.createdAt.seconds,
      nanoseconds: course.createdAt.nanoseconds
    }
  }));
};

// Generate static params for locales
export async function generateStaticParams() {
  return [
    { locale: 'zh' },
    { locale: 'en' }
  ];
}

export default async function CoursesPage() {
  // 使用默认参数进行静态渲染
  
  // 解析搜索参数
  const params: CourseSearchParams = {
    categoryId: undefined,
    sortBy: 'newest',
    sortOrder: 'desc',
    level: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    search: undefined,
    limit: 12
  };

  try {
    // 并行获取数据
    const [coursesResult, categories] = await Promise.all([
      getCoursesListServer(params),
      getCategoriesServer()
    ]);

    return (
      <CoursesPageClient 
        courses={serializeCourseData(coursesResult.data)}
        hasMore={coursesResult.hasMore}
        lastDocId={coursesResult.lastDocId}
        categories={categories}
        currentParams={{}}
      />
    );
  } catch (error) {
    console.error('获取课程数据失败:', error);
    
    // 返回错误页面
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <div className="mx-auto h-12 w-12 text-red-400 mb-4">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            加载课程失败
          </h3>
          <p className="text-gray-600 mb-4">
            抱歉，无法加载课程数据。请检查网络连接或稍后重试。
          </p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            重新加载
          </button>
        </div>
      </div>
    );
  }
}

// 生成静态参数（可选，用于SEO）
export async function generateMetadata() {
  return {
    title: '课程列表 - SkillHub NZ',
    description: '浏览我们精心挑选的技能提升课程，找到适合您的学习路径。',
  };
}
